import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockProperties } from '../data/mockProperties';
import PropertyCard from '../components/PropertyCard';
import { Filter, SlidersHorizontal } from 'lucide-react';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState(mockProperties);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    operation: searchParams.get('op') || '',
    type: searchParams.get('tipo') || '',
    zone: searchParams.get('zona') || '',
    minPrice: searchParams.get('min') || '',
    maxPrice: searchParams.get('max') || '',
    bedrooms: searchParams.get('dormitorios') || '',
    sort: 'recent'
  });

  const propertyTypes = [
    'Terrenos', 'Departamentos', 'Casas', 'Oficinas', 'Locales', 'Cocheras', 'PH', 'Edificios comerciales', 'Depósitos', 'Fondos de comercio', 'Galpones', 'Terrenos comerciales'
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key === 'operation' ? 'op' : key === 'type' ? 'tipo' : key, value);
    } else {
      newParams.delete(key === 'operation' ? 'op' : key === 'type' ? 'tipo' : key);
    }
    setSearchParams(newParams);
  };

  useEffect(() => {
    // In a real app, this would be an API call with the filters
    let result = [...mockProperties];
    
    if (filters.operation) {
      result = result.filter(p => p.operation.toLowerCase() === filters.operation.toLowerCase());
    }
    if (filters.type) {
      result = result.filter(p => p.type.toLowerCase() === filters.type.toLowerCase());
    }
    if (filters.bedrooms) {
      result = result.filter(p => p.features.bedrooms >= parseInt(filters.bedrooms));
    }
    if (filters.minPrice) {
      result = result.filter(p => p.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= parseInt(filters.maxPrice));
    }

    if (filters.sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'recent') {
      result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    }
    
    setProperties(result);
  }, [filters]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Propiedades</h1>
            <p className="text-gray-600">Encontrá el lugar ideal para tu próximo proyecto.</p>
          </div>
          
          <button 
            className="md:hidden flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md font-medium text-gray-700 w-full justify-center"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          >
            <Filter size={18} />
            Filtros avanzados
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className={`w-full lg:w-1/4 ${showFiltersMobile ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <SlidersHorizontal size={20} className="text-brand-primary" />
                <h3 className="font-bold text-gray-900 text-lg">Filtros</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Operación</label>
                  <select 
                    value={filters.operation}
                    onChange={(e) => handleFilterChange('operation', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  >
                    <option value="">Todas</option>
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Propiedad</label>
                  <select 
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  >
                    <option value="">Cualquiera</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type.toLowerCase()}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rango de Precio</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Mínimo" 
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm"
                    />
                    <input 
                      type="number" 
                      placeholder="Máximo" 
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dormitorios</label>
                  <select 
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  >
                    <option value="">Indistinto</option>
                    <option value="1">1 o más</option>
                    <option value="2">2 o más</option>
                    <option value="3">3 o más</option>
                    <option value="4">4 o más</option>
                  </select>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setFilters({ operation: '', type: '', zone: '', minPrice: '', maxPrice: '', bedrooms: '', sort: 'recent' });
                  setSearchParams(new URLSearchParams());
                }}
                className="w-full mt-8 text-brand-primary font-medium hover:underline text-sm"
              >
                Limpiar filtros
              </button>
            </div>
          </aside>

          {/* Properties Grid */}
          <div className="w-full lg:w-3/4">
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 font-medium">
                {properties.length} {properties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 whitespace-nowrap">Ordenar por:</span>
                <select 
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="p-2 border-none bg-gray-50 rounded-md text-sm font-medium focus:ring-0 text-gray-700"
                >
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                </select>
              </div>
            </div>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron propiedades</h3>
                <p className="text-gray-600">Intentá ajustando los filtros de búsqueda.</p>
              </div>
            )}
            
          </div>

        </div>
      </div>
    </div>
  );
}
