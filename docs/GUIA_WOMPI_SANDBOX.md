# KYVORA — Guía de Pruebas y Configuración de Wompi Colombia (Sandbox y Producción)

Esta guía explica en detalle cómo configurar, probar y migrar a producción el módulo de aportes voluntarios ("Donate Us") utilizando la pasarela oficial **Wompi Colombia**.

---

## 1. Obtención de Credenciales de Sandbox

1. Ingresa a la plataforma de comercios de Wompi: [https://comercios.wompi.co/](https://comercios.wompi.co/)
2. Crea una cuenta o inicia sesión.
3. Activa el interruptor a modo **Sandbox** (Entorno de Pruebas).
4. Ve a la sección **Desarrolladores > Llaves de API**:
   - **Llave pública**: Comienza por `pub_test_...`
   - **Secreto de integridad**: Comienza por `test_integrity_...`
   - **Secreto de eventos**: Comienza por `test_events_...`
5. Copia estos valores a tu archivo local `.env.local`:
   ```bash
   NEXT_PUBLIC_WOMPI_ENVIRONMENT=sandbox
   NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_TU_LLAVE_AQUI
   WOMPI_INTEGRITY_SECRET=test_integrity_TU_SECRETO_AQUI
   WOMPI_EVENTS_SECRET=test_events_TU_SECRETO_AQUI
   ```

---

## 2. Configuración de la URL de Webhook de Eventos

Wompi requiere saber a dónde notificar cuando una transacción cambia de estado.

1. En el panel de Wompi Sandbox, dirígete a **Desarrolladores > URL de Eventos**.
2. **Para pruebas locales con túnel**:
   - Si estás probando localmente, puedes usar una herramienta como `ngrok` o `cloudflared`:
     ```bash
     npx ngrok http 3000
     ```
   - Registra en Wompi la URL pública generada:
     ```
     https://tu-subdominio.ngrok-free.app/api/webhooks/wompi
     ```
3. **Para despliegues en Vercel (Preview o Producción)**:
   - Registra tu URL oficial:
     ```
     https://www.kyvora.net.co/api/webhooks/wompi
     ```

---

## 3. Tarjetas de Prueba Oficiales de Wompi (Sandbox)

Para simular pagos con tarjeta de crédito o débito en el checkout de Wompi, utiliza los siguientes datos oficiales provistos por Wompi:

### 3.1. Pagos Aprobados (APPROVED)
| Franquicia | Número de Tarjeta | Fecha Vencimiento | CVC | Nombre |
|---|---|---|---|---|
| **Visa** | `4242 4242 4242 4242` | Cualquier fecha futura (ej. `12/28`) | `123` | Juan Pérez |
| **MasterCard** | `5555 5555 5555 4444` | Cualquier fecha futura (ej. `10/29`) | `456` | María Gómez |

### 3.2. Pagos Rechazados (DECLINED)
| Razón del Rechazo | Número de Tarjeta | Fecha Vencimiento | CVC |
|---|---|---|---|
| Fondos Insuficientes | `4000 0000 0000 0001` | Fecha futura | `123` |
| Tarjeta Bloqueada / Inválida | `4000 0000 0000 0002` | Fecha futura | `123` |
| Sospecha de Fraude | `4000 0000 0000 0003` | Fecha futura | `123` |

### 3.3. Pruebas con PSE (Sandbox)
1. En el checkout de Wompi, selecciona **PSE**.
2. Selecciona cualquier banco de la lista (ej. Bancolombia, Davivienda).
3. Introduce cualquier correo electrónico y número de cédula de prueba.
4. En el simulador de Wompi PSE, haz clic en **Aprobar transacción** o **Rechazar transacción**.

---

## 4. Verificación del Flujo Completo

1. Abre el sitio en `http://localhost:3000/#donate`.
2. Selecciona un destino (ej. *Fondo General* o *Pulso*).
3. Haz clic en un chip de monto (ej. `$50.000 COP`) o introduce una cantidad válida.
4. Presiona el botón **Continuar al Pago Seguro**.
5. Se abrirá la ventana de checkout alojado oficial de Wompi.
6. Realiza el pago utilizando una tarjeta de prueba de la sección 3.
7. Al completarse, Wompi te redirigirá a:
   ```
   http://localhost:3000/donate/resultado?reference=KYV-DON-...&id=...
   ```
8. La página consultará al servidor en `/api/donate/status` y mostrará la pantalla con el sello verde de **APORTE APROBADO**, el resumen del destino y la opción de volver al inicio.

---

## 5. Simulación Automatizada con Suite de Pruebas

El repositorio incluye una suite automatizada para validar la criptografía y la seguridad de Wompi sin necesidad de interactuar manualmente con el navegador:
```bash
npm test
```
Esta suite verifica:
- Generación de firma SHA-256 de 64 caracteres.
- Detección de firmas inválidas si el cliente intenta modificar el monto.
- Autenticación criptográfica de webhooks mediante concatenación de propiedades y secreto de eventos.
- Idempotencia transaccional (ignorar eventos duplicados).
- Rechazo de importes menores a `$10.000 COP` o superiores a `$50.000.000 COP`.

---

## 6. Lista de Verificación para Paso a Producción

Antes de cambiar a producción, el propietario debe:
- [ ] Completar la vinculación de su cuenta bancaria colombiana en el panel de Wompi y recibir la aprobación de vinculación comercial.
- [ ] Obtener las llaves de producción (`pub_prod_...`, `prod_integrity_...`, `prod_events_...`).
- [ ] Configurar las variables de producción en el panel de Vercel:
  ```
  NEXT_PUBLIC_WOMPI_ENVIRONMENT=production
  NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_prod_...
  WOMPI_INTEGRITY_SECRET=prod_integrity_...
  WOMPI_EVENTS_SECRET=prod_events_...
  ```
- [ ] Registrar en el panel de producción de Wompi la URL de eventos:
  `https://www.kyvora.net.co/api/webhooks/wompi`.
- [ ] Realizar un aporte voluntario real de bajo valor (ej. $10.000 COP) para verificar la acreditación bancaria en vivo.
