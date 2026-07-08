import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProperties } from '../data/mockProperties';
import { MapPin, Bed, Bath, Maximize, Calendar, Share2, Phone } from 'lucide-react';

export default function PropertyDetail() {
  const { slug } = useParams();
  
  // In a real app, fetch property by slug
  const property = mockProperties.find(p => p.slug === slug) || mockProperties[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb & Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500 font-medium">
            <Link to="/propiedades" className="hover:text-brand-primary">Propiedades</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{property.type}</span>
          </div>
          <button className="flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors text-sm font-medium">
            <Share2 size={18} />
            Compartir
          </button>
        </div>

        {/* Title & Key Info */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col lg:flex-row justify-between gap-6 items-start">
          <div>
            <div className="flex gap-2 mb-3">
              <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                {property.operation}
              </span>
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                {property.type}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {property.title}
            </h1>
            <p className="flex items-center gap-2 text-gray-600 text-lg">
              <MapPin size={20} className="text-brand-primary" />
              {property.location.address}, {property.location.zone}, {property.location.city}, {property.location.province}
            </p>
          </div>
          <div className="lg:text-right">
            <div className="text-3xl md:text-4xl font-bold text-brand-dark mb-1">
              {formatPrice(property.price, property.currency)}
            </div>
            {/* Optional extra expenses indicator here */}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Gallery */}
            <div className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] md:h-[500px]">
              <div className="h-full">
                <img src={property.images[0]} alt="Principal" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="hidden md:grid grid-rows-2 gap-2 h-full">
                {property.images[1] ? (
                  <img src={property.images[1]} alt="Vista 2" className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-gray-200 w-full h-full"></div>
                )}
                {property.images[2] ? (
                  <img src={property.images[2]} alt="Vista 3" className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-gray-200 w-full h-full relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-medium cursor-pointer hover:bg-black/50 transition-colors">
                      Ver todas las fotos
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Características principales</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-light p-3 rounded-full text-brand-primary">
                    <Maximize size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Superficie Total</p>
                    <p className="font-bold text-gray-900">{property.features.surfaceTotal} m²</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-brand-light p-3 rounded-full text-brand-primary">
                    <Maximize size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sup. Cubierta</p>
                    <p className="font-bold text-gray-900">{property.features.surfaceCovered} m²</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-brand-light p-3 rounded-full text-brand-primary">
                    <Bed size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dormitorios</p>
                    <p className="font-bold text-gray-900">{property.features.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-brand-light p-3 rounded-full text-brand-primary">
                    <Bath size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Baños</p>
                    <p className="font-bold text-gray-900">{property.features.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-brand-light p-3 rounded-full text-brand-primary">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Antigüedad</p>
                    <p className="font-bold text-gray-900">{property.features.age} años</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Descripción</h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                {property.description.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ubicación aproximada</h2>
              <div className="w-full h-[300px] bg-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden">
                {/* Map illustration/placeholder */}
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #9ca3af 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
                <div className="z-10 bg-white/90 p-4 rounded-full shadow-lg text-brand-primary">
                  <MapPin size={32} />
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar / Contact */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Consultar por esta propiedad</h3>
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Consulta enviada'); }}>
                <div>
                  <input required type="text" placeholder="Nombre completo" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
                </div>
                <div>
                  <input required type="tel" placeholder="Teléfono" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
                </div>
                <div>
                  <input required type="email" placeholder="Email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
                </div>
                <div>
                  <textarea required rows={4} placeholder="Hola, me interesa esta propiedad..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-md hover:bg-brand-primary transition-colors">
                  Enviar consulta
                </button>
              </form>

              <div className="mt-6 flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-gray-200"></div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">O contactanos vía</span>
                <div className="h-[1px] flex-1 bg-gray-200"></div>
              </div>

              <a 
                href={`https://wa.me/543812310357?text=Hola, quiero consultar por la propiedad: ${property.title} (${window.location.href})`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 w-full bg-brand-primary text-white font-bold py-3.5 rounded-md hover:bg-brand-dark transition-colors"
              >
                <Phone size={20} />
                WhatsApp Directo
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
