import React from 'react';
import { Home, Key, Building, Calculator, Briefcase, Map, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export default function Services() {
  const services = [
    { icon: <Home size={32} />, title: 'Compra de propiedades' },
    { icon: <Key size={32} />, title: 'Venta de propiedades' },
    { icon: <Building size={32} />, title: 'Alquileres' },
    { icon: <Calculator size={32} />, title: 'Tasaciones' },
    { icon: <Briefcase size={32} />, title: 'Administración' },
    { icon: <Compass size={32} />, title: 'Asesoramiento inmobiliario' },
    { icon: <Map size={32} />, title: 'Propiedades en Salta' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Soluciones integrales</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Nuestros Servicios</h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center"
        >
          {services.map((service, index) => (
            <motion.div 
              variants={itemVariants}
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col items-center justify-center text-center h-full min-h-[220px]"
            >
              <div className="text-brand-primary mb-4 p-4 bg-brand-light rounded-full group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
            </motion.div>
          ))}

          {/* CTA Card with Glassmorphism */}
          <motion.div 
            variants={itemVariants}
            className="relative rounded-xl overflow-hidden shadow-sm group flex flex-col items-center justify-center text-center h-full min-h-[220px]"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-brand-dark/20 backdrop-blur-[4px] group-hover:bg-brand-dark/30 transition-all duration-300"></div>
            
            <div className="relative z-10 p-8 flex flex-col items-center justify-center w-full h-full">
              <h3 className="text-xl font-bold text-white mb-6 leading-tight drop-shadow-md">¿No encontrás lo que buscás?</h3>
              <a 
                href="#contacto" 
                className="w-full bg-white text-brand-dark font-bold px-4 py-2.5 rounded-md hover:bg-brand-light transition-colors text-sm shadow-sm"
              >
                Contactanos
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
