# Features por implementar — lamelas-web (sitio público)

**Última revisión:** 2026-09-27

Backlog exclusivo de **este repo** (SPA de Vite + React, desplegada en Vercel).
Los items de la API van en `back-lamelas/docs/features.md`, los del panel en
`lamelas/docs/features.md` y los de Sofía/n8n en
`lamelas-agent/docs/features.md`.

Formato de cada item: **qué es**, **ventaja** de hacerlo, **viabilidad**
(esfuerzo S/M/L y qué se toca) y **estado**.

## Índice

| ID | Item | Esfuerzo | Estado |
|---|---|:---:|---|
| OG-DINAMICO-01 | Foto de la propiedad al compartir el link | M | pendiente — pedido del cliente |
| ZONA-FILTRO-01 | Filtro de zona sin duplicados | S | pendiente (depende de datos) |

---

## OG-DINAMICO-01 — foto de la propiedad al compartir el link

**Qué es.** Pedido de los empleados de la inmobiliaria (2026-09-20): al pegar el
link de una propiedad en WhatsApp, que la vista previa muestre **una foto de esa
propiedad**, no la imagen institucional.

Hoy no puede funcionar por cómo está armado el sitio: es una SPA con el rewrite
`/(.*) → /index.html` (`vercel.json`), y `useSeo()` (`src/lib/seo.ts`) escribe
`og:title`, `og:description` y `og:image` **con JavaScript**, después de que
`fetchPropertyBySlug()` trae la propiedad. El crawler de WhatsApp y de Facebook no
ejecuta JavaScript: lee el `index.html` estático y se queda con el
`og:image` institucional (`https://i.postimg.cc/…/hero.webp`).

**Ventaja.** Es el pedido más concreto que hicieron los empleados y les ahorra
trabajo todos los días: hoy, para saber de qué propiedad es un link, tienen que
abrirlo. También mejora el link cuando lo comparte el cliente final, que es
difusión gratis, y de paso arregla el SEO de las fichas (Google tampoco ve los
meta que se escriben por JS con la misma confiabilidad).

**Viabilidad.** M, ~3–5 h. Una función serverless en Vercel que sirva el
`index.html` con los meta ya inyectados para `/propiedades/:slug`:
- rewrite de `/propiedades/:slug` a la función, que pega al backend
  (`/v1/export/…`) con la API key **del lado servidor**;
- reemplaza `og:title`, `og:description`, `og:url` y `og:image` en el HTML y lo
  devuelve; la SPA bootea igual y el usuario no nota nada.

Gotchas a tener en cuenta:
- WhatsApp quiere JPG/PNG absoluto y liviano (~1200×630, <300 KB) y es
  inconsistente con WebP. Las fotos se suben en WebP a 1600px, así que conviene un
  `/api/og-image` que traiga la portada y la reencodee, cacheada.
- Conviene tener antes el dominio propio de R2
  (`back-lamelas/docs/bugfix/2026-08-13-fotos-lentas-safari.md`): servir las
  portadas desde `pub-…r2.dev` a los crawlers es pedir timeouts.
- WhatsApp cachea el preview por URL: al cambiar la portada el preview viejo puede
  persistir un rato.

**Estado.** Pendiente.

## ZONA-FILTRO-01 — filtro de zona sin duplicados

**Qué es.** El filtro de zona del listado (`Properties.tsx` + `fetchZonas()` →
`/v1/export/zonas`) se arma con los valores distintos que hay en la base. El panel
pasó a cargar la zona desde una lista cerrada, pero los valores viejos siguen como
estaban, así que el visitante va a ver opciones duplicadas del tipo
`Barrio Norte` y `barrio norte`.

**Ventaja.** Un filtro con la misma zona repetida dos veces con distinta
capitalización se lee como un error del sitio, y además parte los resultados.

**Viabilidad.** S, pero **no se arregla en este repo**: depende de
`back-lamelas/docs/features.md` → `ZONA-NORMALIZE-01` (normalizar los valores ya
cargados). Opcionalmente se puede deduplicar del lado del cliente como red de
seguridad, agrupando por versión normalizada (sin acentos, minúsculas).

**Estado.** Pendiente, esperando la normalización de datos.
