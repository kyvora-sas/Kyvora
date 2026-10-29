import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";
import { legalConfig } from "@/config/legal";

export const metadata: Metadata = {
  title: "Condiciones Legales de Aportes Voluntarios (Donate Us) — KYVORA",
  description:
    "Términos jurídicos, marco tributario y condiciones de transparencia de los aportes económicos voluntarios al laboratorio tecnológico de KYVORA en Colombia.",
};

export default function DonateLegalPage() {
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
