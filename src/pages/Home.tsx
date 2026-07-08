import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import FeaturedProperties from '../components/FeaturedProperties';
import About from '../components/About';
import Services from '../components/Services';
import ValuationCTA from '../components/ValuationCTA';
import Branches from '../components/Branches';
import Contact from '../components/Contact';
import { mockProperties } from '../data/mockProperties';

export default function Home() {
  const location = useLocation();

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
      <FeaturedProperties properties={mockProperties} />
      <About />
      <Services />
      <ValuationCTA />
      <Branches />
      <Contact />
    </>
  );
}
