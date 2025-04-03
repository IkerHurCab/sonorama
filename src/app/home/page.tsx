"use client"

// Importaciones de React
import { useState, useEffect, useRef } from 'react';
// Importaciones de componentes
import { GlobeMain } from '../globe/GlobeMain'; // Componente de Globe 3D
import { HomeMap } from '../globe/map'; // Componente de mapa 2D
import { Timeline } from '../globe/Timeline';
import { Filters } from '../globe/Filters';
import { Navbar } from './Navbar';
import { SettingsModal, type Settings as SettingsType } from '../globe/SettingsModal';
// Importaciones de iconos
import { ChevronLeft, ChevronRight, Settings} from 'lucide-react';

const MIN_YEAR = -35000;
const MAX_YEAR = 2023;

// Configuración por defecto de la aplicación
export const DEFAULT_SETTINGS: SettingsType = {
  visual: {
    rotationSpeed: 0.001,
    showEffects: true,
  },
  display: {
    dateFormat: 'AC/DC',
    showNavbar: true,
    showFilters: true,
    showTimeline: true,
    showCameraButtons: true
  }
};

export default function Home() {
  const [selectedYearRange, setSelectedYearRange] = useState<[number, number]>([MIN_YEAR, MAX_YEAR]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false); // Estado para alternar entre GlobeMain y Map
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [filters, setFilters] = useState({
    search: '',
    yearRange: [MIN_YEAR, MAX_YEAR] as [number, number],
    categories: [] as string[],
    eventTypes: [] as string[],
    regions: [] as string[]
  });
  const [isPaused, setIsPaused] = useState(false);
  const [settingsButtonRef, setSettingsButtonRef] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const orbitControlsRef = useRef(null);

  // Cargar configuración guardada
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('globeSettings');
      console.log('Cargando configuración: ', savedSettings);

      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        console.log('Configuración parseada: ', parsed);
        const newSettings = {
          visual: {
            rotationSpeed: parsed?.visual?.rotationSpeed ?? DEFAULT_SETTINGS.visual.rotationSpeed,
            showEffects: parsed?.visual?.showEffects ?? DEFAULT_SETTINGS.visual.showEffects,
          },
          display: {
            dateFormat: parsed?.display?.dateFormat ?? DEFAULT_SETTINGS.display.dateFormat,
            showNavbar: parsed?.display?.showNavbar ?? DEFAULT_SETTINGS.display.showNavbar,
            showFilters: parsed?.display?.showFilters ?? DEFAULT_SETTINGS.display.showFilters,
            showTimeline: parsed?.display?.showTimeline ?? DEFAULT_SETTINGS.display.showTimeline,
            showCameraButtons: parsed?.display?.showCameraButtons ?? DEFAULT_SETTINGS.display.showCameraButtons,
          },
        };
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  // Separar el efecto de guardado
  const saveSettings = (newSettings: SettingsType) => {
    try {
      localStorage.setItem('globeSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Manejar el clic en el botón de configuración
  const handleSettingsClick = (e: React.MouseEvent) => {
    setSettingsButtonRef({ x: e.clientX, y: e.clientY });
    setShowSettings(true);
  };

  useEffect(() => {
    // Sincronizar filters.yearRange con selectedYearRange
    if (filters.yearRange[0] !== selectedYearRange[0] ||
      filters.yearRange[1] !== selectedYearRange[1]) {
      setFilters(prev => ({
        ...prev,
        yearRange: selectedYearRange
      }));
    }
  }, [selectedYearRange]);

  return (
    <div className="w-full h-screen dark:bg-gray-200 bg-pink-100 relative">
      {settings.display.showNavbar && <Navbar />}

      {settings.display.showFilters && (
        <div className="absolute top-0 left-0 z-10 ">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute top-[50vh] left-0 ${showFilters ? 'left-[340px]' : 'left-4'} z-20 bg-[url(/fondo-inverted.png)] bg-[top_left_-30rem] bg-black/90 hover:bg-black/60 backdrop-blur-md p-2 rounded-full text-white transition-all duration-300 bg-blend-multiply`}
          >
            {showFilters ? <ChevronLeft /> : <ChevronRight />}
          </button>

          <div
            className={`transition-all duration-300 ${showFilters ? 'translate-x-0' : '-translate-x-[280px]'}`}
            style={{ pointerEvents: 'auto' }}
          >
            <Filters
              filters={filters}
              setFilters={setFilters}
              setSelectedYearRange={setSelectedYearRange}
              minYear={MIN_YEAR}
              maxYear={MAX_YEAR}
            />
          </div>
        </div>
      )}

      <div className="absolute  bottom-10/24 -translate-y-15/20 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleSettingsClick}
          className="bg-black/80 hover:bg-black/90 backdrop-blur-md p-2 rounded-full text-white transition-all duration-300"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <label className="absolute top-23 right-20 z-20 inline-flex items-center cursor-pointer mb-4">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={showMap}
          onChange={() => setShowMap(!showMap)}
        />
        <div className="w-14 h-8 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer-checked:bg-blue-500 peer-checked:before:translate-x-6 before:content-[''] before:absolute before:top-1 before:left-1 before:w-6 before:h-6 before:bg-white before:rounded-full before:transition-transform"></div>
      </label>
      {showMap ? (
        <HomeMap
          selectedYearRange={selectedYearRange}
          filters={filters}
        />
      ) : (
        <GlobeMain
          selectedYearRange={selectedYearRange}
          filters={filters}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          settings={settings}
          orbitControlsRef={orbitControlsRef}
        />
      )}

      {settings.display.showTimeline && (
        <Timeline
          selectedYearRange={selectedYearRange}
          setSelectedYearRange={setSelectedYearRange}
          minYear={MIN_YEAR}
          maxYear={MAX_YEAR}
          dateFormat={settings.display.dateFormat}
        />
      )}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={(newSettings) => {
          setSettings(newSettings);
          saveSettings(newSettings);
        }}
        buttonPosition={settingsButtonRef}
      />
    </div>
  );
}