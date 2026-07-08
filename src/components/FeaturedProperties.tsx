import React from 'react';
import PropertyCard from './PropertyCard';
import { Property } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface FeaturedPropertiesProps {
  properties: Property[];
}

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  const featured = properties.filter(p => p.featured).slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Propiedades destacadas</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Oportunidades seleccionadas por nuestro equipo para vos. Encontrá calidad, diseño y excelente ubicación.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {featured.map(property => (
            <motion.div variants={itemVariants} key={property.id}>
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link 
            to="/propiedades" 
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-brand-primary text-brand-primary font-semibold rounded-md hover:bg-brand-primary hover:text-white transition-all duration-300"
          >
            Ver todas las propiedades
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
