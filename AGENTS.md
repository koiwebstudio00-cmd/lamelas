# AGENTS.md

Guía para agentes de código (Cursor, Codex, Copilot, etc.) trabajando en este repo. Claude Code usa `CLAUDE.md` (mismo contenido esencial).

## Qué es este proyecto

Sitio **público** de Inmobiliaria Lamelas: catálogo de propiedades disponibles, de **solo lectura**. Nació como prototipo de AI Studio con datos mock (`src/data/mockProperties.ts`); el objetivo actual es conectarlo al backend real (Supabase) del proyecto interno hermano `lamelas` (repo `../lamelas`), donde los vendedores cargan las propiedades.

**Fuera de alcance:** auth de usuarios, carga/edición de propiedades, panel de gestión (todo eso vive en `lamelas`), y cualquier mutación de datos.

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
- `src/components/` — Header, Footer, Hero, PropertyCard, FeaturedProperties, etc.
- `src/types.ts` — tipos del dominio (hoy reflejan el mock, deben migrar al modelo real)
- `src/data/mockProperties.ts` — datos mock **a reemplazar** por Supabase

## Integración con Supabase (backend del repo `lamelas`)

Fuente de verdad del modelo: `../lamelas/supabase/migrations/0001_init.sql`.

- **Cliente:** `@supabase/supabase-js` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. **Nunca** usar la service role key.
- **Solo lectura:** consultas `select` a `properties` + `property_images`. Cero mutaciones desde este repo.
- **Solo disponibles:** filtrar siempre `estado = 'disponible'`. No mostrar reservadas ni vendidas (salvo pedido explícito).
- **RLS — ojo:** las policies actuales solo permiten `select` a `authenticated`. Para que el sitio público lea datos hace falta una **migración nueva en el repo `lamelas`** que agregue policy de `select` para `anon` (idealmente restringida a `estado = 'disponible'`). Los cambios de BD/policies se hacen SIEMPRE en `lamelas/supabase/migrations/`, nunca desde este repo.
- **Modelo real (columnas en español):** `properties(titulo, operacion, tipo, precio, moneda, descripcion, direccion, zona, ciudad, ambientes, dormitorios, banios, sup_cubierta, sup_total, estado, ...)`.
  - Enums: `operacion` = `venta | alquiler` · `tipo` = `casa | departamento | terreno | local | otro` · `moneda` = `ARS | USD`. Los 12 tipos del mock no existen en la BD; ajustar tipos y filtros de UI a estos enums.
  - Solo `titulo`, `operacion`, `tipo` y `precio` son obligatorios. **Todo lo demás puede ser null** — la UI debe tolerar ausencia de dormitorios, baños, superficies, zona, descripción y fotos sin romperse.
  - **No exponer `notas`** (campo interno de vendedores) ni datos del vendedor.
- **Imágenes:** bucket público `property-images`, path `{property_id}/{uuid}.webp`. URL con `supabase.storage.from('property-images').getPublicUrl(url)`. Portada: `es_portada = true`; galería ordenada por `orden`. Prever placeholder si no hay fotos.

## Reglas del proyecto

1. **Solo lectura.** Ninguna escritura a la BD ni al storage desde este sitio.
2. **Mobile-first.** El público navega desde el celular; probar en viewport móvil.
3. **UI y textos en español (Argentina).** Código (variables, funciones) en inglés; columnas de BD en español — respetarlas.
4. **Marca:** por decisión del cliente (jul 2026), el sitio público mantiene su propia identidad: verde `#16A34A`, bordes redondeados, Inter + Space Grotesk (display). Tokens en `@theme` de `src/index.css`. El design system de `../lamelas/docs/design-system.md` (`#0E9145`, bordes rectos) aplica solo a la app interna — no converger sin pedido explícito.
5. **lucide-react es la única librería de íconos.** No instalar otras librerías de UI/íconos.
6. **No agregar alcance de gestión** (login, carga de propiedades, leads con backend) sin pedido explícito.
7. SEO básico: títulos y metadatos por página en español; URLs limpias `/propiedades/:slug`.

## Al terminar una tarea

`npm run lint && npm run build` sin errores. Si el cambio depende de acceso a datos, verificar que la policy `anon` exista en `lamelas` (o dejarlo documentado como bloqueante).
