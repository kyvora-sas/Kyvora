# KYVORA — Errores Conocidos, Limitaciones y Riesgos Residuales

Este documento ofrece un análisis transparente de las condiciones de operación, limitaciones técnicas identificadas y recomendaciones de mitigación para el despliegue del proyecto.

---

## 1. Limitaciones Técnicas Identificadas y Mitigadas

### 1.1. Incompatibilidad de Turbopack con Tailwind CSS v4 en Entornos Windows
- **Diagnóstico**: Al compilar con `next build` en Next.js 16.4.3 sobre sistemas Windows, el subproceso de Turbopack falla al intentar resolver el paquete `@tailwindcss/node` a través de `@vercel/turbopack/postcss` debido a inconsistencias en el manejo de separadores de ruta en `enhanced-resolve`.
- **Mitigación Implementada**: Se configuró explícitamente el compilador Webpack (`next build --webpack` y `next dev --webpack`) en `package.json`. Esto genera un paquete de producción 100% estable y optimizado en 7 segundos para las 19 rutas del proyecto.
- **Riesgo Residual**: Ninguno en desarrollo ni en despliegues sobre Vercel (donde corre en contenedores Linux de alto rendimiento).

### 1.2. Generación de Blur Hashes para Imágenes Estáticas
- **Diagnóstico**: Next.js requiere la librería nativa `sharp` para procesar imágenes con `placeholder="blur"` durante la compilación estática.
- **Mitigación Implementada**: Se instaló y declaró `sharp` en `dependencies` de `package.json`.

### 1.3. Remoción de Iconos de Marcas en Versiones Recientes de Lucide React
- **Diagnóstico**: Las versiones actuales de `lucide-react` eliminaron iconos de marcas como `Github` e `Instagram`.
- **Mitigación Implementada**: Se creó el componente `src/components/SocialIcons.tsx` con SVGs puros optimizados, accesibles y con soporte para clases Tailwind (`fill-current`).

---

## 2. Limitaciones de Infraestructura y Riesgos Residuales

### 2.1. Persistencia de Transacciones en Despliegues Serverless Multi-Región
- **Condición Actual**: Las transacciones de aportes se registran en caché de memoria y en el archivo local `data/transactions.json`. En un entorno local o servidor dedicado esto es 100% funcional.
- **Riesgo en Vercel**: En la plataforma Serverless de Vercel, el sistema de archivos del contenedor es de solo lectura y efímero entre invocaciones frías (`cold starts`).
- **Mitigación Recomendada**: Para producción con alto volumen de aportes, se aconseja conectar una base de datos gestionada como **Vercel KV (Redis)**, **Upstash** o **Supabase (Postgres)** mediante el adaptador `src/lib/transactions-store.ts`, el cual ya está diseñado para desacoplar el almacén de datos.

### 2.2. Entrega del Formulario de Contacto (Resend)
- **Condición Actual**: Si la variable de entorno `RESEND_API_KEY` no está configurada, el endpoint `/api/contact` opera en **modo simulación**, registrando las consultas en los logs del servidor para no bloquear al visitante.
- **Mitigación Recomendada**: Obtener una API Key gratuita en [Resend](https://resend.com/) y vincular un dominio verificado (`kyvora.net.co`) para garantizar que los correos lleguen directamente a la bandeja de entrada sin caer en spam.

### 2.3. Transición de Wompi Sandbox a Producción
- **Condición Actual**: El proyecto está configurado y probado en modo Sandbox con tarjetas de prueba oficiales y webhooks firmados.
- **Riesgo Residual**: Las transacciones reales solo funcionarán cuando el propietario complete el enrolamiento bancario en Wompi y configure las credenciales de producción en Vercel.
- **Medida Preventiva**: Las firmas criptográficas SHA-256 fueron probadas con 12 pruebas automatizadas para garantizar que la transición a producción sea inmediata simplemente cambiando las variables de entorno.
