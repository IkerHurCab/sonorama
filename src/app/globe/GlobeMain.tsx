import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Globe } from './Globe';
import { Play, Pause, Plus, Minus, RotateCcw } from 'lucide-react';
import { Settings } from './SettingsModal';
import { RefObject } from 'react';

// Configuración de cámara por defecto
const DEFAULT_CAMERA = {
  minDistance: 2,
  maxDistance: 4,
  initialDistance: 3.5
};

interface GlobeMainProps {
  selectedYearRange: [number, number];
  filters: {
    search: string;
    yearRange: [number, number];
    categories: string[];
    eventTypes: string[];
    regions: string[];
  };
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  settings: Settings;
  orbitControlsRef: RefObject<any>;
}

export function GlobeMain({ selectedYearRange, filters, isPaused, setIsPaused, settings, orbitControlsRef }: GlobeMainProps) {
  // Función para acercar la cámara
  const zoomIn = () => {
    if (orbitControlsRef.current) {
      const controls = orbitControlsRef.current;
      const currentDistance = controls.getDistance();
      const newDistance = Math.max(currentDistance - 0.5, DEFAULT_CAMERA.minDistance);

      controls.minDistance = Math.max(DEFAULT_CAMERA.minDistance, newDistance - 0.5);
      controls.maxDistance = Math.max(DEFAULT_CAMERA.minDistance + 1, newDistance + 0.5);

      // Use object position to set zoom level
      const direction = controls.object.position.clone().normalize();
      controls.object.position.copy(direction.multiplyScalar(newDistance));
    }
  };

  // Función para alejar la cámara
  const zoomOut = () => {
    if (orbitControlsRef.current) {
      const controls = orbitControlsRef.current;
      const currentDistance = controls.getDistance();
      const newDistance = Math.min(currentDistance + 0.5, DEFAULT_CAMERA.maxDistance);

      controls.minDistance = Math.max(DEFAULT_CAMERA.minDistance, newDistance - 0.5);
      controls.maxDistance = Math.min(DEFAULT_CAMERA.maxDistance, newDistance + 0.5);

      // Use object position to set zoom level
      const direction = controls.object.position.clone().normalize();
      controls.object.position.copy(direction.multiplyScalar(newDistance));
    }
  };

  // Función para resetear la cámara
  const resetCamera = () => {
    if (orbitControlsRef.current) {
      const controls = orbitControlsRef.current;
      controls.reset();
      controls.minDistance = DEFAULT_CAMERA.minDistance;
      controls.maxDistance = DEFAULT_CAMERA.maxDistance;
    }
  };

  return (
    <>
      <div className="absolute top-[105px] -translate-y-2/5 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="bg-black/80 hover:bg-black/90 backdrop-blur-md p-2 rounded-full text-white transition-all duration-300"
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>
      </div>

      {settings.display.showCameraButtons && (
        <div className="absolute bottom-1/4 -translate-y-1/4 right-4 z-20 flex flex-col gap-2 mt-24">
          <button
            onClick={zoomIn}
            className="bg-black/80 hover:bg-black/90 backdrop-blur-md p-2 rounded-full text-white transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={zoomOut}
            className="bg-black/80 hover:bg-black/90 backdrop-blur-md p-2 rounded-full text-white transition-all duration-300"
          >
            <Minus className="w-5 h-5" />
          </button>
          <button
            onClick={resetCamera}
            className="bg-black/80 hover:bg-black/90 backdrop-blur-md p-2 rounded-full text-white transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      )}

      <Canvas camera={{ position: [0, 0, DEFAULT_CAMERA.initialDistance], fov: 45 }}>
        <OrbitControls
          ref={orbitControlsRef}
          enableZoom={true}
          enablePan={false}
          minDistance={DEFAULT_CAMERA.minDistance}
          maxDistance={DEFAULT_CAMERA.maxDistance}
          zoomSpeed={0.5}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI - 0.1}
        />
        <Globe
          selectedYearRange={selectedYearRange}
          filters={filters}
          isPaused={isPaused}
          settings={settings}
        />
      </Canvas>
    </>
  );
}

// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import { GlobeDemo } from './components/GlobeDemo';

// export default function App(){
//   return (
//     <div className="w-full h-screen bg-slate-100 relative">
//       <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
//         <OrbitControls
//           enableZoom={false}
//           enablePan={false}
//           minDistance={3}
//           maxDistance={4}
//         />
//         <GlobeDemo />
//       </Canvas>
//     </div>
//   );
// }