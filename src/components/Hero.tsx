import React, { useEffect, useState } from 'react';
import { Search, MapPin, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { TIPOS, TIPO_LABELS } from '../types';
import WhatsAppIcon from './WhatsAppIcon';

const operations = [
  { value: '', label: 'Todas' },
  { value: 'venta', label: 'Venta' },
  { value: 'alquiler', label: 'Alquiler' },
];

const quickLinks = [
  { label: 'Casas en venta', to: '/propiedades?op=venta&tipo=casa' },
  { label: 'Departamentos en alquiler', to: '/propiedades?op=alquiler&tipo=departamento' },
  { label: 'Terrenos', to: '/propiedades?tipo=terreno' },
  { label: 'Locales', to: '/propiedades?tipo=local' },
];

export default function Hero() {
  const navigate = useNavigate();
  const [offsetY, setOffsetY] = useState(0);
  const [search, setSearch] = useState({ op: '', tipo: '' });

  useEffect(() => {
    // Parallax solo si el usuario no pidió menos movimiento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.op) params.set('op', search.op);
    if (search.tipo) params.set('tipo', search.tipo);
    navigate(`/propiedades${params.toString() ? `?${params}` : ''}`);
  };

  return (
    <section className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden">
      {/* Fondo con parallax + gradiente (más oscuro abajo, deja respirar la foto) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Mobile: imagen vertical */}
        <div
          className="absolute top-[-30%] left-0 w-full h-[160%] bg-cover bg-center bg-no-repeat md:hidden"
          style={{
            backgroundImage: 'url(/images/hero-mobile.png)',
            transform: `translateY(${offsetY * 0.4}px)`
          }}
        ></div>
        {/* Desktop / tablet: imagen horizontal */}
        <div
          className="absolute top-[-30%] left-0 w-full h-[160%] bg-cover bg-center bg-no-repeat hidden md:block"
          style={{
            backgroundImage: 'url(/images/hero-destkop.png)',
            transform: `translateY(${offsetY * 0.4}px)`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/75"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center pt-20 pb-12 md:pt-24 md:pb-16 flex flex-col items-center justify-center w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight text-balance max-w-4xl px-2"
        >
          Tu próxima propiedad en{' '}
          <span className="relative whitespace-nowrap">
            <span className="relative z-10">Tucumán y Salta</span>
            <span className="absolute left-0 right-0 bottom-1 md:bottom-2 h-2.5 md:h-4 bg-brand-primary/60 -rotate-1 rounded-sm" aria-hidden="true"></span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="hidden md:block text-base md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light text-pretty"
        >
          Casas, departamentos, terrenos y locales seleccionados en San Miguel de Tucumán, Yerba Buena y Salta.
        </motion.p>

        {/* Buscador: un gesto por decisión — tabs de operación, tipo y buscar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-3xl mx-auto mt-2 md:mt-0"
        >
          <form
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-2xl ring-1 ring-black/5 flex flex-col md:flex-row items-stretch gap-3"
          >
            {/* Operación como control segmentado */}
            <div role="group" aria-label="Operación" className="flex shrink-0 gap-1 bg-gray-100 p-1 rounded-lg">
              {operations.map((op) => (
                <button
                  key={op.value}
                  type="button"
                  onClick={() => setSearch(s => ({ ...s, op: op.value }))}
                  aria-pressed={search.op === op.value}
                  className={`flex-1 md:flex-none px-4 min-h-[42px] rounded-md text-sm font-semibold transition-all ${
                    search.op === op.value
                      ? 'bg-white text-brand-dark shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>

            <div className="flex-1 min-w-0">
              <label htmlFor="hero-tipo" className="sr-only">Tipo de propiedad</label>
              <select
                id="hero-tipo"
                value={search.tipo}
                onChange={(e) => setSearch(s => ({ ...s, tipo: e.target.value }))}
                className="w-full h-full p-3 min-h-[48px] bg-gray-50 border border-gray-200 rounded-lg md:px-5 text-gray-900 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 transition-colors"
              >
                <option value="">Todos los tipos de propiedad</option>
                {TIPOS.map(tipo => (
                  <option key={tipo} value={tipo}>{TIPO_LABELS[tipo]}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="shrink-0 bg-brand-primary text-white px-8 min-h-[48px] rounded-lg font-bold hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 shadow-md shadow-brand-primary/25"
            >
              <Search size={18} aria-hidden="true" />
              <span>Buscar</span>
            </button>
          </form>

          {/* Búsquedas frecuentes: al listado ya filtrado, sin tocar el form */}
          <div className="mt-4 hidden md:flex flex-wrap items-center justify-center gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm text-white/85 border border-white/25 px-4 py-1.5 rounded-full hover:bg-white/10 hover:border-white/50 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Prueba de cercanía: datos reales, sin promesas infladas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 hidden md:flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80"
        >
          <span className="flex items-center gap-2">
            <Building2 size={15} aria-hidden="true" className="text-brand-light" />
            Desde 2020 en el mercado
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={15} aria-hidden="true" className="text-brand-light" />
            Sucursales en SMT y Yerba Buena
          </span>
          <span className="flex items-center gap-2">
            <WhatsAppIcon className="h-[15px] w-[15px]" />
            Respuesta directa por WhatsApp
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-6 md:mt-8 hidden md:block"
        >
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 border border-white/40 text-white font-medium px-6 py-2.5 rounded-full hover:bg-white/10 hover:border-white/70 transition-colors"
          >
            ¿Vendés? Solicitá una tasación
          </a>
        </motion.div>
      </div>
    </section>
  );
}
