# KYVORA — Matriz de Pruebas de Calidad y Seguridad

Este documento resume los escenarios de prueba ejecutados, los métodos de validación aplicados y los resultados obtenidos en el proceso de QA de la plataforma.

---

## 1. Suite de Pruebas Automatizadas de Seguridad & Criptografía (`npm test`)

Comando ejecutado: `node scripts/test-wompi-and-security.js`
Resultado: **12 pasaron, 0 fallaron**.

| ID | Caso de Prueba | Categoría | Entrada / Escenario | Comportamiento Esperado | Resultado |
|---|---|---|---|---|---|
| **TC-01** | Firma de Integridad SHA-256 | Criptografía | Referencia `TEST-001`, monto 50.000 COP, secreto de integridad | Generación de hash SHA-256 de 64 caracteres hexadecimales | **PASS** |
| **TC-02** | Detección de Manipulación en Cliente | Seguridad | Monto alterado en frontend tras el cálculo de firma | Las firmas no coinciden; la transacción manipulada es rechazada | **PASS** |
| **TC-03** | Autenticación de Webhook Legítimo | Criptografía | Evento `transaction.updated` con properties y secreto de eventos oficial | Validación exitosa del checksum SHA-256 | **PASS** |
| **TC-04** | Detección de Payload Alterado en Webhook | Seguridad | Checksum modificado por atacante en el payload | El backend detecta la alteración y rechaza el evento | **PASS** |
| **TC-05** | Rechazo por Secreto de Eventos Erróneo | Seguridad | Webhook firmado con clave incorrecta | Autenticación denegada (`isValid === false`) | **PASS** |
| **TC-06** | Transición de Estado a Aprobado | Negocio | Evento con estado `APPROVED` para referencia existente | Estado transiciona de `PENDING` a `APPROVED` en el almacén | **PASS** |
| **TC-07** | Idempotencia frente a Eventos Repetidos | Fiabilidad | Envío múltiple del mismo evento de webhook | El segundo evento se reconoce como ya procesado sin efectos colaterales | **PASS** |
| **TC-08** | Validación de Monto en Webhook | Seguridad | Webhook con monto diferente al registrado al inicio | El backend detecta la discrepancia y emite alerta de seguridad | **PASS** |
| **TC-09** | Referencia Inexistente | Resiliencia | Notificación para una referencia que nunca fue creada | Devuelve error 404 de no encontrado | **PASS** |
| **TC-10** | Límite Mínimo de Aporte | Validación | Aporte de $5.000 COP (inferior al mínimo de $10.000 COP) | Rechazo con mensaje descriptivo de límite mínimo | **PASS** |
| **TC-11** | Monto Válido en Rango Permitido | Negocio | Aporte de $20.000 COP | Aceptado correctamente para procesamiento | **PASS** |
| **TC-12** | Límite Máximo de Aporte | Seguridad | Aporte de $60.000.000 COP (superior a $50.000.000 COP) | Rechazo por exceder el tope máximo fijado | **PASS** |

---

## 2. Pruebas de Calidad Estática de Código y Compilación

| Prueba | Comando | Herramienta | Criterio de Éxito | Resultado |
|---|---|---|---|---|
| **Linting de Código** | `npm run lint` | ESLint 9 + TypeScript ESLint | 0 errores, 0 advertencias | **EXITOSO** (0 problemas) |
| **Verificación de Tipos** | `npm run build` | TypeScript `tsc` | 0 errores de tipos TS | **EXITOSO** |
| **Compilación de Producción** | `npm run build` | Next.js 16 (Webpack) | Generación exitosa de las 19 rutas de la aplicación | **EXITOSO** (7.2s build time) |

---

## 3. Pruebas de Renderizado Visual y Diseño Responsive

Verificación ejecutada mediante subagente de navegación automatizado y renderizado en vivo en servidor de producción (`localhost:3000`):

| Viewport (Ancho x Alto) | Dispositivo Referencia | Aspectos Auditados | Resultado |
|---|---|---|---|
| **320 px** | Dispositivo móvil ultra-compacto | Sin desbordamiento horizontal, titular legible, botones táctiles fluidos. | **APROBADO** |
| **375 px** | iPhone SE / Estándar móvil compacto | Menú hamburguesa accesible, tarjetas de servicios en 1 columna, resumen de aportes adaptativo. | **APROBADO** |
| **390 px** | iPhone 14/15 | Retícula tipográfica proporcionada, espaciados generosos. | **APROBADO** |
| **768 px** | Tablet vertical (iPad mini) | Disposición de servicios en cuadrícula 2x2, navegación clara. | **APROBADO** |
| **1024 px** | Laptop compacta / iPad Pro horizontal | Menú de navegación completo en header, cuadrícula de proyectos con capturas completas. | **APROBADO** |
| **1440 px** | Pantalla de escritorio amplia | Contenedores centrados con `max-w-7xl`, márgenes de respiración, sin distorsión de elementos. | **APROBADO** |

---

## 4. Pruebas de Accesibilidad y Usabilidad

- **Navegación por Teclado**: Todo botón, enlace y campo de formulario puede recibir foco secuencial mediante la tecla `Tab` con indicador de foco visible (`focus-visible:ring-2`).
- **Preferencia de Movimiento Reducido (`prefers-reduced-motion`)**: Declarada regla global en `globals.css` que desactiva transiciones complejas y animaciones continuas para usuarios con sensibilidad vestibular.
- **Contraste de Color**: Textos principales en blanco puro `#FFFFFF` y secundario `#9CA3AF` sobre fondo `#030712`, superando el ratio de contraste WCAG AA (mínimo 4.5:1 para texto normal y 7:1 para titulares).
- **Semántica HTML**: Uso estricto de elementos `<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`, `<h1>` único en el Hero y jerarquía ordenada de `<h2>` a `<h4>`.

---

## 5. Pruebas de Navegación Legal y Flujos

- [x] Navegación desde el pie de página hacia las 8 rutas legales (`/legal/datos-personales`, `/legal/privacidad`, `/legal/terminos`, `/legal/contratacion`, `/legal/pagos-reversiones`, `/legal/pqrs`, `/legal/cookies`, `/legal/donate`).
- [x] Retorno seguro al inicio mediante botón con icono de flecha y enlace de inicio.
- [x] Enlace saliente verificado y accesible a la Superintendencia de Industria y Comercio (`https://www.sic.gov.co/`).
- [x] Formulario interactivo de radicación de PQRS con generación instantánea de código de radicado único (`PQRS-KYV-...`) y recordatorio del término legal de 15 días hábiles.
