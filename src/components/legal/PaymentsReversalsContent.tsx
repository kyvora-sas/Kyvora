"use client";

import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";
import { legalConfig } from "@/config/legal";
import { useLanguage } from "@/context/LanguageContext";

export default function PaymentsReversalsContent() {
  const { language } = useLanguage();
  const isEn = language === "en";

  if (isEn) {
    return (
      <LegalLayout
        title="Payments, Retracto, and Payment Reversals"
        subtitle="Regulations on payment gateways, transactional settlement, cancellation policies, the statutory right of withdrawal (retracto), and payment reversal claims under Colombian eCommerce law."
        lastUpdated="October 27, 2026"
        normativeBase="Law 1480 of 2011 (Arts. 47 & 51), Law 2439 of 2024 & Decree 587 of 2016"
      >
        {/* 1. Payment Gateways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">1. Official Payment Gateway and Enabled Payment Methods</h2>
          <p>
            Electronic transactions (both voluntary contributions within the <em>Donate Us</em> system and formalized software service payments) are processed through <strong>Wompi Colombia</strong>, authorized payment gateway operated by Bancolombia S.A., certified under international PCI-DSS standards.
          </p>
          <p>
            Payment instruments accepted through Wompi include:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm text-foreground-muted">
            <li><strong>Online Bank Transfers (PSE):</strong> Savings and checking accounts across all banking entities affiliated with the ACH Colombia network.</li>
            <li><strong>Credit and Debit Cards:</strong> Visa, MasterCard, and American Express franchises issued in Colombia or abroad.</li>
            <li><strong>Digital Wallets &amp; Bancolombia Button:</strong> Direct account debits from Bancolombia and Nequi accounts.</li>
          </ul>
          <div className="p-4 bg-surface border border-white/5 rounded-xl text-xs text-foreground-muted space-y-1">
            <strong className="text-white font-medium">Moment of Payment Confirmation:</strong>
            <p>
              A transaction is deemed definitive in our records solely when KYVORA&apos;s backend server receives and cryptographically validates the official Wompi webhook with matching integrity checksum and status <code>APPROVED</code>. Client browser return screens are informational and do not constitute proof of payment without backend server confirmation.
            </p>
          </div>
        </section>

        {/* 2. Distinction between Legal Concepts */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">2. Distinctions: Cancellation, Refund, Withdrawal (Retracto), and Reversal</h2>
          <p>
            To ensure consumer clarity, Colombian law distinguishes four separate mechanisms:
          </p>

          <div className="grid md:grid-cols-2 gap-4 text-sm font-light">
            <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
              <h4 className="font-semibold text-white">A. Cancellation</h4>
              <p className="text-xs text-foreground-muted leading-relaxed">
                A request to terminate a transaction or service order before payment has settled or before technical labor has materially commenced.
              </p>
            </div>
            <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
              <h4 className="font-semibold text-white">B. Conventional Refund</h4>
              <p className="text-xs text-foreground-muted leading-relaxed">
                A reimbursement agreed mutually between KYVORA and the Client due to network billing duplicates, demonstrable input errors, or bilateral early contract termination.
              </p>
            </div>
            <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
              <h4 className="font-semibold text-white">C. Statutory Right of Withdrawal (Retracto)</h4>
              <p className="text-xs text-foreground-muted leading-relaxed">
                The non-waivable statutory right under Article 47 of Law 1480 of 2011 permitting consumers to unilaterally terminate distance purchases within 5 business days of contract execution.
              </p>
            </div>
            <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
              <h4 className="font-semibold text-white">D. Payment Reversal (Reversión del Pago)</h4>
              <p className="text-xs text-foreground-muted leading-relaxed">
                The mandatory statutory remedy under Article 51 of Law 1480 of 2011 and Decree 587 of 2016 executed through financial institutions in cases of fraud, unrequested charges, non-delivery, or defective products.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Statutory Right of Withdrawal */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">3. Exercise of the Statutory Right of Withdrawal (Retracto)</h2>
          <p>
            In distance sales and eCommerce service agreements with consumers, the right of withdrawal is legally implied.
          </p>

          <div className="space-y-3 bg-surface p-6 rounded-xl border border-white/10 text-sm">
            <h3 className="font-semibold text-white text-base">A. Legal Deadline to Exercise Retracto</h3>
            <p className="text-foreground-muted leading-relaxed">
              The statutory term to exercise withdrawal is <strong>five (5) business days</strong> following contract execution or payment transaction settlement.
            </p>

            <h3 className="font-semibold text-white text-base pt-2">B. Statutory Exceptions (Article 47, Items 1 &amp; 3)</h3>
            <p className="text-foreground-muted leading-relaxed">
              Pursuant to Colombian law, withdrawal rights are excluded in:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-xs text-foreground-muted">
              <li>
                <strong>Services where execution has commenced:</strong> Contracts whose technical execution has commenced with express consumer authorization before the 5-day window expires (Item 1).
              </li>
              <li>
                <strong>Custom or bespoke software:</strong> Contracts for the supply of goods or software customized to consumer specifications or clearly personalized (Item 3).
              </li>
            </ul>

            <h3 className="font-semibold text-white text-base pt-2">C. Reimbursement Procedure and Timeline</h3>
            <p className="text-foreground-muted leading-relaxed">
              Where withdrawal is exercised timely and validly prior to service commencement, KYVORA will reimburse 100% of monies paid, free of deductions or penalties, within a term not exceeding <strong>thirty (30) calendar days</strong> from notice.
            </p>
            <p className="text-xs text-foreground-muted">
              Withdrawal notices must be sent in writing to <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline">{legalConfig.owner.legalEmail}</a> or through our <Link href="/legal/pqrs" className="text-[var(--color-accent-cyan)] underline">PQRS Channel</Link>, attaching banking details for direct wire transfer.
            </p>
          </div>
        </section>

        {/* 4. Payment Reversal Procedure */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">4. Payment Reversal Procedure (Article 51 Law 1480 &amp; Decree 587 of 2016)</h2>
          <p>
            In electronic transactions paid via credit card, debit card, or electronic instruments, payment processors and merchants must reverse charges when requested by the consumer in any of the following statutory circumstances:
          </p>
          <ol className="list-decimal pl-6 space-y-1.5 text-sm text-foreground-muted">
            <li>When the consumer is a victim of <strong>fraud</strong>.</li>
            <li>When the transaction corresponds to an <strong>unsolicited operation</strong>.</li>
            <li>When the acquired service was <strong>never delivered</strong>.</li>
            <li>When delivered deliverables <strong>do not correspond to contracted specifications</strong>.</li>
            <li>When delivered software is <strong>defective</strong> and unrectifiable under warranty terms.</li>
          </ol>

          <div className="bg-surface p-6 rounded-xl border border-white/10 space-y-3 text-sm">
            <h3 className="font-semibold text-white text-base">Requirements and Workflow for Payment Reversal:</h3>
            <ol className="list-decimal pl-6 space-y-2 text-foreground-muted text-xs leading-relaxed">
              <li>
                <strong>Notification Window (5 business days):</strong> The consumer must file a formal complaint before KYVORA within <strong>five (5) business days</strong> of discovering fraud/unsolicited charges, or from the date service delivery was due or defective.
              </li>
              <li>
                <strong>Notice to Payment Instrument Issuer:</strong> Within the same 5 business days, the consumer must notify their issuing bank, providing proof of the claim filed with KYVORA.
              </li>
              <li>
                <strong>Claim Contents:</strong> Reversal requests must be sent to <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline">{legalConfig.owner.legalEmail}</a> or via the <Link href="/legal/pqrs" className="text-[var(--color-accent-cyan)] underline">PQRS Channel</Link> and include:
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Express statement of facts and precise invocation of statutory reversal grounds.</li>
                  <li>Monetary amount for which reversal is requested.</li>
                  <li>Identification of payment instrument (issuing bank and last 4 digits of card/account).</li>
                  <li>Wompi transaction reference (e.g., <code>KYV-DON-...</code>).</li>
                  <li>Proof of notice dispatched to issuing bank.</li>
                </ul>
              </li>
              <li>
                <strong>Reversal Execution Window (15 business days):</strong> Once both merchant and issuing bank are notified, participants in the payment chain hold <strong>fifteen (15) business days</strong> to credit funds back to the consumer under Decree 587 of 2016.
              </li>
            </ol>
          </div>
        </section>

        {/* 5. Donate Us Transactions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">5. Inconsistent Charges and Refunds in Donate Us</h2>
          <p>
            In the voluntary contributions module (Donate Us), intermittent bank network timeouts during checkout may rarely trigger duplicate charges.
          </p>
          <p className="text-sm text-foreground-muted leading-relaxed">
            In such events, the contributor should email <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline">{legalConfig.owner.legalEmail}</a> attaching their bank statement showing the duplicate debit and transaction reference. KYVORA will verify logs in the Wompi merchant portal within two (2) business days and void the excess charge immediately.
          </p>
        </section>

        {/* 6. Official Reversal Channel */}
        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">6. Official Channel for Refund and Reversal Requests</h2>
          <p className="text-sm text-foreground-muted leading-relaxed">
            All payment inquiries, refund claims, retracto notices, and reversal filings must be lodged through the{" "}
            <Link href="/legal/pqrs" className="text-[var(--color-accent-cyan)] underline font-medium">
              Official PQRS Channel
            </Link>{" "}
            or directly via{" "}
            <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline font-medium">
              {legalConfig.owner.legalEmail}
            </a>.
          </p>
        </section>
      </LegalLayout>
    );
  }

  // Spanish (Default)
  return (
    <LegalLayout
      title="Pagos, Retracto y Reversión del Pago"
      subtitle="Regulaciones sobre pasarelas de pago, confirmación transaccional, política de devoluciones, ejercicio del derecho de retracto y trámite de reversión en el comercio electrónico colombiano."
      lastUpdated="27 de Octubre de 2026"
      normativeBase="Ley 1480 de 2011 (Arts. 47 y 51), Ley 2439 de 2024 & Decreto 587 de 2016"
    >
      {/* 1. Medios de Pago Habilitados */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">1. Pasarela de Pagos Oficial y Medios Habilitados</h2>
        <p>
          Las transacciones electrónicas (tanto los aportes económicos voluntarios del módulo <em>Donate Us</em> como los pagos formalizados de servicios profesionales) se procesan a través de la pasarela autorizada <strong>Wompi Colombia</strong>, operada por Bancolombia S.A., que cumple con la certificación internacional de seguridad PCI-DSS y estándares bancarios de cifrado en tránsito.
        </p>
        <p>
          Los instrumentos y medios de pago habilitados a través de Wompi incluyen:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm text-foreground-muted">
          <li><strong>Transferencias en línea (PSE):</strong> Cuentas de ahorros y corrientes de todas las entidades financieras vinculadas a la red ACH Colombia.</li>
          <li><strong>Tarjetas de Crédito y Débito:</strong> Franquicias Visa, MasterCard y American Express emitidas en Colombia o el exterior.</li>
          <li><strong>Billeteras Digitales y Botón Bancolombia:</strong> Pagos directos desde cuentas de usuario Bancolombia y Nequi.</li>
        </ul>
        <div className="p-4 bg-surface border border-white/5 rounded-xl text-xs text-foreground-muted space-y-1">
          <strong className="text-white font-medium">Momento de confirmación del pago:</strong>
          <p>
            Una transacción se considera definitiva y confirmada en nuestros registros únicamente cuando el servidor de KYVORA recibe y valida criptográficamente el webhook oficial de Wompi con checksum de integridad coincidente y estado <code>APPROVED</code>. La pantalla de retorno del navegador es puramente informativa y no constituye por sí sola prueba de acreditación sin la respectiva confirmación del backend.
          </p>
        </div>
      </section>

      {/* 2. Distinción entre Figuras: Cancelación, Devolución, Retracto y Reversión */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">2. Diferencias entre Cancelación, Devolución, Retracto y Reversión</h2>
        <p>
          Para claridad y transparencia de los usuarios y consumidores, se delimitan las diferencias técnicas y legales entre estas cuatro figuras en el ordenamiento colombiano:
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm font-light">
          <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
            <h4 className="font-semibold text-white">A. Cancelación</h4>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Es la solicitud del usuario para desistir o anular una transacción o servicio antes de que el pago se haya procesado de forma definitiva o antes de que comience materialmente la labor técnica acordada.
            </p>
          </div>
          <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
            <h4 className="font-semibold text-white">B. Devolución Convencional</h4>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Es el reintegro de sumas de dinero acordado de mutuo acuerdo entre KYVORA y el Cliente debido a pagos duplicados por inconsistencias de red, errores de digitación comprobados o terminación bilateral anticipada de un servicio.
            </p>
          </div>
          <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
            <h4 className="font-semibold text-white">C. Derecho de Retracto (Legal)</h4>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Es la facultad legal irrenunciable consagrada en el artículo 47 de la Ley 1480 de 2011 que le permite al consumidor resolver unilateralmente un contrato de compra a distancia o comercio electrónico dentro de los 5 días hábiles siguientes a su celebración.
            </p>
          </div>
          <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
            <h4 className="font-semibold text-white">D. Reversión del Pago (Legal)</h4>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Es el mecanismo legal obligatorio regulado por el artículo 51 de la Ley 1480 de 2011 y el Decreto 587 de 2016, aplicable ante entidades financieras cuando se configuren fraudes, operaciones no solicitadas, servicios no prestados o productos defectuosos.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Derecho de Retracto */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">3. Ejercicio del Derecho de Retracto (Artículo 47 Ley 1480 de 2011)</h2>
        <p>
          En todas las ventas de bienes y prestación de servicios mediante sistemas de financiación o ventas que utilizan métodos a distancia o comercio electrónico, se entenderá pactado el derecho de retracto por parte del consumidor.
        </p>
        
        <div className="space-y-3 bg-surface p-6 rounded-xl border border-white/10 text-sm">
          <h3 className="font-semibold text-white text-base">A. Plazo Legal para Ejercer el Retracto</h3>
          <p className="text-foreground-muted leading-relaxed">
            El término máximo para ejercer el derecho de retracto es de <strong>cinco (5) días hábiles</strong> contados a partir de la celebración del contrato de prestación de servicios o de la realización del pago electrónico correspondiente.
          </p>

          <h3 className="font-semibold text-white text-base pt-2">B. Excepciones Legales Expresas (Numerales 1 y 3 del Artículo 47)</h3>
          <p className="text-foreground-muted leading-relaxed">
            De conformidad con la ley, se exceptúan del derecho de retracto los siguientes casos:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-xs text-foreground-muted">
            <li>
              <strong>Servicios cuya ejecución haya comenzado:</strong> En los contratos de prestación de servicios cuya prestación haya comenzado con el acuerdo expreso del consumidor antes de vencer el plazo de cinco (5) días hábiles (numeral 1).
            </li>
            <li>
              <strong>Bienes o software confeccionados a la medida:</strong> En los contratos de suministro de bienes o software confeccionados conforme a las especificaciones del consumidor o claramente personalizados (numeral 3).
            </li>
          </ul>

          <h3 className="font-semibold text-white text-base pt-2">C. Procedimiento y Plazo de Devolución del Dinero</h3>
          <p className="text-foreground-muted leading-relaxed">
            Cuando el consumidor ejerza el derecho de retracto de forma oportuna y procedente antes de que se haya iniciado la prestación del servicio acordado, KYVORA reintegrará la totalidad del dinero pagado por el consumidor, sin deducciones por descuentos ni penalizaciones de ninguna índole, en un término que no excederá de <strong>treinta (30) días calendario</strong> contados a partir del momento en que ejerció el derecho.
          </p>
          <p className="text-xs text-foreground-muted">
            La solicitud de retracto debe remitirse por escrito al correo <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline">{legalConfig.owner.legalEmail}</a> o mediante el <Link href="/legal/pqrs" className="text-[var(--color-accent-cyan)] underline">Canal PQRS</Link>, indicando los datos del contrato y adjuntando la certificación bancaria para el reintegro.
          </p>
        </div>
      </section>

      {/* 4. Procedimiento de Reversión del Pago */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">4. Procedimiento de Reversión del Pago (Artículo 51 Ley 1480 y Decreto 587 de 2016)</h2>
        <p>
          Cuando las ventas de bienes o prestación de servicios se realicen mediante mecanismos de comercio electrónico y se haya utilizado para pagar una tarjeta de crédito, débito o cualquier otro instrumento de pago electrónico, los participantes del proceso de pago deberán reversar los pagos que solicite el consumidor en cualquiera de los siguientes casos taxativos:
        </p>
        <ol className="list-decimal pl-6 space-y-1.5 text-sm text-foreground-muted">
          <li>Cuando el consumidor sea objeto de <strong>fraude</strong>.</li>
          <li>Cuando corresponda a una <strong>operación no solicitada</strong>.</li>
          <li>Cuando el servicio adquirido <strong>no sea prestado</strong>.</li>
          <li>Cuando el producto o servicio entregado <strong>no corresponda a lo solicitado</strong> en la propuesta contractual.</li>
          <li>Cuando el producto o software entregado <strong>resulte defectuoso</strong> y no sea subsanable en los términos de la garantía.</li>
        </ol>

        <div className="bg-surface p-6 rounded-xl border border-white/10 space-y-3 text-sm">
          <h3 className="font-semibold text-white text-base">Requisitos y Trámite para Solicitar la Reversión:</h3>
          <ol className="list-decimal pl-6 space-y-2 text-foreground-muted text-xs leading-relaxed">
            <li>
              <strong>Plazo para notificar (5 días hábiles):</strong> El consumidor deberá presentar una queja formal ante KYVORA dentro de los <strong>cinco (5) días hábiles</strong> siguientes a la fecha en que tuvo noticia de la operación fraudulenta o no solicitada, o en que debió haber recibido el servicio o lo recibió defectuoso o inconforme.
            </li>
            <li>
              <strong>Notificación al emisor del instrumento de pago:</strong> Dentro del mismo plazo de cinco (5) días hábiles, el consumidor deberá notificar al emisor del instrumento de pago electrónico (banco o entidad financiera de su tarjeta o cuenta), anexando constancia de la queja radicada ante KYVORA.
            </li>
            <li>
              <strong>Contenido de la solicitud:</strong> La queja ante KYVORA deberá remitirse a <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline">{legalConfig.owner.legalEmail}</a> o mediante el <Link href="/legal/pqrs" className="text-[var(--color-accent-cyan)] underline">Canal PQRS</Link> e incluir:
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li>Manifestación expresa de las razones que fundamentan la solicitud de reversión del pago e indicación precisa de la causal legal invocada.</li>
                <li>Valor por el cual se solicita la reversión.</li>
                <li>Identificación del instrumento de pago electrónico utilizado (entidad emisora y últimos 4 dígitos de la tarjeta o cuenta).</li>
                <li>Referencia transaccional emitida por Wompi (Ej: <code>KYV-DON-...</code>).</li>
                <li>Constancia de la notificación enviada al emisor del instrumento de pago.</li>
              </ul>
            </li>
            <li>
              <strong>Término de la reversión (15 días hábiles):</strong> Una vez presentada la solicitud de reversión ante el emisor del instrumento de pago y notificado el comercio, los participantes del proceso de pago dispondrán de un término de <strong>quince (15) días hábiles</strong> para hacer efectiva la reversión en la cuenta o tarjeta del consumidor, de acuerdo con el Decreto 587 de 2016.
            </li>
          </ol>
        </div>
      </section>

      {/* 5. Tratamiento de Pagos en Donate Us */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">5. Pagos Inconsistentes y Devoluciones en Donate Us</h2>
        <p>
          En los aportes económicos voluntarios realizados en el módulo Donate Us, pueden presentarse casos fortuitos de cobros duplicados por caídas intermitentes de red durante la confirmación con la entidad bancaria.
        </p>
        <p className="text-sm text-foreground-muted leading-relaxed">
          En tales supuestos, el aportante debe enviar un correo a <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline">{legalConfig.owner.legalEmail}</a> con la referencia de pago y el comprobante del extracto donde figure el cobro doble. KYVORA verificará el balance en el panel de Wompi dentro de los dos (2) días hábiles siguientes y tramitará de inmediato la solicitud de anulación del cobro excedente ante la pasarela de pagos.
        </p>
      </section>

      {/* 6. Canal de Reclamaciones */}
      <section className="space-y-4 border-t border-white/10 pt-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">6. Canal Oficial para Solicitudes de Devolución</h2>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Cualquier trámite relativo a pagos, devoluciones, retractos o reversiones se canaliza de forma formal a través del{" "}
          <Link href="/legal/pqrs" className="text-[var(--color-accent-cyan)] underline font-medium">
            Canal Oficial de PQRS
          </Link>{" "}
          o escribiendo directamente a{" "}
          <a href={`mailto:${legalConfig.owner.legalEmail}`} className="text-[var(--color-accent-cyan)] underline font-medium">
            {legalConfig.owner.legalEmail}
          </a>.
        </p>
      </section>
    </LegalLayout>
  );
}

