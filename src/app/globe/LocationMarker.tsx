import { useState, useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ExternalLink } from 'lucide-react';


interface LocationMarkerProps {
  position: [number, number, number];
  name: string;
  description: string;
  onHover: (isHovered: boolean) => void;
  category: string;
  type: string;
  region: string;
  year: number;
}

export function LocationMarker({
  position,
  name,
  description,
  onHover,
  category,
  type,
  region,
  year
}: LocationMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const sphereRef = useRef<THREE.Mesh>(null);
  const [popupPosition, setPopupPosition] = useState<'top' | 'bottom'>('top');
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPopupPosition(position[1] > 0 ? 'bottom' : 'top');
  }, [position]);

  useEffect(() => {
    const handleClickOuside = (event: MouseEvent) => {
      if (clicked && popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setClicked(false);
        setHovered(false);
        onHover(false);
      }
    };

    if (clicked) {
      document.addEventListener('click', handleClickOuside);
    }

    return () => {
      document.removeEventListener('click', handleClickOuside);
    };
  }, [clicked, onHover]);

  interface ThreeEvent extends THREE.Event {
    stopPropagation?: () => void;
  }
  
  const handlePointerOver = (e: ThreeEvent) => {
    e.stopPropagation?.();

    if (!clicked) {
      setHovered(true);
      onHover(true);
    }
  };
  
  const handlePointerOut = (e: ThreeEvent) => {
    e.stopPropagation?.();
    if (!clicked) {
      setHovered(false);
      onHover(false);
    }
  };
  
  const handleClick = (e: ThreeEvent) => {
    e.stopPropagation?.();
    setClicked(!clicked);
    setHovered(true);
    onHover(true);
  };
  

  const formatYear = (year: number) => {
    if (year < 0) {
      return `${Math.abs(year)} a.C.`;
    }
    return `${year} d.C.`;
  };

  const handleLinkClick = () => {
    setClicked(false);
    setHovered(false);
    onHover(false);
  }
  return (
    <group position={position}>
      <mesh
        ref={sphereRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.013, 16, 16]} />
        <meshBasicMaterial color={hovered || clicked ? "#ff4444" : "red"} />
      </mesh>
      {hovered && (
        <Html
          position={[0, popupPosition === 'bottom' ? -0.05 : 0.05, 0]}
          className={`pointer-events-auto ${popupPosition === 'bottom' ? 'origin-top' : 'origin-bottom'
            }`}
          center
          style={{
            pointerEvents: 'auto',
            /*Esta medida ayuda a que se pueda interactuar más fácilmente con los puntos de cada localización*/
            transform: `translate(10%, ${popupPosition === 'bottom' ? '0' : '-100%'})`

          }}
          distanceFactor={1.7}
        >
          <div
            ref={popupRef}
            className="bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg min-w-[250px] transform -translate-x-1/4"
            onClick={(e) => { 
              e.stopPropagation();
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover(true);
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900">{name}</h3>
              <span className="text-sm font-medium text-gray-00">{formatYear(year)}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {category}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                {type}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                {region}
              </span>
            </div>
            <a
              href={`/articles/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              onClick={handleLinkClick}
            >
              Ver más <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </Html>
      )}

    </group>
  );
}