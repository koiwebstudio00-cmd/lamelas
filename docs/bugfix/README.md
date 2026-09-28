# docs/bugfix — lamelas-web (sitio público)

Registro de bugs y mejoras pendientes **de este repo**. Los de la API van en
`back-lamelas/docs/bugfix/`, los del panel en `lamelas/docs/bugfix/` y los de
Sofía/n8n en `lamelas-agent/docs/bugfix/`.

Convención: un archivo por bug con nombre `AAAA-MM-DD-descripcion-corta.md`
(síntoma, causa raíz, solución, archivos a tocar, verificación, estado). Los items
chicos van inline en "Mejoras pendientes".

## Índice

(sin incidentes con archivo propio todavía)

## Mejoras pendientes

### `preconnect` desalineado en `index.html` (2026-09-27)

`index.html` tiene `<link rel="preconnect">` a `gnpohmwaulxpvkqzxall.supabase.co`,
que quedó de cuando las fotos vivían en Supabase y hoy no se usa. Falta el
`preconnect` al host real de las fotos. Conviene hacer los dos cambios en la misma
pasada que el dominio propio de R2
(`back-lamelas/docs/bugfix/2026-08-13-fotos-lentas-safari.md`, paso 7).

### Las fotos se sirven desde el endpoint de desarrollo de R2 (2026-09-27)

Igual que el panel, el sitio consume las URLs que devuelve la API, que hoy apuntan
a `pub-…r2.dev` — endpoint de desarrollo que Cloudflare throttlea; se nota
especialmente en Safari y en fichas con muchas fotos. **El arreglo no vive en este
repo**: es infra + backend, runbook en
`back-lamelas/docs/bugfix/2026-08-13-fotos-lentas-safari.md`. Queda anotado acá
porque el síntoma se ve en el sitio.

### Los meta de las fichas se escriben por JavaScript (2026-09-27)

`useSeo()` setea `og:*` y `twitter:*` en el cliente, así que ningún crawler los
ve: WhatsApp muestra siempre la imagen institucional y los buscadores dependen de
renderizar JS. No es un bug de implementación sino una limitación de la
arquitectura SPA; el plan está en [`../features.md`](../features.md) →
`OG-DINAMICO-01`.
