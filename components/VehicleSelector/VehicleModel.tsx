'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Vehicle } from '@/lib/constants';

interface VehicleModelProps {
  vehicle: Vehicle;
  isSelected: boolean;
  isHovered: boolean;
  position: [number, number, number];
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

export default function VehicleModel({
  vehicle,
  isSelected,
  isHovered,
  position,
  onClick,
  onPointerOver,
  onPointerOut,
}: VehicleModelProps) {
  const meshRef = useRef<Mesh>(null);

  // Rotate model continuously (only if not selected)
  useFrame((state, delta) => {
    if (meshRef.current && !isSelected && delta < 0.1) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Determine size based on vehicle type
  const getDimensions = () => {
    switch (vehicle.type) {
      case 'sedan':
        return { width: 1, height: 0.6, depth: 2 };
      case 'van':
        return { width: 1.2, height: 1.2, depth: 2.5 };
      case 'bus':
        return { width: 1.5, height: 2, depth: 4 };
      default:
        return { width: 1, height: 1, depth: 2 };
    }
  };

  const dimensions = getDimensions();
  const scale = isHovered ? 1.1 : isSelected ? 1.05 : 1;

  return (
    <group position={position} scale={scale}>
      {/* Main body */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onPointerOver();
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onPointerOut();
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial
          color={isSelected ? vehicle.color : isHovered ? '#FF6B35' : '#666666'}
          metalness={0.3}
          roughness={0.4}
          emissive={isSelected ? vehicle.color : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Windows */}
      <mesh position={[0, dimensions.height * 0.3, dimensions.depth * 0.2]}>
        <boxGeometry args={[dimensions.width * 0.8, dimensions.height * 0.4, dimensions.depth * 0.3]} />
        <meshStandardMaterial
          color="#87CEEB"
          transparent
          opacity={0.6}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Wheels */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {/* Front wheel */}
          <mesh position={[side * dimensions.width * 0.6, -dimensions.height * 0.3, dimensions.depth * 0.3]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Back wheel */}
          <mesh position={[side * dimensions.width * 0.6, -dimensions.height * 0.3, -dimensions.depth * 0.3]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Selection glow effect */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[dimensions.width + 0.2, dimensions.height + 0.2, dimensions.depth + 0.2]} />
          <meshStandardMaterial
            color={vehicle.color}
            transparent
            opacity={0.2}
            emissive={vehicle.color}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

