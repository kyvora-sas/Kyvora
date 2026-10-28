import { NextResponse } from "next/server";
import {
  transactionStore,
  TransactionRecord,
  isDatabaseError,
} from "@/lib/transactions-store";
import { wompiConfig } from "@/config/wompi";
import {
  parseWompiReturnParams,
  fetchWompiTransactionById,
  fetchWompiTransactionByReference,
  WompiApiTransaction,
} from "@/lib/wompi";

function mapWompiStatus(status: unknown): "APPROVED" | "PENDING" | "DECLINED" | "VOIDED" | "ERROR" {
  switch (String(status)) {
    case "APPROVED":
      return "APPROVED";
    case "DECLINED":
      return "DECLINED";
    case "VOIDED":
      return "VOIDED";
    case "ERROR":
      return "ERROR";
    case "PENDING":
    default:
      return "PENDING";
  }
}

function inferTargetId(reference: string): string {
  if (reference.includes("-PULSO-")) return "pulso";
  if (reference.includes("-QUAKE-")) return "quakenet";
  if (reference.includes("-PULSAI-")) return "pulsai";
  return "general";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { reference, transactionId } = parseWompiReturnParams(searchParams);

    const env = (
      process.env.NEXT_PUBLIC_WOMPI_ENVIRONMENT ||
      process.env.WOMPI_ENVIRONMENT ||
      "sandbox"
    ).toLowerCase() === "production" ? "production" : "sandbox";

    const privateKey = process.env.WOMPI_PRIVATE_KEY;
    const hasPostgres = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);

    // Registro de diagnóstico seguro (sin secretos ni información personal)
    console.info("[api/donate/status] Diagnóstico de consulta:", {
      hasReference: Boolean(reference),
      refPrefix: reference ? reference.slice(0, 18) : null,
      hasTxId: Boolean(transactionId),
      txIdPrefix: transactionId ? transactionId.slice(0, 12) : null,
      env,
      hasPostgres,
      hasPrivateKey: Boolean(privateKey),
    });

    if (!reference && !transactionId) {
      return NextResponse.json(
        {
          error: "Debe proporcionar una referencia o ID de transacción.",
          code: "MISSING_QUERY_PARAMETERS",
        },
        { status: 400 }
      );
    }

    let record: TransactionRecord | null = null;
    let dbError: Error | null = null;

    // 1. Búsqueda en persistencia interna por referencia
    if (reference) {
      try {
        record = await transactionStore.findByReference(reference);
      } catch (err: unknown) {
        dbError = err as Error;
        console.error(
          "[api/donate/status] Fallo al consultar referencia en base de datos:",
          (err as Error)?.message
        );
      }
    }

    // 2. Si no se encontró por referencia, buscar por ID oficial de Wompi (ej. si fue procesada previamente por webhook)
    if (!record && transactionId) {
      try {
        record = await transactionStore.findByWompiTransactionId(transactionId);
      } catch (err: unknown) {
        dbError = err as Error;
        console.error(
          "[api/donate/status] Fallo al consultar wompiTransactionId en base de datos:",
          (err as Error)?.message
        );
      }
    }

    const effectiveTxId = transactionId || record?.wompiTransactionId;

    // Control de asociación cruzada: verificar que el ID de Wompi no esté vinculado a otra donación distinta
    if (record && effectiveTxId) {
      try {
        const existingBound = await transactionStore.findByWompiTransactionId(effectiveTxId);
        if (existingBound && existingBound.reference !== record.reference) {
          console.warn(
            `[api/donate/status] Alerta de seguridad: ID de Wompi ${effectiveTxId.slice(0, 12)}... ya está vinculado a otra donación (${existingBound.reference}).`
          );
          return NextResponse.json(
            {
              error: `El ID de transacción de Wompi ingresado ya fue asignado previamente a otra donación (${existingBound.reference}).`,
              code: "TRANSACTION_ALREADY_BOUND",
              actualReference: existingBound.reference,
            },
            { status: 400 }
          );
        }
      } catch (err: unknown) {
        console.warn(
          "[api/donate/status] Error al verificar unicidad de ID de Wompi en base de datos:",
          (err as Error)?.message
        );
      }
    }

    // 3. Sincronización en vivo con API oficial de Wompi para donaciones PENDING
    // Se intenta sincronizar tanto si se dispone del ID de Wompi como si solo se dispone de la referencia
    if (record && record.status === "PENDING" && privateKey) {
      try {
        let wompiTx: WompiApiTransaction | undefined;

        if (effectiveTxId) {
          const res = await fetchWompiTransactionById(effectiveTxId, privateKey, env);
          if (res.ok && res.data) wompiTx = res.data;
        }

        if (!wompiTx && record.reference) {
          const res = await fetchWompiTransactionByReference(record.reference, privateKey, env);
          if (res.ok && res.data) wompiTx = res.data;
        }

        if (wompiTx && wompiTx.status) {
          // Verificaciones estrictas de integridad y seguridad
          if (wompiTx.reference && wompiTx.reference !== record.reference) {
            console.warn(
              `[api/donate/status] Discrepancia de referencia: interna=${record.reference}, Wompi=${wompiTx.reference}`
            );
            return NextResponse.json(
              {
                error: `El ID de transacción de Wompi ingresado corresponde a otra referencia (${wompiTx.reference}) y no a la referencia consultada (${record.reference}).`,
                code: "REFERENCE_MISMATCH",
                requestedReference: record.reference,
                actualReference: wompiTx.reference,
              },
              { status: 400 }
            );
          }

          if (wompiTx.currency && wompiTx.currency !== record.currency) {
            console.warn(
              `[api/donate/status] Discrepancia de moneda: interna=${record.currency}, Wompi=${wompiTx.currency}`
            );
            return NextResponse.json(
              {
                error: `Discrepancia en la moneda reportada por Wompi (${wompiTx.currency}) frente a la esperada (${record.currency}).`,
                code: "CURRENCY_MISMATCH",
              },
              { status: 400 }
            );
          }

          if (wompiTx.amount_in_cents && Number(wompiTx.amount_in_cents) !== record.amountInCents) {
            console.warn(
              `[api/donate/status] Discrepancia de importe: interna=${record.amountInCents}, Wompi=${wompiTx.amount_in_cents}`
            );
            return NextResponse.json(
              {
                error: `Discrepancia en el importe reportado por Wompi ($${Math.round(Number(wompiTx.amount_in_cents) / 100).toLocaleString("es-CO")} COP) frente al registro del servidor ($${record.amountCOP.toLocaleString("es-CO")} COP).`,
                code: "AMOUNT_MISMATCH",
              },
              { status: 400 }
            );
          }

          const mappedStatus = mapWompiStatus(wompiTx.status);

          if (mappedStatus !== record.status || (wompiTx.id && !record.wompiTransactionId)) {
            try {
              const updated = await transactionStore.updateStatus(
                record.reference,
                mappedStatus,
                wompiTx.id,
                undefined,
                `Estado sincronizado en tiempo real desde API Wompi (${wompiTx.status}).`
              );
              if (updated) record = updated;
            } catch (updateErr: unknown) {
              console.warn(
                "[api/donate/status] Error al actualizar estado en persistencia:",
                (updateErr as Error)?.message
              );
              record = { ...record, status: mappedStatus, wompiTransactionId: wompiTx.id };
            }
          }
        }
      } catch (syncErr) {
        console.warn("[api/donate/status] Fallo al consultar API Wompi para sincronización:", syncErr);
      }
    }

    // 4. Recuperación resiliente desde API Wompi cuando el registro no existe localmente
    // Permite verificar transacciones legítimas aun si hubo intermitencia previa de base de datos
    if (!record && privateKey) {
      try {
        let wompiTx: WompiApiTransaction | undefined;

        if (transactionId) {
          const res = await fetchWompiTransactionById(transactionId, privateKey, env);
          if (res.ok && res.data) wompiTx = res.data;
        }

        if (!wompiTx && reference) {
          const res = await fetchWompiTransactionByReference(reference, privateKey, env);
          if (res.ok && res.data) wompiTx = res.data;
        }

        if (wompiTx && wompiTx.reference) {
          // Si el cliente envió referencia, verificar que coincidan
          if (reference && reference !== wompiTx.reference) {
            console.warn(
              `[api/donate/status] Discrepancia en recuperación: solicitada=${reference}, Wompi=${wompiTx.reference}`
            );
            return NextResponse.json(
              {
                error: `El ID de transacción de Wompi ingresado corresponde a otra referencia (${wompiTx.reference}) y no a la referencia consultada (${reference}).`,
                code: "REFERENCE_MISMATCH",
                requestedReference: reference,
                actualReference: wompiTx.reference,
              },
              { status: 400 }
            );
          }

          const mappedStatus = mapWompiStatus(wompiTx.status);
          const inferredTarget = inferTargetId(wompiTx.reference);

          const recoveredRecord: TransactionRecord = {
            reference: wompiTx.reference,
            amountCOP: Math.round(Number(wompiTx.amount_in_cents || 0) / 100),
            amountInCents: Number(wompiTx.amount_in_cents || 0),
            currency: wompiTx.currency || "COP",
            targetId: inferredTarget,
            donorName: wompiTx.customer_data?.full_name || undefined,
            donorEmail: wompiTx.customer_email || wompiTx.customer_data?.email || undefined,
            status: mappedStatus,
            wompiTransactionId: wompiTx.id,
            createdAt: wompiTx.created_at || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            processedEventIds: [],
            auditLogs: [
              {
                timestamp: new Date().toISOString(),
                action: "RECOVERED_FROM_WOMPI_API",
                details: `Transacción recuperada y validada directamente desde API Wompi (${wompiTx.status}).`,
              },
            ],
          };

          // Intentar guardar en persistencia
          try {
            await transactionStore.save(recoveredRecord);
          } catch (saveErr: unknown) {
            console.warn(
              "[api/donate/status] Aviso: No fue posible persistir transacción recuperada en base de datos:",
              (saveErr as Error)?.message
            );
          }

          record = recoveredRecord;
        }
      } catch (recoveryErr) {
        console.warn("[api/donate/status] Error al intentar recuperación desde Wompi:", recoveryErr);
      }
    }

    // 5. Manejo explícito de ausencia de registro y diferenciación de fallos de base de datos
    if (!record) {
      // Si la consulta de base de datos falló y no fue posible verificar con Wompi:
      // Devolver error 503 DATABASE_ERROR, NUNCA enmascarar un fallo de BD como 404
      if (dbError && isDatabaseError(dbError)) {
        return NextResponse.json(
          {
            error: "No fue posible verificar la transacción debido a una intermitencia temporal con la base de datos.",
            code: "DATABASE_ERROR",
            requestedReference: reference || undefined,
          },
          { status: 503 }
        );
      }

      // Si la base de datos respondió correctamente y la transacción realmente no existe en ningún lado:
      if (reference) {
        return NextResponse.json(
          {
            error: "Transacción no encontrada en el sistema.",
            code: "REFERENCE_NOT_FOUND",
            requestedReference: reference,
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: "Transacción no encontrada en el sistema.",
          code: "TRANSACTION_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    const targetInfo = wompiConfig.targets.find((t) => t.id === record.targetId);

    // 6. Devolver únicamente información segura y pública
    return NextResponse.json({
      reference: record.reference,
      status: record.status,
      amountCOP: record.amountCOP,
      currency: record.currency,
      targetTitle: targetInfo ? targetInfo.title : "Fondo General",
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      donorName: record.donorName || "Anónimo",
    });
  } catch (error: unknown) {
    console.error("[api/donate/status] Error no controlado:", error);
    return NextResponse.json(
      { error: "Error consultando el estado de la transacción.", code: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
