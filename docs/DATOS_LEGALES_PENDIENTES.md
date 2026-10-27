# KYVORA — Lista de Información Legal Pendiente de Completar

De acuerdo con las instrucciones éticas y profesionales del proyecto, **no se inventaron nombres de empresas ficticias, NITs no registrados, matrículas mercantiles falsas ni domicilios no verificados**. KYVORA está operada como actividad comercial independiente por una persona natural en Colombia.

Para garantizar el cumplimiento riguroso de la legislación colombiana (Estatuto del Consumidor - Ley 1480 de 2011, Ley de Comercio Electrónico - Ley 2439 de 2024 y Ley de Datos Personales - Ley 1581 de 2012), el propietario del sitio debe suministrar los siguientes datos en el archivo centralizado `src/config/legal.ts`.

---

## 1. Datos de Identificación del Operador

| Dato Requerido | Valor Temporal en Código | Fundamento Legal | Dónde se Configura |
|---|---|---|---|
| **Nombre Completo del Operador** | `[PENDIENTE_NOMBRE_DEL_RESPONSABLE]` | Art. 50 Ley 1480/2011 (Información al consumidor en comercio electrónico) | `src/config/legal.ts` -> `legalConfig.legalName` |
| **Tipo y Número de Identificación** | `[PENDIENTE_NUMERO_DE_IDENTIFICACION]` | C.C. o NIT de persona natural con RUT ante la DIAN | `src/config/legal.ts` -> `legalConfig.idNumber` |
| **Domicilio / Ciudad de Operación** | `[PENDIENTE_CIUDAD_DE_OPERACION]` | Fijación de jurisdicción legal y notificaciones en Colombia | `src/config/legal.ts` -> `legalConfig.city` |
| **Dirección Física de Notificación** | `[PENDIENTE_DIRECCION_DE_NOTIFICACION]` | Art. 50 literal a) Ley 1480/2011 para notificaciones judiciales | `src/config/legal.ts` -> `legalConfig.physicalAddress` |
| **Teléfono Oficial de Notificaciones** | `+57 315 201 1203` (Verificado de WhatsApp) | Canal directo de atención y PQRS | `src/config/legal.ts` -> `legalConfig.phone` |
| **Correo Electrónico de Contacto Legal** | `kyvorasas@gmail.com` (Verificado) | Canal para recepción de PQRS y derechos de Hábeas Data | `src/config/legal.ts` -> `legalConfig.email` |

---

## 2. Decisiones Comerciales y Tributarias por Definir por el Propietario

1. **Régimen Tributario del Operador**:
   - Confirmar si la persona natural pertenece al *Régimen No Responsable de IVA* (antiguo régimen simplificado) o al *Régimen Responsable de IVA* (antiguo régimen común) ante la DIAN, para incluir la mención correspondiente en las facturas o cuentas de cobro generadas.
2. **Registro de Matrícula Mercantil**:
   - Si la persona natural tiene matrícula mercantil activa como comerciante o establecimiento de comercio ante la Cámara de Comercio correspondiente, suministrar el número de matrícula para incorporarlo en el pie de página y términos de contratación.
3. **Cuenta de Acreditación de Wompi**:
   - Completar el proceso de enrolamiento bancario en la plataforma de Wompi para asociar la cuenta de ahorros o corriente colombiana donde se recibirán los fondos recaudados tanto de los aportes voluntarios como de servicios cotizados.

---

## 3. Instrucciones para Actualizar los Datos

Una vez el propietario cuente con los datos definitivos, únicamente debe abrir el archivo:
`src/config/legal.ts`

Y reemplazar los marcadores:
```typescript
export const legalConfig = {
  brandName: "KYVORA",
  legalName: "NOMBRE REAL DEL PROPIETARIO", // Reemplazar aquí
  idType: "C.C.",                          // C.C. o NIT
  idNumber: "XXXXXXXXX",                   // Reemplazar aquí
  physicalAddress: "Calle XX # XX - XX",  // Reemplazar aquí
  city: "Bogotá D.C., Colombia",           // Reemplazar aquí
  ...
};
```
Todos los textos de las 8 páginas legales (`/legal/*`), los avisos de privacidad y los descargos se actualizarán automáticamente sin necesidad de editar páginas individuales.
