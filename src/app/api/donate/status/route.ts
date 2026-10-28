import { NextResponse } from "next/server";
import { transactionStore } from "@/lib/transactions-store";
import { wompiConfig } from "@/config/wompi";

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
    const reference = searchParams.get("reference");
    const transactionId = searchParams.get("id"); // Wompi añade 'id' al redirigir al comercio

    if (!reference && !transactionId) {
      return NextResponse.json(
        { error: "Debe proporcionar una referencia o ID de transacción." },
        { status: 400 }
      );
    }

    let record = null;
    if (reference) {
      record = await transactionStore.findByReference(reference);
    }

    const env = (
      process.env.NEXT_PUBLIC_WOMPI_ENVIRONMENT ||
      process.env.WOMPI_ENVIRONMENT ||
      "sandbox"
    ).toLowerCase() === "production" ? "production" : "sandbox";

    const apiKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
    const effectiveTxId = transactionId || record?.wompiTransactionId;

    // 1. Si la transacción está en PENDING y disponemos de ID de Wompi, sincronizar estado en vivo
    if (record && record.status === "PENDING" && effectiveTxId && apiKey) {
      try {
        const apiUrl = `${wompiConfig.apiBaseUrl[env]}/transactions/${effectiveTxId}`;
        const res = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${apiKey}` },
          cache: "no-store",
        });
        if (res.ok) {
          const wompiData = await res.json();
          const tx = wompiData?.data;
          if (tx && tx.status) {
            const mappedStatus = mapWompiStatus(tx.status);

            if (mappedStatus !== record.status) {
              record = await transactionStore.updateStatus(
                record.reference,
                mappedStatus,
                tx.id,
                undefined,
                `Estado sincronizado en tiempo real desde API Wompi (${tx.status}).`
              );
            }
          }
        }
      } catch (syncErr) {
        console.warn("[api/donate/status] Fallo al sincronizar con API Wompi:", syncErr);
      }
    }

    // 2. Si el registro no se encontró en el ledger local pero el cliente aportó un ID de Wompi
    // (resiliencia ante arranques fríos o despliegues serverless de Vercel)
    if (!record && transactionId && apiKey) {
      try {
        const apiUrl = `${wompiConfig.apiBaseUrl[env]}/transactions/${transactionId}`;
        const res = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${apiKey}` },
          cache: "no-store",
        });
        if (res.ok) {
          const wompiData = await res.json();
          const tx = wompiData?.data;
          if (tx && tx.reference) {
            // Si el cliente también envió referencia, verificar que coincidan
            if (!reference || reference === tx.reference) {
              const mappedStatus = mapWompiStatus(tx.status);

              let inferredTarget = "general";
              if (tx.reference.includes("-PULSO-")) inferredTarget = "pulso";
              else if (tx.reference.includes("-QUAKE-")) inferredTarget = "quakenet";
              else if (tx.reference.includes("-PULSAI-")) inferredTarget = "pulsai";

              const recoveredRecord = {
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

              await transactionStore.save(recoveredRecord);
              record = recoveredRecord;
            }
          }
        }
      } catch (recoveryErr) {
        console.warn("[api/donate/status] Fallo al recuperar transacción desde API Wompi:", recoveryErr);
      }
    }

    if (!record) {
      return NextResponse.json(
        { error: "Transacción no encontrada en el sistema." },
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
    console.error("[api/donate/status] Error:", error);
    return NextResponse.json(
      { error: "Error consultando el estado de la transacción." },
      { status: 500 }
    );
  }
}
