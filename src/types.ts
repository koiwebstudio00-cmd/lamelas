export interface PropertyLocation {
  province: string;
  city: string;
  zone: string;
  address: string;
}

export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  surfaceTotal: number;
  surfaceCovered: number;
  age: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  type: 'Terrenos' | 'Departamentos' | 'Casas' | 'Oficinas' | 'Locales' | 'Cocheras' | 'PH' | 'Edificios comerciales' | 'Depósitos' | 'Fondos de comercio' | 'Galpones' | 'Terrenos comerciales';
  operation: 'Venta' | 'Alquiler';
  price: number;
  currency: 'USD' | 'ARS';
  location: PropertyLocation;
  features: PropertyFeatures;
  images: string[];
  description: string;
  featured: boolean;
  dateAdded: string;
}
