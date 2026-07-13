import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, ImageOff } from 'lucide-react';
import { Property, OPERACION_LABELS, TIPO_LABELS } from '../types';
import { coverUrl, formatPrice, locationLine, propertySlug } from '../lib/properties';

interface PropertyCardProps {
  property: Property;
  key?: React.Key;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const cover = coverUrl(property);
  const location = locationLine(property);

  const features = [
    property.dormitorios != null && { icon: Bed, label: `${property.dormitorios} Dorm` },
    property.banios != null && { icon: Bath, label: `${property.banios} Baños` },
    property.sup_total != null && { icon: Maximize, label: `${property.sup_total} m²` },
  ].filter(Boolean) as { icon: typeof Bed; label: string }[];

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {cover ? (
          <img
            src={cover}
            alt={property.titulo}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ImageOff size={48} />
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {OPERACION_LABELS[property.operacion]}
          </span>
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {TIPO_LABELS[property.tipo]}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-brand-primary transition-colors tabular-nums">
            {formatPrice(property.precio, property.moneda)}
          </h3>
          <h4 className="text-base font-medium text-gray-800 line-clamp-2 min-h-[3rem]">
            {property.titulo}
          </h4>
          {location && (
            <p className="flex items-start gap-1 text-sm text-gray-500 mt-2">
              <MapPin size={16} className="shrink-0 mt-0.5" />
              <span className="line-clamp-1">{location}</span>
            </p>
          )}
        </div>

        {features.length > 0 && (
          <div
            className={`grid gap-2 py-4 border-y border-gray-100 mt-auto mb-4 ${
              ['grid-cols-1', 'grid-cols-2', 'grid-cols-3'][features.length - 1]
            }`}
          >
            {features.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className={`flex flex-col items-center justify-center text-gray-500 ${i > 0 ? 'border-l border-gray-100' : ''}`}
              >
                <Icon size={18} className="mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        )}

        <div className={`flex gap-2 ${features.length === 0 ? 'mt-auto' : ''}`}>
          <Link
            to={`/propiedades/${propertySlug(property)}`}
            className="flex-1 bg-brand-neutral-light hover:bg-gray-200 text-brand-text text-center py-2.5 rounded-md text-sm font-semibold transition-colors"
          >
            Ver propiedad
          </Link>
          <a
            href={`https://wa.me/543812310357?text=${encodeURIComponent(`Hola, me interesa la propiedad: ${property.titulo}`)}`}
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
