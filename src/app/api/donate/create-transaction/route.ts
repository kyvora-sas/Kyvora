import { NextResponse } from "next/server";
import { wompiConfig } from "@/config/wompi";
import { siteConfig } from "@/config/site";
import {
  generateReference,
  copToCents,
  calculateIntegritySignature,
  buildWompiCheckoutUrl,
  isLocalOrLoopbackUrl,
} from "@/lib/wompi";
import { transactionStore } from "@/lib/transactions-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amountCOP, targetId, donorName, donorEmail } = body;

    // 1. Validación de importe
    const parsedAmount = Number(amountCOP);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount < wompiConfig.minAmountCOP) {
      return NextResponse.json(
        {
          error: `El importe mínimo para aportes es de $${wompiConfig.minAmountCOP.toLocaleString("es-CO")} COP.`,
        },
        { status: 400 }
      );
    }

    if (parsedAmount > wompiConfig.maxAmountCOP) {
      return NextResponse.json(
        {
          error: `El importe supera el límite máximo permitido ($${wompiConfig.maxAmountCOP.toLocaleString("es-CO")} COP).`,
        },
        { status: 400 }
      );
    }

    // 2. Validación de destino
    const target = wompiConfig.targets.find((t) => t.id === targetId);
    if (!target) {
      return NextResponse.json(
        { error: "El destino de aporte seleccionado no es válido." },
        { status: 400 }
      );
    }

    // 3. Generación de referencia única e importe en centavos
    const targetTag =
      targetId === "pulso"
        ? "PULSO"
        : targetId === "quakenet"
        ? "QUAKE"
        : targetId === "pulsai"
        ? "PULSAI"
        : "GEN";
    const reference = generateReference(`KYV-DON-${targetTag}`);
    const amountInCents = copToCents(parsedAmount);
    const currency = wompiConfig.currency;

    // 4. Clave pública y secreto de integridad desde variables de entorno estrictas
    const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

    if (!publicKey || !integritySecret) {
      console.error(
        "[api/donate/create-transaction] Faltan variables de entorno: NEXT_PUBLIC_WOMPI_PUBLIC_KEY o WOMPI_INTEGRITY_SECRET no están definidas."
      );
      return NextResponse.json(
        {
          error:
            "La pasarela de pagos no está configurada en el servidor (Se requieren NEXT_PUBLIC_WOMPI_PUBLIC_KEY y WOMPI_INTEGRITY_SECRET en las variables de entorno).",
        },
        { status: 500 }
      );
    }

    // 5. Cálculo seguro de la firma de integridad en el servidor
    const signature = calculateIntegritySignature(
      reference,
      amountInCents,
      currency,
      integritySecret
    );

    // 6. URL de retorno tras el pago
    // En producción (Vercel o dominio público), se garantiza HTTPS y la URL canónica de KYVORA (https://www.kyvora.net.co/donate/resultado?reference=...).
    // En desarrollo local (localhost), CloudFront / AWS WAF en checkout.wompi.co bloquea con 403 (regla SSRF) peticiones GET que incluyan loopbacks en query params.
    // Para entornos locales se omite redirect-url en el query param para evitar el bloqueo 403; en entornos públicos HTTPS, se incluye siempre.
    const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
    const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
    const siteUrl = isProd && isLocalOrLoopbackUrl(rawSiteUrl) ? siteConfig.url : rawSiteUrl;
    const isLocal = isLocalOrLoopbackUrl(siteUrl);
    const sanitizedBase = siteUrl.trim().replace(/\/+$/, "");
    const redirectUrl = isLocal
      ? undefined
      : `${sanitizedBase}/donate/resultado?reference=${encodeURIComponent(reference)}`;

    console.info("[api/donate/create-transaction] Creando intención de donación:", {
      reference,
      targetId,
      amountCOP: parsedAmount,
      isProd,
      hasPostgres: Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL),
      hasRedirectUrl: Boolean(redirectUrl),
    });

    // 7. Registro de la transacción como PENDING en almacenamiento persistente
    await transactionStore.save({
      reference,
      amountCOP: parsedAmount,
      amountInCents,
      currency,
      targetId,
      donorName: typeof donorName === "string" ? donorName.slice(0, 80) : undefined,
      donorEmail: typeof donorEmail === "string" ? donorEmail.slice(0, 100) : undefined,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      processedEventIds: [],
      auditLogs: [
        {
          timestamp: new Date().toISOString(),
          action: "TRANSACTION_CREATED",
          details: `Transacción iniciada por $${parsedAmount} COP con destino '${target.title}'.`,
        },
      ],
    });

    // 8. Construcción de la URL de Wompi Checkout Web
    const checkoutUrl = buildWompiCheckoutUrl({
      publicKey,
      reference,
      amountInCents,
      currency,
      signature,
      redirectUrl,
      customerData: {
        email: donorEmail,
        fullName: donorName,
      },
    });

    return NextResponse.json({
      success: true,
      reference,
      amountCOP: parsedAmount,
      amountInCents,
      currency,
      publicKey,
      signature,
      redirectUrl,
      checkoutUrl,
    });
  } catch (error: unknown) {
    console.error("[api/donate/create-transaction] Error interno:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar el inicio de la transacción." },
      { status: 500 }
    );
  }
}
