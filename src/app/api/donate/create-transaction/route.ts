import { NextResponse } from "next/server";
import { wompiConfig } from "@/config/wompi";
import {
  generateReference,
  copToCents,
  calculateIntegritySignature,
  validateIntegritySecretForEnvironment,
  buildWompiCheckoutUrl,
  buildWompiReturnUrl,
} from "@/lib/wompi";
import { transactionStore } from "@/lib/transactions-store";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

export async function POST(request: Request) {
  try {
    // 0. Control de tasa de peticiones (SEC-03: Rate Limiting distribuido)
    // Máximo 15 intenciones de donación por ventana de 5 minutos por IP
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`rate:donate:create:${clientIp}`, 15, 300);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Has superado el límite de solicitudes de donación por ahora. Por favor, espera unos minutos.",
          code: "RATE_LIMIT_EXCEEDED",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.ttlSeconds),
          },
        }
      );
    }

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
    const publicKey = (process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || process.env.WOMPI_PUBLIC_KEY || "").trim();
    const integritySecret = (process.env.WOMPI_INTEGRITY_SECRET || process.env.WOMPI_INTEGRITY_KEY || "").trim().replace(/^["']|["']$/g, "");

    if (!publicKey || !integritySecret) {
      console.error(
        "[api/donate/create-transaction] Faltan variables de entorno: NEXT_PUBLIC_WOMPI_PUBLIC_KEY y WOMPI_INTEGRITY_SECRET deben estar definidas."
      );
      return NextResponse.json(
        {
          error:
            "La pasarela de pagos no está configurada en el servidor (Se requieren NEXT_PUBLIC_WOMPI_PUBLIC_KEY y WOMPI_INTEGRITY_SECRET en las variables de entorno).",
        },
        { status: 500 }
      );
    }

    // Validación estricta del secreto de integridad para evitar error «firma inválida» por credenciales cruzadas
    const currentEnv =
      process.env.NEXT_PUBLIC_WOMPI_ENVIRONMENT ||
      process.env.WOMPI_ENVIRONMENT ||
      (publicKey.startsWith("pub_prod_") ? "production" : "sandbox");
    const secretValidation = validateIntegritySecretForEnvironment(integritySecret, publicKey, currentEnv);
    if (!secretValidation.isValid) {
      console.error(
        "[api/donate/create-transaction] Error de configuración de secreto de integridad:",
        secretValidation.reason
      );
      return NextResponse.json(
        {
          error: `Error de configuración en pasarela de pagos: ${secretValidation.reason}`,
          code: "INVALID_INTEGRITY_SECRET_CONFIGURATION",
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

    // 6. URL de retorno tras el pago con política inequívoca de entornos
    // - En Producción (VERCEL_ENV=production): Se garantiza siempre https://www.kyvora.net.co/donate/resultado?reference=...
    // - En Preview (VERCEL_ENV=preview): Se utiliza la URL del deployment preview correspondiente para pruebas aisladas.
    // - En Desarrollo local (localhost): Se omite redirect-url para evitar el bloqueo 403 de CloudFront WAF en checkout.wompi.co.
    // - Jamás se confía en encabezados del cliente (Host, x-forwarded-host) ni en el cuerpo de la petición.
    const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
    const redirectUrl = buildWompiReturnUrl(reference);

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
