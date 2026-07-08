import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Hero() {
  const navigate = useNavigate();
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/propiedades');
  };

  return (
    <section className="relative min-h-[100dvh] lg:min-h-[700px] flex items-center justify-center overflow-hidden py-12">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute top-[-30%] left-0 w-full h-[160%] bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(https://i.postimg.cc/y6P7485C/Chat-GPT-Image-7-jul-2026-08-30-18-p-m.png)',
            transform: `translateY(${offsetY * 0.4}px)`
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center mt-8 md:mt-16 flex flex-col items-center justify-center w-full">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
        >
          Encontrá tu próxima propiedad
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden md:block text-lg md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto font-light"
        >
          Casas, departamentos, terrenos, locales y oportunidades seleccionadas en Tucumán, Yerba Buena, Salta y alrededores.
        </motion.p>

        {/* Search Module */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-brand-dark/40 backdrop-blur-md border border-white/20 p-4 md:p-6 rounded-xl shadow-2xl w-full max-w-5xl mx-auto"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            
            <div className="flex flex-col text-left col-span-1">
              <label className="text-xs font-semibold text-white/90 mb-1 uppercase tracking-wider">Operación</label>
              <select className="p-2.5 bg-white border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 shadow-sm">
                <option value="">Todas</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>

            <div className="flex flex-col text-left col-span-1">
              <label className="text-xs font-semibold text-white/90 mb-1 uppercase tracking-wider">Tipo</label>
              <select className="p-2.5 bg-white border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 shadow-sm">
                <option value="">Cualquiera</option>
                <option value="casas">Casas</option>
                <option value="departamentos">Departamentos</option>
                <option value="terrenos">Terrenos</option>
                <option value="locales">Locales</option>
              </select>
            </div>

            <div className="flex flex-col text-left col-span-2 md:col-span-1 lg:col-span-1">
              <label className="text-xs font-semibold text-white/90 mb-1 uppercase tracking-wider">Ubicación</label>
              <input type="text" placeholder="Ej: Yerba Buena" className="p-2.5 bg-white border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 shadow-sm" />
            </div>

            <div className="flex flex-col text-left col-span-1">
              <label className="text-xs font-semibold text-white/90 mb-1 uppercase tracking-wider">Precio Mín.</label>
              <input type="number" placeholder="0" className="p-2.5 bg-white border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 shadow-sm" />
            </div>

            <div className="flex flex-col text-left col-span-1">
              <label className="text-xs font-semibold text-white/90 mb-1 uppercase tracking-wider">Precio Máx.</label>
              <input type="number" placeholder="Sin límite" className="p-2.5 bg-white border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 shadow-sm" />
            </div>

            <div className="flex flex-col justify-end col-span-2 md:col-span-1 lg:col-span-1">
              <button type="submit" className="w-full bg-brand-primary text-white p-2.5 rounded-md font-bold hover:bg-brand-primary/90 transition-colors flex items-center justify-center gap-2 h-[46px] shadow-sm">
                <Search size={18} />
                <span>Buscar</span>
              </button>
            </div>
            
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8"
        >
          <a href="#tasaciones" className="text-white hover:text-brand-light font-medium underline underline-offset-4 transition-colors">
            Solicitar tasación
          </a>
        </motion.div>
      </div>
    </section>
  );
}
