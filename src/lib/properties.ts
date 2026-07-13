import { supabase } from './supabase';
import { Property, PropertyImage } from '../types';

const SELECT = `id, slug, titulo, operacion, tipo, precio, moneda, descripcion, direccion, zona, ciudad,
  ambientes, dormitorios, banios, sup_cubierta, sup_total, created_at,
  property_images ( id, url, es_portada, orden )`;

export type SortOption = 'recent' | 'price-asc' | 'price-desc';

export interface PropertyFilters {
  operacion?: string;
  tipo?: string;
  ciudad?: string;
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

/** Listado público: solo propiedades disponibles (la policy RLS anon también lo garantiza). */
export async function fetchProperties(filters: PropertyFilters = {}): Promise<PropertiesPage> {
  let query = supabase
    .from('properties')
    .select(SELECT, { count: 'exact' })
    .eq('estado', 'disponible');

  if (filters.operacion) query = query.eq('operacion', filters.operacion);
  if (filters.tipo) query = query.eq('tipo', filters.tipo);
  if (filters.ciudad) query = query.eq('ciudad', filters.ciudad);
  if (filters.dormitoriosMin) query = query.gte('dormitorios', filters.dormitoriosMin);
  if (filters.precioMin) query = query.gte('precio', filters.precioMin);
  if (filters.precioMax) query = query.lte('precio', filters.precioMax);

  switch (filters.sort) {
    case 'price-asc':
      query = query.order('precio', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('precio', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }
  // Orden secundario estable para que la paginación no duplique/saltee filas
  query = query.order('id', { ascending: true });

  if (filters.page && filters.pageSize) {
    const from = (filters.page - 1) * filters.pageSize;
    query = query.range(from, from + filters.pageSize - 1);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { properties: (data ?? []) as unknown as Property[], total: count ?? 0 };
}

/** Ciudades con propiedades disponibles, para el filtro del listado. */
export async function fetchCiudades(): Promise<string[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('ciudad')
    .eq('estado', 'disponible')
    .not('ciudad', 'is', null);
  if (error) throw error;
  const ciudades = (data ?? [])
    .map((row) => (row as { ciudad: string | null }).ciudad?.trim())
    .filter((c): c is string => Boolean(c));
  return [...new Set(ciudades)].sort((a, b) => a.localeCompare(b, 'es'));
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select(SELECT)
    .eq('estado', 'disponible')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Property | null;
}


/** URL pública de una foto (bucket público property-images). */
export function imageUrl(image: PropertyImage): string {
  return supabase.storage.from('property-images').getPublicUrl(image.url).data.publicUrl;
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

/** URL p\u00fablica del detalle: usa la columna slug de la BD. */
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
