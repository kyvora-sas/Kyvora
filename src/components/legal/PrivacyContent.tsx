"use client";

import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";
import { legalConfig } from "@/config/legal";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyContent() {
  const { language } = useLanguage();
  const isEn = language === "en";

  if (isEn) {
    return (
      <LegalLayout
        title="Privacy Notice"
        subtitle="Prior and express disclosure regarding the processing of personal data provided through KYVORA forms and digital channels."
        lastUpdated="October 27, 2026"
        normativeBase="Decree 1377 of 2013 (Arts. 14 & 15) & Law 1581 of 2012"
      >
        {/* 1. Identity and Channels */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">1. Identity and Contact Details of the Data Controller</h2>
          <p>
            Pursuant to Colombian Statutory Law 1581 of 2012 and Articles 14 and 15 of Decree 1377 of 2013, please be informed that the data controller responsible for personal data processing is an independent natural person operating under the trade name <strong>{legalConfig.tradeName}</strong> ({legalConfig.brandName}), domiciled in {legalConfig.owner.cityDomicile}, Colombia.
          </p>
          <div className="bg-surface p-5 rounded-xl border border-white/10 space-y-1.5 text-sm font-light">
            <div><strong className="text-white font-medium">Responsible Operator:</strong> {legalConfig.owner.legalRepresentative}</div>
            <div><strong className="text-white font-medium">Identity Document:</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.idPlaceholder}</span></div>
            <div><strong className="text-white font-medium">Tax ID (RUT):</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.rutPlaceholder}</span></div>
            <div><strong className="text-white font-medium">Physical Address for Notices:</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.physicalAddressPlaceholder}</span></div>
            <div>
              <strong className="text-white font-medium">Official Legal Email:</strong>{" "}
              <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline">
                {legalConfig.owner.legalEmail}
              </a>
            </div>
            <div><strong className="text-white font-medium">Direct WhatsApp / Support:</strong> {legalConfig.owner.phone}</div>
          </div>
        </section>

        {/* 2. Processing Purposes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">2. Purposes of Personal Data Processing</h2>
          <p>
            Personal data gathered via contact forms, the voluntary contributions system, and PQRS channels will be processed exclusively for the following lawful and explicit purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground-muted text-sm leading-relaxed">
            <li><strong>Inquiry and Quotation Management:</strong> Reviewing technical specifications, preparing custom software estimates, and responding to commercial inquiries.</li>
            <li><strong>Voluntary Contributions Processing:</strong> Facilitating fund allocation toward specific experimental laboratory initiatives via Wompi Colombia and generating receipts.</li>
            <li><strong>Claims and Petitions (PQRS):</strong> Processing formal inquiries, complaints, claims, or payment reversal requests within statutory deadlines.</li>
            <li><strong>Web Security and Auditing:</strong> Defending server infrastructure against cyberattacks, preventing unsolicited spam submissions, and satisfying Colombian accounting and tax obligations.</li>
          </ul>
          <p className="text-xs text-foreground-muted/80">
            <em>No-Sale Commitment:</em> KYVORA does not sell, rent, or transfer personal data to third parties for commercial profiling or unconsented advertising.
          </p>
        </section>

        {/* 3. Rights of Data Subjects */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">3. Rights of Data Subjects</h2>
          <p>
            As a data subject under Colombian law, you have the right to:
          </p>
          <ol className="list-decimal pl-6 space-y-1.5 text-foreground-muted text-sm leading-relaxed">
            <li>Know, update, and rectify your personal data held by the controller.</li>
            <li>Request proof of the authorization granted for processing.</li>
            <li>Be informed regarding the specific uses given to your data.</li>
            <li>File complaints with the Superintendence of Industry and Commerce (SIC) after exhausting direct petition procedures with KYVORA.</li>
            <li>Revoke authorization or request data suppression when constitutional and legal principles are breached.</li>
            <li>Access your processed personal data free of charge.</li>
          </ol>
        </section>

        {/* 4. Habeas Data Channels */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">4. Channels for Exercising Habeas Data Rights</h2>
          <p>
            To exercise your rights, submit inquiries, or file claims regarding your personal data, you may reach out through:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-foreground-muted">
            <li>
              <strong>Direct Legal Email:</strong>{" "}
              <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline">
                {legalConfig.owner.legalEmail}
              </a>{" "}
              (Subject: &ldquo;Exercise of Habeas Data Rights&rdquo;).
            </li>
            <li>
              <strong>Digital PQRS Portal:</strong> Interactive submission form at the{" "}
              <Link href="/legal/pqrs" className="text-[var(--color-accent-cyan)] underline">
                PQRS Channel
              </Link>.
            </li>
          </ul>
          <p className="text-xs text-foreground-muted">
            <strong>Statutory Deadlines:</strong> Inquiries are answered within a maximum of ten (10) business days; Claims and suppressions within fifteen (15) business days (Statutory Law 1581 of 2012, Articles 14 and 15).
          </p>
        </section>

        {/* 5. Access to Full Policy */}
        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">5. Consultation of Comprehensive Policy</h2>
          <p className="text-sm text-foreground-muted leading-relaxed">
            For exhaustive details on retention periods, technical security measures, definitions, and third-party processors, please consult our full{" "}
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
      title="Aviso de Privacidad"
      subtitle="Información previa y expresa sobre el tratamiento de datos personales suministrados a través de los formularios y canales digitales de Kyvora."
      lastUpdated="27 de Octubre de 2026"
      normativeBase="Decreto 1377 de 2013 (Arts. 14 y 15) & Ley 1581 de 2012"
    >
      {/* 1. Identificación y Domicilio */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">1. Identidad y Canales de Contacto del Responsable</h2>
        <p>
          En cumplimiento de lo dispuesto en la Ley Estatutaria 1581 de 2012 y los artículos 14 y 15 del Decreto 1377 de 2013, se informa que el responsable del tratamiento de los datos personales es la persona natural independiente que opera bajo el nombre comercial <strong>{legalConfig.tradeName}</strong> ({legalConfig.brandName}), con domicilio en {legalConfig.owner.cityDomicile}.
        </p>
        <div className="bg-surface p-5 rounded-xl border border-white/10 space-y-1.5 text-sm font-light">
          <div><strong className="text-white font-medium">Titular responsable:</strong> {legalConfig.owner.legalRepresentative}</div>
          <div><strong className="text-white font-medium">Documento de identidad:</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.idPlaceholder}</span></div>
          <div><strong className="text-white font-medium">Identificación tributaria:</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.rutPlaceholder}</span></div>
          <div><strong className="text-white font-medium">Dirección física de notificación:</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.physicalAddressPlaceholder}</span></div>
          <div>
            <strong className="text-white font-medium">Correo electrónico oficial:</strong>{" "}
            <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline">
              {legalConfig.owner.legalEmail}
            </a>
          </div>
          <div><strong className="text-white font-medium">Canal telefónico / WhatsApp:</strong> {legalConfig.owner.phone}</div>
        </div>
      </section>

      {/* 2. Tratamiento y Finalidades */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">2. Finalidades del Tratamiento de Datos</h2>
        <p>
          Los datos personales solicitados a través del formulario de contacto, el sistema de aportes voluntarios y el canal de PQRS serán tratados para las siguientes finalidades legítimas y específicas:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-foreground-muted text-sm leading-relaxed">
          <li><strong>Gestión de solicitudes y cotizaciones:</strong> Analizar requerimientos técnicos, preparar cotizaciones personalizadas de desarrollo de software y dar respuesta a consultas comerciales.</li>
          <li><strong>Procesamiento de aportes voluntarios:</strong> Gestionar la intención de aporte hacia proyectos específicos del laboratorio a través de la pasarela Wompi Colombia y emitir los comprobantes pertinentes.</li>
          <li><strong>Trámite y respuesta de PQRS:</strong> Tramitar formalmente peticiones, quejas, reclamos o solicitudes de reversión de pago conforme a los términos de ley.</li>
          <li><strong>Seguridad web y auditoría:</strong> Proteger la infraestructura contra ataques informáticos, prevenir el envío no autorizado de correo masivo (spam) y cumplir obligaciones contables y tributarias en Colombia.</li>
        </ul>
        <p className="text-xs text-foreground-muted/80">
          <em>Aclaración de no cesión:</em> Kyvora no vende, arrienda ni cede bases de datos personales a terceras entidades para fines publicitarios o de prospección comercial no consentida.
        </p>
      </section>

      {/* 3. Derechos de los Titulares */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">3. Derechos que le Asisten como Titular</h2>
        <p>
          En su calidad de titular de la información, usted tiene derecho a:
        </p>
        <ol className="list-decimal pl-6 space-y-1.5 text-foreground-muted text-sm leading-relaxed">
          <li>Conocer, actualizar y rectificar sus datos personales frente al responsable.</li>
          <li>Solicitar prueba de la autorización otorgada para el tratamiento.</li>
          <li>Ser informado sobre el uso específico que se le ha dado a sus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) una vez agotado el trámite directo con Kyvora.</li>
          <li>Revocar la autorización o solicitar la supresión del dato en los términos del ordenamiento jurídico.</li>
          <li>Acceder de forma gratuita a los datos personales que hayan sido objeto de tratamiento.</li>
        </ol>
      </section>

      {/* 4. Canales para Ejercer Derechos */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">4. Canales de Atención para Hábeas Data</h2>
        <p>
          Para ejercer cualquiera de sus derechos, formular consultas o radicar reclamos respecto a sus datos personales, puede comunicarse formalmente a través de:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-foreground-muted">
          <li>
            <strong>Correo electrónico directo:</strong>{" "}
            <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline">
              {legalConfig.owner.legalEmail}
            </a>{" "}
            (Asunto: &ldquo;Ejercicio de Derechos Hábeas Data&rdquo;).
          </li>
          <li>
            <strong>Módulo digital de radicación:</strong> Formulario interactivo en el{" "}
            <Link href="/legal/pqrs" className="text-[var(--color-accent-cyan)] underline">
              Canal de PQRS
            </Link>{" "}
            de KYVORA.
          </li>
        </ul>
        <p className="text-xs text-foreground-muted">
          <strong>Plazos legales de atención:</strong> Consultas en un máximo de diez (10) días hábiles; Reclamos y supresiones en un máximo de quince (15) días hábiles (Ley 1581 de 2012, artículos 14 y 15).
        </p>
      </section>

      {/* 5. Acceso a la Política Integral */}
      <section className="space-y-4 border-t border-white/10 pt-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">5. Consulta de la Política Integral</h2>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Para conocer en detalle los procedimientos, definiciones, medidas técnicas de seguridad, terceros encargados y periodos de retención de la información, le invitamos a consultar el texto completo de nuestra{" "}
          <Link href="/legal/datos-personales" className="text-[var(--color-accent-cyan)] underline font-medium">
            Política de Tratamiento de Datos Personales
          </Link>.
        </p>
      </section>
    </LegalLayout>
  );
}

