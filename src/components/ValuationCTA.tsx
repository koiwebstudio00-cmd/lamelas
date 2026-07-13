import React from 'react';

export default function ValuationCTA() {
  return (
    <section id="tasaciones" className="relative py-24">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000)' }}
      >
        <div className="absolute inset-0 bg-brand-dark/90 mix-blend-multiply"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center bg-white/10 backdrop-blur-md p-10 md:p-14 rounded-2xl border border-white/20 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Querés saber cuánto vale tu propiedad?
          </h2>
          <p className="text-lg text-gray-200 mb-10 font-light">
            Contanos sobre tu propiedad y nuestro equipo se comunica con vos para asesorarte con profesionalismo y conocimiento del mercado.
          </p>
          <a 
            href="#contacto"
            className="inline-block bg-brand-primary hover:bg-green-500 text-white px-8 py-4 rounded-md text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            Solicitar tasación
          </a>
        </div>
      </div>
    </section>
  );
}
