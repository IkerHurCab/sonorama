import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { MusicNote } from './MusicNote';

export function GlobeDemo() {
  const globeRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const [notes, setNotes] = useState<{ position: [number, number, number]; id: number }[]>([]);
  const lastNoteTime = useRef(Date.now());

  const [earthTexture] = useState(() => {
    return new THREE.TextureLoader().load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'
    );
  });

  const [cloudsTexture] = useState(() => {
    return new THREE.TextureLoader().load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
    );
  });

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015;
    }

    // Añadir nuevas notas periódicamente
    if (Date.now() - lastNoteTime.current > 500) { // Cada 500ms
      const angle = Math.random() * Math.PI * 2;
      const y = Math.random() * 2 - 1;
      const radius = 1.2;
      
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      setNotes(prev => [...prev, {
        position: [x, y, z],
        id: Date.now()
      }]);
      lastNoteTime.current = Date.now();
    }
  });

  // Limpiar notas viejas
  useEffect(() => {
    const interval = setInterval(() => {
      setNotes(prev => prev.filter(note => Date.now() - note.id < 3000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <directionalLight
        position={[5, 3, 5]}
        intensity={1.5}
        castShadow
      />
      <ambientLight intensity={10} />
      <pointLight position={[10, 10, 10]} intensity={2} />

      <group ref={globeRef}>
        <Sphere args={[1, 64, 64]}>
          <meshStandardMaterial 
            map={earthTexture}
          />
        </Sphere>
      </group>

      <group ref={cloudsRef}>
        <Sphere args={[1.01, 64, 64]}>
          <meshStandardMaterial
            map={cloudsTexture}
            transparent={true}
            opacity={0.8}
          />
        </Sphere>
      </group>

      {notes.map(note => (
        <MusicNote 
          key={note.id}
          initialPosition={note.position}
        />
      ))}
    </>
  );
}
