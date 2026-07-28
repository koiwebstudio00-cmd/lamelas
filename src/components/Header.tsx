import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import WhatsAppIcon from './WhatsAppIcon';

// Nav agrupada: Venta/Alquiler viven dentro de Propiedades (filtros)
const navLinks = [
  { name: 'Inicio', path: '/', end: true },
  { name: 'Propiedades', path: '/propiedades', end: false },
];

const anchorLinks = [
  { name: 'Nosotros', path: '/#nosotros' },
  { name: 'Contacto', path: '/#contacto' },
];

const mobileExtraLinks = [
  { name: 'En venta', path: '/propiedades?op=venta' },
  { name: 'En alquiler', path: '/propiedades?op=alquiler' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar con Escape y con click/tap fuera del menú
  useEffect(() => {
    if (!isMenuOpen) return;
    // Lock body scroll when menu is open
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isMenuOpen]);

  // En la home el header arranca transparente sobre el hero y se vuelve sólido al scrollear
  const overHero = pathname === '/' && !scrolled && !isMenuOpen;

  const linkBase = 'relative text-sm font-semibold transition-colors py-1 after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand-primary after:transition-all after:duration-200';
  const linkIdle = overHero
    ? 'text-white/90 hover:text-white after:w-0 hover:after:w-full after:bg-white'
    : 'text-gray-700 hover:text-gray-950 after:w-0 hover:after:w-full';
  const linkActive = overHero ? 'text-white after:w-full after:bg-white' : 'text-gray-950 after:w-full';

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        overHero
          ? 'bg-transparent border-b border-white/10'
          : 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/60'
      }`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)'
      }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-[72px]">
        <Link to="/" aria-label="Lamelas y Chaumont — Inicio" className="flex items-center gap-3">
          <span className={`flex items-center justify-center h-10 w-10 rounded-lg transition-colors ${overHero ? 'bg-white' : 'bg-brand-light/60'}`}>
            <img src="/logo.webp" alt="" width={447} height={447} className="h-7 w-7 object-contain" />
          </span>
          <span className={`font-display leading-none transition-colors ${overHero ? 'text-white' : 'text-gray-900'}`}>
            <span className="block text-[15px] font-bold tracking-wide">LAMELAS &amp; CHAUMONT</span>
            <span className={`block text-[11px] font-medium tracking-[0.2em] mt-1 ${overHero ? 'text-white/70' : 'text-brand-primary'}`}>
              INMOBILIARIA
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Principal">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
            >
              {link.name}
            </NavLink>
          ))}
          {anchorLinks.map((link) => (
            <a key={link.name} href={link.path} className={`${linkBase} ${linkIdle}`}>
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center">
          <a
            href="https://wa.me/543812310357"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm hover:shadow-md ${
              overHero
                ? 'bg-white text-gray-900 hover:bg-brand-light'
                : 'bg-brand-primary text-white hover:bg-brand-dark'
            }`}
          >
            <WhatsAppIcon className={`h-[17px] w-[17px] ${overHero ? 'text-[#25D366]' : 'text-white'}`} />
            WhatsApp
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${overHero ? 'text-white' : 'text-gray-800'}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="lg:hidden fixed left-0 w-full bg-white overflow-y-auto py-4 px-4 flex flex-col gap-1"
            style={{
              top: 'calc(4rem + env(safe-area-inset-top, 0px))',
              height: 'calc(100dvh - 4rem - env(safe-area-inset-top, 0px))'
            }}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.end}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-semibold py-3 border-b border-gray-100/50 ${
                    isActive ? 'text-brand-primary' : 'text-gray-800 hover:text-brand-primary'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            {mobileExtraLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-base py-3 pl-4 border-b border-gray-100/50 text-gray-600 hover:text-brand-primary"
              >
                {link.name}
              </Link>
            ))}
            {anchorLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-semibold py-3 border-b border-gray-100/50 last:border-0 text-gray-800 hover:text-brand-primary"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://wa.me/543812310357"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-brand-primary text-white px-5 py-3 rounded-full font-semibold mt-3 shadow-sm"
            >
              <WhatsAppIcon className="h-[18px] w-[18px] text-white" />
              Escribinos por WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
