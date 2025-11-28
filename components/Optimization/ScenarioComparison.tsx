'use client';

import { motion } from 'framer-motion';
import { Route, OptimizationScenario } from '@/lib/store';

interface ScenarioComparisonProps {
  costSavingRoutes: Route[];
  experienceRoutes: Route[];
  currentRoutes: Route[];
  onSelectScenario: (scenario: OptimizationScenario) => void;
  selectedScenario: OptimizationScenario;
}

export default function ScenarioComparison({
  costSavingRoutes,
  experienceRoutes,
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg sm:text-xl font-bold text-swvl-dark"
      >
        Choose Your Optimization Strategy
      </motion.h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Cost-Saving Scenario */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all cursor-pointer ${
            selectedScenario === 'cost-saving'
              ? 'border-swvl-primary bg-gradient-to-br from-swvl-primary/10 to-transparent shadow-lg'
              : 'border-swvl-gray-200 bg-white hover:border-swvl-gray-300'
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
              <h4 className="text-base sm:text-lg font-bold text-swvl-dark mb-1">Cost-Saving Scenario</h4>
              <p className="text-xs sm:text-sm text-swvl-gray-500">
                Minimize operational costs with larger vehicles
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Vehicles:</span>
              <span className="font-semibold text-swvl-dark">{costMetrics.totalVehicles}</span>
              {costSavings.vehicles !== 0 && (
                <span className={`text-xs ${costSavings.vehicles > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({costSavings.vehicles > 0 ? '-' : '+'}{Math.abs(costSavings.vehicles)})
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Utilization:</span>
              <span className="font-semibold text-swvl-dark">{costMetrics.avgUtilization}%</span>
              {costSavings.utilization !== 0 && (
                <span className={`text-xs ${costSavings.utilization > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({costSavings.utilization > 0 ? '+' : ''}{costSavings.utilization}%)
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Total Distance:</span>
              <span className="font-semibold text-swvl-dark">{costMetrics.totalDistance.toFixed(1)} km</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Avg. Time:</span>
              <span className="font-semibold text-swvl-dark">{Math.round(costMetrics.totalTime / costMetrics.totalVehicles)} min</span>
            </div>
          </div>

          <div className="pt-3 border-t border-swvl-gray-200">
            <p className="text-xs text-swvl-gray-500">
              ✓ Prefers larger vehicles (50-seater bus)<br />
              ✓ Higher vehicle utilization (~70%)<br />
              ✓ Accepts longer travel distances
            </p>
          </div>
        </motion.div>

        {/* Experience-Optimizing Scenario */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all cursor-pointer ${
            selectedScenario === 'experience-optimizing'
              ? 'border-swvl-primary bg-gradient-to-br from-swvl-primary/10 to-transparent shadow-lg'
              : 'border-swvl-gray-200 bg-white hover:border-swvl-gray-300'
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
              <h4 className="text-base sm:text-lg font-bold text-swvl-dark mb-1">Experience-Optimizing Scenario</h4>
              <p className="text-xs sm:text-sm text-swvl-gray-500">
                Enhance user experience with optimized routes
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Vehicles:</span>
              <span className="font-semibold text-swvl-dark">{experienceMetrics.totalVehicles}</span>
              {experienceSavings.vehicles !== 0 && (
                <span className={`text-xs ${experienceSavings.vehicles > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({experienceSavings.vehicles > 0 ? '-' : '+'}{Math.abs(experienceSavings.vehicles)})
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Utilization:</span>
              <span className="font-semibold text-swvl-dark">{experienceMetrics.avgUtilization}%</span>
              {experienceSavings.utilization !== 0 && (
                <span className={`text-xs ${experienceSavings.utilization > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({experienceSavings.utilization > 0 ? '+' : ''}{experienceSavings.utilization}%)
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Total Distance:</span>
              <span className="font-semibold text-swvl-dark">{experienceMetrics.totalDistance.toFixed(1)} km</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-swvl-gray-600">Avg. Time:</span>
              <span className="font-semibold text-swvl-dark">{Math.round(experienceMetrics.totalTime / experienceMetrics.totalVehicles)} min</span>
            </div>
          </div>

          <div className="pt-3 border-t border-swvl-gray-200">
            <p className="text-xs text-swvl-gray-500">
              ✓ Prefers smaller vehicles (14-seater van)<br />
              ✓ Higher seat utilization (up to 95%)<br />
              ✓ Shorter travel times and distances
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

