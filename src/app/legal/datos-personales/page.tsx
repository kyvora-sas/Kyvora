import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";
import { legalConfig } from "@/config/legal";

export const metadata: Metadata = {
  title: "Política de Tratamiento de Datos Personales — KYVORA",
  description:
    "Política integral de tratamiento de datos personales de KYVORA conforme a la Ley 1581 de 2012, Decreto 1377 de 2013 y Decreto 1074 de 2015 en Colombia.",
};

export default function DatosPersonalesPage() {
  return (
    <LegalLayout
      title="Política de Tratamiento de Datos Personales"
      subtitle="Disposiciones institucionales sobre recolección, almacenamiento, uso, circulación, protección y supresión de datos personales en el territorio de la República de Colombia."
      lastUpdated="27 de Octubre de 2026"
      normativeBase="Ley Estatutaria 1581 de 2012, Decreto 1377 de 2013 & Decreto 1074 de 2015"
    >
      {/* 1. Identificación del Responsable */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">1. Identificación del Responsable del Tratamiento</h2>
        <p>
          El responsable del tratamiento de los datos personales tratados a través del portal oficial <strong>kyvora.net.co</strong>, canales de mensajería instantánea y formularios en línea es una persona natural independiente que ejerce actividades comerciales en la República de Colombia bajo el nombre comercial <strong>{legalConfig.tradeName}</strong>.
        </p>
        <div className="bg-surface p-6 rounded-xl border border-white/10 space-y-2 text-sm font-light">
          <div><strong className="text-white font-medium">Nombre comercial:</strong> {legalConfig.brandName} ({legalConfig.tradeName})</div>
          <div><strong className="text-white font-medium">Naturaleza jurídica:</strong> {legalConfig.owner.legalStatus}</div>
          <div><strong className="text-white font-medium">Titular de la operación:</strong> {legalConfig.owner.legalRepresentative}</div>
          <div><strong className="text-white font-medium">Documento de identidad:</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.idPlaceholder}</span></div>
          <div><strong className="text-white font-medium">Identificación Tributaria (RUT):</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.rutPlaceholder}</span></div>
          <div><strong className="text-white font-medium">Domicilio principal:</strong> {legalConfig.owner.cityDomicile}</div>
          <div><strong className="text-white font-medium">Dirección de correspondencia física:</strong> <span className="font-mono text-amber-400/90">{legalConfig.owner.physicalAddressPlaceholder}</span></div>
          <div>
            <strong className="text-white font-medium">Correo electrónico exclusivo para Hábeas Data:</strong>{" "}
            <a href={legalConfig.owner.legalEmailHref} className="text-[var(--color-accent-cyan)] underline">
              {legalConfig.owner.legalEmail}
            </a>
          </div>
          <div><strong className="text-white font-medium">Teléfono / WhatsApp oficial:</strong> {legalConfig.owner.phone}</div>
        </div>
      </section>

      {/* 2. Marco Normativo y Ámbito de Aplicación */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">2. Marco Normativo y Ámbito de Aplicación</h2>
        <p>
          La presente Política de Tratamiento de la Información se expide en estricto cumplimiento del artículo 15 de la Constitución Política de Colombia, la <strong>Ley Estatutaria 1581 de 2012</strong>, el <strong>Decreto 1377 de 2013</strong> (incorporado en el Decreto Único Reglamentario 1074 de 2015, Capítulo 25), la <strong>Ley 1266 de 2008</strong> cuando resulte aplicable, y las directrices vinculantes expedidas por la Delegatura para la Protección de Datos Personales de la Superintendencia de Industria y Comercio (SIC).
        </p>
        <p>
          Esta política resulta aplicable a todos los datos personales de personas naturales que sean recolectados, almacenados, utilizados, transmitidos o suprimidos por KYVORA con ocasión de las visitas al sitio web oficial, solicitudes comerciales de cotización, contratación de servicios tecnológicos, radicación de PQRS y aportes económicos voluntarios al laboratorio de proyectos.
        </p>
      </section>

      {/* 3. Definiciones Legales */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">3. Definiciones Legales Fundamentales</h2>
        <p>
          Para la correcta interpretación de esta política, se adoptan las definiciones consagradas en el artículo 3 de la Ley 1581 de 2012 y el artículo 3 del Decreto 1377 de 2013:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-foreground-muted text-sm leading-relaxed">
          <li><strong>Autorización:</strong> Consentimiento previo, expreso e informado del Titular para llevar a cabo el Tratamiento de datos personales.</li>
          <li><strong>Base de Datos:</strong> Conjunto organizado de datos personales que sea objeto de Tratamiento.</li>
          <li><strong>Dato personal:</strong> Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables.</li>
          <li><strong>Dato público:</strong> Es el dato que no sea semiprivado, privado o sensible. Son considerados datos públicos, entre otros, los datos relativos al estado civil de las personas y a su profesión u oficio.</li>
          <li><strong>Dato privado:</strong> Es el dato que por su naturaleza íntima o reservada solo es relevante para el titular.</li>
          <li><strong>Dato sensible:</strong> Aquel que afecta la intimidad del Titular o cuyo uso indebido puede generar discriminación (origen racial, convicciones religiosas, datos de salud, vida sexual o biométricos).</li>
          <li><strong>Encargado del Tratamiento:</strong> Persona natural o jurídica, pública o privada, que por cuenta del Responsable realice el Tratamiento de datos personales.</li>
          <li><strong>Responsable del Tratamiento:</strong> Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, decida sobre la base de datos y/o el Tratamiento de los datos.</li>
          <li><strong>Titular:</strong> Persona natural cuyos datos personales sean objeto de Tratamiento.</li>
          <li><strong>Tratamiento:</strong> Cualquier operación o conjunto de operaciones sobre datos personales, tales como recolección, almacenamiento, uso, circulación o supresión.</li>
          <li><strong>Transferencia:</strong> Envío de datos personales a un receptor que actúa como Responsable, ubicado dentro o fuera de Colombia.</li>
          <li><strong>Transmisión:</strong> Comunicación de datos personales a un Encargado para que realice el Tratamiento por cuenta del Responsable, dentro o fuera de Colombia.</li>
        </ul>
      </section>

      {/* 4. Categorías de Datos Recopilados y Finalidades */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">4. Categorías de Datos Recopilados y Finalidades Específicas</h2>
        <p>
          En observancia del principio de libertad y necesidad, KYVORA recopila exclusivamente los datos pertinentes y adecuados para finalidades previamente informadas. Se diferencian las siguientes categorías:
        </p>

        <div className="space-y-4 bg-surface p-6 rounded-xl border border-white/10">
          <div>
            <h3 className="font-semibold text-white text-base">A. Datos de Contacto y Solicitudes Comerciales</h3>
            <p className="text-sm text-foreground-muted mt-1 leading-relaxed">
              <strong>Datos tratados:</strong> Nombre y apellidos, dirección de correo electrónico, tipo de proyecto tecnológico requerido, descripción de la necesidad y rango presupuestal orientativo.
              <br />
              <strong>Finalidades:</strong> Atender y dar respuesta técnica a la consulta; evaluar la viabilidad de desarrollo; estructurar propuestas comerciales y cotizaciones a la medida; y contactar al interesado a través de medios electrónicos.
            </p>
          </div>

          <div className="border-t border-white/5 pt-3">
            <h3 className="font-semibold text-white text-base">B. Datos de Aportantes Voluntarios (Donate Us)</h3>
            <p className="text-sm text-foreground-muted mt-1 leading-relaxed">
              <strong>Datos tratados:</strong> Nombre o seudónimo del aportante, dirección de correo electrónico, identificador único de referencia de la transacción y proyecto específico de asignación.
              <br />
              <strong>Finalidades:</strong> Registrar la intención de aporte; generar la referencia criptográfica ante la pasarela de pagos Wompi; conciliar transacciones mediante webhooks; emitir el comprobante digital de la operación; y verificar eventuales solicitudes de devolución ante errores técnicos.
            </p>
          </div>

          <div className="border-t border-white/5 pt-3">
            <h3 className="font-semibold text-white text-base">C. Datos del Sistema de Peticiones, Quejas y Reclamos (PQRS)</h3>
            <p className="text-sm text-foreground-muted mt-1 leading-relaxed">
              <strong>Datos tratados:</strong> Nombre completo, tipo y número de documento de identidad (opcional o requerido según la naturaleza del trámite), correo electrónico para notificación, motivo y relato de los hechos.
              <br />
              <strong>Finalidades:</strong> Radicar formalmente la petición o reclamación; generar número de radicado trazable; adelantar las investigaciones técnicas o contractuales correspondientes; y emitir respuesta formal dentro de los términos legales de la Ley 1755 de 2015 y Ley 1480 de 2011.
            </p>
          </div>

          <div className="border-t border-white/5 pt-3">
            <h3 className="font-semibold text-white text-base">D. Registros Técnicos de Navegación y Seguridad</h3>
            <p className="text-sm text-foreground-muted mt-1 leading-relaxed">
              <strong>Datos tratados:</strong> Dirección IP de conexión, fecha y hora de la petición HTTP, cabeceras técnicas del navegador (User-Agent).
              <br />
              <strong>Finalidades:</strong> Mitigar ataques informáticos (DDoS, inyecciones de código); aplicar limitación de tasa por dirección IP (rate limiting); prevenir envíos automatizados de spam en formularios; y garantizar la disponibilidad del servicio.
            </p>
          </div>
        </div>

        <div className="p-4 bg-blue-950/20 border border-blue-500/20 rounded-xl space-y-2 text-xs text-foreground-muted leading-relaxed">
          <p className="text-white font-medium uppercase tracking-wider">Aclaración Expresa sobre Datos Sensibles y Financieros:</p>
          <p>
            1. <strong>No recolección de datos sensibles:</strong> KYVORA <strong>no solicita ni trata datos de carácter sensible</strong> (origen racial o étnico, orientación política, convicciones religiosas o filosóficas, datos biométricos ni datos de salud).
          </p>
          <p>
            2. <strong>No almacenamiento de datos de pago:</strong> KYVORA <strong>no recopila ni almacena números completos de tarjetas de crédito o débito, códigos de seguridad CVV/CVC, fechas de expiración ni claves bancarias</strong>. La captura y validación financiera se ejecuta directamente en los servidores de la pasarela certificada Wompi Colombia (Bancolombia S.A.) bajo rigurosos protocolos PCI-DSS Nivel 1.
          </p>
          <p>
            3. <strong>Menores de edad:</strong> Los servicios y canales de KYVORA están dirigidos exclusivamente a mayores de edad. No se recopilan deliberadamente datos de niños, niñas ni adolescentes.
          </p>
        </div>
      </section>

      {/* 5. Principios Rectores */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">5. Principios Rectores del Tratamiento</h2>
        <p>
          En todo tratamiento de datos personales ejecutado por KYVORA se aplicarán de manera armónica los principios contenidos en el artículo 4 de la Ley 1581 de 2012:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-foreground-muted text-sm leading-relaxed">
          <li><strong>Principio de legalidad:</strong> El Tratamiento de datos se sujetará plenamente a la legislación colombiana aplicable.</li>
          <li><strong>Principio de finalidad:</strong> Los datos se tratarán exclusivamente para una finalidad legítima de acuerdo con la Constitución y la Ley, informada previamente al Titular.</li>
          <li><strong>Principio de libertad:</strong> El Tratamiento solo puede ejercerse con el consentimiento previo, expreso e informado del Titular. No se obtendrán ni divulgarán datos sin previa autorización.</li>
          <li><strong>Principio de veracidad o calidad:</strong> La información debe ser veraz, completa, exacta, actualizada, comprobable y comprensible. Se prohíbe el Tratamiento de datos parciales o engañosos.</li>
          <li><strong>Principio de transparencia:</strong> Se garantiza el derecho del Titular a obtener del Responsable, en cualquier momento y sin restricciones, información acerca de la existencia de datos que le conciernan.</li>
          <li><strong>Principio de acceso y circulación restringida:</strong> Los datos personales, salvo los de naturaleza pública, no estarán disponibles en internet u otros medios de divulgación masiva sin medidas de seguridad que limiten el acceso exclusivamente a los autorizados.</li>
          <li><strong>Principio de seguridad:</strong> Se incorporan las medidas técnicas, humanas y administrativas necesarias para otorgar seguridad a los registros, evitando su adulteración, pérdida, consulta, uso o acceso no autorizado.</li>
          <li><strong>Principio de confidencialidad:</strong> Todas las personas que intervengan en el Tratamiento están obligadas a garantizar la reserva de la información, incluso después de finalizada su relación con las labores del tratamiento.</li>
        </ul>
      </section>

      {/* 6. Derechos de los Titulares */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">6. Derechos de los Titulares de los Datos (Hábeas Data)</h2>
        <p>
          De conformidad con el artículo 8 de la Ley 1581 de 2012, el Titular de los datos personales tiene los siguientes derechos inalienables:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-foreground-muted text-sm leading-relaxed">
          <li><strong>Conocer, actualizar y rectificar</strong> sus datos personales frente a KYVORA en su condición de Responsable del Tratamiento. Este derecho se podrá ejercer, entre otros, frente a datos parciales, inexactos, incompletos, fraccionados, que induzcan a error, o aquellos cuyo Tratamiento esté expresamente prohibido o no haya sido autorizado.</li>
          <li><strong>Solicitar prueba de la autorización</strong> otorgada a KYVORA, salvo cuando expresamente se exceptúe como requisito para el Tratamiento, de conformidad con lo previsto en el artículo 10 de la Ley 1581 de 2012.</li>
          <li><strong>Ser informado por KYVORA</strong>, previa solicitud, respecto del uso que le ha dado a sus datos personales.</li>
          <li><strong>Presentar ante la Superintendencia de Industria y Comercio</strong> quejas por infracciones a lo dispuesto en la ley y las demás normas que la modifiquen, adicionen o complementen.</li>
          <li><strong>Revocar la autorización y/o solicitar la supresión del dato</strong> cuando en el Tratamiento no se respeten los principios, derechos y garantías constitucionales y legales. La revocatoria y/o supresión procederá cuando la Superintendencia de Industria y Comercio haya determinado que en el Tratamiento el Responsable ha incurrido en conductas contrarias a la ley y a la Constitución.</li>
          <li><strong>Acceder en forma gratuita</strong> a sus datos personales que hayan sido objeto de Tratamiento.</li>
        </ol>
      </section>

      {/* 7. Procedimiento para el Ejercicio de los Derechos */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">7. Procedimiento para el Ejercicio de los Derechos de Consulta y Reclamo</h2>
        <p>
          Los titulares o sus causahabientes debidamente acreditados podrán ejercer sus derechos a través de los siguientes canales oficiales:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm text-foreground-muted">
          <li><strong>Correo electrónico institucional:</strong> <a href={legalConfig.owner.legalEmailHref} className="text-[var(--color-accent-cyan)] underline">{legalConfig.owner.legalEmail}</a></li>
          <li><strong>Formulario en línea:</strong> Módulo oficial de radicación en el <Link href="/legal/pqrs" className="text-[var(--color-accent-cyan)] underline">Canal PQRS</Link>.</li>
        </ul>

        <div className="space-y-4 pt-2">
          <div className="bg-surface p-5 rounded-xl border border-white/10 space-y-2">
            <h3 className="font-semibold text-white text-base">A. Trámite de Consultas (Artículo 14 Ley 1581 de 2012)</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              El Titular podrá consultar de forma gratuita su información personal que repose en nuestras bases de datos.
            </p>
            <p className="text-sm text-foreground-muted leading-relaxed">
              <strong>Término de respuesta:</strong> La consulta será atendida en un término máximo de <strong>diez (10) días hábiles</strong> contados a partir de la fecha de su recibo. Cuando no fuere posible atender la consulta dentro de dicho término, se informará al interesado antes del vencimiento expresando los motivos de la demora y señalando la fecha en que se atenderá, la cual en ningún caso podrá superar los <strong>cinco (5) días hábiles</strong> siguientes al vencimiento del primer término.
            </p>
          </div>

          <div className="bg-surface p-5 rounded-xl border border-white/10 space-y-2">
            <h3 className="font-semibold text-white text-base">B. Trámite de Reclamos, Rectificación o Supresión (Artículo 15 Ley 1581 de 2012)</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              El Titular que considere que la información contenida en una base de datos debe ser objeto de corrección, actualización o supresión, o que advierta el presunto incumplimiento de cualquiera de los deberes legales, podrá presentar un reclamo indicando:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-xs text-foreground-muted">
              <li>Identificación del Titular (nombre completo y documento de identidad).</li>
              <li>Descripción detallada de los hechos que dan lugar al reclamo y petición concreta.</li>
              <li>Dirección de notificación física o electrónica para remitir respuesta.</li>
              <li>Documentos o soportes que se quieran hacer valer.</li>
            </ul>
            <p className="text-sm text-foreground-muted leading-relaxed">
              <strong>Requerimiento por información incompleta:</strong> Si el reclamo resulta incompleto, se requerirá al interesado dentro de los cinco (5) días hábiles siguientes a la recepción del reclamo para que subsane las fallas. Transcurridos dos (2) meses desde la fecha del requerimiento sin que el solicitante presente la información requerida, se entenderá que ha desistido del reclamo.
            </p>
            <p className="text-sm text-foreground-muted leading-relaxed">
              <strong>Inclusión de leyenda:</strong> Una vez recibido el reclamo completo, se incluirá en la base de datos respectiva una leyenda que diga &ldquo;reclamo en trámite&rdquo; y el motivo del mismo, en un término no mayor a dos (2) días hábiles.
            </p>
            <p className="text-sm text-foreground-muted leading-relaxed">
              <strong>Término de respuesta:</strong> El término máximo para atender el reclamo será de <strong>quince (15) días hábiles</strong> contados a partir del día siguiente a la fecha de su recibo. Cuando no fuere posible atenderlo dentro de dicho término, se informará al interesado los motivos de la demora y la fecha en que se atenderá, la cual no podrá superar los <strong>ocho (8) días hábiles</strong> siguientes al vencimiento del primer término.
            </p>
          </div>

          <div className="p-4 bg-surface/50 border border-white/5 rounded-xl text-xs text-foreground-muted leading-relaxed">
            <strong className="text-white">Requisito de procedibilidad ante la SIC:</strong> De acuerdo con el artículo 16 de la Ley 1581 de 2012, el Titular solo podrá elevar queja ante la Superintendencia de Industria y Comercio una vez haya agotado el trámite de consulta o reclamo directamente ante KYVORA.
          </div>
        </div>
      </section>

      {/* 8. Terceros Encargados y Transmisiones Internacionales */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">8. Terceros Encargados y Transmisiones Internacionales</h2>
        <p>
          Para garantizar la operación tecnológica, alta disponibilidad y seguridad del Sitio Web, KYVORA contrata servicios de infraestructura con los siguientes terceros, quienes actúan en calidad de Encargados del Tratamiento y aplican rigurosos estándares de seguridad y privacidad:
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm font-light">
          <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
            <h4 className="font-semibold text-white">Vercel Inc.</h4>
            <p className="text-xs text-foreground-muted"><strong>Ubicación:</strong> Estados Unidos.</p>
            <p className="text-xs text-foreground-muted"><strong>Rol:</strong> Plataforma de alojamiento cloud, renderizado perimetral (Edge) y entrega de contenido (CDN).</p>
          </div>
          <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
            <h4 className="font-semibold text-white">Wompi Colombia</h4>
            <p className="text-xs text-foreground-muted"><strong>Ubicación:</strong> Colombia (Bancolombia S.A.).</p>
            <p className="text-xs text-foreground-muted"><strong>Rol:</strong> Pasarela transaccional oficial para aportes voluntarios en COP, certificada PCI-DSS.</p>
          </div>
          <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-1.5">
            <h4 className="font-semibold text-white">Resend Inc.</h4>
            <p className="text-xs text-foreground-muted"><strong>Ubicación:</strong> Estados Unidos.</p>
            <p className="text-xs text-foreground-muted"><strong>Rol:</strong> Servicio de entrega y retransmisión segura de correos electrónicos transaccionales del formulario.</p>
          </div>
        </div>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Las transmisiones internacionales de datos a Vercel Inc. y Resend Inc. se realizan bajo contratos y compromisos de tratamiento de datos conformes a los estándares exigidos por la Superintendencia de Industria y Comercio para países que ofrecen niveles adecuados de protección.
        </p>
      </section>

      {/* 9. Seguridad de la Información */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">9. Medidas Técnicas y Administrativas de Seguridad</h2>
        <p>
          KYVORA adopta las medidas técnicas, humanas y organizativas necesarias para preservar la confidencialidad, integridad y disponibilidad de la información:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm text-foreground-muted">
          <li><strong>Cifrado en tránsito:</strong> Conexiones protegidas mediante HTTPS con protocolo TLS 1.3 forzado y cabeceras HSTS preactivadas.</li>
          <li><strong>Cabeceras de seguridad estrictas:</strong> Implementación de Content Security Policy (CSP), X-Frame-Options: DENY, X-Content-Type-Options: nosniff y Permissions-Policy.</li>
          <li><strong>Sanitización contra inyecciones:</strong> Validación y depuración estricta de todos los campos de texto para evitar vulnerabilidades de Cross-Site Scripting (XSS) e inyecciones de código.</li>
          <li><strong>Protección contra abusos y bots:</strong> Mecanismos de trampa honeypot invisibles y limitación de tasa por dirección IP (rate limiting) para evitar ataques de fuerza bruta o saturación.</li>
          <li><strong>Aislamiento de credenciales:</strong> Todos los secretos de servidor y firmas criptográficas se custodian en variables de entorno inaccesibles para el navegador del usuario.</li>
        </ul>
      </section>

      {/* 10. Periodo de Conservación y Supresión */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">10. Periodo de Conservación y Criterios de Supresión</h2>
        <p>
          Los datos personales se conservarán únicamente durante el tiempo estrictamente necesario para cumplir las finalidades informadas:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm text-foreground-muted">
          <li><strong>Consultas comerciales y cotizaciones no formalizadas:</strong> Hasta doce (12) meses posteriores al último contacto, tras lo cual se eliminan de los registros activos.</li>
          <li><strong>Aportes voluntarios y transacciones:</strong> Hasta cinco (5) años con el propósito exclusivo de atender requerimientos contables, conciliaciones bancarias o requerimientos tributarios de la DIAN.</li>
          <li><strong>PQRS y reclamaciones:</strong> Hasta tres (3) años posteriores a la emisión y notificación de la respuesta definitiva, para respaldar el debido proceso y la defensa legal.</li>
        </ul>
      </section>

      {/* 11. Vigencia y Actualizaciones */}
      <section className="space-y-4 border-t border-white/10 pt-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">11. Vigencia y Modificaciones de la Política</h2>
        <p className="text-sm text-foreground-muted leading-relaxed">
          La presente Política de Tratamiento de Datos Personales rige a partir del <strong>27 de Octubre de 2026</strong>.
        </p>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Cualquier cambio sustancial en las finalidades del tratamiento o en los canales de atención será comunicado oportunamente a través de un aviso destacado en el sitio web antes de su entrada en vigencia, garantizando a los titulares la facultad de ejercer sus derechos o revocar su autorización si fuere procedente.
        </p>
      </section>
    </LegalLayout>
  );
}
