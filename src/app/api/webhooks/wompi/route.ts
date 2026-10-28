import { NextResponse } from "next/server";
import { verifyWebhookChecksum } from "@/lib/wompi";
import { transactionStore, TransactionStatus, TransactionRecord } from "@/lib/transactions-store";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let eventPayload: Record<string, unknown>;

    try {
      eventPayload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Cuerpo de solicitud JSON inválido." }, { status: 400 });
    }

    // 1. Verificación de configuración del secreto de eventos
    const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
    if (!eventsSecret) {
      console.error("[webhook/wompi] Error crítico de configuración: WOMPI_EVENTS_SECRET no está definida.");
      return NextResponse.json(
        { error: "El servidor no tiene configurada la llave de eventos de Wompi (WOMPI_EVENTS_SECRET)." },
        { status: 500 }
      );
    }

    // 2. Verificación criptográfica de la firma de autenticidad (checksum SHA-256)
    const verification = verifyWebhookChecksum(eventPayload, eventsSecret);
    if (!verification.isValid) {
      console.warn("[webhook/wompi] Intento de webhook no autenticado o firma no válida:", verification.reason);
      return NextResponse.json(
        { error: "Firma criptográfica inválida o no autenticada." },
        { status: 401 }
      );
    }

    // 3. Verificación de ambiente
    const currentEnv = (
      process.env.NEXT_PUBLIC_WOMPI_ENVIRONMENT ||
      process.env.WOMPI_ENVIRONMENT ||
      "sandbox"
    ).toLowerCase() === "production" ? "prod" : "test";

    if (eventPayload.environment && typeof eventPayload.environment === "string") {
      const payloadEnv = eventPayload.environment.toLowerCase();
      if (payloadEnv !== currentEnv) {
        console.warn(
          `[webhook/wompi] Advertencia: Discrepancia de ambiente en webhook. Servidor=${currentEnv}, Webhook=${payloadEnv}`
        );
      }
    }

    // 4. Extraer datos del evento
    const dataObj = eventPayload.data as Record<string, unknown> | undefined;
    const tx = dataObj?.transaction as Record<string, unknown> | undefined;
    const eventId = String(tx?.id || eventPayload.timestamp);

    if (!tx || typeof tx.reference !== "string") {
      return NextResponse.json({ error: "Transacción o referencia ausente en el evento." }, { status: 400 });
    }

    // 5. Control de Idempotencia: Verificar si este evento exacto ya fue procesado
    const alreadyProcessed = await transactionStore.isEventProcessed(eventId);
    if (alreadyProcessed) {
      console.info(`[webhook/wompi] Evento ${eventId} ya procesado previamente. Idempotencia aplicada.`);
      return NextResponse.json({ received: true, note: "Evento ya procesado previamente." }, { status: 200 });
    }

    // 6. Buscar registro en el ledger interno o recuperar desde payload autenticado
    let record = await transactionStore.findByReference(tx.reference);
    const txId = typeof tx.id === "string" ? tx.id : undefined;

    if (!record) {
      console.info(`[webhook/wompi] Referencia ${tx.reference} no encontrada en cache local. Reconstruyendo a partir de webhook verificado.`);
      let inferredTarget = "general";
      if (tx.reference.includes("-PULSO-")) inferredTarget = "pulso";
      else if (tx.reference.includes("-QUAKE-")) inferredTarget = "quakenet";
      else if (tx.reference.includes("-PULSAI-")) inferredTarget = "pulsai";

      const newRecord: TransactionRecord = {
        reference: tx.reference,
        amountCOP: Math.round(Number(tx.amount_in_cents || 0) / 100),
        amountInCents: Number(tx.amount_in_cents || 0),
        currency: String(tx.currency || "COP"),
        targetId: inferredTarget,
        status: "PENDING",
        wompiTransactionId: txId,
        createdAt: String(eventPayload.sent_at || new Date().toISOString()),
        updatedAt: new Date().toISOString(),
        processedEventIds: [],
        auditLogs: [
          {
            timestamp: new Date().toISOString(),
            action: "RECORD_CREATED_FROM_VERIFIED_WEBHOOK",
            details: "Registro recuperado a partir de notificación webhook auténtica de Wompi.",
          },
        ],
      };
      await transactionStore.save(newRecord);
      record = newRecord;
    }

    const txCurrency = String(tx.currency);
    const txAmountInCents = Number(tx.amount_in_cents);
    const txStatus = String(tx.status);
    const txStatusMsg = typeof tx.status_message === "string" ? tx.status_message : "Sin mensaje";

    // 7. Validación de integridad del importe y la moneda
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

    // 8. Mapeo estricto del estado reportado por Wompi
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

    // 9. Actualización idempotente del estado y registro de auditoría
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
