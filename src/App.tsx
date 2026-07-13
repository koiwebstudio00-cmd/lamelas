import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Header from './components/Header';
import Footer from './components/Footer';

function Layout() {
  const { pathname } = useLocation();
  // El header es fixed: la home fluye debajo (hero full-screen); el resto compensa el alto
  const offset = pathname === '/' ? '' : 'pt-16 md:pt-[72px]';

  return (
    <div className="flex flex-col min-h-screen">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-brand-primary focus:font-semibold focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className={`flex-grow ${offset}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/propiedades" element={<Properties />} />
          <Route path="/propiedades/:slug" element={<PropertyDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
