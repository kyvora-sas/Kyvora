import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";
import { legalConfig } from "@/config/legal";

export const metadata: Metadata = {
  title: "Condiciones Generales de Contratación — KYVORA",
  description:
    "Condiciones generales de contratación y prestación de servicios de software, desarrollo web y sistemas a la medida de KYVORA en Colombia.",
};

export default function ContratacionPage() {
  return (
    <LegalLayout
      title="Condiciones Generales de Contratación"
      subtitle="Bases comerciales, contractuales y operativas que regulan la cotización, formalización, desarrollo y entrega de servicios tecnológicos por parte de KYVORA."
      lastUpdated="27 de Octubre de 2026"
      normativeBase="Ley 1480 de 2011, Ley 527 de 1999 & Código de Comercio de Colombia"
    >
      {/* 1. Objeto y Alcance */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">1. Objeto y Alcance de las Condiciones</h2>
        <p>
          Las presentes Condiciones Generales de Contratación regulan las relaciones precontractuales, contractuales y de entrega entre <strong>{legalConfig.brandName}</strong> (operada por persona natural independiente en Colombia) y las personas naturales o jurídicas (en adelante, el &ldquo;Cliente&rdquo;) que contraten la prestación de servicios profesionales de desarrollo de software, sitios web, aplicaciones, arquitecturas cloud, sistemas a la medida y automatización técnica.
        </p>
        <p>
          Estas condiciones aplican de manera supletoria y complementaria a la propuesta técnica y económica individualizada (en adelante, la &ldquo;Propuesta&rdquo;) o al contrato específico de prestación de servicios que las partes suscriban. En caso de discrepancia entre lo pactado en la Propuesta formal aceptada y estas condiciones generales, prevalecerá lo establecido en la Propuesta específica.
        </p>
      </section>

      {/* 2. Proceso Comercial Transparente */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">2. Proceso Comercial y Fases de Contratación</h2>
        <p>
          El ciclo comercial y operativo de KYVORA se desarrolla a través de las siguientes etapas transparentes y verificables:
        </p>
        
        <div className="space-y-4 bg-surface p-6 rounded-xl border border-white/10 text-sm">
          <div>
            <h3 className="font-semibold text-white text-base">Fase 1: Solicitud de Información y Descubrimiento Preliminar</h3>
            <p className="text-foreground-muted mt-1 leading-relaxed">
              El Cliente remite su requerimiento técnico a través del formulario de contacto del Sitio Web, correo electrónico o canal de WhatsApp. Esta consulta inicial <strong>no constituye un contrato ni compromete a ninguna de las partes</strong>; tiene como único propósito evaluar la viabilidad técnica, alcances aproximados y afinidad tecnológica del proyecto.
            </p>
          </div>

          <div className="border-t border-white/5 pt-3">
            <h3 className="font-semibold text-white text-base">Fase 2: Definición de Requisitos y Estructuración de Propuesta</h3>
            <p className="text-foreground-muted mt-1 leading-relaxed">
              KYVORA analiza en detalle la necesidad, establece los casos de uso, define la arquitectura recomendada y emite una Propuesta formal por escrito que contiene: objetivo del proyecto, lista detallada de funcionalidades incluidas, entregables concretos, cronograma estimado por hitos, valor total en pesos colombianos (COP) o dólares (USD), forma de pago y requerimientos previos a cargo del Cliente.
            </p>
          </div>

          <div className="border-t border-white/5 pt-3">
            <h3 className="font-semibold text-white text-base">Fase 3: Aceptación y Perfeccionamiento del Acuerdo</h3>
            <p className="text-foreground-muted mt-1 leading-relaxed">
              El contrato se perfecciona válidamente cuando el Cliente manifiesta su aceptación expresa de la Propuesta por medios electrónicos válidos (correo electrónico de confirmación, firma digital o suscripción de contrato formal conforme a la Ley 527 de 1999 sobre Comercio Electrónico) y se realiza el pago del anticipo inicial pactado.
            </p>
          </div>

          <div className="border-t border-white/5 pt-3">
            <h3 className="font-semibold text-white text-base">Fase 4: Ejecución Técnica e Hitos de Avance</h3>
            <p className="text-foreground-muted mt-1 leading-relaxed">
              El desarrollo se ejecuta en iteraciones planificadas. KYVORA presenta avances en entornos de prueba o despliegues preliminares para validación continua por parte del Cliente.
            </p>
          </div>

          <div className="border-t border-white/5 pt-3">
            <h3 className="font-semibold text-white text-base">Fase 5: Revisión, Pruebas y Aprobación de Entregables</h3>
            <p className="text-foreground-muted mt-1 leading-relaxed">
              Finalizada la construcción, el Cliente dispone de un plazo ordinario de <strong>cinco (5) a diez (10) días hábiles</strong> (según se pacte en la Propuesta) para revisar el software, realizar pruebas de usuario y reportar discrepancias frente a la especificación técnica aprobada. Si transcurrido dicho plazo el Cliente no formula observaciones motivadas o pone en producción el sistema, se entenderá recibido a entera satisfacción.
            </p>
          </div>

          <div className="border-t border-white/5 pt-3">
            <h3 className="font-semibold text-white text-base">Fase 6: Despliegue Final, Liquidación y Soporte</h3>
            <p className="text-foreground-muted mt-1 leading-relaxed">
              Una vez cancelado el saldo final acordado, KYVORA realiza el despliegue en los servidores de producción definitivos, hace entrega formal del código fuente pactado o accesos administrativos y da inicio al periodo de garantía técnica legal.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Precios, Pagos y Facturación */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">3. Estructura de Precios, Pagos y Facturación</h2>
        <p>
          Los precios base exhibidos en la sección comercial del Sitio Web son estrictamente referenciales para alcances estandarizados mínimos. El precio vinculante para cualquier desarrollo es el fijado en la Propuesta técnica individualizada.
        </p>
        <p>
          <strong>Esquema habitual de pagos:</strong> Salvo pacto expreso en contrario, los servicios se remuneran bajo la modalidad de precio global por hitos:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm text-foreground-muted">
          <li><strong>Anticipo inicial del 50%:</strong> Requisito indispensable para agendar el proyecto, iniciar el diseño de arquitectura y reservar la disponibilidad técnica de KYVORA.</li>
          <li><strong>Saldo final del 50% (o pagos intermedios por hitos):</strong> Exigible contra la presentación y aprobación de los entregables acordados, previo al despliegue en servidores finales de producción y entrega de repositorios.</li>
        </ul>
        <div className="p-4 bg-surface border border-white/5 rounded-xl text-xs text-foreground-muted space-y-1.5 leading-relaxed">
          <p className="text-white font-medium">Condición Tributaria y Soportes de Cobro:</p>
          <p>
            Al ser operada por una persona natural independiente perteneciente al Régimen No Responsable de IVA (antiguo Régimen Simplificado) en Colombia, las solicitudes de pago se acompañan de la correspondiente <strong>Cuenta de Cobro</strong> con copia del Registro Único Tributario (RUT) actualizado, o documento equivalente legalmente exigible ante la DIAN.
          </p>
        </div>
      </section>

      {/* 4. Deberes del Cliente y Dependencias Externas */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">4. Deberes del Cliente y Servicios de Terceros</h2>
        <p>
          El cumplimiento oportuno de los cronogramas exige la colaboración activa del Cliente. Constituyen deberes y obligaciones esenciales del Cliente:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm text-foreground-muted">
          <li><strong>Entrega oportuna de insumos:</strong> Proveer textos definitivos, manual de identidad de marca, logotipos en alta resolución, material fotográfico con derechos de uso y accesos a servidores en los plazos fijados.</li>
          <li><strong>Costos de plataformas externas:</strong> Los costos por licenciamiento o suscripción a servicios de terceros (nombres de dominio, hosting cloud en Vercel/AWS, certificados SSL de pago, tokens de modelos de lenguaje o IA de OpenAI/Anthropic, cuentas de pasarelas de pago y cuentas de desarrollador en Apple/Google Play) son de cuenta y cargo exclusivo del Cliente.</li>
          <li><strong>Designación de interlocutor:</strong> Nombrar a una persona autorizada con capacidad de decisión para resolver consultas técnicas y aprobar avances.</li>
        </ul>
      </section>

      {/* 5. Gestión de Cambios de Alcance */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">5. Gestión de Cambios de Alcance (Change Requests)</h2>
        <p>
          Cualquier funcionalidad, módulo, integración, ajuste de diseño estructural o rediseño solicitado por el Cliente que no se encuentre expresamente detallado en la Propuesta técnica aprobada se considerará un <strong>Cambio de Alcance</strong>.
        </p>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Los Cambios de Alcance deberán ser cotizados por separado por KYVORA en cuanto a costo adicional y extensión requerida en el cronograma de entrega. Ningún cambio de alcance comenzará a desarrollarse sin la aprobación previa y por escrito del Cliente.
        </p>
      </section>

      {/* 6. Propiedad Intelectual */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">6. Régimen de Propiedad Intelectual y Licencias</h2>
        <p>
          Salvo estipulación expresa en contrario en el contrato formal:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-foreground-muted">
          <li><strong>Derechos Patrimoniales del Cliente:</strong> Una vez acreditado el pago del 100% del valor total acordado, KYVORA transfiere al Cliente la titularidad de los derechos patrimoniales sobre el código fuente y las interfaces desarrolladas específicamente a la medida de su encargo.</li>
          <li><strong>Herramientas y Componentes Preexistentes:</strong> KYVORA conserva la titularidad y derechos morales sobre sus metodologías, bibliotecas base, componentes de arquitectura genéricos reutilizables y herramientas de desarrollo previas, otorgando al Cliente una licencia no exclusiva, perpetua e irrevocable para utilizarlos como parte integrada del software desarrollado.</li>
          <li><strong>Derecho Moral de Autor y Portafolio:</strong> De acuerdo con la Ley 23 de 1982, KYVORA conserva el derecho moral a ser reconocida como autora del desarrollo y a mencionar el proyecto en su portafolio comercial de trabajos realizados, salvo que exista un acuerdo de confidencialidad (NDA) expreso en contrario.</li>
        </ul>
      </section>

      {/* 7. Garantía Legal de Funcionamiento */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">7. Garantía Legal de Idoneidad y Calidad</h2>
        <p>
          De conformidad con el artículo 7 y siguientes de la Ley 1480 de 2011 (Estatuto del Consumidor), KYVORA otorga una garantía legal de funcionamiento sobre el software desarrollado por un término estándar de <strong>treinta (30) días calendario</strong> contados a partir de la fecha de entrega final a conformidad.
        </p>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Durante el término de la garantía, KYVORA corregirá sin costo adicional cualquier falla funcional, error de código (bug) o comportamiento que se aparte de la especificación técnica aprobada en la Propuesta.
        </p>
        <div className="bg-surface p-4 rounded-xl border border-white/5 text-xs text-foreground-muted space-y-1 leading-relaxed">
          <p className="text-white font-medium">Exclusiones Expresas de la Garantía:</p>
          <p>
            La garantía no cubre fallas causadas por: intervención o modificación del código fuente por parte del Cliente o de terceros no autorizados por KYVORA; fallas, caídas o suspensiones en los servidores de hosting contratados por el Cliente; cambios imprevistos o discontinuación de APIs externas de terceros (como Google, Meta, OpenAI o Wompi); o incompatibilidades generadas por actualizaciones futuras de navegadores o sistemas operativos posteriores a la fecha de entrega.
          </p>
        </div>
      </section>

      {/* 8. Retracto y Terminación */}
      <section className="space-y-4 border-t border-white/10 pt-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">8. Derecho de Retracto y Terminación del Contrato</h2>
        <p className="text-sm text-foreground-muted leading-relaxed">
          En los contratos de servicios celebrados a distancia con consumidores, resulta aplicable el derecho de retracto conforme al artículo 47 de la Ley 1480 de 2011 (cinco días hábiles contados desde la celebración), con las excepciones legales expresas para servicios cuya prestación haya comenzado con el acuerdo del consumidor o software claramente confeccionado a la medida de sus especificaciones.
        </p>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Para conocer las condiciones detalladas, plazos y procedimientos de devolución, consulte nuestra sección de{" "}
          <Link href="/legal/pagos-reversiones" className="text-[var(--color-accent-cyan)] underline font-medium">
            Pagos, Retracto y Reversión del Pago
          </Link>.
        </p>
      </section>
    </LegalLayout>
  );
}
