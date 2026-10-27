import { NextResponse } from "next/server";
import { verifyWebhookChecksum } from "@/lib/wompi";
import { transactionStore, TransactionStatus } from "@/lib/transactions-store";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let eventPayload: Record<string, unknown>;

    try {
      eventPayload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Cuerpo de solicitud JSON inválido." }, { status: 400 });
    }

    // 1. Verificación de la firma de autenticidad (checksum)
    const verification = verifyWebhookChecksum(eventPayload);
    if (!verification.isValid) {
      console.warn("[webhook/wompi] Intento de webhook no autenticado o firma no válida:", verification.reason);
      return NextResponse.json(
        { error: "Firma criptográfica inválida o no autenticada." },
        { status: 401 }
      );
    }

    // 2. Extraer datos del evento
    const dataObj = eventPayload.data as Record<string, unknown> | undefined;
    const tx = dataObj?.transaction as Record<string, unknown> | undefined;
    const eventId = String(tx?.id || eventPayload.timestamp);

    if (!tx || typeof tx.reference !== "string") {
      return NextResponse.json({ error: "Transacción o referencia ausente en el evento." }, { status: 400 });
    }

    // 3. Control de Idempotencia: Verificar si este evento exacto ya fue procesado
    const alreadyProcessed = await transactionStore.isEventProcessed(eventId);
    if (alreadyProcessed) {
      console.info(`[webhook/wompi] Evento ${eventId} ya procesado previamente. Idempotencia aplicada.`);
      return NextResponse.json({ received: true, note: "Evento ya procesado previamente." }, { status: 200 });
    }

    // 4. Buscar registro en el ledger interno
    const record = await transactionStore.findByReference(tx.reference);
    if (!record) {
      console.warn(`[webhook/wompi] Referencia ${tx.reference} no encontrada en el sistema.`);
      return NextResponse.json(
        { error: "Referencia de transacción no encontrada en los registros del comercio." },
        { status: 404 }
      );
    }

    const txCurrency = String(tx.currency);
    const txAmountInCents = Number(tx.amount_in_cents);
    const txStatus = String(tx.status);
    const txId = typeof tx.id === "string" ? tx.id : undefined;
    const txStatusMsg = typeof tx.status_message === "string" ? tx.status_message : "Sin mensaje";

    // 5. Validación de integridad del importe y la moneda
    if (txCurrency !== record.currency) {
      console.error(`[webhook/wompi] Moneda discordante: esperada ${record.currency}, recibida ${txCurrency}`);
      await transactionStore.updateStatus(
        record.reference,
        "ERROR",
        txId,
        eventId,
        `Alerta de seguridad: Discrepancia de moneda detectada (${txCurrency} vs ${record.currency}).`
      );
      return NextResponse.json({ error: "Discrepancia de moneda." }, { status: 400 });
    }

    if (txAmountInCents !== record.amountInCents) {
      console.error(
        `[webhook/wompi] Importe discordante: esperado ${record.amountInCents}, recibido ${txAmountInCents}`
      );
      await transactionStore.updateStatus(
        record.reference,
        "ERROR",
        txId,
        eventId,
        `Alerta de seguridad: Discrepancia de monto detectada (${txAmountInCents} vs ${record.amountInCents}).`
      );
      return NextResponse.json({ error: "Discrepancia de importe en centavos." }, { status: 400 });
    }

    // 6. Mapeo estricto del estado reportado por Wompi
    let nextStatus: TransactionStatus = "PENDING";
    switch (txStatus) {
      case "APPROVED":
        nextStatus = "APPROVED";
        break;
      case "DECLINED":
        nextStatus = "DECLINED";
        break;
      case "VOIDED":
        nextStatus = "VOIDED";
        break;
      case "ERROR":
        nextStatus = "ERROR";
        break;
      case "PENDING":
      default:
        nextStatus = "PENDING";
        break;
    }

    // 7. Actualización idempotente del estado y registro de auditoría
    await transactionStore.updateStatus(
      record.reference,
      nextStatus,
      txId,
      eventId,
      `Evento Wompi '${String(eventPayload.event || "")}' recibido. Estado reportado: ${txStatus} (${txStatusMsg}).`
    );

    console.info(`[webhook/wompi] Transacción ${record.reference} actualizada a estado ${nextStatus}.`);

    return NextResponse.json({ received: true, status: nextStatus }, { status: 200 });
  } catch (error: unknown) {
    console.error("[webhook/wompi] Error procesando webhook:", error);
    return NextResponse.json({ error: "Error procesando el evento webhook." }, { status: 500 });
  }
}
