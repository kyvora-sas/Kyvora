import { NextResponse } from "next/server";
import { transactionStore, TransactionRecord } from "@/lib/transactions-store";
import { wompiConfig } from "@/config/wompi";
import { parseWompiReturnParams } from "@/lib/wompi";

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

    // 1. Búsqueda en almacenamiento local por referencia
    if (reference) {
      try {
        record = await transactionStore.findByReference(reference);
      } catch (dbErr: unknown) {
        console.warn("[api/donate/status] Error al consultar referencia en almacenamiento:", (dbErr as Error)?.message);
      }
    }

    // 2. Si no se encontró por referencia, buscar por ID oficial de Wompi (ej. si fue procesada previamente por webhook)
    if (!record && transactionId) {
      try {
        record = await transactionStore.findByWompiTransactionId(transactionId);
      } catch (dbErr: unknown) {
        console.warn("[api/donate/status] Error al consultar wompiTransactionId en almacenamiento:", (dbErr as Error)?.message);
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
      } catch (dbErr: unknown) {
        console.warn("[api/donate/status] Error al verificar unicidad de ID de Wompi:", (dbErr as Error)?.message);
      }
    }

    // 3. Sincronización en vivo con API oficial de Wompi para donaciones PENDING
    if (record && record.status === "PENDING" && effectiveTxId) {
      if (!privateKey) {
        console.warn("[api/donate/status] WOMPI_PRIVATE_KEY no configurada. No es posible sincronizar estado en vivo con Wompi.");
      } else {
        try {
          const apiUrl = `${wompiConfig.apiBaseUrl[env]}/transactions/${effectiveTxId}`;
          const res = await fetch(apiUrl, {
            headers: { Authorization: `Bearer ${privateKey}` },
            cache: "no-store",
          });

          if (res.ok) {
            const wompiData = await res.json();
            const tx = wompiData?.data;
            if (tx && tx.status) {
              // Verificación estricta de seguridad
              if (tx.reference && tx.reference !== record.reference) {
                console.warn(
                  `[api/donate/status] Discrepancia de referencia detectada: interna=${record.reference}, Wompi=${tx.reference}`
                );
                return NextResponse.json(
                  {
                    error: `El ID de transacción de Wompi ingresado corresponde a otra referencia (${tx.reference}) y no a la referencia consultada (${record.reference}).`,
                    code: "REFERENCE_MISMATCH",
                    requestedReference: record.reference,
                    actualReference: tx.reference,
                  },
                  { status: 400 }
                );
              }

              if (tx.currency && tx.currency !== record.currency) {
                console.warn(
                  `[api/donate/status] Discrepancia de moneda detectada: interna=${record.currency}, Wompi=${tx.currency}`
                );
                return NextResponse.json(
                  {
                    error: `Discrepancia en la moneda reportada por Wompi (${tx.currency}) frente a la esperada (${record.currency}).`,
                    code: "CURRENCY_MISMATCH",
                  },
                  { status: 400 }
                );
              }

              if (tx.amount_in_cents && Number(tx.amount_in_cents) !== record.amountInCents) {
                console.warn(
                  `[api/donate/status] Discrepancia de importe detectada: interna=${record.amountInCents}, Wompi=${tx.amount_in_cents}`
                );
                return NextResponse.json(
                  {
                    error: `Discrepancia en el importe reportado por Wompi ($${Math.round(Number(tx.amount_in_cents) / 100).toLocaleString("es-CO")} COP) frente al registro del servidor ($${record.amountCOP.toLocaleString("es-CO")} COP).`,
                    code: "AMOUNT_MISMATCH",
                  },
                  { status: 400 }
                );
              }

              const mappedStatus = mapWompiStatus(tx.status);

              if (mappedStatus !== record.status) {
                try {
                  const updated = await transactionStore.updateStatus(
                    record.reference,
                    mappedStatus,
                    tx.id,
                    undefined,
                    `Estado sincronizado en tiempo real desde API Wompi (${tx.status}).`
                  );
                  if (updated) record = updated;
                } catch (updateErr: unknown) {
                  console.warn("[api/donate/status] Error al actualizar estado en persistencia:", (updateErr as Error)?.message);
                  record = { ...record, status: mappedStatus, wompiTransactionId: tx.id };
                }
              }
            }
          }
        } catch (syncErr) {
          console.warn("[api/donate/status] Fallo al consultar API Wompi para sincronización:", syncErr);
        }
      }
    }

    // 4. Si el registro no se encontró en el ledger pero disponemos de ID de Wompi (resiliencia cross-lambda o cold start)
    if (!record && transactionId) {
      if (!privateKey) {
        console.warn("[api/donate/status] Transacción no encontrada localmente y WOMPI_PRIVATE_KEY no está configurada en el servidor.");
        return NextResponse.json(
          {
            error: "La transacción no se encuentra en el registro del servidor y no está configurada la llave privada (WOMPI_PRIVATE_KEY) para consultarla en Wompi.",
            code: "MISSING_SERVER_PRIVATE_KEY",
            environment: env,
          },
          { status: 500 }
        );
      }

      try {
        const apiUrl = `${wompiConfig.apiBaseUrl[env]}/transactions/${transactionId}`;
        console.info(`[api/donate/status] Intentando recuperación en Wompi API (${env}) para txId=${transactionId.slice(0, 12)}...`);

        const res = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${privateKey}` },
          cache: "no-store",
        });

        if (res.ok) {
          const wompiData = await res.json();
          const tx = wompiData?.data;

          if (tx && tx.reference) {
            // Si el cliente también envió referencia, verificar que coincidan
            if (reference && reference !== tx.reference) {
              console.warn(
                `[api/donate/status] Discrepancia en recuperación: solicitada=${reference}, Wompi=${tx.reference}`
              );
              return NextResponse.json(
                {
                  error: `El ID de transacción de Wompi ingresado corresponde a otra referencia (${tx.reference}) y no a la referencia consultada (${reference}).`,
                  code: "REFERENCE_MISMATCH",
                  requestedReference: reference,
                  actualReference: tx.reference,
                },
                { status: 400 }
              );
            }

            const mappedStatus = mapWompiStatus(tx.status);

            // Verificar si la referencia ya existe en el ledger local
            let existingRecord: TransactionRecord | null = null;
            try {
              existingRecord = await transactionStore.findByReference(tx.reference);
            } catch (dbErr: unknown) {
              console.warn("[api/donate/status] Error al buscar referencia en persistencia:", (dbErr as Error)?.message);
            }

            if (existingRecord) {
              if (existingRecord.status !== mappedStatus || !existingRecord.wompiTransactionId) {
                try {
                  const updated = await transactionStore.updateStatus(
                    existingRecord.reference,
                    mappedStatus,
                    tx.id,
                    undefined,
                    `Estado sincronizado en tiempo real desde API Wompi (${tx.status}).`
                  );
                  if (updated) existingRecord = updated;
                } catch (updateErr: unknown) {
                  console.warn("[api/donate/status] Error al actualizar estado:", (updateErr as Error)?.message);
                  existingRecord = { ...existingRecord, status: mappedStatus, wompiTransactionId: tx.id };
                }
              }
              record = existingRecord;
            } else {
              let inferredTarget = "general";
              if (tx.reference.includes("-PULSO-")) inferredTarget = "pulso";
              else if (tx.reference.includes("-QUAKE-")) inferredTarget = "quakenet";
              else if (tx.reference.includes("-PULSAI-")) inferredTarget = "pulsai";

              const recoveredRecord: TransactionRecord = {
                reference: tx.reference,
                amountCOP: Math.round(Number(tx.amount_in_cents || 0) / 100),
                amountInCents: Number(tx.amount_in_cents || 0),
                currency: tx.currency || "COP",
                targetId: inferredTarget,
                donorName: tx.customer_data?.full_name || undefined,
                donorEmail: tx.customer_data?.email || undefined,
                status: mappedStatus,
                wompiTransactionId: tx.id,
                createdAt: tx.created_at || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                processedEventIds: [],
                auditLogs: [
                  {
                    timestamp: new Date().toISOString(),
                    action: "RECOVERED_FROM_WOMPI_API",
                    details: `Transacción recuperada directamente desde API Wompi (${tx.status}).`,
                  },
                ],
              };

              try {
                await transactionStore.save(recoveredRecord);
              } catch (saveErr: unknown) {
                console.warn("[api/donate/status] Aviso: No fue posible persistir transacción recuperada en base de datos:", (saveErr as Error)?.message);
              }
              record = recoveredRecord;
            }
          }
        } else if (res.status === 404) {
          console.warn(`[api/donate/status] Wompi API (${env}) respondió 404: La transacción no existe en Wompi.`);
          return NextResponse.json(
            {
              error: `La transacción no existe en Wompi ${env === "sandbox" ? "Sandbox (Pruebas)" : "Producción"}.`,
              code: "NOT_FOUND_IN_WOMPI",
              environment: env,
              transactionId,
            },
            { status: 404 }
          );
        } else if (res.status === 401 || res.status === 403) {
          console.error(`[api/donate/status] Error de autorización en Wompi API (${res.status}). Compruebe WOMPI_PRIVATE_KEY.`);
          return NextResponse.json(
            {
              error: "Error de autenticación con la pasarela Wompi. Verifique las credenciales del servidor.",
              code: "GATEWAY_AUTH_ERROR",
              environment: env,
            },
            { status: 502 }
          );
        } else {
          console.warn(`[api/donate/status] Wompi API respondió con código HTTP ${res.status}`);
        }
      } catch (recoveryErr) {
        console.warn("[api/donate/status] Error de conexión con API Wompi:", recoveryErr);
      }
    }

    // 5. Si después de todas las comprobaciones no se obtuvo el registro
    if (!record) {
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

    // Devolver únicamente información segura y pública
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
