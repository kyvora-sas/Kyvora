import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL || "kyvorasas@gmail.com";

// Memoria volátil para limitación de tasa (rate limiting por IP)
// Máximo 5 envíos por ventana de 10 minutos por IP
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimits = new Map<string, RateLimitEntry>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQUESTS) {
    return true;
  }
  entry.count++;
  return false;
}

// Sanitización de entidades HTML para evitar inyección en el correo
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    // 1. Rate limiting por IP o encabezado Forwarded
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous-client";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error:
            "Has alcanzado el límite de solicitudes por ahora. Por favor, intenta de nuevo en unos minutos o escríbenos directamente a WhatsApp.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { nombre, email, tipoProyecto, descripcion, presupuesto, website_hp, aceptaPolitica } = body;

    // 2. Trampa anti-spam (Honeypot)
    if (website_hp) {
      console.warn(`[contact] Bot detectado mediante trampa honeypot desde IP ${ip}`);
      // Respuesta ficticia sin procesar para despistar al bot
      return NextResponse.json({ success: true });
    }

    // 3. Validación de campos obligatorios
    if (!nombre || !email || !tipoProyecto || !descripcion) {
      return NextResponse.json(
        { error: "Por favor, completa todos los campos requeridos (Nombre, Email, Tipo de Proyecto y Descripción)." },
        { status: 400 }
      );
    }

    // 4. Verificación de consentimiento para tratamiento de datos personales (Ley 1581 de 2012)
    if (aceptaPolitica !== true) {
      return NextResponse.json(
        { error: "Debes autorizar el tratamiento de tus datos personales conforme a nuestra política para enviar el mensaje." },
        { status: 400 }
      );
    }

    // 5. Sanitización y límites de longitud
    const cleanNombre = escapeHtml(String(nombre).trim().slice(0, 100));
    const cleanEmail = String(email).trim().toLowerCase().slice(0, 120);
    const cleanTipo = escapeHtml(String(tipoProyecto).trim().slice(0, 80));
    const cleanDesc = escapeHtml(String(descripcion).trim().slice(0, 3000));
    const cleanPresupuesto = presupuesto ? escapeHtml(String(presupuesto).trim().slice(0, 80)) : "No especificado";

    // Validación de formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "La dirección de correo electrónico ingresada no tiene un formato válido." },
        { status: 400 }
      );
    }

    // 6. Envío seguro mediante Resend
    if (!resend) {
      console.warn(
        "[contact] RESEND_API_KEY no configurado en entorno. Mensaje registrado en registro de auditoría:",
        { cleanNombre, cleanEmail, cleanTipo, cleanPresupuesto }
      );
      // Para no perder el mensaje en entornos de prueba si no hay Resend activo
      return NextResponse.json({
        success: true,
        note: "Mensaje procesado en entorno local/staging.",
      });
    }

    const { data, error } = await resend.emails.send({
      from: "KYVORA Contacto <onboarding@resend.dev>",
      to: [notificationEmail],
      replyTo: cleanEmail,
      subject: `Nuevo contacto comercial de ${cleanNombre} - [${cleanTipo}]`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0B0F19; color: #F8FAFC; border: 1px solid #1E293B; border-radius: 8px;">
          <h2 style="color: #00E5FF; margin-top: 0; border-bottom: 1px solid #1E293B; padding-bottom: 12px;">Nuevo Mensaje desde kyvora.net.co</h2>
          <p style="font-size: 15px; margin: 8px 0;"><strong>Nombre:</strong> ${cleanNombre}</p>
          <p style="font-size: 15px; margin: 8px 0;"><strong>Correo de contacto:</strong> <a href="mailto:${cleanEmail}" style="color: #0066FF;">${cleanEmail}</a></p>
          <p style="font-size: 15px; margin: 8px 0;"><strong>Tipo de Proyecto:</strong> ${cleanTipo}</p>
          <p style="font-size: 15px; margin: 8px 0;"><strong>Presupuesto estimado:</strong> ${cleanPresupuesto}</p>
          <div style="margin-top: 20px; padding: 16px; background: #111827; border-radius: 6px; border-left: 3px solid #0066FF;">
            <h4 style="margin-top: 0; color: #94A3B8;">Descripción del requerimiento:</h4>
            <p style="line-height: 1.6; white-space: pre-wrap; font-size: 14px; margin-bottom: 0;">${cleanDesc}</p>
          </div>
          <p style="font-size: 12px; color: #64748B; margin-top: 24px;">Autorización Ley 1581 de 2012 otorgada por el usuario. IP: ${ip}</p>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Error de Resend:", error);
      return NextResponse.json(
        { error: "No fue posible entregar el mensaje al servidor de correo. Por favor, contáctanos por WhatsApp." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error: unknown) {
    console.error("[contact] Error interno no controlado:", error);
    return NextResponse.json({ error: "Error interno del servidor procesando el formulario." }, { status: 500 });
  }
}
