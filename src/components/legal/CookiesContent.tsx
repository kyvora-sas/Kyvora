"use client";

import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";
import { legalConfig } from "@/config/legal";
import { useLanguage } from "@/context/LanguageContext";

export default function CookiesContent() {
  const { language } = useLanguage();
  const isEn = language === "en";

  if (isEn) {
    return (
      <LegalLayout
        title="Cookie & Similar Technologies Policy"
        subtitle="Technical disclosure regarding strictly necessary cookies, local storage of user preferences, and complete absence of invasive advertising trackers."
        lastUpdated="October 27, 2026"
        normativeBase="Law 1581 of 2012, Law 527 of 1999 & SIC Cookie Guidelines"
      >
        {/* 1. Definition and Privacy Approach */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">1. What are Cookies and Similar Technologies?</h2>
          <p>
            Cookies are small data files stored in the user&apos;s browser upon visiting a website. They serve diverse functional purposes, such as remembering visual preferences, maintaining session stability, or facilitating secure interactions with third-party payment gateways.
          </p>
          <p>
            At <strong>{legalConfig.brandName}</strong>, we adopt a strict <strong>Privacy by Design</strong> approach. Guided by technical and ethical standards, our website minimizes persistent identifiers and <strong>does not employ advertising cookies, commercial profiling algorithms, or cross-site tracking tools</strong>.
          </p>
        </section>

        {/* 2. Real Inventory of Technologies */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">2. Verified Inventory of Technologies Used at KYVORA</h2>
          <p>
            In accordance with our architecture audit across Next.js and Vercel infrastructure, the only technologies deployed on this site are:
          </p>

          <div className="space-y-4 bg-surface p-6 rounded-xl border border-white/10 text-sm">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-base">A. Technical and Security Cookies (Strictly Necessary)</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Essential</span>
              </div>
              <p className="text-foreground-muted mt-1 leading-relaxed text-xs">
                <strong>Purpose:</strong> Enforce secure HTTPS browsing, enable Cross-Site Request Forgery (CSRF) defenses, apply rate limiting to prevent Denial of Service attacks, and securely route transaction parameters to official Wompi Colombia checkout endpoints.
                <br />
                <strong>Duration:</strong> Session-based cookies destroyed upon browser closure or expiring after brief technical windows.
              </p>
            </div>

            <div className="border-t border-white/5 pt-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-base">B. Local Preference Storage (localStorage)</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">Preferences</span>
              </div>
              <p className="text-foreground-muted mt-1 leading-relaxed text-xs">
                <strong>Purpose:</strong> Retain client-side accessibility and UI preferences, such as reduced motion settings (<code>prefers-reduced-motion</code>) and interface language selection (<code>kyvora_lang</code>). This data remains strictly in your local device and is never consolidated or transmitted to KYVORA remote servers.
                <br />
                <strong>Duration:</strong> Persistent on the client device until browser cache and site storage are manually cleared.
              </p>
            </div>

            <div className="border-t border-white/5 pt-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-base">C. Payment Gateway Cookies (Wompi Colombia)</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">Transactional</span>
              </div>
              <p className="text-foreground-muted mt-1 leading-relaxed text-xs">
                <strong>Purpose:</strong> When interacting with our voluntary contributions system (Donate Us) and redirecting to Wompi&apos;s encrypted checkout (checkout.wompi.co), the gateway deploys PCI-DSS certified banking cookies to authenticate payments with financial institutions (PSE, Visa, MasterCard, Nequi).
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-1.5 text-xs text-foreground-muted leading-relaxed">
            <p className="text-white font-medium">Absence of Advertising Trackers (Full Transparency):</p>
            <p>
              KYVORA <strong>does NOT use tracking pixels (such as Meta Pixel or TikTok Pixel), Google Ads remarketing cookies, browser fingerprinting identifiers, or analytics scripts that resell or share browsing behavior with advertising intermediaries</strong>.
            </p>
          </div>
        </section>

        {/* 3. Legal Grounds */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">3. Legal Grounds for Essential Cookies</h2>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Pursuant to the guidelines issued by the Superintendence of Industry and Commerce (SIC) and Statutory Law 1581 of 2012, strictly technical cookies do not require prior user consent, as they are indispensable for telecommunications and the provision of digital services explicitly requested by the visitor.
          </p>
        </section>

        {/* 4. Browser Management */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">4. Managing and Disabling Cookies in Your Browser</h2>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Users may restrict, block, or delete cookies and web storage at any time by configuring their browser settings:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-xs text-foreground-muted font-light">
            <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Third-party cookies / Site data.</li>
            <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data.</li>
            <li><strong>Apple Safari:</strong> Settings &gt; Safari &gt; Advanced &gt; Privacy and Cookie Blocking.</li>
            <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies.</li>
          </ul>
          <p className="text-xs text-foreground-muted">
            <em>Technical Note:</em> Disabling or blocking technical cookies may cause transactional anomalies during redirection and receipt validation with the Wompi payment gateway.
          </p>
        </section>

        {/* 5. Inquiries and Contact */}
        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">5. Questions and Exercising Privacy Rights</h2>
          <p className="text-sm text-foreground-muted leading-relaxed">
            For any inquiry regarding cookie management or digital privacy protection at KYVORA, you may contact us at{" "}
            <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline">
              {legalConfig.owner.legalEmail}
            </a>{" "}
            or review our full{" "}
            <Link href="/legal/datos-personales" className="text-[var(--color-accent-cyan)] underline font-medium">
              Personal Data Processing Policy
            </Link>.
          </p>
        </section>
      </LegalLayout>
    );
  }

  // Spanish (Default)
  return (
    <LegalLayout
      title="Política de Cookies y Tecnologías Similares"
      subtitle="Declaración técnica de transparencia sobre el uso de cookies estrictamente necesarias, almacenamiento local de preferencias y ausencia de rastreadores publicitarios intrusivos."
      lastUpdated="27 de Octubre de 2026"
      normativeBase="Ley 1581 de 2012, Ley 527 de 1999 & Guía de Cookies de la SIC"
    >
      {/* 1. Definición y Enfoque de Privacidad */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">1. ¿Qué son las Cookies y Tecnologías Similares?</h2>
        <p>
          Las cookies son pequeños ficheros de datos que se almacenan en el navegador del usuario al visitar un sitio web. Cumplen funciones variadas como recordar preferencias de visualización, asegurar la estabilidad de la sesión o facilitar la interacción con pasarelas de pago externas.
        </p>
        <p>
          En <strong>{legalConfig.brandName}</strong> adoptamos un enfoque de <strong>privacidad por diseño (Privacy by Design)</strong>. Por principio ético e ingenieril, nuestro sitio web minimiza al máximo el uso de identificadores persistentes y <strong>no implementa cookies publicitarias ni herramientas de perfilamiento comercial o seguimiento cruzado (cross-site tracking)</strong>.
        </p>
      </section>

      {/* 2. Inventario Real de Tecnologías Utilizadas */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">2. Inventario Real y Verificado de Tecnologías en KYVORA</h2>
        <p>
          De acuerdo con la auditoría técnica de nuestra arquitectura sobre Next.js y Vercel, las únicas tecnologías empleadas en este portal son:
        </p>

        <div className="space-y-4 bg-surface p-6 rounded-xl border border-white/10 text-sm">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-base">A. Cookies Técnicas y de Seguridad (Estrictamente Necesarias)</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Esenciales</span>
            </div>
            <p className="text-foreground-muted mt-1 leading-relaxed text-xs">
              <strong>Finalidad:</strong> Garantizar la navegación segura mediante HTTPS, habilitar la protección contra solicitudes falsificadas en sitios cruzados (CSRF), controlar la tasa de peticiones (rate limiting) para evitar ataques de denegación de servicio y facilitar el paso seguro de parámetros hacia el checkout oficial de Wompi Colombia.
              <br />
              <strong>Temporalidad:</strong> Cookies de sesión que se eliminan al cerrar el navegador o expiran en periodos técnicos breves.
            </p>
          </div>

          <div className="border-t border-white/5 pt-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-base">B. Almacenamiento Local de Preferencias (localStorage)</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">Preferencias</span>
            </div>
            <p className="text-foreground-muted mt-1 leading-relaxed text-xs">
              <strong>Finalidad:</strong> Conservar localmente en el navegador del usuario sus preferencias de accesibilidad, como la indicación de movimiento reducido (<code>prefers-reduced-motion</code>) y la selección de idioma (<code>kyvora_lang</code>). Estos datos residen exclusivamente en el dispositivo del visitante y nunca se transmiten ni consolidan en servidores de KYVORA.
              <br />
              <strong>Temporalidad:</strong> Persistente en el cliente hasta que el usuario limpie la memoria caché de su navegador.
            </p>
          </div>

          <div className="border-t border-white/5 pt-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-base">C. Cookies de Pasarela de Pagos (Wompi Colombia)</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">Transaccional</span>
            </div>
            <p className="text-foreground-muted mt-1 leading-relaxed text-xs">
              <strong>Finalidad:</strong> Cuando el usuario interactúa voluntariamente con el módulo de aportes (Donate Us) y es redirigido al entorno de pago seguro de Wompi (checkout.wompi.co), la pasarela de pagos utiliza sus propias cookies de sesión bancaria con certificación PCI-DSS para autenticar la transacción con la entidad financiera correspondiente (PSE, Visa, MasterCard, Nequi).
            </p>
          </div>
        </div>

        <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-1.5 text-xs text-foreground-muted leading-relaxed">
          <p className="text-white font-medium">Ausencia de Rastreadores Publicitarios (Transparencia Total):</p>
          <p>
            Kyvora <strong>NO utiliza píxeles de seguimiento publicitario (como Meta Pixel o TikTok Pixel), cookies de remarketing de Google Ads, identificadores de huella digital del dispositivo (fingerprinting), ni scripts de analítica que revendan o compartan el comportamiento del usuario con intermediarios publicitarios</strong>.
          </p>
        </div>
      </section>

      {/* 3. Base Jurídica de las Cookies Esenciales */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">3. Base Legal de las Tecnologías Utilizadas</h2>
        <p className="text-sm text-foreground-muted leading-relaxed">
          De conformidad con las orientaciones de la Superintendencia de Industria y Comercio (SIC) y la Ley 1581 de 2012, el uso de cookies estrictamente técnicas no requiere de autorización previa del usuario por resultar indispensables para la adecuada transmisión de comunicaciones por medios electrónicos y para la provisión del servicio digital expresamente demandado por el internauta.
        </p>
      </section>

      {/* 4. Cómo Gestionar o Bloquear Cookies */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">4. Administración y Desactivación en el Navegador</h2>
        <p className="text-sm text-foreground-muted leading-relaxed">
          El usuario puede en cualquier momento restringir, bloquear o borrar las cookies y datos de sitios web modificando las preferencias de seguridad en la configuración de su navegador web:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-xs text-foreground-muted font-light">
          <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies de terceros / Datos de sitios.</li>
          <li><strong>Mozilla Firefox:</strong> Ajustes &gt; Privacidad &amp; Seguridad &gt; Cookies y datos del sitio.</li>
          <li><strong>Apple Safari:</strong> Ajustes &gt; Safari &gt; Avanzado &gt; Privacidad y Bloqueo de Cookies.</li>
          <li><strong>Microsoft Edge:</strong> Configuración &gt; Cookies y permisos del sitio &gt; Administrar y eliminar cookies.</li>
        </ul>
        <p className="text-xs text-foreground-muted">
          <em>Nota técnica:</em> Si decide deshabilitar o bloquear todas las cookies técnicas en su navegador, el proceso transaccional con la pasarela de pagos Wompi podría presentar anomalías durante la redirección y validación del aporte.
        </p>
      </section>

      {/* 5. Consultas y Contacto */}
      <section className="space-y-4 border-t border-white/10 pt-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">5. Dudas y Ejercicio de Derechos</h2>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Para cualquier inquietud sobre la gestión de cookies o sobre la protección de su privacidad digital en KYVORA, puede remitir su consulta a nuestro correo electrónico{" "}
          <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline">
            {legalConfig.owner.legalEmail}
          </a>{" "}
          o consultar nuestra{" "}
          <Link href="/legal/datos-personales" className="text-[var(--color-accent-cyan)] underline font-medium">
            Política de Tratamiento de Datos Personales
          </Link>.
        </p>
      </section>
    </LegalLayout>
  );
}

