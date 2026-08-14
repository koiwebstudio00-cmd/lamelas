// Modelo público del sitio. Refleja lo que expone /v1/export del backend
// propio (back-lamelas), traducido a snake_case por src/lib/properties.ts:
// los componentes no conocen el formato de la API.
// Solo titulo, operacion, tipo y precio son obligatorios: el resto puede ser null.

export type Operacion = 'venta' | 'alquiler';
export type TipoPropiedad =
  | 'monoambiente'
  | 'departamento'
  | 'casa'
  | 'duplex'
  | 'local_comercial'
  | 'oficina'
  | 'galpon'
  | 'estacionamiento'
  | 'terreno'
  | 'otro';
export type Moneda = 'ARS' | 'USD';

// Campos de alquiler (valores canónicos de la API).
export type DestinoAlquiler = 'vivienda' | 'comercial' | 'profesional' | 'otro';
export type PlazoContrato = 'meses_12' | 'meses_18' | 'meses_24' | 'meses_36' | 'otro';
export type AjusteAlquiler = 'trimestral' | 'cuatrimestral' | 'otro';
export type IndiceAjuste = 'icl' | 'ipc' | 'fijo';
export type MascotasAlquiler = 'se_permiten' | 'no_se_permiten' | 'sin_especificar';
export type AmobladoAlquiler = 'amoblado' | 'sin_amoblar' | 'sin_especificar';

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
  requisitos: string | null;
  // Alquiler (nullable)
  destino: DestinoAlquiler | null;
  plazo_contrato: PlazoContrato | null;
  plazo_otro: string | null;
  ajuste: AjusteAlquiler | null;
  ajuste_otro: string | null;
  indice_ajuste: IndiceAjuste | null;
  indice_fijo_pct: number | null;
  expensas: string | null;
  mascotas: MascotasAlquiler | null;
  amoblado: AmobladoAlquiler | null;
  // Ubicación en el mapa
  lat: number | null;
  lng: number | null;
  link_maps: string | null;
  created_at: string;
  property_images: PropertyImage[];
}

export const OPERACION_LABELS: Record<Operacion, string> = {
  venta: 'Venta',
  alquiler: 'Alquiler',
};

export const TIPO_LABELS: Record<TipoPropiedad, string> = {
  monoambiente: 'Monoambiente',
  departamento: 'Departamento',
  casa: 'Casa',
  duplex: 'Dúplex',
  local_comercial: 'Local comercial',
  oficina: 'Oficina',
  galpon: 'Galpón',
  estacionamiento: 'Estacionamiento',
  terreno: 'Terreno',
  otro: 'Otro',
};

export const TIPOS: TipoPropiedad[] = [
  'monoambiente',
  'departamento',
  'casa',
  'duplex',
  'local_comercial',
  'oficina',
  'galpon',
  'estacionamiento',
  'terreno',
  'otro',
];

// Etiquetas de los campos de alquiler.
export const DESTINO_LABELS: Record<DestinoAlquiler, string> = {
  vivienda: 'Vivienda',
  comercial: 'Comercial',
  profesional: 'Profesional',
  otro: 'Otro',
};

export const PLAZO_LABELS: Record<PlazoContrato, string> = {
  meses_12: '12 meses',
  meses_18: '18 meses',
  meses_24: '24 meses',
  meses_36: '36 meses',
  otro: 'Otro',
};

export const AJUSTE_LABELS: Record<AjusteAlquiler, string> = {
  trimestral: 'Trimestral',
  cuatrimestral: 'Cuatrimestral',
  otro: 'Otro',
};

export const INDICE_LABELS: Record<IndiceAjuste, string> = {
  icl: 'ICL',
  ipc: 'IPC',
  fijo: 'Fijo',
};

export const MASCOTAS_LABELS: Record<MascotasAlquiler, string> = {
  se_permiten: 'Se permiten',
  no_se_permiten: 'No se permiten',
  sin_especificar: 'Sin especificar',
};

export const AMOBLADO_LABELS: Record<AmobladoAlquiler, string> = {
  amoblado: 'Amoblado',
  sin_amoblar: 'Sin amoblar',
  sin_especificar: 'Sin especificar',
};
