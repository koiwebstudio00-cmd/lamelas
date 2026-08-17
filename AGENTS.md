# AGENTS.md

Guía para agentes de código (Cursor, Codex, Copilot, etc.) trabajando en este repo. Claude Code usa `CLAUDE.md` (mismo contenido esencial).

## Qué es este proyecto

Sitio **público** de Inmobiliaria Lamelas: catálogo de propiedades disponibles, de **solo lectura**. Consume el backend propio `back-lamelas` (repo `../back-lamelas`) a través de su módulo `/export`; las propiedades se cargan desde el panel interno `lamelas` (repo `../lamelas`).

**Fuera de alcance:** auth de usuarios, carga/edición de propiedades, panel de gestión (todo eso vive en `lamelas`) y cualquier mutación de datos, con la única excepción del alta de leads del formulario de contacto.

## Stack

Vite + React 19 + TypeScript · react-router-dom 7 · Tailwind CSS v4 (tokens en `@theme` de `src/index.css`) · lucide-react (única librería de íconos) · motion. SPA sin backend propio.

## Comandos

```bash
npm install
npm run dev      # Vite en puerto 3000
npm run lint     # tsc --noEmit
npm run build    # correr antes de dar por terminado
```

## Estructura

- `src/pages/` — `Home`, `Properties` (listado + filtros por query params), `PropertyDetail` (ruta `/propiedades/:slug`)
- `src/components/` — Header, Footer, Hero, PropertyCard, FeaturedProperties, Contact, etc.
- `src/types.ts` — modelo del dominio que consumen los componentes (snake_case)
- `src/lib/api.ts` — cliente HTTP del backend (base URL, API key, manejo de errores)
- `src/lib/properties.ts` — consultas a `/export` y adaptación del payload al modelo de `types.ts`

## Integración con back-lamelas

Fuente de verdad del modelo: `../back-lamelas/src/modules/export/` y `docs/api.md` de ese repo.

- **Cliente:** `src/lib/api.ts` con `VITE_API_URL` (base sin barra final) y `VITE_API_KEY` (header `X-Api-Key`). La key es de solo lectura, está acotada al tenant y se revoca desde el panel en un minuto: puede viajar en el bundle. **Nunca** credenciales de admin ni cookies de sesión en este repo.
- **Solo lectura:** `GET /v1/export/properties`, `GET /v1/export/properties/:idOrSlug`, `GET /v1/export/ciudades`. La única escritura permitida es `POST /v1/public/:tenant_slug/leads` desde el formulario de contacto.
- **Solo disponibles:** mandar siempre `estado=disponible`. No mostrar reservadas ni vendidas (salvo pedido explícito).
- **Capa de adaptación obligatoria:** ningún componente llama a la API directamente. `src/lib/properties.ts` traduce camelCase → snake_case, convierte a número los `numeric` que viajan como string (`precio`, `supCubierta`, `supTotal`) y renombra `images` → `property_images`. Si cambia la API, se toca solo ese archivo.
- **Modelo:** `titulo, operacion, tipo, precio, moneda, descripcion, direccion, zona, ciudad, ambientes, dormitorios, banios, sup_cubierta, sup_total, estado, requisitos, slug` + campos de alquiler (`destino, plazo_contrato, plazo_otro, ajuste, ajuste_otro, indice_ajuste, indice_fijo_pct, expensas, mascotas, amoblado`) + mapa (`lat, lng, link_maps`).
  - Enums: `operacion` = `venta | alquiler` · `tipo` = `monoambiente | departamento | casa | duplex | local_comercial | oficina | galpon | estacionamiento | terreno | otro` · `moneda` = `ARS | USD` · alquiler: `destino` (`vivienda|comercial|profesional|otro`), `plazo_contrato` (`meses_12|meses_18|meses_24|meses_36|otro`), `ajuste` (`trimestral|cuatrimestral|otro`), `indice_ajuste` (`icl|ipc|fijo`), `mascotas` (`se_permiten|no_se_permiten|sin_especificar`), `amoblado` (`amoblado|sin_amoblar|sin_especificar`).
  - Solo `titulo`, `operacion`, `tipo` y `precio` son obligatorios. **Todo lo demás puede ser null** — la UI debe tolerar ausencia de dormitorios, baños, superficies, zona, descripción, campos de alquiler, mapa y fotos sin romperse.
  - El mapa de la ficha usa **Leaflet + OpenStreetMap** (dep `leaflet` + `@types/leaflet`), solo se muestra si la propiedad tiene `lat`/`lng`.
  - El select de `/export` ya excluye `notas`, `user_id` y `tenant_id` (hay tests anti-fuga en el backend). No intentar pedirlos.
- **Imágenes:** la API devuelve la **URL absoluta** ya resuelta. `imageUrl()` quedó como identidad para no tocar los componentes. Portada: `es_portada = true`; galería ordenada por `orden`. Prever placeholder si no hay fotos.
- **Filtros y orden los resuelve la API:** `operacion`, `tipo`, `ciudad`, `dormitorios_min`, `precio_min`, `precio_max`, `sort` (`recent | price-asc | price-desc`), `page`, `limit` (máx. 100). No filtrar ni ordenar en el cliente sobre una página parcial.

## Reglas del proyecto

1. **Solo lectura**, salvo el alta de leads del formulario de contacto.
2. **Mobile-first.** El público navega desde el celular; probar en viewport móvil.
3. **UI y textos en español (Argentina).** Código (variables, funciones) en inglés; campos de la API en español — respetarlos.
4. **Marca:** por decisión del cliente (jul 2026), el sitio público mantiene su propia identidad: verde `#16A34A`, bordes redondeados, Inter + Space Grotesk (display). Tokens en `@theme` de `src/index.css`. El design system de `../lamelas/docs/design-system.md` (`#0E9145`, bordes rectos) aplica solo a la app interna — no converger sin pedido explícito.
5. **lucide-react es la única librería de íconos.** No instalar otras librerías de UI/íconos.
6. **No agregar alcance de gestión** (login, carga de propiedades, bandeja de leads) sin pedido explícito.
7. SEO básico: títulos y metadatos por página en español; URLs limpias `/propiedades/:slug`.

## Al terminar una tarea

`npm run lint && npm run build` sin errores. Si el cambio depende de datos reales, verificar que `back-lamelas` esté corriendo y que `VITE_API_KEY` tenga una key válida del tenant.
