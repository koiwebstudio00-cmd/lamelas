import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  const trustItems = [
    'Atención personalizada',
    'Transparencia en cada operación',
    'Conocimiento del mercado local'
  ];

  return (
    <section id="nosotros" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative aspect-[4/5] md:aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://i.postimg.cc/sDmPh7LR/Chat-GPT-Image-7-jul-2026-08-45-49-p-m.png" 
                alt="Equipo Lamelas y Chaumont" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-transparent"></div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <span className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Nuestra Historia</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Sobre Lamelas y Chaumont</h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Somos Marcos Chaumont y Pablo Lamelas, dos amigos que desde 2020 construimos un espacio pensado para acompañarte en una de las decisiones más importantes: encontrar, vender o alquilar una propiedad. En Lamelas y Chaumont trabajamos con atención personalizada, transparencia y compromiso en cada operación.
            </p>

            <div className="space-y-4">
              {trustItems.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  key={index} 
                  className="flex items-center gap-3"
                >
                  <div className="text-brand-primary bg-brand-light p-1 rounded-full">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-gray-800 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-gray-100">
              <p className="text-sm text-gray-500 italic">
                "Nuestra prioridad es que sientas respaldo y tranquilidad en cada paso."
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
