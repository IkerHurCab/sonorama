import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { LocationMarker } from './LocationMarker';
import eventsData from '../data/events.json';
import { DisplaySettings } from './SettingsModal';

interface GlobeProps {
  selectedYearRange: [number, number];
  filters: {
    search: string;
    yearRange: [number, number];
    categories: string[];
    eventTypes: string[];
    regions: string[];
  };
  isPaused: boolean;
  settings: {
    visual: {
      rotationSpeed: number;
      showEffects: boolean;
    };
    display: DisplaySettings;
  };
}

export function Globe({ selectedYearRange, filters, isPaused, settings }: GlobeProps) {
  const globeRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(settings.visual.rotationSpeed);
  const targetSpeedRef = useRef(settings.visual.rotationSpeed);
  
  // Cargar texturas
  const [earthTexture] = useState(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('/assets/images/earth/4k-earth_atmos.webp');
  });

  const [cloudsTexture] = useState(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('/assets/images/clouds/4k-earth_blue_marble_cloud_map__.webp');
  });

  // Actualizar velocidad de rotación cuando cambian las props
  useEffect(() => {
    if (isHovered || isPaused) {
      targetSpeedRef.current = 0;
    } else {
      targetSpeedRef.current = settings.visual.rotationSpeed;
    }
  }, [isHovered, isPaused, settings.visual.rotationSpeed]);

  // Actualizar velocidad de rotación cuando cambia la configuración
  useEffect(() => {
    setRotationSpeed(settings.visual.rotationSpeed);
    targetSpeedRef.current = settings.visual.rotationSpeed;
  }, [settings.visual.rotationSpeed]);

  // Animar la rotación del globo
  useFrame(() => {
    if (globeRef.current) {
      // Suavizar la transición de velocidad
      setRotationSpeed(prev => {
        const diff = targetSpeedRef.current - prev;
        return prev + diff * 0.05;
      });

      // Aplicar rotación
      globeRef.current.rotation.y += rotationSpeed;
    }
    
    // Rotar nubes independientemente
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015;
    }
  });

  // Filtrar eventos según los criterios
  const getCurrentEvents = () => {
    const filteredEvents = eventsData.events
      .filter(event => {
        // Filtrar por rango de años
        if (event.year < selectedYearRange[0] || event.year > selectedYearRange[1]) {
          return false;
        }

        return event.events.some(e => {
          // Filtro por búsqueda
          if (filters.search && !e.name.toLowerCase().includes(filters.search.toLowerCase()) &&
            !e.description.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
          }

          // Filtro por categorías
          if (filters.categories.length > 0 && !filters.categories.includes(e.category)) {
            return false;
          }

          // Filtro por tipos de eventos
          if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(e.type)) {
            return false;
          }

          // Filtro por regiones
          if (filters.regions.length > 0 && !filters.regions.includes(e.region)) {
            return false;
          }

          return true;
        });
      })
      .flatMap(event => event.events.map(e => ({ ...e, year: event.year })));

    return filteredEvents;
  };

  return (
    <>
      <ambientLight intensity={8} />
      <pointLight position={[10, 10, 10]} intensity={2} />

      <group ref={globeRef}>
        <Sphere args={[1, 64, 64]}>
          <meshStandardMaterial map={earthTexture} />
        </Sphere>

        {settings.visual.showEffects && (
          <Sphere args={[1.01, 64, 64]}>
            <meshStandardMaterial
              map={cloudsTexture}
              transparent={true}
              opacity={0.8}
            />
          </Sphere>
        )}

        {getCurrentEvents().map((event, index) => (
          <LocationMarker
            key={`${event.name}-${index}`}
            position={latLngToVector3(event.lat, event.lng)}
            name={event.name}
            description={event.description}
            onHover={setIsHovered}
            category={event.category}
            type={event.type}
            region={event.region}
            year={event.year}
          />
        ))}
      </group>
    </>
  );
}

// Función para convertir coordenadas geográficas a posición 3D
function latLngToVector3(lat: number, lng: number): [number, number, number] {
  const radius = 1.02;
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}