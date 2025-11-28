'use client';

import { Vehicle } from '@/lib/constants';
import { motion } from 'framer-motion';

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onClick: () => void;
}

export default function VehicleCard({ vehicle, isSelected, onClick }: VehicleCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-swvl-primary bg-gradient-to-br from-swvl-primary/10 to-swvl-accent/10 shadow-md'
          : 'border-swvl-gray-200 bg-white hover:border-swvl-gray-300 hover:shadow-sm'
      }`}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{vehicle.icon}</div>
      <h3 className="font-semibold text-swvl-dark mb-0.5 sm:mb-1 text-xs sm:text-sm">{vehicle.name}</h3>
      <p className="text-xs text-swvl-gray-500">Capacity: {vehicle.capacity}</p>
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-1 sm:mt-2 text-swvl-primary font-medium text-xs sm:text-sm"
        >
          ✓ Selected
        </motion.div>
      )}
    </motion.div>
  );
}

