'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAppStore, Route, OptimizationScenario } from '@/lib/store';
import { optimizeVehicles, generateRoutes, generateCurrentRoutes } from '@/lib/routeOptimizer';
import CurrentRoutesPreview from '@/components/Optimization/CurrentRoutesPreview';
import ScenarioComparison from '@/components/Optimization/ScenarioComparison';
import GoogleMap from '@/components/Map/GoogleMap';
import RouteVisualization from '@/components/Map/RouteVisualization';
import LocationSearch from '@/components/Controls/LocationSearch';
import PassengerSlider from '@/components/Controls/PassengerSlider';
import ConstraintsInput from '@/components/Controls/ConstraintsInput';
import dynamic from 'next/dynamic';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import MonitoringDashboard from '@/components/Dashboard/MonitoringDashboard';
import FeaturesSlider from '@/components/Features/FeaturesSlider';

const VehicleSelector3D = dynamic(() => import('@/components/VehicleSelector/VehicleSelector3D'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px]">
      <LoadingSpinner size="lg" />
    </div>
  ),
});

export default function Home() {
  const [step, setStep] = useState<'location' | 'config' | 'vehicles' | 'preview' | 'scenarios' | 'results'>('location');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [costSavingRoutes, setCostSavingRoutes] = useState<Route[]>([]);
  const [experienceRoutes, setExperienceRoutes] = useState<Route[]>([]);
  
  const officeLocation = useAppStore((state) => state.officeLocation);
  const passengerCount = useAppStore((state) => state.passengerCount);
  const constraints = useAppStore((state) => state.constraints);
  const selectedVehicles = useAppStore((state) => state.selectedVehicles);
  const routes = useAppStore((state) => state.routes);
  const currentRoutes = useAppStore((state) => state.currentRoutes);
  const optimizationScenario = useAppStore((state) => state.optimizationScenario);
  const isLoading = useAppStore((state) => state.isLoading);
  const setSelectedVehicles = useAppStore((state) => state.setSelectedVehicles);
  const setRoutes = useAppStore((state) => state.setRoutes);
  const setCurrentRoutes = useAppStore((state) => state.setCurrentRoutes);
  const setOptimizationScenario = useAppStore((state) => state.setOptimizationScenario);
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    useAppStore.getState().setOfficeLocation(location);
    setTimeout(() => setStep('config'), 500);
  };

  const handleGeneratePreview = async () => {
    if (!officeLocation) return;

    setIsLoading(true);
    
    // Generate current routes (preview)
    const previewRoutes = generateCurrentRoutes(officeLocation, passengerCount, constraints);
    setCurrentRoutes(previewRoutes);
    
    setIsLoading(false);
    setStep('preview');
  };

  const handleTransform = async () => {
    if (!officeLocation) return;

    setIsLoading(true);
    
    // Simulate optimization delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate both optimization scenarios
    const costVehicles = optimizeVehicles(passengerCount, constraints, 'cost-saving');
    const experienceVehicles = optimizeVehicles(passengerCount, constraints, 'experience-optimizing');

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

    setCostSavingRoutes(costRoutes);
    setExperienceRoutes(expRoutes);
    
    setIsLoading(false);
    setStep('scenarios');
  };

  const handleSelectScenario = (scenario: OptimizationScenario) => {
    if (!scenario) return;
    setOptimizationScenario(scenario);
    if (scenario === 'cost-saving') {
      setRoutes(costSavingRoutes);
      setSelectedVehicles(optimizeVehicles(passengerCount, constraints, 'cost-saving'));
    } else {
      setRoutes(experienceRoutes);
      setSelectedVehicles(optimizeVehicles(passengerCount, constraints, 'experience-optimizing'));
    }
    setStep('results');
  };

  const handleReset = () => {
    useAppStore.getState().reset();
    setStep('location');
  };

  // Calculate trip metrics
  const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);
  const avgTime = routes.length > 0 
    ? Math.round(routes.reduce((sum, route) => sum + route.totalTime, 0) / routes.length)
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
            {step !== 'location' && (
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
        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {[
              { id: 'location', label: 'Location' },
              { id: 'config', label: 'Configuration' },
              { id: 'vehicles', label: 'Vehicles' },
              { id: 'preview', label: 'Preview' },
              { id: 'scenarios', label: 'Optimize' },
              { id: 'results', label: 'Results' },
            ].map((s, index) => {
              const stepIndex = ['location', 'config', 'vehicles', 'preview', 'scenarios', 'results'].indexOf(step);
              const isActive = index <= stepIndex;
              const isCurrent = s.id === step;

              return (
                <div key={s.id} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <motion.div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-base transition-all ${
                        isActive
                          ? 'bg-gradient-to-br from-swvl-primary to-swvl-accent text-white shadow-lg'
                          : 'bg-swvl-gray-200 text-swvl-gray-500'
                      }`}
                      animate={{ scale: isCurrent ? 1.15 : 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {index + 1}
                    </motion.div>
                    <span
                      className={`mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-center ${
                        isActive ? 'text-swvl-dark' : 'text-swvl-gray-400'
                      }`}
                    >
                      <span className="hidden sm:inline">{s.label}</span>
                      <span className="sm:hidden">{s.label.substring(0, 4)}</span>
                    </span>
                  </div>
                  {index < 5 && (
                    <motion.div
                      className={`h-1 flex-1 mx-1 sm:mx-2 rounded-full ${
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
                onLocationSelect={handleLocationSelect}
                onMapReady={(mapInstance, loaded) => {
                  setMap(mapInstance);
                  setIsMapLoaded(loaded);
                }}
              />
              {isMapLoaded && map && (
                <RouteVisualization 
                  map={map} 
                  isLoaded={isMapLoaded}
                  routes={step === 'preview' ? currentRoutes : routes}
                />
              )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Location Selection */}
              {step === 'location' && (
                <motion.div
                  key="location"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 p-4 sm:p-6"
                >
                  <motion.h2 
                    className="text-lg sm:text-xl font-semibold text-swvl-dark mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    Where is your office located?
                  </motion.h2>
                  <motion.p 
                    className="text-swvl-gray-500 mb-4 sm:mb-6 text-xs sm:text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Enter your office address in the UAE to begin optimizing your employee transportation routes.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <LocationSearch />
                  </motion.div>
                </motion.div>
              )}

              {/* Step 2: Configuration */}
              {step === 'config' && (
                <motion.div
                  key="config"
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
                      Set your transportation requirements
                    </motion.h2>
                    <motion.p 
                      className="text-swvl-gray-500 mb-4 sm:mb-6 text-xs sm:text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Configure the number of employees and your service constraints to find the optimal solution.
                    </motion.p>
                    <div className="space-y-4 sm:space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <PassengerSlider />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <ConstraintsInput />
                      </motion.div>
                    </div>
                    <motion.div 
                      className="mt-4 sm:mt-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button
                        onClick={() => setStep('vehicles')}
                        disabled={!officeLocation}
                        className="w-full"
                      >
                        Continue to Vehicle Selection
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Vehicle Selection */}
              {step === 'vehicles' && (
                <motion.div
                  key="vehicles"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 p-4 sm:p-6"
                >
                  <motion.div 
                    className="h-[400px] sm:h-[500px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <VehicleSelector3D />
                  </motion.div>
                  <motion.div 
                    className="mt-4 sm:mt-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={handleGeneratePreview}
                      disabled={selectedVehicles.length === 0 || isLoading}
                      className="w-full bg-gradient-to-r from-swvl-primary to-swvl-accent hover:from-swvl-accent hover:to-swvl-primary transition-all duration-300"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <LoadingSpinner size="sm" />
                          Generating Preview...
                        </span>
                      ) : (
                        'Preview Current Routes'
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 4: Preview Current Routes */}
              {step === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="space-y-4 sm:space-y-6"
                >
                  <CurrentRoutesPreview routes={currentRoutes} onTransform={handleTransform} />
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center p-8"
                    >
                      <LoadingSpinner size="lg" />
                    </motion.div>
                  )}
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep('vehicles')}>
                      Back
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Optimization Scenarios */}
              {step === 'scenarios' && (
                <motion.div
                  key="scenarios"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="space-y-4 sm:space-y-6"
                >
                  <ScenarioComparison
                    costSavingRoutes={costSavingRoutes}
                    experienceRoutes={experienceRoutes}
                    currentRoutes={currentRoutes}
                    onSelectScenario={handleSelectScenario}
                    selectedScenario={optimizationScenario}
                  />
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep('preview')}>
                      Back
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Results */}
              {step === 'results' && (
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
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mb-4 sm:mb-6"
                    >
                      <p className="text-swvl-gray-500 mb-2 text-xs sm:text-sm">
                        {optimizationScenario === 'cost-saving' 
                          ? '💰 Cost-Saving Optimization: Minimizing operational costs with larger vehicles'
                          : '⭐ Experience-Optimizing: Enhancing user experience with optimized routes'}
                      </p>
                      <p className="text-swvl-gray-500 text-xs sm:text-sm">
                        We&apos;ve generated {routes.length} optimized route{routes.length !== 1 ? 's' : ''} to transport {passengerCount} employee{passengerCount !== 1 ? 's' : ''} efficiently to your office location.
                      </p>
                    </motion.div>

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

                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button variant="outline" onClick={handleReset} className="flex-1">
                        Start Over
                      </Button>
                      <Button 
                        onClick={() => setStep('config')} 
                        className="flex-1 bg-gradient-to-r from-swvl-primary to-swvl-accent hover:from-swvl-accent hover:to-swvl-primary transition-all duration-300"
                      >
                        Adjust Settings
                      </Button>
                    </div>
                  </div>

                  {/* Monitoring Dashboard */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-4 sm:mt-6"
                  >
                    <MonitoringDashboard />
                  </motion.div>

                  {/* Features Slider */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="mt-4 sm:mt-6"
                  >
                    <FeaturesSlider />
                  </motion.div>

                  {/* Trip Metrics */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-4 sm:mt-6"
                  >
                    <div className="bg-gradient-to-br from-swvl-light to-white rounded-xl p-4 sm:p-6 border border-swvl-gray-200">
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
                            {routes.reduce((sum, r) => sum + r.pickupPoints.length, 0)}
                          </p>
                          <p className="text-xs text-swvl-gray-500">Total Stops</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl sm:text-3xl font-bold text-swvl-primary mb-1">
                            {Math.round((routes.reduce((sum, r) => sum + r.totalDistance, 0) / routes.reduce((sum, r) => sum + r.totalTime, 0)) * 60)}
                          </p>
                          <p className="text-xs text-swvl-gray-500">Avg. Speed (km/h)</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* CTA Section - Less Intrusive */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                    className="mt-4 sm:mt-6"
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-5 border border-swvl-gray-200 text-center">
                      <p className="text-sm sm:text-base text-swvl-gray-600 mb-3 sm:mb-4">
                        Ready to optimize your employee transportation?
                      </p>
                      <button
                        onClick={() => window.open('https://calendly.com/swvl-advisor', '_blank')}
                        className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-swvl-primary to-swvl-accent text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                      >
                        Book a Free Consultation
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </main>
  );
}

