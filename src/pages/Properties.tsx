import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Search } from 'lucide-react';

function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-[4/3] bg-gray-200"></div>
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-10 bg-gray-100 rounded mt-4"></div>
      </div>
    </div>
  );
}
import { Property, TIPOS, TIPO_LABELS } from '../types';
import { fetchProperties, fetchZonas, SortOption, DEFAULT_PAGE_SIZE } from '../lib/properties';
import { useSeo } from '../lib/seo';

/** Números de página a mostrar: 1 … vecinos de la actual … última */
function pageNumbers(current: number, totalPages: number): (number | '…')[] {
  const pages = new Set<number>([1, totalPages]);
  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('…');
    result.push(p);
  });
  return result;
}

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [zonas, setZonas] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const opParam = searchParams.get('op');
  useSeo({
    title:
      opParam === 'venta'
        ? 'Propiedades en venta en Tucumán'
        : opParam === 'alquiler'
          ? 'Propiedades en alquiler en Tucumán'
          : 'Propiedades en venta y alquiler en Tucumán',
    description:
      'Buscá casas, departamentos, terrenos y locales disponibles en Tucumán, Yerba Buena y Salta. Filtrá por operación, tipo, precio y dormitorios.',
  });

  const page = Math.max(1, parseInt(searchParams.get('pagina') || '1') || 1);
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));

  const goToPage = (p: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (p <= 1) {
      newParams.delete('pagina');
    } else {
      newParams.set('pagina', String(p));
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 0 });
  };

  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    operation: searchParams.get('op') || '',
    type: searchParams.get('tipo') || '',
    zone: searchParams.get('zona') || '',
    minPrice: searchParams.get('min') || '',
    maxPrice: searchParams.get('max') || '',
    bedrooms: searchParams.get('dormitorios') || '',
    sort: 'recent' as SortOption,
  });

  // Zonas disponibles para el filtro (una sola vez)
  useEffect(() => {
    fetchZonas().then(setZonas).catch(() => setZonas([]));
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'sort') return;
    const paramKey =
      key === 'query' ? 'q' :
      key === 'operation' ? 'op' :
      key === 'type' ? 'tipo' :
      key === 'zone' ? 'zona' :
      key === 'minPrice' ? 'min' :
      key === 'maxPrice' ? 'max' :
      key === 'bedrooms' ? 'dormitorios' : key;
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(paramKey, value);
    } else {
      newParams.delete(paramKey);
    }
    newParams.delete('pagina'); // cambiar filtros vuelve a la página 1
    setSearchParams(newParams);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    // Debounce: evita una consulta por tecla en los campos de precio
    const timer = setTimeout(() => {
      fetchProperties({
      q: filters.query || undefined,
      operacion: filters.operation || undefined,
      tipo: filters.type || undefined,
      zona: filters.zone || undefined,
      dormitoriosMin: filters.bedrooms ? parseInt(filters.bedrooms) : undefined,
      precioMin: filters.minPrice ? parseInt(filters.minPrice) : undefined,
      precioMax: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
        sort: filters.sort,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      })
        .then(({ properties, total }) => {
          if (!cancelled) {
            setProperties(properties);
            setTotal(total);
          }
        })
        .catch(() => {
          if (!cancelled) setError(true);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [filters, page]);

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
                  <label htmlFor="filter-q" className="block text-sm font-semibold text-gray-700 mb-2">Buscar</label>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                    <input
                      id="filter-q"
                      type="search"
                      value={filters.query}
                      onChange={(e) => handleFilterChange('query', e.target.value)}
                      placeholder="Ej: monoambiente en barrio sur"
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="filter-op" className="block text-sm font-semibold text-gray-700 mb-2">Operación</label>
                  <select
                    id="filter-op"
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
                  <label htmlFor="filter-tipo" className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Propiedad</label>
                  <select
                    id="filter-tipo"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  >
                    <option value="">Cualquiera</option>
                    {TIPOS.map(tipo => (
                      <option key={tipo} value={tipo}>{TIPO_LABELS[tipo]}</option>
                    ))}
                  </select>
                </div>

                {zonas.length > 0 && (
                  <div>
                    <label htmlFor="filter-zona" className="block text-sm font-semibold text-gray-700 mb-2">Zona</label>
                    <select
                      id="filter-zona"
                      value={filters.zone}
                      onChange={(e) => handleFilterChange('zone', e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    >
                      <option value="">Todas</option>
                      {zonas.map(zona => (
                        <option key={zona} value={zona}>{zona}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rango de Precio</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      aria-label="Precio mínimo"
                      placeholder="Mínimo"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm"
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      aria-label="Precio máximo"
                      placeholder="Máximo"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="filter-dorm" className="block text-sm font-semibold text-gray-700 mb-2">Dormitorios</label>
                  <select
                    id="filter-dorm"
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  >
                    <option value="">Indistinto</option>
                    <option value="1">1 dormitorio</option>
                    <option value="2">2 dormitorios</option>
                    <option value="3">3 dormitorios</option>
                    <option value="4">4 o más</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  setFilters({ query: '', operation: '', type: '', zone: '', minPrice: '', maxPrice: '', bedrooms: '', sort: 'recent' });
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
                {loading
                  ? 'Buscando propiedades…'
                  : `${total} ${total === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="filter-sort" className="text-sm text-gray-500 whitespace-nowrap">Ordenar por:</label>
                <select
                  id="filter-sort"
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

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" aria-hidden="true">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">No pudimos cargar las propiedades</h3>
                <p className="text-gray-600">Probá de nuevo en unos minutos.</p>
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      filtroOperacion={
                        filters.operation === 'venta' || filters.operation === 'alquiler'
                          ? filters.operation
                          : undefined
                      }
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav aria-label="Paginación" className="mt-10 flex items-center justify-center gap-1 sm:gap-2">
                    <button
                      onClick={() => goToPage(page - 1)}
                      disabled={page <= 1}
                      aria-label="Página anterior"
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:border-brand-primary hover:text-brand-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <ChevronLeft size={20} aria-hidden="true" />
                    </button>

                    {pageNumbers(page, totalPages).map((p, i) =>
                      p === '…' ? (
                        <span key={`gap-${i}`} className="px-1 text-gray-400 select-none">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => goToPage(p)}
                          aria-label={`Página ${p}`}
                          aria-current={p === page ? 'page' : undefined}
                          className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-sm font-semibold transition-colors tabular-nums ${
                            p === page
                              ? 'bg-brand-primary text-white shadow-sm'
                              : 'border border-gray-200 bg-white text-gray-700 hover:border-brand-primary hover:text-brand-primary'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => goToPage(page + 1)}
                      disabled={page >= totalPages}
                      aria-label="Página siguiente"
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:border-brand-primary hover:text-brand-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <ChevronRight size={20} aria-hidden="true" />
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron propiedades</h3>
                <p className="text-gray-600">Probá quitando algún filtro o ampliando el rango de precio.</p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
