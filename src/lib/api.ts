// Cliente HTTP del backend propio (back-lamelas).
//
// La API key viaja en el bundle a propósito: /export es de solo lectura, está
// acotada a un tenant y su select nunca incluye notas, user_id ni tenant_id.
// Es el mismo criterio con el que antes viajaba la anon key de Supabase, con
// la ventaja de que esta se revoca desde el panel en un minuto.

const BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');
const API_KEY = import.meta.env.VITE_API_KEY ?? '';

/** Slug del tenant, para los endpoints públicos que no usan API key (leads). */
export const TENANT_SLUG = import.meta.env.VITE_TENANT_SLUG ?? 'lamelas';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type QueryValue = string | number | undefined;

function buildUrl(path: string, params?: Record<string, QueryValue>): string {
  if (!BASE_URL) {
    throw new ApiError('Falta VITE_API_URL en el entorno del sitio.', 0, 'CONFIG');
  }
  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  }
  return url.toString();
}

// El backend responde { error: { code, message } }; el message ya viene en
// castellano y apto para mostrar, así que se propaga tal cual.
async function toApiError(res: Response): Promise<ApiError> {
  let message = 'No pudimos conectarnos. Probá de nuevo en un momento.';
  let code: string | undefined;
  try {
    const body = await res.json();
    if (body?.error?.message) message = body.error.message;
    code = body?.error?.code;
  } catch {
    // respuesta sin JSON (502 de un proxy, por ejemplo): queda el mensaje genérico
  }
  return new ApiError(message, res.status, code);
}

/** GET al módulo /export (requiere API key). */
export async function apiGet<T>(path: string, params?: Record<string, QueryValue>): Promise<T> {
  const res = await fetch(buildUrl(path, params), {
    headers: { 'X-Api-Key': API_KEY },
  });
  if (!res.ok) throw await toApiError(res);
  return (await res.json()) as T;
}

/** POST a un endpoint público (sin API key ni cookies: alta de leads). */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await toApiError(res);
  return (await res.json()) as T;
}
