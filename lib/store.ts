import { create } from 'zustand';
import { Vehicle } from './constants';

export interface OfficeLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Constraints {
  maxTime: number; // minutes
  maxDistance: number; // km
}

export type OptimizationScenario = 'cost-saving' | 'experience-optimizing' | 'optimum' | null;

export interface Route {
  id: string;
  vehicle: Vehicle;
  pickupPoints: Array<{ lat: number; lng: number; passengers: number }>;
  path: Array<{ lat: number; lng: number }>;
  totalDistance: number;
  totalTime: number;
}

interface AppState {
  officeLocation: OfficeLocation | null;
  passengerCount: number;
  constraints: Constraints;
  selectedVehicles: Vehicle[];
  routes: Route[];
  currentRoutes: Route[]; // Routes before optimization (preview)
  optimizationScenario: OptimizationScenario;
  isLoading: boolean;
  setOfficeLocation: (location: OfficeLocation) => void;
  setPassengerCount: (count: number) => void;
  setConstraints: (constraints: Constraints) => void;
  setSelectedVehicles: (vehicles: Vehicle[]) => void;
  setRoutes: (routes: Route[]) => void;
  setCurrentRoutes: (routes: Route[]) => void;
  setOptimizationScenario: (scenario: OptimizationScenario) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  officeLocation: null,
  passengerCount: 10,
  constraints: {
    maxTime: 30,
    maxDistance: 20,
  },
  selectedVehicles: [],
  routes: [],
  currentRoutes: [],
  optimizationScenario: null as OptimizationScenario,
  isLoading: false,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setOfficeLocation: (location) => set({ officeLocation: location }),
  setPassengerCount: (count) => set({ passengerCount: count }),
  setConstraints: (constraints) => set({ constraints }),
  setSelectedVehicles: (vehicles) => set({ selectedVehicles: vehicles }),
  setRoutes: (routes) => set({ routes }),
  setCurrentRoutes: (routes) => set({ currentRoutes: routes }),
  setOptimizationScenario: (scenario) => set({ optimizationScenario: scenario }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  reset: () => set(initialState),
}));

