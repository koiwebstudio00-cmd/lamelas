import React from 'react';
import { MapPin, Phone, MessageCircle } from 'lucide-react';

export default function Branches() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Estamos cerca tuyo</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Nuestras sucursales</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:border-brand-primary/30 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand-light text-brand-primary flex items-center justify-center">1</span>
              San Miguel de Tucumán
            </h3>
            <div className="space-y-4 text-gray-600">
              <p className="flex items-start gap-3">
                <MapPin className="text-brand-primary shrink-0 mt-1" size={20} />
                <span>Junín 615, 1A<br/>San Miguel de Tucumán</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="text-brand-primary shrink-0" size={20} />
                <span>+54 381 2310357</span>
              </p>
            </div>
            <a 
              href="https://wa.me/543812310357"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block text-center w-full bg-white border border-gray-200 hover:border-brand-primary text-gray-800 font-medium py-2.5 rounded-md transition-colors"
            >
              Contactar sucursal
            </a>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:border-brand-primary/30 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand-light text-brand-primary flex items-center justify-center">2</span>
              Yerba Buena
            </h3>
            <div className="space-y-4 text-gray-600">
              <p className="flex items-start gap-3">
                <MapPin className="text-brand-primary shrink-0 mt-1" size={20} />
                <span>Av. Solano Vera esquina Mendoza<br/>Yerba Buena, Tucumán</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="text-brand-primary shrink-0" size={20} />
                <span>+54 381 2581179</span>
              </p>
            </div>
            <a 
              href="https://wa.me/543812581179"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block text-center w-full bg-white border border-gray-200 hover:border-brand-primary text-gray-800 font-medium py-2.5 rounded-md transition-colors"
            >
              Contactar sucursal
            </a>
          </div>

          <div className="bg-brand-primary p-8 rounded-xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <MapPin size={120} />
            </div>
            <h3 className="text-xl font-bold mb-6 relative z-10 flex items-center gap-2">
              <MessageCircle size={24} />
              Propiedades en Salta
            </h3>
            <p className="text-brand-light mb-8 relative z-10 leading-relaxed">
              Contactanos por WhatsApp y coordiná una reunión personalizada con nuestros asesores para conocer las mejores oportunidades disponibles en Salta.
            </p>
            <a 
              href="https://wa.me/543812310357?text=Hola, quiero consultar por propiedades en Salta."
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 block text-center w-full bg-white text-brand-primary font-bold py-3 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
            >
              Consultar por Salta
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
