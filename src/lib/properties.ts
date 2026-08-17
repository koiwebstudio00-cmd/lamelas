import { apiGet, ApiError } from './api';
import {
  AjusteAlquiler,
  AmobladoAlquiler,
  DestinoAlquiler,
  IndiceAjuste,
  MascotasAlquiler,
  Moneda,
  Operacion,
  PlazoContrato,
  Property,
  PropertyImage,
  TipoPropiedad,
} from '../types';

export type SortOption = 'recent' | 'price-asc' | 'price-desc';

export interface PropertyFilters {
  operacion?: string;
  tipo?: string;
  ciudad?: string;
  zona?: string;
  /** Texto libre del buscador natural. */
  q?: string;
  dormitoriosMin?: number;
  precioMin?: number;
  precioMax?: number;
  sort?: SortOption;
  /** Página 1-based. Si se omite junto con pageSize, trae todo. */
  page?: number;
  pageSize?: number;
}

export interface PropertiesPage {
  properties: Property[];
  total: number;
}

export const DEFAULT_PAGE_SIZE = 12;

/** Tope de /export/properties: sin paginación explícita se pide el máximo. */
const MAX_PAGE_SIZE = 100;

// ── Adaptación del payload de la API ─────────────────────────────────────────
// La API responde en camelCase y los numeric de Postgres viajan como string
// (precio, superficies). Los componentes siguen consumiendo el modelo
// snake_case de types.ts, así que la traducción vive acá y en ningún otro lado.

interface ApiImage {
  id: string;
  url: string;
  esPortada: boolean;
  orden: number;
}

interface ApiProperty {
  id: string;
  slug: string;
  titulo: string;
  operacion: Operacion;
  tipo: TipoPropiedad;
  precio: string | number;
  moneda: Moneda;
  precioAlquiler: string | number | null;
  monedaAlquiler: Moneda | null;
  destacada?: boolean;
  descripcion: string | null;
  direccion: string | null;
  zona: string | null;
  ciudad: string | null;
  ambientes: number | null;
  dormitorios: number | null;
  banios: number | null;
  supCubierta: string | number | null;
  supTotal: string | number | null;
  estado: 'disponible' | 'reservado' | 'proximamente' | 'pausado' | 'vendida' | 'alquilada' | 'privado';
  requisitos: string | null;
  destino: DestinoAlquiler | null;
  plazoContrato: PlazoContrato | null;
  plazoOtro: string | null;
  ajuste: AjusteAlquiler | null;
  ajusteOtro: string | null;
  indiceAjuste: IndiceAjuste | null;
  indiceFijoPct: string | number | null;
  expensas: string | null;
  mascotas: MascotasAlquiler | null;
  amoblado: AmobladoAlquiler | null;
  lat: string | number | null;
  lng: string | number | null;
  linkMaps: string | null;
  createdAt: string;
  images?: ApiImage[];
}

function num(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toImage(img: ApiImage): PropertyImage {
  return { id: img.id, url: img.url, es_portada: img.esPortada, orden: img.orden };
}

function toProperty(p: ApiProperty): Property {
  return {
    id: p.id,
    slug: p.slug,
    titulo: p.titulo,
    operacion: p.operacion,
    tipo: p.tipo,
    precio: num(p.precio) ?? 0,
    moneda: p.moneda,
    precio_alquiler: num(p.precioAlquiler),
    moneda_alquiler: p.monedaAlquiler ?? null,
    destacada: p.destacada ?? false,
    descripcion: p.descripcion,
    direccion: p.direccion,
    zona: p.zona,
    ciudad: p.ciudad,
    ambientes: p.ambientes,
    dormitorios: p.dormitorios,
    banios: p.banios,
    sup_cubierta: num(p.supCubierta),
    sup_total: num(p.supTotal),
    requisitos: p.requisitos ?? null,
    destino: p.destino ?? null,
    plazo_contrato: p.plazoContrato ?? null,
    plazo_otro: p.plazoOtro ?? null,
    ajuste: p.ajuste ?? null,
    ajuste_otro: p.ajusteOtro ?? null,
    indice_ajuste: p.indiceAjuste ?? null,
    indice_fijo_pct: num(p.indiceFijoPct),
    expensas: p.expensas ?? null,
    mascotas: p.mascotas ?? null,
    amoblado: p.amoblado ?? null,
    lat: num(p.lat),
    lng: num(p.lng),
    link_maps: p.linkMaps ?? null,
    created_at: p.createdAt,
    property_images: (p.images ?? []).map(toImage),
  };
}

// ── Consultas ────────────────────────────────────────────────────────────────

/** Listado público: solo propiedades disponibles. */
export async function fetchProperties(filters: PropertyFilters = {}): Promise<PropertiesPage> {
  const res = await apiGet<{ data: ApiProperty[]; meta: { total: number } }>(
    '/v1/export/properties',
    {
      estado: 'disponible',
      operacion: filters.operacion,
      tipo: filters.tipo,
      ciudad: filters.ciudad,
      zona: filters.zona,
      q: filters.q,
      // dormitorios exacto (1..3) / 4+ ; el backend interpreta el "4 o más".
      dormitorios: filters.dormitoriosMin,
      precio_min: filters.precioMin,
      precio_max: filters.precioMax,
      sort: filters.sort ?? 'recent',
      page: filters.page ?? 1,
      limit: filters.pageSize ?? MAX_PAGE_SIZE,
    }
  );
  return { properties: res.data.map(toProperty), total: res.meta.total };
}

/** Ciudades con propiedades disponibles, para el filtro del listado. */
export async function fetchCiudades(): Promise<string[]> {
  // La API ya devuelve el distinct ordenado alfabéticamente en es-AR.
  const res = await apiGet<{ data: string[] }>('/v1/export/ciudades', { estado: 'disponible' });
  return res.data;
}

/** Zonas/barrios con propiedades disponibles, para el filtro del listado. */
export async function fetchZonas(): Promise<string[]> {
  const res = await apiGet<{ data: string[] }>('/v1/export/zonas', { estado: 'disponible' });
  return res.data;
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const res = await apiGet<{ property: ApiProperty }>(
      `/v1/export/properties/${encodeURIComponent(slug)}`
    );
    // La ficha no filtra por estado del lado de la API: el sitio público solo
    // muestra disponibles, igual que el listado, así que se descarta acá.
    if (res.property.estado !== 'disponible') return null;
    return toProperty(res.property);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

/**
 * URL pública de una foto. La API ya devuelve la URL absoluta (R2 o el bucket
 * público heredado de Supabase), así que no hay nada que componer acá.
 * Se mantiene como función para no tocar los componentes que la usan.
 */
export function imageUrl(image: PropertyImage): string {
  return image.url;
}

/** Fotos ordenadas: portada primero, luego por `orden`. */
export function sortedImages(property: Property): PropertyImage[] {
  return [...(property.property_images ?? [])].sort(
    (a, b) => Number(b.es_portada) - Number(a.es_portada) || a.orden - b.orden
  );
}

export function coverUrl(property: Property): string | null {
  const images = sortedImages(property);
  return images.length > 0 ? imageUrl(images[0]) : null;
}

/** URL pública del detalle: usa la columna slug de la BD. */
export function propertySlug(property: Property): string {
  return property.slug;
}

export function formatPrice(precio: number, moneda: string): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(precio);
}

/** "Dirección, zona, ciudad" omitiendo los campos vacíos. */
export function locationLine(property: Property): string {
  return [property.direccion, property.zona, property.ciudad].filter(Boolean).join(', ');
}
