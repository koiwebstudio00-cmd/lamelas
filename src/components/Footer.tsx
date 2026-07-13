import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-brand-primary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center h-10 w-10 rounded-lg bg-white">
                <img src="/logo.webp" alt="" width={447} height={447} className="h-7 w-7 object-contain" />
              </span>
              <span className="font-display leading-none text-white">
                <span className="block text-[15px] font-bold tracking-wide">LAMELAS &amp; CHAUMONT</span>
                <span className="block text-[11px] font-medium tracking-[0.2em] mt-1 text-brand-primary">INMOBILIARIA</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Acompañándote en cada decisión importante. Transparencia, atención personalizada y conocimiento del mercado.
            </p>
            <div className="flex gap-4">
              <a href="mailto:contacto@lamelasychaumont.com" aria-label="Enviar email" className="w-11 h-11 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors">
                <Mail size={20} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Navegación</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-brand-primary transition-colors">Inicio</Link></li>
              <li><Link to="/propiedades" className="hover:text-brand-primary transition-colors">Propiedades</Link></li>
              <li><Link to="/propiedades?op=venta" className="hover:text-brand-primary transition-colors">Venta</Link></li>
              <li><Link to="/propiedades?op=alquiler" className="hover:text-brand-primary transition-colors">Alquiler</Link></li>
              <li><a href="/#nosotros" className="hover:text-brand-primary transition-colors">Nosotros</a></li>
              <li><a href="/#contacto" className="hover:text-brand-primary transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Tipos de Propiedades</h4>
            <ul className="space-y-3">
              <li><Link to="/propiedades?tipo=casa" className="hover:text-brand-primary transition-colors">Casas</Link></li>
              <li><Link to="/propiedades?tipo=departamento" className="hover:text-brand-primary transition-colors">Departamentos</Link></li>
              <li><Link to="/propiedades?tipo=terreno" className="hover:text-brand-primary transition-colors">Terrenos</Link></li>
              <li><Link to="/propiedades?tipo=local" className="hover:text-brand-primary transition-colors">Locales Comerciales</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-primary shrink-0 mt-1" size={20} />
                <span className="text-sm">Junín 615, 1A, SMT<br/>Av. Solano Vera esq. Mendoza, YB</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-primary shrink-0" size={20} />
                <span className="text-sm">+54 381 2310357 (SMT)<br/>+54 381 2581179 (YB)</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 text-sm text-gray-500 text-center">
          <p className="mb-4 text-xs">
            Todas las medidas enunciadas son meramente orientativas. Las medidas exactas serán las que se expresen en el respectivo título de propiedad de cada inmueble. Todas las fotos, imágenes y videos son meramente ilustrativos y no contractuales. Los precios enunciados son meramente orientativos y no contractuales.
          </p>
          <p>
            &copy; 2026 Lamelas y Chaumont. Desarrollado por Koi Studio &middot; Diseñamos software e IA para resolver problemas reales de negocio.
          </p>
        </div>
      </div>
    </footer>
  );
}
