import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  key?: React.Key;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {property.operation}
          </span>
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {property.type}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-brand-primary transition-colors">
            {formatPrice(property.price, property.currency)}
          </h3>
          <h4 className="text-base font-medium text-gray-800 line-clamp-2 min-h-[3rem]">
            {property.title}
          </h4>
          <p className="flex items-start gap-1 text-sm text-gray-500 mt-2">
            <MapPin size={16} className="shrink-0 mt-0.5" />
            <span className="line-clamp-1">{property.location.address}, {property.location.city}</span>
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-100 mt-auto mb-4">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Bed size={18} className="mb-1" />
            <span className="text-xs font-medium">{property.features.bedrooms} Dorm</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-500 border-x border-gray-100">
            <Bath size={18} className="mb-1" />
            <span className="text-xs font-medium">{property.features.bathrooms} Baños</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Maximize size={18} className="mb-1" />
            <span className="text-xs font-medium">{property.features.surfaceTotal} m²</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link 
            to={`/propiedades/${property.slug}`}
            className="flex-1 bg-brand-neutral-light hover:bg-gray-200 text-brand-text text-center py-2.5 rounded-md text-sm font-semibold transition-colors"
          >
            Ver propiedad
          </Link>
          <a 
            href={`https://wa.me/543812310357?text=Hola, me interesa la propiedad: ${property.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-brand-primary hover:bg-brand-dark text-white text-center py-2.5 rounded-md text-sm font-semibold transition-colors"
          >
            Consultar
          </a>
        </div>
      </div>
    </div>
  );
}
