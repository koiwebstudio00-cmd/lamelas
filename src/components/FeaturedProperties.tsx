import React, { useRef } from 'react';
import PropertyCard from './PropertyCard';
import { Property } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedPropertiesProps {
  properties: Property[];
}

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  // Sin flag de destacadas en la BD: se muestran las más recientes disponibles.
  const featured = properties.slice(0, 4);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollByViewport = (direction: 1 | -1) => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  // Sin propiedades cargadas no mostramos una sección vacía.
  if (featured.length === 0) return null;

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
          <span className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Recién ingresadas</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">Propiedades destacadas</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Oportunidades seleccionadas por nuestro equipo, con calidad, diseño y excelente ubicación.
          </p>
        </motion.div>

        {/* xl: grilla de 4 columnas · <xl: slider con scroll-snap (1 card en mobile, 2 en tablet) */}
        <div className="relative mb-12">
          <motion.div
            ref={sliderRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-6 pb-2 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:grid xl:grid-cols-4 xl:overflow-visible xl:mx-0 xl:px-0 xl:pb-0"
          >
            {featured.map(property => (
              <motion.div
                variants={itemVariants}
                key={property.id}
                className="snap-start shrink-0 w-[88%] sm:w-[calc(50%-12px)] xl:w-auto xl:shrink"
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>

          {/* Controles del slider (solo tablet/mobile), debajo para no tapar las cards */}
          {featured.length > 1 && (
            <div className="xl:hidden flex items-center justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => scrollByViewport(-1)}
                aria-label="Propiedades anteriores"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white text-gray-700 shadow-md ring-1 ring-black/5 hover:text-brand-primary active:scale-95 transition-all"
              >
                <ChevronLeft size={22} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByViewport(1)}
                aria-label="Propiedades siguientes"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white text-gray-700 shadow-md ring-1 ring-black/5 hover:text-brand-primary active:scale-95 transition-all"
              >
                <ChevronRight size={22} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

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
