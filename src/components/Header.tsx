import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Propiedades', path: '/propiedades' },
    { name: 'Venta', path: '/propiedades?op=venta' },
    { name: 'Alquiler', path: '/propiedades?op=alquiler' },
    { name: 'Tasaciones', path: '/#tasaciones' },
    { name: 'Nosotros', path: '/#nosotros' },
    { name: 'Contacto', path: '/#contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm border-gray-200/50">
      <div className="container mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="https://i.postimg.cc/9XxsYRKG/image-removebg-preview-(4).png" 
            alt="Lamelas y Chaumont" 
            className="object-contain h-8" 
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-semibold text-gray-800 hover:text-brand-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center">
          <a
            href="https://wa.me/543812310357"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-md font-medium hover:bg-brand-dark transition-colors shadow-sm hover:shadow-md"
          >
            <Phone size={18} />
            Consultar
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-gray-800 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="text-base font-semibold text-gray-800 py-2 border-b border-gray-100/50 last:border-0 hover:text-brand-primary"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://wa.me/543812310357"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-brand-primary text-white px-5 py-3 rounded-md font-medium mt-2 shadow-sm"
          >
            <Phone size={18} />
            Consultar por WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
