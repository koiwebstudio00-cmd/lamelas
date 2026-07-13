import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import FeaturedProperties from '../components/FeaturedProperties';
import About from '../components/About';
import Services from '../components/Services';
import ValuationCTA from '../components/ValuationCTA';
import Contact from '../components/Contact';
import { Property } from '../types';
import { fetchProperties } from '../lib/properties';
import { useSeo } from '../lib/seo';

export default function Home() {
  const location = useLocation();

  useSeo({
    title: 'Inmobiliaria en Tucumán y Yerba Buena',
    description:
      'Casas, departamentos, terrenos y locales en venta y alquiler en Tucumán, Yerba Buena y Salta. Tasaciones y asesoramiento inmobiliario con atención personalizada.',
  });
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchProperties({ sort: 'recent', page: 1, pageSize: 4 })
      .then(({ properties }) => {
        if (!cancelled) setProperties(properties);
      })
      .catch(() => {
        if (!cancelled) setProperties([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <Hero />
      <FeaturedProperties properties={properties} />
      <About />
      <Services />
      <ValuationCTA />
      <Contact />
    </>
  );
}
