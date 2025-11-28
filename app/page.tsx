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

  // Initialize with default office location (UAE) and 60+ passengers
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
    
    // Generate current routes (inefficient)
    const previewRoutes = generateCurrentRoutes(officeLocation, passengerCount, constraints);
    setCurrentRoutes(previewRoutes);
    
    // Simulate optimization delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate all three optimization scenarios
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
    // You can integrate with a phone call service or show a form
    window.open('tel:+971501234567', '_self');
  };

  const handleReset = () => {
    useAppStore.getState().reset();
    setScreen('data');
    setCostSavingRoutes([]);
    setExperienceRoutes([]);
    setOptimumRoutes([]);
  };

  // Calculate trip metrics
  const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);
  const avgTime = routes.length > 0 
    ? Math.round(routes.reduce((sum, route) => sum + route.totalTime, 0) / routes.length)
    : 0;
  const totalStops = routes.reduce((sum, route) => sum + route.pickupPoints.length, 0);
  const avgSpeed = routes.reduce((sum, r) => sum + r.totalTime, 0) > 0
    ? Math.round((routes.reduce((sum, r) => sum + r.totalDistance, 0) / routes.reduce((sum, r) => sum + r.totalTime, 0)) * 60)
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-swvl-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image 
                  src="/swvl-logo.svg" 
                  alt="SWVL Logo" 
                  width={120}
                  height={33}
                  className="h-6 sm:h-8 w-auto"
                  priority
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="hidden sm:block"
              >
                <p className="text-xs sm:text-sm text-swvl-gray-500 font-medium">Enterprise Transport Solutions</p>
              </motion.div>
            </div>
            {screen !== 'data' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Button variant="outline" onClick={handleReset} className="text-xs sm:text-sm px-3 sm:px-6 py-2">
                  Reset
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Screen Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-4">
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
                    <motion.div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
                        isActive
                          ? 'bg-gradient-to-br from-swvl-primary to-swvl-accent text-white shadow-lg'
                          : 'bg-swvl-gray-200 text-swvl-gray-500'
                      }`}
                      animate={{ scale: isCurrent ? 1.15 : 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {index + 1}
                    </motion.div>
                    <span
                      className={`mt-2 text-xs sm:text-sm font-medium ${
                        isActive ? 'text-swvl-dark' : 'text-swvl-gray-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {index < 2 && (
                    <motion.div
                      className={`h-1 w-16 sm:w-24 mx-2 sm:mx-4 rounded-full ${
                        isActive ? 'bg-gradient-to-r from-swvl-primary to-swvl-accent' : 'bg-swvl-gray-200'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isActive ? 1 : 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Map */}
          <div className="lg:sticky lg:top-8 order-2 lg:order-1 h-[400px] sm:h-[500px] lg:h-[calc(100vh-200px)]">
            <motion.div
              className="w-full h-full rounded-xl overflow-hidden shadow-xl border border-white/50 bg-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="w-full h-full">
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
            </motion.div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            <AnimatePresence mode="wait">
              {/* Screen 1: Data Sheet */}
              {screen === 'data' && (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <GoogleSheetView onOptimize={handleOptimize} />
                </motion.div>
              )}

              {/* Screen 2: Optimization Options */}
              {screen === 'optimization' && (
                <motion.div
                  key="optimization"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="space-y-4 sm:space-y-6"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : (
                    <>
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-swvl-dark mb-2">
                          Optimized Routes Generated
                        </h2>
                        <p className="text-xs sm:text-sm text-swvl-gray-500 mb-4">
                          Routes mapped to your office location. Choose your optimization strategy:
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

                      <div className="flex justify-between">
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
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 p-4 sm:p-6">
                    <motion.h2 
                      className="text-lg sm:text-xl font-semibold text-swvl-dark mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      Your Optimized Transportation Solution
                    </motion.h2>
                    <motion.p
                      className="text-swvl-gray-500 mb-4 sm:mb-6 text-xs sm:text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {optimizationScenario === 'cost-saving' 
                        ? '💰 Cost Efficient: Minimizing operational costs with larger vehicles'
                        : optimizationScenario === 'optimum'
                        ? '⚖️ Optimum: Balanced approach for cost and experience'
                        : '⭐ Experience: Optimizing for employee comfort and shorter routes'}
                    </motion.p>

                    <div className="space-y-3 sm:space-y-4">
                      {routes.map((route, index) => (
                        <motion.div
                          key={route.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="p-3 sm:p-4 border border-swvl-gray-200 rounded-lg hover:border-swvl-primary hover:shadow-md transition-all bg-gradient-to-r from-white to-swvl-light/30"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-swvl-dark mb-1 text-sm sm:text-base">
                                {route.vehicle.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-swvl-gray-500">
                                {route.pickupPoints.reduce((sum, p) => sum + p.passengers, 0)} employees • {route.pickupPoints.length} pickup point{route.pickupPoints.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-medium text-swvl-primary">
                                {route.totalDistance} km
                              </p>
                              <p className="text-xs text-swvl-gray-500">
                                ~{route.totalTime} min
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Monitoring Dashboard */}
                  <MonitoringDashboard />

                  {/* Features Slider */}
                  <FeaturesSlider />

                  {/* Trip Metrics */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="bg-gradient-to-br from-swvl-light to-white rounded-xl p-4 sm:p-6 border border-swvl-gray-200"
                  >
                    <h4 className="text-sm sm:text-base font-semibold text-swvl-dark mb-3 sm:mb-4">Trip Metrics</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-swvl-primary mb-1">
                          {totalDistance.toFixed(1)}
                        </p>
                        <p className="text-xs text-swvl-gray-500">Total Distance (km)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-swvl-primary mb-1">
                          {avgTime}
                        </p>
                        <p className="text-xs text-swvl-gray-500">Avg. Time (min)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-swvl-primary mb-1">
                          {totalStops}
                        </p>
                        <p className="text-xs text-swvl-gray-500">Total Stops</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-swvl-primary mb-1">
                          {avgSpeed}
                        </p>
                        <p className="text-xs text-swvl-gray-500">Avg. Speed (km/h)</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* CTA Section */}
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
