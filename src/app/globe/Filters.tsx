// Importaciones de React y useState
import React, { useState, useEffect } from 'react';
// Importaciones de iconos
import { Search, Filter, X } from 'lucide-react';

interface FiltersProps {
  filters: {
    search: string;
    yearRange: [number, number];
    categories: string[];
    eventTypes: string[];
    regions: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    search: string;
    yearRange: [number, number];
    categories: string[];
    eventTypes: string[];
    regions: string[];
  }>>;
  setSelectedYearRange: (range: [number, number]) => void;
  minYear: number;
  maxYear: number;
}

// Categorías de eventos
const categories = [
  'Prehistoria',
  'Antigüedad',
  'Edad Media',
  'Renacimiento',
  'Barroco',
  'Clasicismo',
  'Romanticismo',
  'Modernismo',
  'Era Digital'
];

// Tipos de eventos
const eventTypes = [
  'Invención de Instrumentos',
  'Composiciones Importantes',
  'Nacimientos',
  'Innovaciones Técnicas',
  'Festivales',
  'Grabaciones',
  'Movimientos Musicales'
];

// Regiones geográficas
const regions = [
  'Europa',
  'Asia',
  'América del Norte',
  'América del Sur',
  'África',
  'Oceanía',
  'Oriente Medio'
];

export function Filters({ filters, setFilters, setSelectedYearRange, minYear, maxYear }: FiltersProps) {
  const [startYear, setStartYear] = useState(filters.yearRange[0].toString());
  const [endYear, setEndYear] = useState(filters.yearRange[1].toString());
  /*
  const formatYear = (year: number) => {
    if (year < 0) {
      return `${Math.abs(year)} a.C.`;
    }
    return `${year} d.C.`;
  };
  */

  // Funciones para transformación logarítmica
  const toLogarithmic = (year: number): number => {
    // Ajustamos para manejar años negativos y positivos
    const sign = year >= 0 ? 1 : -1;
    const absYear = Math.abs(year);

    // Usamos logaritmo para comprimir los años antiguos y expandir los recientes
    // Añadimos 1 para evitar log(0)
    return sign * Math.log(absYear + 1) / Math.log(Math.abs(maxYear) + 1) * Math.abs(maxYear);
  };

  const fromLogarithmic = (logValue: number): number => {
    // Convertimos de valor logarítmico a año real
    const sign = logValue >= 0 ? 1 : -1;
    const absLogValue = Math.abs(logValue);

    // Transformación inversa
    const year = Math.round(Math.exp(absLogValue * Math.log(Math.abs(maxYear) + 1) / Math.abs(maxYear)) - 1);
    return sign * year;
  };

  // Convertimos los valores del rango a escala logarítmica para visualización
  const logMinYear = toLogarithmic(minYear);
  const logMaxYear = toLogarithmic(maxYear);
  const logSelectedStart = toLogarithmic(filters.yearRange[0]);
  const logSelectedEnd = toLogarithmic(filters.yearRange[1]);

  useEffect(() => {
    setStartYear(filters.yearRange[0].toString());
    setEndYear(filters.yearRange[1].toString());
  }, [filters.yearRange]);

  const handleYearInput = (value: string, isStart: boolean) => {
    if (isStart) {
      setStartYear(value);
    } else {
      setEndYear(value);
    }

    // Intentar actualizar inmediatamente si el valor es válido
    const year = parseInt(value);
    if (!isNaN(year)) {
      if (isStart && year <= filters.yearRange[1]) {
        const newRange: [number, number] = [year, filters.yearRange[1]];
        setSelectedYearRange(newRange);
        setFilters(prev => ({
          ...prev,
          yearRange: newRange
        }));
      } else if (!isStart && year >= filters.yearRange[0]) {
        const newRange: [number, number] = [filters.yearRange[0], year];
        setSelectedYearRange(newRange);
        setFilters(prev => ({
          ...prev,
          yearRange: newRange
        }));
      }
    }
  };

  const handleYearSubmit = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>, isStart: boolean) => {
    if ('key' in e && e.key !== 'Enter') {
      return;
    }

    const value = isStart ? startYear : endYear;
    let year = parseInt(value);

    if (isNaN(year)) {
      if (isStart) {
        setStartYear(filters.yearRange[0].toString());
      } else {
        setEndYear(filters.yearRange[1].toString());
      }
      return;
    }

    // Validar rango
    if (isStart) {
      year = Math.max(minYear, Math.min(year, filters.yearRange[1]));
      setStartYear(year.toString());
      const newRange: [number, number] = [year, filters.yearRange[1]];
      setSelectedYearRange(newRange);
      setFilters(prev => ({
        ...prev,
        yearRange: newRange
      }));
    } else {
      year = Math.max(filters.yearRange[0], Math.min(year, maxYear));
      setEndYear(year.toString());
      const newRange: [number, number] = [filters.yearRange[0], year];
      setSelectedYearRange(newRange);
      setFilters(prev => ({
        ...prev,
        yearRange: newRange
      }));
    }
  };


  const handleRangeChange = (logValue: number, isStart: boolean) => {
    // Convertimos el valor logarítmico de vuelta a año real
    const realYear = fromLogarithmic(logValue);

    if (isStart) {
      if (realYear <= filters.yearRange[1]) {
        const newRange: [number, number] = [realYear, filters.yearRange[1]];
        setStartYear(realYear.toString());
        setSelectedYearRange(newRange);
        setFilters(prev => ({
          ...prev,
          yearRange: newRange
        }));
      }
    } else {
      if (realYear >= filters.yearRange[0]) {
        const newRange: [number, number] = [filters.yearRange[0], realYear];
        setEndYear(realYear.toString());
        setSelectedYearRange(newRange);
        setFilters(prev => ({
          ...prev,
          yearRange: newRange
        }));
      }
    }
  };

  // Función para alternar filtros
  const toggleFilter = (type: 'categories' | 'eventTypes' | 'regions', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };


  return (
    <div
      className="fixed top-20 left-4 bg-[url(/fondo-inverted.png)] bg-cover backdrop-blur-md rounded-lg text-white w-[280px] h-[calc(100vh-120px)] flex flex-col overflow-hidden"
      style={{ pointerEvents: 'auto' }}
    >
      <div className='flex mx-auto px-4 bg-black/80  dark:bg-black backdrop-blur-sm rounded-lg p-4 text-white w-[280px] h-[calc(100vh-120px)] flex-col overflow-hidden'>
        {/* Encabezado */}
        <div className="flex-none flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Filtros</h2>
          </div>
          <button
            onClick={() => {
              setFilters({
                search: '',
                yearRange: [minYear, maxYear],
                categories: [],
                eventTypes: [],
                regions: []
              });
              setSelectedYearRange([minYear, maxYear]);
            }}
            className="text-xs hover:text-gray-300 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>

        {/* Buscador de eventos por nombre */}
        <div className="flex-none relative mb-4">
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full bg-white/5 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Rango de años desde un año hasta un año */}
        <h3 className="text-sm font-medium mb-2">Rango de Años</h3>
        <div className="flex gap-4 mb-2">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Desde</label>
            <input
              type="text"
              value={startYear}
              onChange={(e) => handleYearInput(e.target.value, true)}
              onKeyDown={(e) => handleYearSubmit(e, true)}
              onBlur={(e) => handleYearSubmit(e, true)}
              className="w-full bg-white/5 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Hasta</label>
            <input
              type="text"
              value={endYear}
              onChange={(e) => handleYearInput(e.target.value, false)}
              onKeyDown={(e) => handleYearSubmit(e, false)}
              onBlur={(e) => handleYearSubmit(e, false)}
              className="w-full bg-white/5 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
        <div className="flex gap-4 mb-2">
          <input
            type="range"
            min={logMinYear}
            max={logMaxYear}
            value={logSelectedStart}
            onChange={(e) => handleRangeChange(Number(e.target.value), true)}
            className="w-full"
            step="1"
          />
          <input
            type="range"
            min={logMinYear}
            max={logMaxYear}
            value={logSelectedEnd}
            onChange={(e) => handleRangeChange(Number(e.target.value), false)}
            className="w-full"
            step="1"
          />
        </div>

        {/* Filtros activos */}
        {(filters.categories.length > 0 || filters.eventTypes.length > 0 || filters.regions.length > 0) && (
          <div className="flex-none mb-4 ">
            <h3 className="text-sm font-medium mb-2">Filtros Activos</h3>
            <div className="max-h-[120px] overflow-y-auto pr-2 bg-white/5 rounded-lg p-3">
              <div className="flex flex-wrap gap-2">
                {[...filters.categories, ...filters.eventTypes, ...filters.regions].map(filter => (
                  <span
                    key={filter}
                    className="text-xs bg-white/20 text-white px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap"
                  >
                    {filter}
                    <button
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          categories: prev.categories.filter(c => c !== filter),
                          eventTypes: prev.eventTypes.filter(t => t !== filter),
                          regions: prev.regions.filter(r => r !== filter)
                        }));
                      }}
                      className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3 hover:text-red-400 transition-colors" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categorías */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div className="bg-white/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Categorías</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleFilter('categories', category)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${filters.categories.includes(category)
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Tipos de Eventos</h3>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleFilter('eventTypes', type)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${filters.eventTypes.includes(type)
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <h3 className="text-sm font-medium mb-2">Regiones</h3>
          <div className="flex flex-wrap gap-2">
            {regions.map(region => (
              <button
                key={region}
                onClick={() => toggleFilter('regions', region)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${filters.regions.includes(region)
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}