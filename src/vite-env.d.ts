/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base del backend, sin barra final. Ej: http://localhost:3001 */
  readonly VITE_API_URL: string;
  /** API key del módulo /export (solo lectura, revocable desde el panel). */
  readonly VITE_API_KEY: string;
  /** Slug del tenant para los endpoints públicos. Por defecto "lamelas". */
  readonly VITE_TENANT_SLUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
