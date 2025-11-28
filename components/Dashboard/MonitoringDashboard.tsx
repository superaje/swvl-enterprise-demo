'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function MonitoringDashboard() {
  const routes = useAppStore((state) => state.routes);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || routes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => (prev + 1) % 100);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, routes.length]);

  const totalEmployees = routes.reduce(
    (sum, route) => sum + route.pickupPoints.reduce((s, p) => s + p.passengers, 0),
    0
  );
  const totalVehicles = routes.length;
  const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);
  const avgTime = Math.round(
    routes.reduce((sum, route) => sum + route.totalTime, 0) / routes.length
  );

  const completedPickups = Math.floor((currentTime / 100) * totalEmployees);
  const inTransit = totalVehicles;
  const onTime = Math.floor(totalVehicles * 0.95);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-swvl-dark">Live Monitoring Dashboard</h3>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg bg-swvl-light hover:bg-swvl-gray-200 transition-colors"
        >
          {isPlaying ? (
            <svg className="w-5 h-5 text-swvl-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-swvl-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-xs sm:text-sm text-swvl-gray-600 mb-1">Total Employees</p>
          <p className="text-xl sm:text-2xl font-bold text-swvl-dark">{totalEmployees}</p>
        </motion.div>
        <motion.div
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-xs sm:text-sm text-swvl-gray-600 mb-1">Vehicles Active</p>
          <p className="text-xl sm:text-2xl font-bold text-swvl-dark">{inTransit}</p>
        </motion.div>
        <motion.div
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-xs sm:text-sm text-swvl-gray-600 mb-1">Pickups Completed</p>
          <p className="text-xl sm:text-2xl font-bold text-swvl-dark">{completedPickups}</p>
        </motion.div>
        <motion.div
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 sm:p-4"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-xs sm:text-sm text-swvl-gray-600 mb-1">On-Time Rate</p>
          <p className="text-xl sm:text-2xl font-bold text-swvl-dark">{onTime}/{totalVehicles}</p>
        </motion.div>
      </div>

      {/* Route Status */}
      <div className="space-y-2 sm:space-y-3">
        <h4 className="text-sm sm:text-base font-semibold text-swvl-dark">Route Status</h4>
        {routes.map((route, index) => {
          const progress = Math.min((currentTime / 100) * 100, 100);
          const isActive = progress < 100;
          
          return (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-swvl-light rounded-lg"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-swvl-primary to-swvl-accent flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  {route.vehicle.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs sm:text-sm font-semibold text-swvl-dark truncate">
                    {route.vehicle.name}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {isActive ? 'In Transit' : 'Completed'}
                  </span>
                </div>
                <div className="w-full bg-swvl-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-swvl-primary to-swvl-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-xs text-swvl-gray-500">
                  <span>{route.pickupPoints.length} stops</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-swvl-gray-200 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-swvl-gray-500 mb-1">Total Distance</p>
          <p className="text-lg sm:text-xl font-bold text-swvl-primary">{totalDistance.toFixed(1)} km</p>
        </div>
        <div>
          <p className="text-xs text-swvl-gray-500 mb-1">Avg. Time</p>
          <p className="text-lg sm:text-xl font-bold text-swvl-primary">{avgTime} min</p>
        </div>
      </div>
    </motion.div>
  );
}

