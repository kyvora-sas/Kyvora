"use client";

import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";
import { legalConfig } from "@/config/legal";
import { useLanguage } from "@/context/LanguageContext";

export default function DonateLegalContent() {
  const { language } = useLanguage();
  const isEn = language === "en";

  if (isEn) {
    return (
      <LegalLayout
        title="Voluntary Contributions Legal Terms (Donate Us)"
        subtitle="Legal framework, fiscal transparency, operational scope, and tax treatment of voluntary economic contributions made to KYVORA in Colombia."
        lastUpdated="October 27, 2026"
        normativeBase="Colombian Civil Code, Colombian Tax Statute & Law 1480 of 2011"
      >
        {/* 1. Legal Nature and Tax Transparency */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">1. Legal Nature of Contributions and Tax Transparency</h2>

          <div className="p-6 bg-surface border border-amber-500/30 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
              <span>Fundamental Legal and Tax Disclosure</span>
            </div>
            <p className="text-sm text-foreground-muted leading-relaxed font-light">
              <strong>{legalConfig.brandName}</strong> is an independent software engineering studio and research laboratory operated in Colombia by an <strong>independent natural person</strong>. Consequently, voluntary financial contributions processed through the <em>Donate Us</em> module <strong>do NOT legally constitute donations to a Non-Profit Organization (ESAL), charity, foundation, or Non-Governmental Organization (NGO)</strong>.
            </p>
            <div className="bg-background/80 p-4 rounded-xl border border-white/5 space-y-2 text-xs text-foreground-muted leading-relaxed">
              <p className="text-white font-medium uppercase tracking-wider">Direct Legal and Fiscal Implications:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>No Tax Deductibility:</strong> Contributions <strong>do NOT confer tax deduction certificates or income tax credits</strong> within the Republic of Colombia (pursuant to Article 125 et seq. of the Colombian Tax Statute).
                </li>
                <li>
                  <strong>Civil Nature:</strong> These transfers represent <strong>gratuitous voluntary patrimonial transfers (independent technological patronage/sponsorship)</strong> initiated by the contributor with the sole intent of supporting research, open-source prototyping, and digital tooling.
                </li>
                <li>
                  <strong>Absence of Profit or Equity:</strong> Contributions yield no financial returns, interest, dividends, corporate stock, or equity rights over developed software.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. Allocation of Funds */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">2. Modalities and Allocation of Resources</h2>
          <p>
            Contributors may freely indicate a preferred destination for their contribution among available laboratory options:
          </p>

          <div className="space-y-3 bg-surface p-6 rounded-xl border border-white/10 text-sm font-light">
            <div>
              <h3 className="font-semibold text-white text-base">A. General Laboratory Fund</h3>
              <p className="text-foreground-muted mt-1 text-xs leading-relaxed">
                Allocated across baseline operating expenses: development servers, Vercel cloud hosting, annual domain renewals, developer tooling licenses, and continuous open-source research.
              </p>
            </div>

            <div className="border-t border-white/5 pt-3">
              <h3 className="font-semibold text-white text-base">B. Targeted Project Contributions</h3>
              <p className="text-foreground-muted mt-1 text-xs leading-relaxed">
                The contributor may orient support toward an active research initiative:
              </p>
              <ul className="list-disc pl-6 mt-1 space-y-1 text-xs text-foreground-muted">
                <li><strong>Pulso:</strong> Dedicated to concurrency server testing and low-latency real-time data streams.</li>
                <li><strong>QuakeNet:</strong> Acquisition of experimental IoT hardware components and public seismological API integration.</li>
                <li><strong>Kyvora Studio:</strong> Research in user experience, accessibility, and modern design systems.</li>
                <li><strong>PulsAI:</strong> Coverage of AI model computation tokens and intelligent automation agents.</li>
                <li><strong>VoiceTranslate:</strong> Real-time voice translation pipelines, speech-to-text latency reduction, and multilingual audio synthesis.</li>
              </ul>
            </div>
          </div>

          <p className="text-xs text-foreground-muted leading-relaxed">
            <strong>Contractual Nature of Allocation:</strong> Selecting a specific initiative represents an <strong>ethical commitment of expenditure prioritization</strong> by KYVORA. It does not establish a formal trust, separate patrimony, or contractual obligation of specific delivery dates.
          </p>
        </section>

        {/* 3. Secure Wompi Processing */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">3. Secure Transaction Processing via Wompi Colombia</h2>
          <p>
            Contributions are collected securely through authorized payment gateway <strong>Wompi Colombia</strong> (Bancolombia S.A.):
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-foreground-muted font-light">
            <li><strong>Minimum Contribution:</strong> Set at <strong>$10,000 COP</strong> due to technical transaction cost thresholds.</li>
            <li><strong>Maximum Transaction Limit:</strong> Capped preventively at <strong>$50,000,000 COP</strong> to mitigate fraudulent activities.</li>
            <li><strong>Cryptographic SHA-256 Integrity:</strong> Each transaction signature is calculated server-side concatenating unique reference, amount in cents, currency, and private integrity secret, preventing client-side tampering.</li>
            <li><strong>Server-to-Server Webhook Confirmation:</strong> The contribution settles in our database solely upon cryptographic verification of Wompi&apos;s webhook event.</li>
          </ul>
        </section>

        {/* 4. Absence of Commercial Obligation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">4. Absence of Consumer Relationship or Service Quid Pro Quo</h2>
          <p>
            Voluntary contributions in the Donate Us module are independent acts and do not establish a commercial or consumer relationship for professional software engineering services.
          </p>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Contributions do not entitle the contributor to demand custom feature development, private proprietary source code transfers, dedicated technical support, or commercial SLAs. Formal software engagements are exclusively regulated by our{" "}
            <Link href="/legal/contratacion" className="text-[var(--color-accent-cyan)] underline font-medium">
              General Contracting Terms
            </Link>.
          </p>
        </section>

        {/* 5. Refunds for Technical Errors */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">5. Refunds for Duplicate Charges or Transaction Errors</h2>
          <p>
            Given the voluntary nature of contributions, once settled and allocated to laboratory operations, they are not subject to conventional returns for mere change of mind.
          </p>
          <div className="bg-surface p-5 rounded-xl border border-white/10 space-y-2 text-sm">
            <h3 className="font-semibold text-white text-base">Exceptional Procedure for Technical Errors:</h3>
            <p className="text-foreground-muted text-xs leading-relaxed">
              If network drops during bank checkout trigger a <strong>duplicate charge, unverified debit, or demonstrable banking inconsistency</strong>, the contributor may notify KYVORA within <strong>five (5) business days</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-xs text-foreground-muted">
              <li>Emailing <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline">{legalConfig.owner.legalEmail}</a> or submitting a claim at the <Link href="/legal/pqrs" className="text-[var(--color-accent-cyan)] underline">PQRS Channel</Link>.</li>
              <li>Attaching the Wompi payment reference (<code>KYV-DON-...</code>) and banking voucher showing duplicate debits.</li>
            </ul>
            <p className="text-foreground-muted text-xs leading-relaxed">
              KYVORA will audit logs with Wompi within two (2) business days and initiate refund processing. Moreover, in events of fraud or unauthorized card use, the contributor holds the right to request <strong>Payment Reversal</strong> under Decree 587 of 2016 as outlined in our{" "}
              <Link href="/legal/pagos-reversiones" className="text-[var(--color-accent-cyan)] underline">
                Payments and Reversals Policy
              </Link>.
            </p>
          </div>
        </section>

        {/* 6. Vouchers and Privacy */}
        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">6. Issued Receipts and Contributor Data Protection</h2>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Upon processing through Wompi, the contributor receives an automated digital banking voucher directly from the gateway via email. KYVORA may issue, upon request, a simple receipt confirming reception of voluntary patronage funds.
          </p>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Personal data gathered during the transaction (name, email, transaction reference) is protected under Colombian Law 1581 of 2012 and our{" "}
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
      title="Condiciones Legales de Aportes Voluntarios (Donate Us)"
      subtitle="Marco jurídico, transparencia financiera, alcance operativo y condiciones tributarias de los aportes económicos voluntarios canalizados a KYVORA en Colombia."
      lastUpdated="27 de Octubre de 2026"
      normativeBase="Código Civil Colombiano, Estatuto Tributario & Ley 1480 de 2011"
    >
      {/* 1. Naturaleza Jurídica y Transparencia Fiscal */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">1. Naturaleza Jurídica del Aporte y Transparencia Tributaria</h2>
        
        <div className="p-6 bg-surface border border-amber-500/30 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
            <span>Declaración Legal y Tributaria Fundamental</span>
          </div>
          <p className="text-sm text-foreground-muted leading-relaxed font-light">
            <strong>{legalConfig.brandName}</strong> es un estudio y laboratorio de desarrollo tecnológico operado actualmente por una <strong>persona natural independiente en Colombia</strong>. Por consiguiente, los aportes económicos procesados a través del módulo <em>Donate Us</em> <strong>NO constituyen legalmente donaciones a una Entidad Sin Ánimo de Lucro (ESAL), corporación, fundación u organización no gubernamental (ONG)</strong>.
          </p>
          <div className="bg-background/80 p-4 rounded-xl border border-white/5 space-y-2 text-xs text-foreground-muted leading-relaxed">
            <p className="text-white font-medium uppercase tracking-wider">Consecuencias Jurídicas y Fiscales Directas:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>No deducibilidad fiscal:</strong> Los aportes <strong>NO otorgan derecho a certificados de donación deducibles del impuesto sobre la renta ni a descuentos tributarios</strong> en la República de Colombia (conforme al artículo 125 y siguientes del Estatuto Tributario).
              </li>
              <li>
                <strong>Naturaleza civil:</strong> Estos aportes corresponden a <strong>transferencias patrimoniales voluntarias a título gratuito o actos de mecenazgo independiente</strong> que realiza el aportante con la única intención de respaldar la labor investigativa, el prototipado y el sostenimiento de herramientas digitales de acceso abierto.
              </li>
              <li>
                <strong>Ausencia de condición lucrativa para el aportante:</strong> La transferencia voluntaria no genera rendimientos financieros, intereses, dividendos, acciones societarias ni derechos patrimoniales sobre los desarrollos de software.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Modalidades y Destino de los Recursos */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">2. Modalidades y Asignación de los Recursos</h2>
        <p>
          El aportante puede seleccionar de forma libre el destino preferente de su aporte económico dentro de las opciones habilitadas en la plataforma:
        </p>
        
        <div className="space-y-3 bg-surface p-6 rounded-xl border border-white/10 text-sm font-light">
          <div>
            <h3 className="font-semibold text-white text-base">A. Fondo General del Laboratorio</h3>
            <p className="text-foreground-muted mt-1 text-xs leading-relaxed">
              Recursos asignados a la cobertura global de costos operativos: servidores de desarrollo, infraestructura cloud en Vercel, renovación anual de dominios, adquisición de licencias técnicas de software y experimentación continua en código abierto.
            </p>
          </div>

          <div className="border-t border-white/5 pt-3">
            <h3 className="font-semibold text-white text-base">B. Aporte Dirigido a Proyecto Específico</h3>
            <p className="text-foreground-muted mt-1 text-xs leading-relaxed">
              El aportante puede orientar su apoyo hacia uno de los proyectos activos del laboratorio:
            </p>
            <ul className="list-disc pl-6 mt-1 space-y-1 text-xs text-foreground-muted">
              <li><strong>Pulso:</strong> Asignación prioritaria para servidores de concurrencia y optimización de flujos de datos en tiempo real.</li>
              <li><strong>QuakeNet:</strong> Adquisición de componentes de sensorica IoT y mantenimiento de consumo de APIs sismológicas públicas.</li>
              <li><strong>Kyvora Studio:</strong> Investigación de diseño de interacción, accesibilidad y bibliotecas de componentes de interfaz.</li>
              <li><strong>PulsAI:</strong> Cobertura de tokens de cómputo y pruebas de modelos de automatización e inteligencia artificial.</li>
              <li><strong>VoiceTranslate:</strong> Pipelines de traducción de voz en tiempo real, latencia ultra-baja y síntesis de voz multilingüe.</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-foreground-muted leading-relaxed">
          <strong>Alcance contractual de la asignación:</strong> La elección de un proyecto específico representa una <strong>intención ética de priorización en la asignación del gasto</strong> por parte de KYVORA. No constituye una afectación fiduciaria de fondos, un patrimonio autónomo ni una obligación de resultado o cumplimiento forzoso de fechas de lanzamiento.
        </p>
      </section>

      {/* 3. Procesamiento Financiero Seguro con Wompi */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">3. Procesamiento de Transacciones a través de Wompi Colombia</h2>
        <p>
          La recaudación de los aportes se ejecuta de manera transparente y segura mediante la pasarela bancaria autorizada <strong>Wompi Colombia</strong> (Bancolombia S.A.):
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-foreground-muted font-light">
          <li><strong>Importe mínimo:</strong> Fijado en <strong>$10.000 COP</strong> por limitaciones técnicas y de comisiones mínimas de la pasarela.</li>
          <li><strong>Importe máximo por transacción:</strong> Establecido preventivamente en <strong>$50.000.000 COP</strong> para mitigar riesgos de transacciones anómalas o no autorizadas.</li>
          <li><strong>Integridad criptográfica SHA-256:</strong> Cada transacción se genera y firma en nuestro servidor concatenando la referencia única, el importe en centavos, la moneda y el secreto de integridad privado, garantizando que el monto no sea alterado en el cliente.</li>
          <li><strong>Confirmación por Webhook:</strong> El aporte se asienta como verificado en el sistema únicamente tras la recepción y comprobación criptográfica del webhook del servidor de Wompi.</li>
        </ul>
      </section>

      {/* 4. Ausencia de Vínculo Comercial o Contraprestación */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">4. Ausencia de Relación de Consumo o Contraprestación de Servicios</h2>
        <p>
          La realización de un aporte voluntario en el módulo Donate Us es un acto independiente y desvinculado de cualquier relación comercial o contractual de prestación de servicios profesionales de software.
        </p>
        <p className="text-sm text-foreground-muted leading-relaxed">
          El aporte voluntario no confiere al aportante el derecho a exigir el desarrollo de funciones a su medida, la entrega de código propietario privado, soporte técnico individualizado, ni el cumplimiento de cronogramas comerciales. Las relaciones de desarrollo de software formal se rigen de forma exclusiva por las{" "}
          <Link href="/legal/contratacion" className="text-[var(--color-accent-cyan)] underline font-medium">
            Condiciones Generales de Contratación
          </Link>.
        </p>
      </section>

      {/* 5. Devoluciones ante Errores Técnicos y Reversión */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">5. Devoluciones ante Cobros Duplicados o Errores de Transacción</h2>
        <p>
          En razón a la naturaleza voluntaria de los aportes económicos, una vez acreditados y asignados a los gastos del laboratorio, no son susceptibles de devolución ordinaria por mero arrepentimiento.
        </p>
        <div className="bg-surface p-5 rounded-xl border border-white/10 space-y-2 text-sm">
          <h3 className="font-semibold text-white text-base">Procedimiento Excepcional por Errores Técnicos:</h3>
          <p className="text-foreground-muted text-xs leading-relaxed">
            Si por intermitencias de red, caídas de conexión durante el checkout o errores del sistema bancario se generara un <strong>cargo duplicado, cobro no reconocido o inconsistencia transaccional comprobable</strong>, el aportante podrá notificar a KYVORA dentro de los <strong>cinco (5) días hábiles</strong> siguientes a la operación:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-xs text-foreground-muted">
            <li>Enviando un correo a <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline">{legalConfig.owner.legalEmail}</a> o radicando la solicitud en el <Link href="/legal/pqrs" className="text-[var(--color-accent-cyan)] underline">Canal PQRS</Link>.</li>
            <li>Adjuntando la referencia de pago de Wompi (<code>KYV-DON-...</code>) y el extracto bancario donde se evidencie la duplicidad del cargo.</li>
          </ul>
          <p className="text-foreground-muted text-xs leading-relaxed">
            KYVORA verificará la inconsistencia ante Wompi dentro de los dos (2) días hábiles siguientes y tramitará la anulación y reintegro del cobro excedente. Asimismo, en los supuestos de fraude o transacciones no autorizadas, el aportante conserva intacto el derecho a solicitar la <strong>Reversión del Pago</strong> conforme a los términos del Decreto 587 de 2016 descritos en nuestra{" "}
            <Link href="/legal/pagos-reversiones" className="text-[var(--color-accent-cyan)] underline">
              Política de Pagos y Reversiones
            </Link>.
          </p>
        </div>
      </section>

      {/* 6. Comprobantes Emitidos y Tratamiento de Datos */}
      <section className="space-y-4 border-t border-white/10 pt-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">6. Comprobantes Emitidos y Protección de Datos del Aportante</h2>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Al procesarse el aporte a través de Wompi, el aportante recibe el comprobante digital bancario emitido automáticamente por la pasarela de pagos a su correo electrónico. KYVORA podrá expedir, a solicitud del interesado, un recibo simple de constancia de recepción de aporte voluntario independiente.
        </p>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Los datos personales suministrados para procesar el aporte (nombre o seudónimo, email y referencia de pago) son tratados con estricto apego a la Ley 1581 de 2012 y a nuestra{" "}
          <Link href="/legal/datos-personales" className="text-[var(--color-accent-cyan)] underline font-medium">
            Política de Tratamiento de Datos Personales
          </Link>.
        </p>
      </section>
    </LegalLayout>
  );
}

