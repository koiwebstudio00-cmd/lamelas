# CLAUDE.md

Contexto para Claude Code al trabajar en este repo.

## Proyecto

Sitio **público** de Inmobiliaria Lamelas: catálogo de propiedades disponibles, **solo lectura**. Consume el backend propio `back-lamelas` (repo `../back-lamelas`), donde los vendedores cargan las propiedades desde el panel interno `lamelas` (repo `../lamelas`).

**Sin auth, sin carga/edición de propiedades, sin panel de gestión, sin mutaciones** (la única excepción es el alta de leads del formulario de contacto). Todo lo demás vive en `lamelas`.

## Stack

Vite + React 19 + TypeScript · react-router-dom 7 · Tailwind CSS v4 (tokens en `@theme` de `src/index.css`) · lucide-react · motion. SPA sin backend propio.

## Comandos

```bash
npm run dev      # Vite en puerto 3000
npm run lint     # tsc --noEmit
npm run build    # correr antes de dar por terminado
```

## Estructura

Rutas: `/` (Home), `/propiedades` (listado + filtros por query params), `/propiedades/:slug` (detalle). Páginas en `src/pages/`, componentes en `src/components/`, tipos en `src/types.ts`, acceso a datos en `src/lib/api.ts` (cliente HTTP) y `src/lib/properties.ts` (consultas + adaptación del payload).

## Integración con back-lamelas

Fuente de verdad: `../back-lamelas/src/modules/export/` y `docs/api.md` de ese repo.

1. **Cliente:** `src/lib/api.ts`. `VITE_API_URL` (base, sin barra final) y `VITE_API_KEY` (key del módulo `/export`, header `X-Api-Key`). La key es de **solo lectura**, está acotada a un tenant y se revoca desde el panel: puede viajar en el bundle. **Nunca** poner acá credenciales de admin ni cookies de sesión.
2. **Solo lectura** de `/v1/export/properties`, `/v1/export/properties/:idOrSlug` y `/v1/export/ciudades`, filtrando siempre `estado=disponible`.
3. **Ningún componente habla con la API directamente.** Todo pasa por `src/lib/properties.ts`, que traduce el payload (camelCase, `precio`/superficies como string por ser `numeric`, `images`) al modelo snake_case de `src/types.ts`. Si cambia la API, se toca solo ese archivo.
4. **Modelo:** enums `operacion` = `venta | alquiler`, `tipo` = `casa | departamento | terreno | local | otro`, `moneda` = `ARS | USD`.
5. **Solo `titulo`, `operacion`, `tipo` y `precio` son obligatorios.** La UI debe tolerar null en dormitorios, baños, superficies, zona, ciudad, descripción y fotos. El select de `/export` ya excluye `notas`, `user_id` y `tenant_id`: no hay riesgo de fuga, pero tampoco hay que pedirlos.
6. **Imágenes:** la API devuelve la **URL absoluta** ya resuelta. `imageUrl()` es identidad y existe solo para no tocar los componentes. Portada `es_portada = true`, galería por `orden`, placeholder si no hay fotos.
7. **Leads:** el formulario de contacto hace `POST /v1/public/:tenant_slug/leads` (sin API key, rate limit por IP, campo honeypot `website` obligatorio en el form).

## Reglas del proyecto

1. **Solo lectura**, salvo el alta de leads del formulario de contacto.
2. **Mobile-first.** Probar todo en viewport móvil.
3. **UI y textos en español (Argentina).** Código en inglés; campos de la API en español — respetarlos.
4. **Marca:** por decisión del cliente (jul 2026), el sitio público mantiene identidad propia: verde `#16A34A`, bordes redondeados, Inter + Space Grotesk (display). Tokens en `@theme` de `src/index.css`. El design system de `../lamelas/docs/design-system.md` aplica solo a la app interna — no converger sin pedido explícito.
5. **lucide-react es la única librería de íconos.** No instalar otras librerías de UI/íconos.
6. **No agregar alcance de gestión** (login, ABM de propiedades, bandeja de leads) sin pedido explícito.

## Al terminar una tarea

`npm run lint && npm run build` sin errores. Si la tarea depende de datos reales, verificar que `back-lamelas` esté corriendo y que `VITE_API_KEY` tenga una key válida del tenant.
