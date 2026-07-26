// Modelo público del sitio. Refleja lo que expone /v1/export del backend
// propio (back-lamelas), traducido a snake_case por src/lib/properties.ts:
// los componentes no conocen el formato de la API.
// Solo titulo, operacion, tipo y precio son obligatorios: el resto puede ser null.

export type Operacion = 'venta' | 'alquiler';
export type TipoPropiedad = 'casa' | 'departamento' | 'terreno' | 'local' | 'otro';
export type Moneda = 'ARS' | 'USD';

export interface PropertyImage {
  id: string;
  url: string; // URL absoluta ya resuelta por la API (R2 o el bucket heredado)
  es_portada: boolean;
  orden: number;
}

export interface Property {
  id: string;
  /** Identificador público para URLs: {operacion}-{titulo}-{id_corto} */
  slug: string;
  titulo: string;
  operacion: Operacion;
  tipo: TipoPropiedad;
  precio: number;
  moneda: Moneda;
  descripcion: string | null;
  direccion: string | null;
  zona: string | null;
  ciudad: string | null;
  ambientes: number | null;
  dormitorios: number | null;
  banios: number | null;
  sup_cubierta: number | null;
  sup_total: number | null;
  created_at: string;
  property_images: PropertyImage[];
}

export const OPERACION_LABELS: Record<Operacion, string> = {
  venta: 'Venta',
  alquiler: 'Alquiler',
};

export const TIPO_LABELS: Record<TipoPropiedad, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  terreno: 'Terreno',
  local: 'Local',
  otro: 'Otro',
};

export const TIPOS: TipoPropiedad[] = ['casa', 'departamento', 'terreno', 'local', 'otro'];
