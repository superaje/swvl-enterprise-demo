'use client';

import { motion } from 'framer-motion';
import { Route, OptimizationScenario } from '@/lib/store';

interface ScenarioComparisonProps {
  costSavingRoutes: Route[];
  experienceRoutes: Route[];
  optimumRoutes: Route[];
  currentRoutes: Route[];
  onSelectScenario: (scenario: OptimizationScenario) => void;
  selectedScenario: OptimizationScenario;
}

export default function ScenarioComparison({
  costSavingRoutes,
  experienceRoutes,
  optimumRoutes,
  currentRoutes,
  onSelectScenario,
  selectedScenario,
}: ScenarioComparisonProps) {
  const calculateMetrics = (routes: Route[]) => {
    const totalDistance = routes.reduce((sum, r) => sum + r.totalDistance, 0);
    const totalTime = routes.reduce((sum, r) => sum + r.totalTime, 0);
    const totalVehicles = routes.length;
    const totalPassengers = routes.reduce(
      (sum, r) => sum + r.pickupPoints.reduce((s, p) => s + p.passengers, 0),
      0
    );
    const avgUtilization = routes.length > 0
      ? Math.round((totalPassengers / routes.reduce((sum, r) => sum + r.vehicle.capacity, 0)) * 100)
      : 0;
    
    return { totalDistance, totalTime, totalVehicles, avgUtilization, totalPassengers };
  };

  const currentMetrics = calculateMetrics(currentRoutes);
  const costMetrics = calculateMetrics(costSavingRoutes);
  const experienceMetrics = calculateMetrics(experienceRoutes);
  const optimumMetrics = calculateMetrics(optimumRoutes);

  const costSavings = {
    vehicles: currentMetrics.totalVehicles - costMetrics.totalVehicles,
    distance: currentMetrics.totalDistance - costMetrics.totalDistance,
    time: currentMetrics.totalTime - costMetrics.totalTime,
    utilization: costMetrics.avgUtilization - currentMetrics.avgUtilization,
  };

  const experienceSavings = {
    vehicles: currentMetrics.totalVehicles - experienceMetrics.totalVehicles,
    distance: currentMetrics.totalDistance - experienceMetrics.totalDistance,
    time: currentMetrics.totalTime - experienceMetrics.totalTime,
    utilization: experienceMetrics.avgUtilization - currentMetrics.avgUtilization,
  };

  const optimumSavings = {
    vehicles: currentMetrics.totalVehicles - optimumMetrics.totalVehicles,
    distance: currentMetrics.totalDistance - optimumMetrics.totalDistance,
    time: currentMetrics.totalTime - optimumMetrics.totalTime,
    utilization: optimumMetrics.avgUtilization - currentMetrics.avgUtilization,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg sm:text-xl font-bold text-swvl-dark"
      >
        Choose Your Optimization Strategy
      </motion.h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Cost-Saving Scenario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all cursor-pointer ${
            selectedScenario === 'cost-saving'
              ? 'border-swvl-primary bg-gradient-to-br from-swvl-primary/10 to-transparent shadow-lg scale-105'
              : 'border-swvl-gray-200 bg-white hover:border-swvl-gray-300 hover:shadow-md'
          }`}
          onClick={() => onSelectScenario('cost-saving')}
        >
          {selectedScenario === 'cost-saving' && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-swvl-primary rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          <div className="flex items-start gap-3 mb-4">
            <div className="text-3xl">💰</div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-swvl-dark mb-1">Cost Efficient</h4>
              <p className="text-xs sm:text-sm text-swvl-gray-500">
                Minimize operational costs
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Vehicles:</span>
              <span className="font-semibold text-swvl-dark">{costMetrics.totalVehicles}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Utilization:</span>
              <span className="font-semibold text-swvl-dark">{costMetrics.avgUtilization}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Distance:</span>
              <span className="font-semibold text-swvl-dark">{costMetrics.totalDistance.toFixed(1)} km</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Avg. Time:</span>
              <span className="font-semibold text-swvl-dark">{Math.round(costMetrics.totalTime / costMetrics.totalVehicles)} min</span>
            </div>
          </div>

          <div className="pt-3 border-t border-swvl-gray-200">
            <p className="text-xs text-swvl-gray-500">
              ✓ Larger vehicles<br />
              ✓ ~70% utilization<br />
              ✓ Lower cost per passenger
            </p>
          </div>
        </motion.div>

        {/* Optimum Scenario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all cursor-pointer ${
            selectedScenario === 'optimum'
              ? 'border-swvl-primary bg-gradient-to-br from-swvl-primary/10 to-transparent shadow-lg scale-105'
              : 'border-swvl-gray-200 bg-white hover:border-swvl-gray-300 hover:shadow-md'
          }`}
          onClick={() => onSelectScenario('optimum')}
        >
          {selectedScenario === 'optimum' && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-swvl-primary rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          <div className="flex items-start gap-3 mb-4">
            <div className="text-3xl">⚖️</div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-swvl-dark mb-1">Optimum</h4>
              <p className="text-xs sm:text-sm text-swvl-gray-500">
                Balance of cost & experience
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Vehicles:</span>
              <span className="font-semibold text-swvl-dark">{optimumMetrics.totalVehicles}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Utilization:</span>
              <span className="font-semibold text-swvl-dark">{optimumMetrics.avgUtilization}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Distance:</span>
              <span className="font-semibold text-swvl-dark">{optimumMetrics.totalDistance.toFixed(1)} km</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Avg. Time:</span>
              <span className="font-semibold text-swvl-dark">{Math.round(optimumMetrics.totalTime / optimumMetrics.totalVehicles)} min</span>
            </div>
          </div>

          <div className="pt-3 border-t border-swvl-gray-200">
            <p className="text-xs text-swvl-gray-500">
              ✓ Mixed vehicle sizes<br />
              ✓ ~85% utilization<br />
              ✓ Balanced approach
            </p>
          </div>
        </motion.div>

        {/* Experience-Optimizing Scenario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all cursor-pointer ${
            selectedScenario === 'experience-optimizing'
              ? 'border-swvl-primary bg-gradient-to-br from-swvl-primary/10 to-transparent shadow-lg scale-105'
              : 'border-swvl-gray-200 bg-white hover:border-swvl-gray-300 hover:shadow-md'
          }`}
          onClick={() => onSelectScenario('experience-optimizing')}
        >
          {selectedScenario === 'experience-optimizing' && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-swvl-primary rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          <div className="flex items-start gap-3 mb-4">
            <div className="text-3xl">⭐</div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-swvl-dark mb-1">Experience</h4>
              <p className="text-xs sm:text-sm text-swvl-gray-500">
                Optimize for comfort
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Vehicles:</span>
              <span className="font-semibold text-swvl-dark">{experienceMetrics.totalVehicles}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Utilization:</span>
              <span className="font-semibold text-swvl-dark">{experienceMetrics.avgUtilization}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Distance:</span>
              <span className="font-semibold text-swvl-dark">{experienceMetrics.totalDistance.toFixed(1)} km</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Avg. Time:</span>
              <span className="font-semibold text-swvl-dark">{Math.round(experienceMetrics.totalTime / experienceMetrics.totalVehicles)} min</span>
            </div>
          </div>

          <div className="pt-3 border-t border-swvl-gray-200">
            <p className="text-xs text-swvl-gray-500">
              ✓ Smaller vehicles<br />
              ✓ ~95% utilization<br />
              ✓ Shorter routes
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
