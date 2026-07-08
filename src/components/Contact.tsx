import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Consulta enviada. Nos pondremos en contacto pronto.");
  };

  return (
    <section id="contacto" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-5/12"
          >
            <span className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Contacto</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Hablemos de tu próxima propiedad</h2>
            <p className="text-lg text-gray-600 mb-10">
              Comunicate con la sucursal que prefieras para una atención inmediata, o dejanos tu consulta y nuestro equipo de asesores se pondrá en contacto a la brevedad.
            </p>

            <div className="space-y-6">
              <a href="https://wa.me/543812310357" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:border-brand-primary hover:shadow-md transition-all group">
                <div className="bg-brand-light p-3 rounded-full text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sucursal SMT</h4>
                  <p className="text-sm text-gray-500">Enviar WhatsApp</p>
                </div>
              </a>

              <a href="https://wa.me/543812581179" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:border-brand-primary hover:shadow-md transition-all group">
                <div className="bg-brand-light p-3 rounded-full text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sucursal Yerba Buena</h4>
                  <p className="text-sm text-gray-500">Enviar WhatsApp</p>
                </div>
              </a>

              <a href="https://wa.me/543812310357" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-brand-primary rounded-lg shadow-md hover:bg-brand-dark transition-all group text-white">
                <div className="bg-white/20 p-3 rounded-full">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Sucursal Salta</h4>
                  <p className="text-sm text-brand-light">Atención personalizada</p>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-7/12"
          >
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Dejanos tu mensaje</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nombre completo</label>
                    <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50" placeholder="Ej. Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Teléfono</label>
                    <input required type="tel" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50" placeholder="Código de área + número" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input required type="email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50" placeholder="tu@email.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Motivo de consulta</label>
                  <select required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-700">
                    <option value="">Seleccionar...</option>
                    <option value="comprar">Quiero comprar</option>
                    <option value="alquilar">Quiero alquilar</option>
                    <option value="vender">Quiero vender</option>
                    <option value="tasar">Quiero tasar mi propiedad</option>
                    <option value="otro">Otro motivo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mensaje</label>
                  <textarea required rows={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none" placeholder="Escribí tu consulta detallada aquí..."></textarea>
                </div>

                <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-md hover:bg-brand-primary transition-colors duration-300">
                  Enviar consulta
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
