"use client";

import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";
import { legalConfig } from "@/config/legal";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsContent() {
  const { language } = useLanguage();
  const isEn = language === "en";

  if (isEn) {
    return (
      <LegalLayout
        title="Terms and Conditions of Use"
        subtitle="Rules and conditions governing access, navigation, and use of the official KYVORA web portal in Colombia."
        lastUpdated="October 27, 2026"
        normativeBase="Law 527 of 1999, Law 1480 of 2011 & Law 2439 of 2024"
      >
        {/* 1. Identification of the Website Operator */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">1. Website Operator Identification</h2>
          <p>
            This website <strong>www.kyvora.net.co</strong> (hereinafter, the &ldquo;Website&rdquo;) is owned and operated by an independent natural person trading under the commercial name <strong>{legalConfig.tradeName}</strong> ({legalConfig.brandName}), domiciled in {legalConfig.owner.cityDomicile}, Republic of Colombia.
          </p>
          <div className="bg-surface p-5 rounded-xl border border-white/10 space-y-1 text-sm font-light">
            <div><strong className="text-white font-medium">Responsible Operator:</strong> {legalConfig.owner.legalRepresentative}</div>
            <div><strong className="text-white font-medium">Official Identification:</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.idPlaceholder}</span></div>
            <div><strong className="text-white font-medium">Tax ID (RUT):</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.rutPlaceholder}</span></div>
            <div><strong className="text-white font-medium">Notice Address:</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.physicalAddressPlaceholder}</span></div>
            <div>
              <strong className="text-white font-medium">Contact Email:</strong>{" "}
              <a href={`mailto:${legalConfig.owner.contactEmail}`} className="text-[var(--color-accent-cyan)] underline">
                {legalConfig.owner.contactEmail}
              </a>
            </div>
            <div><strong className="text-white font-medium">Support Channel / WhatsApp:</strong> {legalConfig.owner.phone}</div>
          </div>
        </section>

        {/* 2. Purpose and Acceptance */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">2. Website Purpose and Acceptance of Terms</h2>
          <p>
            The primary purpose of this Website is to present KYVORA&apos;s technological capabilities in web development, mobile and web applications, custom systems architecture, and artificial intelligence automation; display experimental prototypes engineered in our laboratory; provide direct commercial contact channels; and enable voluntary contributions through authorized payment gateways.
          </p>
          <p>
            Accessing, browsing, or utilizing this Website grants the status of <strong>User</strong> and constitutes full, conscious, and unreserved acceptance of every provision in these Terms and Conditions. If you do not agree with any provision herein, you must immediately refrain from browsing this portal.
          </p>
        </section>

        {/* 3. Acceptable Use and Prohibited Actions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">3. Acceptable Use and Prohibited Conduct</h2>
          <p>
            The User agrees to use the Website and its interactive features in a lawful, diligent, honest, and good-faith manner. The following actions are strictly prohibited:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground-muted text-sm leading-relaxed">
            <li><strong>Security Violations:</strong> Attempting to breach server authentication, access unauthorized directories, or scan network ports.</li>
            <li><strong>Infrastructure Disruption:</strong> Initiating Denial of Service attacks (DoS or DDoS), spamming contact forms, or overloading cloud infrastructure on Vercel.</li>
            <li><strong>Malicious Code Injection:</strong> Transmitting viruses, trojans, worms, malicious scripts, or exploits intended to disrupt software or client browsers.</li>
            <li><strong>Fraudulent Submissions:</strong> Submitting deliberately false, defamatory, or impersonated information through contact forms, claims (PQRS), or contribution workflows.</li>
            <li><strong>Unauthorized Scraping:</strong> Deploying automated spiders, scrapers, or extraction bots to harvest personal data or intellectual property without prior written consent.</li>
          </ul>
          <p className="text-xs text-foreground-muted">
            Non-compliance entitles KYVORA to block the offending IP address and initiate corresponding criminal (Colombian Law 1273 of 2009 on Cybercrimes) and civil legal actions.
          </p>
        </section>

        {/* 4. Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">4. Intellectual and Industrial Property</h2>
          <p>
            All content, designs, source code, graphical interfaces, typography, trademarks, logos, illustrations, and software prototypes hosted on this Website (including <strong>Pulso</strong>, <strong>QuakeNet</strong>, <strong>Kyvora Studio</strong>, <strong>PulsAI</strong>, and <strong>VoiceTranslate</strong>) are the exclusive property of KYVORA or are duly licensed under Colombian and international copyright and industrial property treaties.
          </p>
          <p>
            Third-party open-source libraries used within the platform (such as Next.js, React, Tailwind CSS, or Lucide Icons) remain governed by their original licenses (MIT, Apache 2.0).
          </p>
          <p>
            Except with express prior written authorization from KYVORA, any reproduction, distribution, public transmission, reverse engineering, decompilation, or commercial exploitation is strictly prohibited.
          </p>
        </section>

        {/* 5. External Links */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">5. Links to Third-Party Websites</h2>
          <p>
            This Website may contain outbound links to third-party platforms for operational or reference purposes, such as Wompi Colombia (Bancolombia S.A.), the Superintendence of Industry and Commerce (SIC), the United States Geological Survey (USGS), GitHub repositories, or social profiles (WhatsApp, Instagram).
          </p>
          <p className="text-sm text-foreground-muted leading-relaxed">
            KYVORA exercises no control over external platforms&apos; content, privacy policies, or commercial practices. The inclusion of external links does not imply corporate endorsement or liability for transactions conducted on third-party sites.
          </p>
        </section>

        {/* 6. Availability and Continuity */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">6. Availability and Continuity of Service</h2>
          <p>
            KYVORA employs professional engineering standards to maintain uninterrupted platform availability. However, given the nature of telecommunication networks and internet infrastructure, 100% continuous uptime cannot be guaranteed.
          </p>
          <p className="text-sm text-foreground-muted leading-relaxed">
            KYVORA reserves the right to temporarily suspend access for scheduled technical maintenance, security updates, or force majeure events beyond reasonable control.
          </p>
        </section>

        {/* 7. Operator Liability and Legal Limits */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">7. Operator Liability and Legal Limits</h2>
          <p>
            Pursuant to the Colombian Consumer Protection Statute (Law 1480 of 2011), KYVORA is responsible for the veracity of commercial information directly offered on this site and for the quality and suitability of formally contracted technological services.
          </p>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Under no circumstances shall KYVORA be liable for damages resulting from user misuse, internet service provider outages, malware on user devices, or bank network failures during payment gateway processing. Nothing in these terms excludes or limits non-waivable rights granted to consumers under Colombian legislation.
          </p>
        </section>

        {/* 8. Communications and Proposals */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">8. Communications, Quotes, and Proposals</h2>
          <p>
            Inquiries and project descriptions sent via our contact forms represent good-faith commercial approximations. Submitting or receiving a preliminary estimate <strong>does not constitute a binding service contract</strong> nor obligate KYVORA to commence work until a formal agreement is executed in accordance with our{" "}
            <Link href="/legal/contratacion" className="text-[var(--color-accent-cyan)] underline font-medium">
              Contract Terms
            </Link>.
          </p>
        </section>

        {/* 9. Modifications to Terms */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">9. Modification of Terms and Conditions</h2>
          <p>
            KYVORA may update these conditions at any time to reflect legislative changes, security enhancements, or operational updates. Any amendments take effect upon publication on the Website, indicating the last revision date.
          </p>
        </section>

        {/* 10. Governing Law and Jurisdiction */}
        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">10. Governing Law and Competent Jurisdiction</h2>
          <p className="text-sm text-foreground-muted leading-relaxed">
            These Terms and Conditions are governed by and construed exclusively under the laws of the <strong>Republic of Colombia</strong>.
          </p>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Any dispute or claim arising from this document shall first seek direct, amicable resolution via official support channels or through a legally authorized conciliation center in Colombia. If unresolved, disputes shall be submitted to the competent civil courts of the Republic of Colombia.
          </p>
        </section>
      </LegalLayout>
    );
  }

  // Spanish (Default)
  return (
    <LegalLayout
      title="Términos y Condiciones de Uso"
      subtitle="Reglas y condiciones aplicables al acceso, navegación y utilización del portal web oficial de KYVORA en Colombia."
      lastUpdated="27 de Octubre de 2026"
      normativeBase="Ley 527 de 1999, Ley 1480 de 2011 & Ley 2439 de 2024"
    >
      {/* 1. Identificación del Operador */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">1. Identificación del Operador del Sitio Web</h2>
        <p>
          El presente portal web <strong>www.kyvora.net.co</strong> (en adelante, el &ldquo;Sitio Web&rdquo;) es propiedad y es administrado por la persona natural independiente que opera bajo el nombre comercial <strong>{legalConfig.tradeName}</strong> ({legalConfig.brandName}), con domicilio en {legalConfig.owner.cityDomicile}, República de Colombia.
        </p>
        <div className="bg-surface p-5 rounded-xl border border-white/10 space-y-1 text-sm font-light">
          <div><strong className="text-white font-medium">Titular responsable:</strong> {legalConfig.owner.legalRepresentative}</div>
          <div><strong className="text-white font-medium">Identificación oficial:</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.idPlaceholder}</span></div>
          <div><strong className="text-white font-medium">RUT / Identificación Tributaria:</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.rutPlaceholder}</span></div>
          <div><strong className="text-white font-medium">Dirección de correspondencia:</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.physicalAddressPlaceholder}</span></div>
          <div>
            <strong className="text-white font-medium">Correo electrónico de contacto:</strong>{" "}
            <a href={`mailto:${legalConfig.owner.contactEmail}`} className="text-[var(--color-accent-cyan)] underline">
              {legalConfig.owner.contactEmail}
            </a>
          </div>
          <div><strong className="text-white font-medium">Canal de WhatsApp / Soporte:</strong> {legalConfig.owner.phone}</div>
        </div>
      </section>

      {/* 2. Objeto y Alcance */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">2. Objeto del Sitio Web y Aceptación de los Términos</h2>
        <p>
          El Sitio Web tiene por objeto principal dar a conocer al público los servicios tecnológicos de KYVORA en las áreas de desarrollo web, aplicaciones móviles y web, arquitectura de sistemas personalizados y automatización con inteligencia artificial; exhibir proyectos y prototipos de software desarrollados en su laboratorio de experimentación; habilitar canales de contacto y cotización comercial; y permitir la realización de aportes económicos voluntarios a través de pasarelas de pago seguras.
        </p>
        <p>
          El acceso, navegación o utilización de este Sitio Web atribuye la condición de <strong>Usuario</strong> e implica la aceptación plena, consciente y sin reservas de todas y cada una de las disposiciones contenidas en estos Términos y Condiciones. Si el Usuario no está de acuerdo con cualquiera de estas cláusulas, deberá abstenerse inmediatamente de navegar en este portal.
        </p>
      </section>

      {/* 3. Condiciones de Navegación y Uso Permitido */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">3. Condiciones de Navegación y Conductas Prohibidas</h2>
        <p>
          El Usuario se compromete a hacer un uso lícito, diligente, honesto y de buena fe del Sitio Web y de sus funcionalidades interactivas. Queda expresamente prohibido:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-foreground-muted text-sm leading-relaxed">
          <li><strong>Vulneración de la seguridad:</strong> Intentar violar o vulnerar las medidas de autenticación o seguridad del servidor, acceder a áreas privadas no autorizadas o escanear puertos de red.</li>
          <li><strong>Ataques y saturación:</strong> Ejecutar ataques de denegación de servicio (DoS o DDoS), saturar deliberadamente los formularios o provocar sobrecargas en la infraestructura de Vercel.</li>
          <li><strong>Inyección de código malicioso:</strong> Transmitir o inyectar virus, troyanos, gusanos, scripts maliciosos o exploits que puedan alterar el funcionamiento del software o de los navegadores de terceros.</li>
          <li><strong>Uso fraudulento de formularios:</strong> Ingresar información deliberadamente falsa, difamatoria, inexacta o que suplante la identidad de terceros en los formularios de contacto, PQRS o donaciones.</li>
          <li><strong>Extracción masiva no autorizada:</strong> Emplear robots, arañas, raspadores web (scrapers) o herramientas automatizadas para extraer datos personales o propiedad intelectual sin consentimiento escrito previo.</li>
        </ul>
        <p className="text-xs text-foreground-muted">
          El incumplimiento de estas prohibiciones faculta a KYVORA a bloquear el acceso técnico a la dirección IP infractora y a ejercer las acciones legales penales (Ley 1273 de 2009 sobre Delitos Informáticos) y civiles que correspondan.
        </p>
      </section>

      {/* 4. Propiedad Intelectual e Industrial */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">4. Propiedad Intelectual e Industrial</h2>
        <p>
          Todos los contenidos, diseños, código fuente, interfaces gráficas, tipografías, logotipos, marcas, ilustraciones y proyectos de software alojados o exhibidos en este Sitio Web (incluyendo las marcas y prototipos <strong>Pulso</strong>, <strong>QuakeNet</strong>, <strong>Kyvora Studio</strong>, <strong>PulsAI</strong> y <strong>VoiceTranslate</strong>) son de exclusiva titularidad del operador de KYVORA o se encuentran debidamente licenciados conforme a las leyes colombianas e internacionales de derechos de autor y propiedad industrial.
        </p>
        <p>
          Las bibliotecas de código abierto (open-source) de terceros utilizadas en la plataforma (como Next.js, React, Tailwind CSS o Lucide Icons) conservan sus respectivas licencias originales (MIT, Apache 2.0).
        </p>
        <p>
          Salvo autorización expresa y por escrito de KYVORA, queda terminantemente prohibida la reproducción, distribución, comunicación pública, ingeniería inversa, descompilación o transformación con fines comerciales de los activos protegidos.
        </p>
      </section>

      {/* 5. Enlaces a Sitios Web de Terceros */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">5. Enlaces a Sitios Web Externos</h2>
        <p>
          El Sitio Web puede contener enlaces a plataformas de terceros con propósitos puramente funcionales e informativos, tales como la pasarela de pagos Wompi Colombia (Bancolombia S.A.), el portal de la Superintendencia de Industria y Comercio (SIC), APIs del Servicio Geológico de Estados Unidos (USGS), repositorios de GitHub o perfiles en redes sociales (WhatsApp, Instagram).
        </p>
        <p className="text-sm text-foreground-muted leading-relaxed">
          KYVORA no ejerce control sobre los contenidos, políticas de privacidad ni prácticas comerciales de dichos terceros externos. La inclusión de un enlace no implica recomendación, respaldo societario ni asunción de responsabilidad por las transacciones celebradas directamente con tales plataformas.
        </p>
      </section>

      {/* 6. Disponibilidad y Mantenimiento */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">6. Disponibilidad y Continuidad del Servicio</h2>
        <p>
          KYVORA despliega sus mejores esfuerzos técnicos para procurar la disponibilidad ininterrumpida y el correcto funcionamiento del Sitio Web. No obstante, en observancia de la naturaleza de las redes de telecomunicaciones e internet, no es posible garantizar una disponibilidad absoluta del cien por ciento (100%).
        </p>
        <p className="text-sm text-foreground-muted leading-relaxed">
          KYVORA se reserva el derecho de suspender temporalmente el acceso a la plataforma para adelantar labores de mantenimiento técnico, actualización de software, mejoras de seguridad o por eventos de fuerza mayor o caso fortuito ajenos a su control razonable.
        </p>
      </section>

      {/* 7. Responsabilidades y Limitaciones Válidas */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">7. Responsabilidad del Operador y Límites Legales</h2>
        <p>
          En concordancia con el Estatuto del Consumidor (Ley 1480 de 2011), KYVORA responde por la veracidad de la información comercial directamente ofrecida a través de este portal y por la idoneidad y calidad de los servicios contratados formalmente.
        </p>
        <p className="text-sm text-foreground-muted leading-relaxed">
          En ningún caso KYVORA responderá por daños derivados del uso indebido del portal por parte del Usuario, por caídas imputables al proveedor de conexión a internet del usuario, por alteraciones causadas por malware presente en los dispositivos de los visitantes, ni por fallas ajenas originadas en las redes bancarias de la pasarela de pagos. Ninguna cláusula de estos términos excluye ni limita los derechos irrenunciables que la legislación colombiana confiere a los consumidores.
        </p>
      </section>

      {/* 8. Tratamiento de Comunicaciones */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">8. Comunicaciones, Cotizaciones y Propuestas</h2>
        <p>
          Las comunicaciones, descripciones de proyectos o solicitudes de presupuesto enviadas a través del formulario de contacto constituyen aproximaciones comerciales de buena fe. El envío o recepción de una consulta o cotización referencial <strong>no perfecciona por sí mismo un contrato vinculante de prestación de servicios</strong> ni genera la obligación de iniciar labores hasta tanto no medie un acuerdo expreso formal conforme a nuestras{" "}
          <Link href="/legal/contratacion" className="text-[var(--color-accent-cyan)] underline font-medium">
            Condiciones de Contratación
          </Link>.
        </p>
      </section>

      {/* 9. Modificaciones a los Términos */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">9. Modificación de los Términos y Condiciones</h2>
        <p>
          KYVORA podrá actualizar o modificar en cualquier momento las presentes condiciones para adaptarlas a nuevas disposiciones legales, mejoras de seguridad o cambios en su modelo operativo. Las modificaciones entrarán en vigencia a partir de su publicación en el Sitio Web, indicando siempre la fecha de última actualización.
        </p>
      </section>

      {/* 10. Ley Aplicable y Solución de Controversias */}
      <section className="space-y-4 border-t border-white/10 pt-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">10. Ley Aplicable y Jurisdicción Competente</h2>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Los presentes Términos y Condiciones se rigen e interpretan exclusivamente con arreglo al ordenamiento jurídico de la <strong>República de Colombia</strong>.
        </p>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Para la resolución de cualquier discrepancia, controversia o reclamación derivada de la interpretación o ejecución de este documento, las partes buscarán en primera instancia una solución directa y amigable mediante los canales oficiales de atención o a través de un centro de conciliación legalmente autorizado en Colombia. De persistir el desacuerdo, el litigio se someterá a la jurisdicción ordinaria de los jueces competentes de la República de Colombia.
        </p>
      </section>
    </LegalLayout>
  );
}

