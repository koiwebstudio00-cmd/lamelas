# CLAUDE.md

Contexto para Claude Code al trabajar en este repo.

## Proyecto

Sitio **público** de Inmobiliaria Lamelas: catálogo de propiedades disponibles, **solo lectura**. Prototipo AI Studio con datos mock (`src/data/mockProperties.ts`) que debe conectarse al backend Supabase del proyecto interno hermano `lamelas` (repo `../lamelas`), donde los vendedores cargan propiedades.

**Sin auth, sin carga/edición de propiedades, sin panel de gestión, sin mutaciones.** Todo eso vive en `lamelas`.

## Stack

Vite + React 19 + TypeScript · react-router-dom 7 · Tailwind CSS v4 (tokens en `@theme` de `src/index.css`) · lucide-react · motion. SPA sin backend propio.

## Comandos

```bash
npm run dev      # Vite en puerto 3000
npm run lint     # tsc --noEmit
npm run build    # correr antes de dar por terminado
```

## Estructura

Rutas: `/` (Home), `/propiedades` (listado + filtros por query params), `/propiedades/:slug` (detalle). Páginas en `src/pages/`, componentes en `src/components/`, tipos en `src/types.ts` (hoy reflejan el mock; migrar al modelo real), mock a reemplazar en `src/data/mockProperties.ts`.

## Integración con Supabase (backend del repo `lamelas`)

Fuente de verdad: `../lamelas/supabase/migrations/0001_init.sql`.

1. **Cliente:** `@supabase/supabase-js` con `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`. **Nunca** la service role key.
2. **Solo lectura** de `properties` + `property_images`, filtrando siempre `estado = 'disponible'`.
3. **RLS:** las policies actuales solo permiten `select` a `authenticated`. El acceso público requiere una **migración nueva en `lamelas/supabase/migrations/`** con policy `select` para `anon` (idealmente limitada a `estado = 'disponible'`). Nunca modificar la BD desde este repo.
4. **Modelo real (columnas en español):** enums `operacion` = `venta | alquiler`, `tipo` = `casa | departamento | terreno | local | otro`, `moneda` = `ARS | USD`. Los 12 tipos del mock no existen en la BD — ajustar `src/types.ts` y los filtros de UI a los enums reales.
5. **Solo `titulo`, `operacion`, `tipo` y `precio` son obligatorios.** La UI debe tolerar null en dormitorios, baños, superficies, zona, ciudad, descripción y fotos. **No exponer `notas`** ni datos del vendedor.
6. **Imágenes:** bucket público `property-images`, path `{property_id}/{uuid}.webp`, URL vía `getPublicUrl`. Portada `es_portada = true`, galería por `orden`, placeholder si no hay fotos.

## Reglas del proyecto

1. **Solo lectura.** Ninguna escritura a BD ni storage desde este sitio.
2. **Mobile-first.** Probar todo en viewport móvil.
3. **UI y textos en español (Argentina).** Código en inglés; columnas de BD en español — respetarlas.
4. **Marca:** por decisión del cliente (jul 2026), el sitio público mantiene identidad propia: verde `#16A34A`, bordes redondeados, Inter + Space Grotesk (display). Tokens en `@theme` de `src/index.css`. El design system de `../lamelas/docs/design-system.md` aplica solo a la app interna — no converger sin pedido explícito.
5. **lucide-react es la única librería de íconos.** No instalar otras librerías de UI/íconos.
6. **No agregar alcance de gestión** (login, ABM de propiedades, leads con backend) sin pedido explícito.

## Al terminar una tarea

`npm run lint && npm run build` sin errores. Si la tarea depende de datos reales, verificar que exista la policy `anon` en `lamelas` o documentarlo como bloqueante.
