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

  const costMetrics = calculateMetrics(costSavingRoutes);
  const experienceMetrics = calculateMetrics(experienceRoutes);
  const optimumMetrics = calculateMetrics(optimumRoutes);

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Choose Your Optimization Strategy
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cost Efficient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`relative p-6 rounded-lg border-2 transition-all cursor-pointer ${
            selectedScenario === 'cost-saving'
              ? 'border-swvl-primary bg-white shadow-md'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => onSelectScenario('cost-saving')}
        >
          {selectedScenario === 'cost-saving' && (
            <div className="absolute top-4 right-4 w-5 h-5 bg-swvl-primary rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          <div className="mb-4">
            <div className="text-2xl mb-2">💰</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">Cost Efficient</h4>
            <p className="text-sm text-gray-600">
              Minimize operational costs
            </p>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vehicles</span>
              <span className="text-sm font-semibold text-gray-900">{costMetrics.totalVehicles}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Utilization</span>
              <span className="text-sm font-semibold text-gray-900">{costMetrics.avgUtilization}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Distance</span>
              <span className="text-sm font-semibold text-gray-900">{costMetrics.totalDistance.toFixed(1)} km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Time</span>
              <span className="text-sm font-semibold text-gray-900">
                {costMetrics.totalVehicles > 0 ? Math.round(costMetrics.totalTime / costMetrics.totalVehicles) : 0} min
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              Larger vehicles • ~70% utilization • Lower cost per passenger
            </p>
          </div>
        </motion.div>

        {/* Optimum */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`relative p-6 rounded-lg border-2 transition-all cursor-pointer ${
            selectedScenario === 'optimum'
              ? 'border-swvl-primary bg-white shadow-md'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => onSelectScenario('optimum')}
        >
          {selectedScenario === 'optimum' && (
            <div className="absolute top-4 right-4 w-5 h-5 bg-swvl-primary rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          <div className="mb-4">
            <div className="text-2xl mb-2">⚖️</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">Optimum</h4>
            <p className="text-sm text-gray-600">
              Balance of cost & experience
            </p>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vehicles</span>
              <span className="text-sm font-semibold text-gray-900">{optimumMetrics.totalVehicles}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Utilization</span>
              <span className="text-sm font-semibold text-gray-900">{optimumMetrics.avgUtilization}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Distance</span>
              <span className="text-sm font-semibold text-gray-900">{optimumMetrics.totalDistance.toFixed(1)} km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Time</span>
              <span className="text-sm font-semibold text-gray-900">
                {optimumMetrics.totalVehicles > 0 ? Math.round(optimumMetrics.totalTime / optimumMetrics.totalVehicles) : 0} min
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              Mixed vehicle sizes • ~85% utilization • Balanced approach
            </p>
          </div>
        </motion.div>

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative p-6 rounded-lg border-2 transition-all cursor-pointer ${
            selectedScenario === 'experience-optimizing'
              ? 'border-swvl-primary bg-white shadow-md'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => onSelectScenario('experience-optimizing')}
        >
          {selectedScenario === 'experience-optimizing' && (
            <div className="absolute top-4 right-4 w-5 h-5 bg-swvl-primary rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          <div className="mb-4">
            <div className="text-2xl mb-2">⭐</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">Experience</h4>
            <p className="text-sm text-gray-600">
              Optimize for comfort
            </p>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vehicles</span>
              <span className="text-sm font-semibold text-gray-900">{experienceMetrics.totalVehicles}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Utilization</span>
              <span className="text-sm font-semibold text-gray-900">{experienceMetrics.avgUtilization}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Distance</span>
              <span className="text-sm font-semibold text-gray-900">{experienceMetrics.totalDistance.toFixed(1)} km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Time</span>
              <span className="text-sm font-semibold text-gray-900">
                {experienceMetrics.totalVehicles > 0 ? Math.round(experienceMetrics.totalTime / experienceMetrics.totalVehicles) : 0} min
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              Smaller vehicles • ~95% utilization • Shorter routes
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
