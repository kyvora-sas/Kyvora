# KYVORA — Requerimiento de Datos Legales y Tributarios del Responsable (LEGAL_DATA_REQUIRED)

**Estado:** Documento de Control y Auditoría Interna  
**Fecha de Emisión:** 27 de Octubre de 2026  
**Entorno del Negocio:** Persona Natural Independiente en Colombia  
**Archivo Centralizado de Configuración:** `src/config/legal.ts`

---

## 1. Principio Rector: Honestidad y Veracidad de la Información

En cumplimiento de las normas éticas de ingeniería y del principio de veracidad o calidad del artículo 4 literal d) de la Ley Estatutaria 1581 de 2012 y del artículo 23 de la Ley 1480 de 2011, **KYVORA no publica información engañosa, sociedades mercantiles inexistentes (S.A.S., Ltda.), números de matrícula falsos ni domicilios no verificados**.

La plataforma opera bajo un **mecanismo de configuración centralizada** en `src/config/legal.ts`. Toda la información pendiente del operador se encuentra rotulada con marcadores visibles `[PENDIENTE_...]` para evitar que se interprete como dato definitivo antes de que el propietario la complete.

---

## 2. Clasificación de Datos: Información Pública Exigible vs. Datos Internos Reservados

Para proteger la seguridad personal del operador sin infringir los deberes de información comercial frente al consumidor (artículo 50 de la Ley 1480 de 2011 y Circular Única de la SIC), se distingue rigurosamente qué información debe publicarse en el portal y qué datos son de custodia privada:

### 2.1. Información Legal que DEBE Publicarse en el Sitio Web
| Dato Requerido | Variable en `src/config/legal.ts` | Fundamento Legal en Colombia | Justificación y Finalidad | Estado Actual |
|---|---|---|---|---|
| **Nombre o Razón Comercial** | `legalConfig.brandName` / `tradeName` | Art. 50 lit. a) Ley 1480/2011 | Identificación del oferente ante el público consumidor | **DEFINIDO:** KYVORA / KYVORA Studio & Software |
| **Nombre Completo del Operador (Persona Natural)** | `legalConfig.owner.legalRepresentative` | Art. 50 lit. a) Ley 1480/2011 | Individualización del sujeto de derecho responsable de la operación | **PENDIENTE:** Requiere nombre y apellidos del propietario |
| **Tipo y Número de Identificación (C.C. / NIT)** | `legalConfig.owner.idPlaceholder` / `rutPlaceholder` | Art. 50 lit. a) Ley 1480/2011 | Certeza jurídica y tributaria para contratación y facturación | **PENDIENTE:** Requiere C.C. o NIT con RUT |
| **Ciudad y País de Domicilio** | `legalConfig.owner.cityDomicile` | Art. 50 lit. a) Ley 1480/2011 | Determinación de la jurisdicción y competencia judicial en Colombia | **PENDIENTE:** Requiere ciudad (Ej. Bogotá D.C. / Medellín) |
| **Dirección Física de Notificación Judicial** | `legalConfig.owner.physicalAddressPlaceholder` | Art. 50 lit. a) Ley 1480/2011 | Lugar para recepción de correspondencia formal o notificaciones judiciales | **PENDIENTE:** Requiere dirección física formal |
| **Correo Electrónico Oficial de Contacto y PQRS** | `legalConfig.owner.contactEmail` / `legalEmail` | Art. 50 lit. c) Ley 1480/2011 & Ley 1755/2015 | Canal para radicación de peticiones, quejas y derechos de Hábeas Data | **DEFINIDO Y VERIFICADO:** `kyvorasas@gmail.com` |
| **Línea Telefónica / WhatsApp de Atención** | `legalConfig.owner.phone` | Art. 50 lit. c) Ley 1480/2011 | Canal directo y accesible de comunicación con el consumidor | **DEFINIDO Y VERIFICADO:** `+57 315 201 1203` |
| **Enlace Visible a la Autoridad de Vigilancia (SIC)** | `legalConfig.supervisoryAuthority.portalUrl` | Art. 50 lit. d) Ley 1480/2011 | Acceso permanente del consumidor al portal de la SIC | **DEFINIDO Y VERIFICADO:** `https://www.sic.gov.co/` |

---

### 2.2. Datos de Custodia Interna Privada (NUNCA Exponer en Código Fuente ni Repositorio)
| Dato / Secreto | Variable de Entorno | Riesgo si se Expone | Medida de Mitigación Implementada |
|---|---|---|---|
| **Secreto de Integridad de Wompi** | `WOMPI_INTEGRITY_SECRET` | Manipulación de montos de transacciones por terceros | Confinado al servidor (`route.ts`). Nunca prefijado con `NEXT_PUBLIC_`. |
| **Secreto de Eventos / Checksum Webhooks Wompi** | `WOMPI_EVENTS_SECRET` | Falsificación de eventos de pago aprobado | Verificación criptográfica aislada en `/api/webhooks/wompi`. |
| **API Key de Resend (Email)** | `RESEND_API_KEY` | Envío no autorizado de correos masivos / spam | Custodiado en `.env.local` / Variables de entorno de Vercel. |
| **Número de Cuenta Bancaria para Dispersión Wompi** | N/A (Solo en plataforma Wompi) | Fraude financiero | Administrado exclusivamente en el portal oficial bancario de Wompi. |

---

## 3. Decisiones Tributarias y Comerciales por Confirmar por el Propietario

Antes de dar inicio a operaciones con cobros reales en producción, el propietario de KYVORA debe resolver y documentar:

1. **Régimen Tributario del IVA ante la DIAN**:
   - Confirmar si como persona natural cumple los requisitos del artículo 437 del Estatuto Tributario para operar como *No Responsable del Impuesto sobre las Ventas (IVA)* (antiguo régimen simplificado).
   - De ser No Responsable, las cuentas de cobro emitidas deben incluir la leyenda de no responsabilidad de IVA y adjuntar el RUT.
2. **Matrícula Mercantil de Comerciante / Establecimiento**:
   - Si la actividad de desarrollo de software se ejerce de manera habitual y profesional, el propietario debe validar ante la Cámara de Comercio de su ciudad la conveniencia de matricularse como persona natural comerciante o inscribir un establecimiento de comercio bajo el nombre KYVORA.
3. **Tratamiento Fiscal de los Aportes Voluntarios (Donate Us)**:
   - Los aportes recaudados en la cuenta bancaria constituyen ingresos brutos para la persona natural receptora. El propietario debe coordinar con su contador público o asesor tributario la clasificación de dichos ingresos en su Declaración de Renta anual (cédula general / rentas de trabajo o no laborales).

---

## 4. Instrucción de Actualización Centralizada

Para completar los datos sin tocar cada una de las 8 páginas legales, el propietario debe editar únicamente el archivo:
`src/config/legal.ts`

```typescript
export const legalConfig = {
  brandName: "KYVORA",
  tradeName: "KYVORA Studio & Software",
  commercialActivity: "Servicios de desarrollo de software, diseño de interfaces, aplicaciones y consultoría técnica.",
  
  owner: {
    legalStatus: "Persona Natural Independiente (Colombia)",
    legalRepresentative: "NOMBRE Y APELLIDOS DEL PROPIETARIO",
    idPlaceholder: "C.C. X.XXX.XXX.XXX de [Ciudad]",
    rutPlaceholder: "NIT / RUT XXXXXXXXX-X",
    cityDomicile: "[Ciudad], Colombia",
    physicalAddressPlaceholder: "Calle XX # XX - XX, Oficina/Apto XXX, [Ciudad]",
    contactEmail: "kyvorasas@gmail.com",
    legalEmail: "kyvorasas@gmail.com",
    phone: "+57 315 201 1203",
  },
  ...
};
```
Una vez actualizado, Next.js propagará de inmediato la información a todas las rutas `/legal/*`, metadatos, vouchers imprimibles y pie de página.
