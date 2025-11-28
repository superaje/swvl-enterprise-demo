'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { useAppStore } from '@/lib/store';
import { VEHICLES, Vehicle } from '@/lib/constants';
import VehicleModel from './VehicleModel';
import VehicleCard from './VehicleCard';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../UI/LoadingSpinner';
import VehicleSelectorErrorBoundary from './VehicleSelectorErrorBoundary';

export default function VehicleSelector3D() {
  const selectedVehicles = useAppStore((state) => state.selectedVehicles);
  const setSelectedVehicles = useAppStore((state) => state.setSelectedVehicles);
  const [hoveredVehicle, setHoveredVehicle] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleVehicleClick = (vehicle: Vehicle) => {
    const isSelected = selectedVehicles.some((v) => v.id === vehicle.id);
    
    if (isSelected) {
      setSelectedVehicles(selectedVehicles.filter((v) => v.id !== vehicle.id));
    } else {
      setSelectedVehicles([...selectedVehicles, vehicle]);
    }
  };

  const isVehicleSelected = (vehicleId: string) => {
    return selectedVehicles.some((v) => v.id === vehicleId);
  };

  // Position vehicles in a circle
  const getVehiclePosition = (index: number, total: number): [number, number, number] => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 3;
    return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-swvl-dark mb-1 sm:mb-2">Choose Your Fleet</h3>
        <p className="text-xs sm:text-sm text-swvl-gray-500">
          Select the vehicles that best fit your needs, or let our system optimize automatically
        </p>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl overflow-hidden mb-3 sm:mb-4 border border-white/50 shadow-inner min-h-[300px]">
        {isMounted ? (
          <VehicleSelectorErrorBoundary>
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              <Canvas shadows gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
                <PerspectiveCamera makeDefault position={[0, 5, 8]} fov={50} />
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
                <pointLight position={[-10, -10, -5]} intensity={0.4} />
                
                <Environment preset="sunset" />
                
                {VEHICLES.map((vehicle, index) => (
                  <VehicleModel
                    key={vehicle.id}
                    vehicle={vehicle}
                    isSelected={isVehicleSelected(vehicle.id)}
                    isHovered={hoveredVehicle === vehicle.id}
                    position={getVehiclePosition(index, VEHICLES.length)}
                    onClick={() => handleVehicleClick(vehicle)}
                    onPointerOver={() => setHoveredVehicle(vehicle.id)}
                    onPointerOut={() => setHoveredVehicle(null)}
                  />
                ))}
                
                <OrbitControls
                  enableZoom={true}
                  enablePan={false}
                  minDistance={6}
                  maxDistance={12}
                  autoRotate={false}
                  enableDamping={true}
                  dampingFactor={0.05}
                />
              </Canvas>
            </Suspense>
          </VehicleSelectorErrorBoundary>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
      </div>

      {/* Vehicle Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <AnimatePresence>
          {VEHICLES.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VehicleCard
                vehicle={vehicle}
                isSelected={isVehicleSelected(vehicle.id)}
                onClick={() => handleVehicleClick(vehicle)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {selectedVehicles.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-swvl-primary bg-opacity-10 rounded-lg"
        >
          <p className="text-sm text-swvl-dark">
            <span className="font-semibold">{selectedVehicles.length}</span> vehicle(s) selected
          </p>
        </motion.div>
      )}
    </div>
  );
}

