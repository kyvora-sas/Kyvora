# KYVORA `/recursos` — Guía de Arquitectura y Publicación Editorial

Documentación técnica y editorial para mantener, revisar y ampliar la sección bilingüe **`/recursos`** de `www.kyvora.net.co`.

---

## 1. Arquitectura de Rutas e Idiomas (ES / EN)

Para evitar contenido duplicado entre idiomas en Google y ofrecer URLs limpias por intención de búsqueda:

* **Hub en Español:** `/recursos` (`canonical: https://www.kyvora.net.co/recursos`)
* **Artículos individuales (ES):** `/recursos/[slug-espanol]`
* **Hub en Inglés:** `/recursos/en` (`canonical: https://www.kyvora.net.co/recursos/en`)
* **Artículos individuales (EN):** `/recursos/en/[slug-ingles]`

Cada ruta declara automáticamente:
1. `<link rel="canonical">` propio de su idioma mediante Next Metadata API.
2. Enlaces alternativos `hreflang` (`es` y `en`) sincronizados entre la versión en español y su contraparte exacta en inglés.
3. Datos estructurados JSON-LD (`BlogPosting` + `BreadcrumbList`) sanitizados con `.replace(/</g, "\\u003c")`.
4. Preselección directa hacia `/#contacto` con `?service=...` según el servicio de KYVORA Studio más afín al artículo.

---

## 2. Estructura de Archivos

* `src/content/recursos/types.ts`: Esquema tipado de artículos (`ResourceArticle`, `LocalizedArticleContent`, `ResourceBlock`).
* `src/content/recursos/articles.ts`: Repositorio de artículos y bloques estructurados (`heading`, `paragraph`, `list`, `table`, `callout`, `code`, `figure`).
* `src/content/recursos/helpers.ts`: Utilidades de consulta (`getPublishedArticles`, `getArticleBySlug`, `resolveAlternateRecursosPath`).
* `src/components/recursos/ResourceCard.tsx`: Tarjeta del índice editorial.
* `src/components/recursos/ArticleRenderer.tsx`: Renderizador de tablas, listas, llamados, código e imágenes optimizadas.
* `src/components/recursos/ResourcesHubClient.tsx`: Hub interactivo con filtro por categoría y selector bilingüe.
* `src/components/recursos/ResourceArticleView.tsx`: Vista de lectura editorial con tabla de contenido lateral, CTA a Studio y JSON-LD.
* `src/app/sitemap.ts`: Incorpora `/recursos`, `/recursos/en` y todos los artículos con `published: true`.

---

## 3. Cómo incorporar un nuevo artículo (Paso a paso)

1. Abrir [`src/content/recursos/articles.ts`](../src/content/recursos/articles.ts).
2. Agregar un nuevo objeto al arreglo `resourceArticles` siguiendo la interfaz `ResourceArticle`:
   * **`id`**: identificador interno único en kebab-case.
   * **`category`**: `"costos"` | `"arquitectura"` | `"ia-automatizacion"`.
   * **`published`**: mantener en `false` mientras esté en borrador; cambiar a `true` solo después de revisión editorial y técnica.
   * **`publishedAt` y `updatedAt`**: fechas reales en formato `YYYY-MM-DD`.
   * **`relatedServiceValue`**: debe coincidir con una opción válida del formulario de contacto (`"Landing Page / Web"`, `"Aplicación Web/Móvil"`, `"Sistema a Medida"`, `"Automatización / IA"`, `"Otro"`).
   * **`es` y `en`**: completar slugs únicos y descriptivos sin tildes ni caracteres especiales, `seoTitle`, `metaDescription` (entre 135 y 160 caracteres aprox.), `excerpt`, `keywords`, CTA contextual y `blocks`.
3. Ejecutar verificación técnica antes de publicar:
   * `npm run lint`
   * `npx tsc --noEmit`
   * `npm run build` (confirmar que `generateStaticParams` genera la ruta estática en `/recursos/[slug]` y `/recursos/en/[slug]`)

---

## 4. Criterios de Calidad Editorial (No negociables)

* **Cero relleno ni contenido genérico:** cada artículo debe responder una duda real de negocio o arquitectura con ejemplos claros, tablas comparativas o listas accionables.
* **Cero datos inventados:** prohibido fabricar estadísticas de mercado, porcentajes no verificados, casos ficticios o métricas inventadas de clientes.
* **Hechos vs. criterio:** cuando se incluyan rangos de precios o tiempos referenciales, aclarar explícitamente si son referencias de KYVORA Studio y qué costos corresponden a terceros (dominio, hosting, pasarelas, tokens).
* **Imágenes verificables:** si se usa el bloque `figure`, emplear capturas reales o esquemas propios en `public/` o recursos importados, nunca gráficos genéricos de stock sin relación técnica.

---

## 5. Backlog Editorial Propuesto (Pendiente de Revisión antes de Publicar)

Se publicaron primero **3 guías fundacionales** para asegurar profundidad real. Los siguientes **4 temas aprobados en la hoja de ruta** quedan documentados como próximos artículos a redactar y revisar antes de activar `published: true`:

1. **Cómo saber si tu negocio necesita un sistema de inventario** (`category: "arquitectura"`, enlace a *Sistema a Medida*) — enfocado en señales operativas reales frente a hojas de cálculo y trazabilidad.
2. **Automatización de procesos empresariales: qué se puede automatizar y cuándo conviene** (`category: "ia-automatizacion"`, enlace a *Automatización / IA*) — flujos repetitivos, APIs, webhooks y evaluación de retorno operativo real.
3. **Software a medida vs. herramientas comerciales** (`category: "costos"`, enlace a *Sistema a Medida*) — cuándo conviene adaptar un SaaS existente y cuándo justifica construir software propio.
4. **Qué debes considerar antes de desarrollar una aplicación móvil** (`category: "arquitectura"`, enlace a *Aplicación Web/Móvil*) — PWA vs. móvil nativa/híbrida, costos reales de tiendas (App Store / Google Play) y mantenimiento.

