'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAppStore, Route, OptimizationScenario } from '@/lib/store';
import { optimizeVehicles, generateRoutes, generateCurrentRoutes } from '@/lib/routeOptimizer';
import GoogleSheetView from '@/components/DataSheet/GoogleSheetView';
import ScenarioComparison from '@/components/Optimization/ScenarioComparison';
import GoogleMap from '@/components/Map/GoogleMap';
import RouteVisualization from '@/components/Map/RouteVisualization';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import MonitoringDashboard from '@/components/Dashboard/MonitoringDashboard';
import FeaturesSlider from '@/components/Features/FeaturesSlider';
import CTASection from '@/components/UI/CTASection';

export default function Home() {
  const [screen, setScreen] = useState<'data' | 'optimization' | 'results'>('data');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [costSavingRoutes, setCostSavingRoutes] = useState<Route[]>([]);
  const [experienceRoutes, setExperienceRoutes] = useState<Route[]>([]);
  const [optimumRoutes, setOptimumRoutes] = useState<Route[]>([]);
  
  const officeLocation = useAppStore((state) => state.officeLocation);
  const passengerCount = useAppStore((state) => state.passengerCount);
  const constraints = useAppStore((state) => state.constraints);
  const routes = useAppStore((state) => state.routes);
  const currentRoutes = useAppStore((state) => state.currentRoutes);
  const optimizationScenario = useAppStore((state) => state.optimizationScenario);
  const isLoading = useAppStore((state) => state.isLoading);
  
  const setRoutes = useAppStore((state) => state.setRoutes);
  const setCurrentRoutes = useAppStore((state) => state.setCurrentRoutes);
  const setOptimizationScenario = useAppStore((state) => state.setOptimizationScenario);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const setOfficeLocation = useAppStore((state) => state.setOfficeLocation);
  const setPassengerCount = useAppStore((state) => state.setPassengerCount);

  useEffect(() => {
    if (!officeLocation) {
      setOfficeLocation({
        lat: 24.36524921,
        lng: 54.56290389,
        address: 'Abu Dhabi, UAE',
      });
    }
    if (passengerCount < 60) {
      setPassengerCount(65);
    }
  }, [officeLocation, passengerCount, setOfficeLocation, setPassengerCount]);

  const handleOptimize = async () => {
    if (!officeLocation) return;

    setIsLoading(true);
    
    const previewRoutes = generateCurrentRoutes(officeLocation, passengerCount, constraints);
    setCurrentRoutes(previewRoutes);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const costVehicles = optimizeVehicles(passengerCount, constraints, 'cost-saving');
    const experienceVehicles = optimizeVehicles(passengerCount, constraints, 'experience-optimizing');
    const optimumVehicles = optimizeVehicles(passengerCount, constraints, 'optimum');

    const costRoutes = generateRoutes(
      officeLocation,
      passengerCount,
      constraints,
      costVehicles,
      'cost-saving'
    );
    
    const expRoutes = generateRoutes(
      officeLocation,
      passengerCount,
      constraints,
      experienceVehicles,
      'experience-optimizing'
    );

    const optRoutes = generateRoutes(
      officeLocation,
      passengerCount,
      constraints,
      optimumVehicles,
      'optimum'
    );

    setCostSavingRoutes(costRoutes);
    setExperienceRoutes(expRoutes);
    setOptimumRoutes(optRoutes);
    
    setIsLoading(false);
    setScreen('optimization');
  };

  const handleSelectScenario = (scenario: OptimizationScenario) => {
    if (!scenario) return;
    setOptimizationScenario(scenario);
    
    if (scenario === 'cost-saving') {
      setRoutes(costSavingRoutes);
    } else if (scenario === 'experience-optimizing') {
      setRoutes(experienceRoutes);
    } else if (scenario === 'optimum') {
      setRoutes(optimumRoutes);
    }
    
    setScreen('results');
  };

  const handleBookCall = () => {
    window.open('https://calendly.com/swvl-advisor', '_blank');
  };

  const handleCallNow = () => {
    window.open('tel:+971501234567', '_self');
  };

  const handleReset = () => {
    useAppStore.getState().reset();
    setScreen('data');
    setCostSavingRoutes([]);
    setExperienceRoutes([]);
    setOptimumRoutes([]);
  };

  const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);
  const avgTime = routes.length > 0 
    ? Math.round(routes.reduce((sum, route) => sum + route.totalTime, 0) / routes.length)
    : 0;
  const totalStops = routes.reduce((sum, route) => sum + route.pickupPoints.length, 0);
  const avgSpeed = routes.reduce((sum, r) => sum + r.totalTime, 0) > 0
    ? Math.round((routes.reduce((sum, r) => sum + r.totalDistance, 0) / routes.reduce((sum, r) => sum + r.totalTime, 0)) * 60)
    : 0;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image 
                src="/swvl-logo.svg" 
                alt="SWVL Logo" 
                width={120}
                height={33}
                className="h-8 w-auto"
                priority
              />
              <p className="hidden sm:block text-sm text-gray-600">Enterprise Transport Solutions</p>
            </div>
            {screen !== 'data' && (
              <Button variant="outline" onClick={handleReset} className="text-sm px-4 py-2">
                Reset
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-6">
            {[
              { id: 'data', label: 'Your Data' },
              { id: 'optimization', label: 'Optimization' },
              { id: 'results', label: 'Results' },
            ].map((s, index) => {
              const screenIndex = ['data', 'optimization', 'results'].indexOf(screen);
              const isActive = index <= screenIndex;
              const isCurrent = s.id === screen;

              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                        isActive
                          ? 'bg-swvl-primary text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {index < 2 && (
                    <div
                      className={`h-0.5 w-20 mx-4 rounded-full ${
                        isActive ? 'bg-swvl-primary' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="lg:sticky lg:top-24 h-[500px] lg:h-[calc(100vh-200px)]">
            <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
              <GoogleMap 
                onLocationSelect={(location) => {
                  setOfficeLocation(location);
                }}
                onMapReady={(mapInstance, loaded) => {
                  setMap(mapInstance);
                  setIsMapLoaded(loaded);
                }}
              />
              {isMapLoaded && map && screen !== 'data' && (
                <RouteVisualization 
                  map={map} 
                  isLoaded={isMapLoaded}
                  routes={screen === 'optimization' && !optimizationScenario ? currentRoutes : routes}
                />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Screen 1: Data Sheet */}
              {screen === 'data' && (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GoogleSheetView onOptimize={handleOptimize} />
                </motion.div>
              )}

              {/* Screen 2: Optimization */}
              {screen === 'optimization' && (
                <motion.div
                  key="optimization"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center p-12 bg-white rounded-lg border border-gray-200">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : (
                    <>
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          Optimized Routes Generated
                        </h2>
                        <p className="text-sm text-gray-600">
                          Routes mapped to your office location. Choose your optimization strategy.
                        </p>
                      </div>

                      <ScenarioComparison
                        costSavingRoutes={costSavingRoutes}
                        experienceRoutes={experienceRoutes}
                        optimumRoutes={optimumRoutes}
                        currentRoutes={currentRoutes}
                        onSelectScenario={handleSelectScenario}
                        selectedScenario={optimizationScenario}
                      />

                      <div>
                        <Button variant="outline" onClick={() => setScreen('data')}>
                          Back
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* Screen 3: Results */}
              {screen === 'results' && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Optimized Transportation Solution
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      {optimizationScenario === 'cost-saving' 
                        ? 'Cost Efficient: Minimizing operational costs with larger vehicles'
                        : optimizationScenario === 'optimum'
                        ? 'Optimum: Balanced approach for cost and experience'
                        : 'Experience: Optimizing for employee comfort and shorter routes'}
                    </p>

                    <div className="space-y-3">
                      {routes.map((route) => (
                        <div
                          key={route.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {route.vehicle.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {route.pickupPoints.reduce((sum, p) => sum + p.passengers, 0)} employees • {route.pickupPoints.length} pickup{route.pickupPoints.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {route.totalDistance} km
                              </p>
                              <p className="text-xs text-gray-500">
                                {route.totalTime} min
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <MonitoringDashboard />

                  <FeaturesSlider />

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h4 className="text-base font-semibold text-gray-900 mb-4">Trip Metrics</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-swvl-primary mb-1">
                          {totalDistance.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-600">Total Distance (km)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-swvl-primary mb-1">
                          {avgTime}
                        </p>
                        <p className="text-xs text-gray-600">Avg. Time (min)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-swvl-primary mb-1">
                          {totalStops}
                        </p>
                        <p className="text-xs text-gray-600">Total Stops</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-swvl-primary mb-1">
                          {avgSpeed}
                        </p>
                        <p className="text-xs text-gray-600">Avg. Speed (km/h)</p>
                      </div>
                    </div>
                  </div>

                  <CTASection onBookCall={handleBookCall} onCallNow={handleCallNow} />

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setScreen('optimization')}>
                      Back
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      Start Over
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
