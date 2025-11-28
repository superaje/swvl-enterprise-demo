'use client';

import { motion } from 'framer-motion';
import { Route } from '@/lib/store';

interface CurrentRoutesPreviewProps {
  routes: Route[];
  onTransform: () => void;
}

export default function CurrentRoutesPreview({ routes, onTransform }: CurrentRoutesPreviewProps) {
  const totalVehicles = routes.length;
  const totalDistance = routes.reduce((sum, r) => sum + r.totalDistance, 0);
  const totalTime = routes.reduce((sum, r) => sum + r.totalTime, 0);
  const totalPassengers = routes.reduce(
    (sum, r) => sum + r.pickupPoints.reduce((s, p) => s + p.passengers, 0),
    0
  );
  const avgUtilization = routes.length > 0
    ? Math.round((totalPassengers / routes.reduce((sum, r) => sum + r.vehicle.capacity, 0)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 p-4 sm:p-6"
    >
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-swvl-dark mb-2">Current Process Preview</h3>
          <p className="text-xs sm:text-sm text-swvl-gray-500">
            This is how your routes are currently organized before optimization
          </p>
        </div>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-swvl-light rounded-lg p-3 text-center">
          <p className="text-xl sm:text-2xl font-bold text-swvl-dark mb-1">{totalVehicles}</p>
          <p className="text-xs text-swvl-gray-500">Vehicles</p>
        </div>
        <div className="bg-swvl-light rounded-lg p-3 text-center">
          <p className="text-xl sm:text-2xl font-bold text-swvl-dark mb-1">{totalDistance.toFixed(1)}</p>
          <p className="text-xs text-swvl-gray-500">Total km</p>
        </div>
        <div className="bg-swvl-light rounded-lg p-3 text-center">
          <p className="text-xl sm:text-2xl font-bold text-swvl-dark mb-1">{Math.round(totalTime / totalVehicles)}</p>
          <p className="text-xs text-swvl-gray-500">Avg. min</p>
        </div>
        <div className="bg-swvl-light rounded-lg p-3 text-center">
          <p className="text-xl sm:text-2xl font-bold text-swvl-dark mb-1">{avgUtilization}%</p>
          <p className="text-xs text-swvl-gray-500">Utilization</p>
        </div>
      </div>

      {/* Current Routes List */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        {routes.map((route, index) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-2 sm:p-3 bg-swvl-light rounded-lg"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-xl sm:text-2xl">{route.vehicle.icon}</div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-swvl-dark">{route.vehicle.name}</p>
                <p className="text-xs text-swvl-gray-500">
                  {route.pickupPoints.reduce((sum, p) => sum + p.passengers, 0)} passengers • {route.pickupPoints.length} stops
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium text-swvl-gray-600">{route.totalDistance} km</p>
              <p className="text-xs text-swvl-gray-500">~{route.totalTime} min</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transform Button */}
      <motion.button
        onClick={onTransform}
        className="w-full bg-gradient-to-r from-swvl-primary to-swvl-accent text-white font-bold py-3 sm:py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Transform My Routes</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </motion.button>
    </motion.div>
  );
}

