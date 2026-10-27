import { NextResponse } from "next/server";
import { transactionStore } from "@/lib/transactions-store";
import { wompiConfig } from "@/config/wompi";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");
    const transactionId = searchParams.get("id"); // Wompi a veces añade 'id' en la URL de redirección

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

    // Si aún no está en el ledger local pero vino con un id de transacción de Wompi, o está en PENDING
    // se puede consultar el API de Wompi para verificar el estado en tiempo real
    if (record && record.status === "PENDING" && record.wompiTransactionId) {
      try {
        const env = process.env.WOMPI_ENVIRONMENT === "production" ? "production" : "sandbox";
        const apiUrl = `${wompiConfig.apiBaseUrl[env]}/transactions/${record.wompiTransactionId}`;
        const apiKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "";
        
        if (apiKey) {
          const res = await fetch(apiUrl, {
            headers: { Authorization: `Bearer ${apiKey}` },
            cache: "no-store",
          });
          if (res.ok) {
            const wompiData = await res.json();
            const tx = wompiData?.data;
            if (tx && tx.status) {
              const mappedStatus =
                tx.status === "APPROVED"
                  ? "APPROVED"
                  : tx.status === "DECLINED"
                  ? "DECLINED"
                  : tx.status === "VOIDED"
                  ? "VOIDED"
                  : tx.status === "ERROR"
                  ? "ERROR"
                  : "PENDING";
              
              if (mappedStatus !== record.status) {
                record = await transactionStore.updateStatus(
                  record.reference,
                  mappedStatus,
                  tx.id,
                  undefined,
                  `Estado sincronizado directamente desde API Wompi (${tx.status}).`
                );
              }
            }
          }
        }
      } catch (syncErr) {
        console.warn("[api/donate/status] Fallo al sincronizar con API Wompi:", syncErr);
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
