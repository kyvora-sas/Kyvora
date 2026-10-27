# KYVORA — Notas de Revisión y Dictamen de Cumplimiento Legal (LEGAL_REVIEW_NOTES)

**Fecha del Dictamen:** 27 de Octubre de 2026  
**Auditoría Realizada Por:** Equipo Senior Full-Stack & Cumplimiento Normativo Web  
**Entorno Operativo:** Persona Natural Independiente (Colombia)  
**Dominio Oficial:** [https://www.kyvora.net.co/](https://www.kyvora.net.co/)  

---

## 1. Alcance y Metodología de la Revisión

Este informe consolida las notas técnicas y jurídicas derivadas de la auditoría integral del sitio oficial de KYVORA. Con el propósito de mantener el más alto rigor profesional y de acuerdo con el principio de honestidad técnica, se clasifica el estado del proyecto en tres niveles estrictamente diferenciados:
1. **Cumplimiento Técnico (Comprobado y Verificado en Código)**.
2. **Cumplimiento Documental y Editorial (Textos y Políticas Oficiales Redactadas)**.
3. **Cuestiones Jurídicas y Fiscales que Requieren Validación Profesional del Propietario**.

---

## 2. Nivel 1: Cumplimiento Técnico (100% Implementado y Verificado)

El cumplimiento técnico abarca los mecanismos de software, arquitectura, seguridad y frontend que garantizan que el sitio web no vulnere los derechos del usuario ni exponga datos sensibles:

### 2.1. Consentimiento Previo y Separado (Ley 1581 de 2012)
- **Implementación:**
  - El formulario de contacto (`#contacto`) y el formulario oficial de radicación de PQRS (`/legal/pqrs`) incorporan una casilla de verificación (`checkbox`) obligatoria para autorizar el tratamiento de datos personales.
  - La casilla **NUNCA está preseleccionada** (no pre-checked), exigiendo un acto positivo e inequívoco del titular.
  - La autorización está **desagregada**: no se condiciona el envío de una consulta comercial a la aceptación de envíos publicitarios o boletines informativos no deseados.
  - Se enlaza directamente a la [Política de Tratamiento de Datos Personales](file:///c:/Proyectos/web-kyvora/src/app/legal/datos-personales/page.tsx).

### 2.2. Seguridad Transaccional e Integridad de Pagos (Wompi Colombia)
- **Implementación:**
  - Las firmas de integridad SHA-256 (`reference + amount_in_cents + currency + integrity_secret`) se calculan **exclusivamente en el servidor** ([src/lib/wompi.ts](file:///c:/Proyectos/web-kyvora/src/lib/wompi.ts)), imposibilitando que el navegador altere el importe a pagar.
  - Los webhooks de notificación se autentican mediante el checksum SHA-256 oficial de Wompi ([src/app/api/webhooks/wompi/route.ts](file:///c:/Proyectos/web-kyvora/src/app/api/webhooks/wompi/route.ts)).
  - Se implementó **procesamiento idempotente**: eventos duplicados enviados por Wompi no generan cobros dobles ni corrompen el estado transaccional.
  - La pantalla de retorno (`/donate/resultado`) consulta el estado real en el backend mediante `/api/donate/status` y no confía en parámetros manipulables de la URL.
  - **Cero almacenamiento de datos de pago:** Ni números de tarjetas, ni CVVs, ni claves bancarias pasan ni se almacenan en servidores de KYVORA.

### 2.3. Mecanismo Operativo de Reclamaciones (PQRS Trazables)
- **Implementación:**
  - En lugar de ser un texto estático informativo, `/legal/pqrs` es un módulo interactivo funcional.
  - Cada radicación genera un identificador oficial con marca temporal (`PQRS-KYV-YYYYMMDD-XXXX`).
  - El usuario recibe en pantalla la confirmación formal con los plazos legales de respuesta según la Ley 1755 de 2015 y la opción de **imprimir el comprobante de radicación**.

### 2.4. Accesibilidad, Responsive y Versión Imprimible
- **Implementación:**
  - Estilos de impresión optimizados en [globals.css](file:///c:/Proyectos/web-kyvora/src/app/globals.css) bajo `@media print`: ocultan barras de navegación, ajustan el texto a negro sobre fondo blanco puro y preservan la legibilidad sin cortes tipográficos.
  - Botón accesible `PrintButton` en la cabecera de todas las páginas legales.
  - Subnavegación interactiva en `LegalLayout.tsx` para alternar rápidamente entre los 8 apartados.
  - Cumplimiento de estándares de contraste WCAG AA y respeto a preferencias de movimiento reducido (`prefers-reduced-motion`).

---

## 3. Nivel 2: Cumplimiento Documental (100% Redactado y Publicado)

Comprende los textos normativos específicos elaborados para la actividad real de KYVORA:

1. **Política de Tratamiento de Datos Personales** ([/legal/datos-personales](file:///c:/Proyectos/web-kyvora/src/app/legal/datos-personales/page.tsx)):
   - 11 secciones estructuradas conforme a la Ley 1581 de 2012, Decreto 1377 de 2013 y Decreto 1074 de 2015.
   - Detalle de datos recogidos por categoría (contacto, donaciones, PQRS, logs de seguridad).
   - Plazos de 10 días hábiles (consultas) y 15 días hábiles (reclamos).
   - Identificación de encargados en el exterior (Vercel, Resend) y en Colombia (Wompi).
2. **Aviso de Privacidad** ([/legal/privacidad](file:///c:/Proyectos/web-kyvora/src/app/legal/privacidad/page.tsx)):
   - Síntesis clara y visible de finalidades y derechos para el consumidor.
3. **Términos y Condiciones de Uso** ([/legal/terminos](file:///c:/Proyectos/web-kyvora/src/app/legal/terminos/page.tsx)):
   - Reglas de uso, prohibición de ataques informáticos (Ley 1273 de 2009) y reserva de derechos de autor (Ley 23 de 1982).
4. **Condiciones de Contratación de Servicios** ([/legal/contratacion](file:///c:/Proyectos/web-kyvora/src/app/legal/contratacion/page.tsx)):
   - Proceso comercial en 6 etapas, formalización por medios electrónicos (Ley 527 de 1999), gestión de hitos, exclusión de costos de hosting y garantía técnica de 30 días.
5. **Pagos, Retracto y Reversión** ([/legal/pagos-reversiones](file:///c:/Proyectos/web-kyvora/src/app/legal/pagos-reversiones/page.tsx)):
   - Diferenciación jurídica entre cancelación, devolución, retracto (5 días hábiles, reintegro en 30 días calendario) y reversión del pago (Decreto 587 de 2016 ante 5 causales taxativas).
6. **Canal Oficial de PQRS** ([/legal/pqrs](file:///c:/Proyectos/web-kyvora/src/app/legal/pqrs/page.tsx)):
   - Módulo interactivo con soporte de radicado, plazos legales y escalamiento ante la SIC.
7. **Política de Cookies** ([/legal/cookies](file:///c:/Proyectos/web-kyvora/src/app/legal/cookies/page.tsx)):
   - Inventario transparente de cookies técnicas y almacenamiento local, sin falsas afirmaciones de analítica intrusiva ni píxeles inexistentes.
8. **Condiciones Legales de Donate Us** ([/legal/donate](file:///c:/Proyectos/web-kyvora/src/app/legal/donate/page.tsx)):
   - Aclaración expresa de que los aportes no son donaciones deducibles a una ESAL, sino mecenazgo voluntario para sostener investigación de código abierto.
9. **Superintendencia de Industria y Comercio**:
   - Enlace oficial y visible en pie de página y en todas las páginas legales a [https://www.sic.gov.co/](https://www.sic.gov.co/).

---

## 4. Nivel 3: Cuestiones Jurídicas y Fiscales que Requieren Validación Profesional del Propietario

Ninguna implementación de software sustituye el asesoramiento legal o contable individualizado. Se recomienda al propietario someter los siguientes puntos a revisión con su abogado y contador de confianza en Colombia:

### 4.1. Formalización Tributaria ante la DIAN
- **Punto de revisión:** Verificar el cumplimiento de los topes de ingresos brutos anuales (3.500 UVT) establecidos en el artículo 437 del Estatuto Tributario para mantener la calidad de *Persona Natural No Responsable de IVA*.
- **Acción recomendada:** Si la persona natural supera dichos topes o tiene más de un establecimiento de comercio, deberá inscribirse como Responsable de IVA e implementar el sistema de Facturación Electrónica de Venta con validación previa de la DIAN.

### 4.2. Registro Mercantil de Establecimiento de Comercio
- **Punto de revisión:** Evaluar ante la Cámara de Comercio correspondiente si la explotación continua del nombre comercial **KYVORA** amerita la matrícula de un establecimiento de comercio o matrícula de persona natural comerciante (Código de Comercio, artículo 19 numeral 1).
- **Acción recomendada:** Una vez obtenida la matrícula mercantil, incluir el número de matrícula en `src/config/legal.ts` para fortalecer la transparencia institucional.

### 4.3. Tratamiento Contable y Declaración de Renta de los Aportes de Donate Us
- **Punto de revisión:** Los dineros ingresados a la cuenta bancaria por concepto de mecenazgo voluntario a través de Wompi constituyen ingresos propios para la persona natural.
- **Acción recomendada:** El contador del propietario debe definir si se clasifican como ingresos de la Cédula General (subcédula de rentas no laborales o rentas de trabajo) o si se consideran ganancias ocasionales / donaciones civiles (artículo 1443 del Código Civil), garantizando la adecuada retención en la fuente e inclusión en la declaración de renta anual.

### 4.4. Registro Nacional de Bases de Datos (RNBD) de la SIC
- **Punto de revisión:** La Ley 1581 de 2012 y el Decreto 090 de 2018 establecen que la obligación de inscribir bases de datos en el RNBD de la SIC aplica a personas jurídicas con activos totales superiores a 100.000 UVT.
- **Acción recomendada:** Confirmar con el asesor legal que, en su condición actual de persona natural independiente con volumen operativo inicial, KYVORA se encuentra exenta de dicha inscripción obligatoria, manteniendo intacto el deber de cumplir con las políticas de tratamiento y atención de Hábeas Data.

---

## 5. Dictamen Final de Ingeniería y Preparación para Producción

El sitio web oficial de KYVORA cuenta con una **infraestructura legal sólida, responsable, verificable y completamente adaptada a la legislación colombiana**. 

No existen enlaces rotos, páginas vacías ni afirmaciones falsas. El proyecto está listo para compilarse y desplegarse en producción en Vercel una vez el propietario ingrese sus datos de identificación en el archivo de configuración centralizado.
