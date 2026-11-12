import { NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml, sanitizeAndValidateEmail } from "@/lib/contact-utils";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

const resendApiKey = process.env.RESEND_API_KEY || "";
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL || "kyvorasas@gmail.com";
const senderEmail = process.env.CONTACT_FROM_EMAIL || "KYVORA Contacto <onboarding@resend.dev>";

export async function POST(request: Request) {
  try {
    // 1. Rate limiting distribuido (PostgreSQL con respaldo en memoria) por IP confiable
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(`rate:contact:${ip}`, 5, 600);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "Has alcanzado el límite de solicitudes por ahora. Por favor, intenta de nuevo en unos minutos o escríbenos directamente a WhatsApp.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.ttlSeconds) },
        }
      );
    }

    const body = await request.json();
    const { nombre, email, tipoProyecto, descripcion, presupuesto, website_hp, aceptaPolitica } =
      body ?? {};

    // 2. Trampa anti-spam (Honeypot)
    if (website_hp) {
      console.warn(`[contact] Bot detectado mediante trampa honeypot desde IP ${escapeHtml(ip)}`);
      return NextResponse.json({ success: true });
    }

    // 3. Validación de campos obligatorios
    if (!nombre || !email || !tipoProyecto || !descripcion) {
      return NextResponse.json(
        {
          error:
            "Por favor, completa todos los campos requeridos (Nombre, Email, Tipo de Proyecto y Descripción).",
        },
        { status: 400 }
      );
    }

    // 4. Verificación de consentimiento para tratamiento de datos personales (Ley 1581 de 2012)
    if (aceptaPolitica !== true) {
      return NextResponse.json(
        {
          error:
            "Debes autorizar el tratamiento de tus datos personales conforme a nuestra política para enviar el mensaje.",
        },
        { status: 400 }
      );
    }

    // 5. Sanitización, límites de longitud y validación estricta de correo
    const cleanEmail = sanitizeAndValidateEmail(String(email));
    if (!cleanEmail) {
      return NextResponse.json(
        { error: "La dirección de correo electrónico ingresada no tiene un formato válido." },
        { status: 400 }
      );
    }

    const cleanNombre = escapeHtml(String(nombre).trim().slice(0, 100));
    const cleanTipo = escapeHtml(String(tipoProyecto).trim().slice(0, 80));
    const cleanDesc = escapeHtml(String(descripcion).trim().slice(0, 3000));
    const cleanPresupuesto = presupuesto
      ? escapeHtml(String(presupuesto).trim().slice(0, 80))
      : "No especificado";

    const safeEmailHtml = escapeHtml(cleanEmail);
    const safeIpHtml = escapeHtml(ip);

    // 6. Envío seguro mediante Resend
    if (!resend) {
      console.warn(
        "[contact] RESEND_API_KEY no configurado en entorno. Mensaje registrado en registro de auditoría:",
        { cleanNombre, cleanEmail, cleanTipo, cleanPresupuesto }
      );
      return NextResponse.json({
        success: true,
        note: "Mensaje procesado en entorno local/staging.",
      });
    }

    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: [notificationEmail],
      replyTo: cleanEmail,
      subject: `Nuevo contacto comercial de ${cleanNombre} - [${cleanTipo}]`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #080B12; color: #FFFFFF; border: 1px solid #252D3A; border-radius: 10px;">
          <h2 style="color: #2B85FF; margin-top: 0; border-bottom: 1px solid #252D3A; padding-bottom: 12px;">Nuevo Mensaje desde kyvora.net.co</h2>
          <p style="font-size: 15px; margin: 8px 0;"><strong>Nombre:</strong> ${cleanNombre}</p>
          <p style="font-size: 15px; margin: 8px 0;"><strong>Correo de contacto:</strong> <a href="mailto:${safeEmailHtml}" style="color: #5CA8FF;">${safeEmailHtml}</a></p>
          <p style="font-size: 15px; margin: 8px 0;"><strong>Tipo de Proyecto:</strong> ${cleanTipo}</p>
          <p style="font-size: 15px; margin: 8px 0;"><strong>Presupuesto estimado:</strong> ${cleanPresupuesto}</p>
          <div style="margin-top: 20px; padding: 16px; background: #0D121D; border-radius: 8px; border-left: 3px solid #1677FF;">
            <h4 style="margin-top: 0; color: #AFC4E8;">Descripción del requerimiento:</h4>
            <p style="line-height: 1.6; white-space: pre-wrap; font-size: 14px; margin-bottom: 0;">${cleanDesc}</p>
          </div>
          <p style="font-size: 12px; color: #8F9BB3; margin-top: 24px;">Autorización Ley 1581 de 2012 otorgada por el usuario. IP: ${safeIpHtml}</p>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Error de Resend:", error);
      return NextResponse.json(
        {
          error:
            "No fue posible entregar el mensaje al servidor de correo. Por favor, contáctanos por WhatsApp.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error: unknown) {
    console.error("[contact] Error interno no controlado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor procesando el formulario." },
      { status: 500 }
    );
  }
}
