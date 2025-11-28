import { Vehicle, VEHICLES } from './constants';
import { OfficeLocation, Constraints, Route } from './store';

// Generate random pickup points around the office location
function generatePickupPoints(
  officeLocation: OfficeLocation,
  passengerCount: number,
  maxDistance: number
): Array<{ lat: number; lng: number; passengers: number }> {
  const points: Array<{ lat: number; lng: number; passengers: number }> = [];
  const numPoints = Math.ceil(passengerCount / 4); // Average 4 passengers per pickup point
  
  for (let i = 0; i < numPoints; i++) {
    // Generate random offset within maxDistance (in degrees, roughly)
    const distanceKm = Math.random() * maxDistance * 0.8; // Stay within 80% of max
    const angle = (Math.PI * 2 * i) / numPoints; // Distribute evenly around circle
    
    // Rough conversion: 1 degree latitude ≈ 111 km
    const latOffset = (distanceKm * Math.cos(angle)) / 111;
    const lngOffset = (distanceKm * Math.sin(angle)) / (111 * Math.cos(officeLocation.lat * Math.PI / 180));
    
    const passengers = i === numPoints - 1 
      ? passengerCount - points.reduce((sum, p) => sum + p.passengers, 0)
      : Math.floor(passengerCount / numPoints) + Math.floor(Math.random() * 3);
    
    points.push({
      lat: officeLocation.lat + latOffset,
      lng: officeLocation.lng + lngOffset,
      passengers: Math.max(1, passengers),
    });
  }
  
  return points;
}

// Generate path between points
function generatePath(
  points: Array<{ lat: number; lng: number }>,
  officeLocation: OfficeLocation
): Array<{ lat: number; lng: number }> {
  const path: Array<{ lat: number; lng: number }> = [];
  
  // Start from first pickup point
  if (points.length > 0) {
    path.push({ lat: points[0].lat, lng: points[0].lng });
    
    // Add intermediate points for smooth curves
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      // Add a few intermediate points for smooth path
      const steps = 5;
      for (let j = 1; j <= steps; j++) {
        const t = j / steps;
        path.push({
          lat: prev.lat + (curr.lat - prev.lat) * t,
          lng: prev.lng + (curr.lng - prev.lng) * t,
        });
      }
    }
    
    // Finally, route to office
    const lastPoint = points[points.length - 1];
    const steps = 10;
    for (let j = 1; j <= steps; j++) {
      const t = j / steps;
      path.push({
        lat: lastPoint.lat + (officeLocation.lat - lastPoint.lat) * t,
        lng: lastPoint.lng + (officeLocation.lng - lastPoint.lng) * t,
      });
    }
  }
  
  return path;
}

// Calculate distance between two points (Haversine formula, simplified)
function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * Math.PI / 180) *
      Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Optimize vehicle selection based on passenger count, constraints, and scenario
export function optimizeVehicles(
  passengerCount: number,
  constraints: Constraints,
  scenario: 'cost-saving' | 'experience-optimizing' = 'cost-saving'
): Vehicle[] {
  const selected: Vehicle[] = [];
  let remaining = passengerCount;
  
  if (scenario === 'cost-saving') {
    // Cost-saving: Prefer larger vehicles (60-seater bus if available, then 50-seater, then van)
    // Sort vehicles by capacity (largest first)
    const sortedVehicles = [...VEHICLES].sort((a, b) => b.capacity - a.capacity);
    
    // Greedy selection: use largest vehicles first
    for (const vehicle of sortedVehicles) {
      if (remaining <= 0) break;
      
      const numVehicles = Math.ceil(remaining / vehicle.capacity);
      for (let i = 0; i < numVehicles && remaining > 0; i++) {
        selected.push(vehicle);
        remaining -= vehicle.capacity;
      }
    }
  } else {
    // Experience-optimizing: Prefer smaller vehicles (14-seater van, then sedan)
    // Sort vehicles by capacity (smallest first, but skip very small ones)
    const sortedVehicles = [...VEHICLES]
      .filter(v => v.capacity >= 4) // At least sedan size
      .sort((a, b) => a.capacity - b.capacity);
    
    // Use smaller vehicles for better utilization and shorter routes
    for (const vehicle of sortedVehicles) {
      if (remaining <= 0) break;
      
      // For experience-optimizing, try to fill vehicles to 90-95% capacity
      const targetCapacity = Math.floor(vehicle.capacity * 0.9);
      const numVehicles = Math.ceil(remaining / targetCapacity);
      
      for (let i = 0; i < numVehicles && remaining > 0; i++) {
        const passengersForThisVehicle = Math.min(targetCapacity, remaining);
        if (passengersForThisVehicle > 0) {
          selected.push(vehicle);
          remaining -= passengersForThisVehicle;
        }
      }
    }
  }
  
  return selected;
}

// Generate routes for selected vehicles
export function generateRoutes(
  officeLocation: OfficeLocation,
  passengerCount: number,
  constraints: Constraints,
  vehicles: Vehicle[],
  scenario: 'cost-saving' | 'experience-optimizing' = 'cost-saving'
): Route[] {
  const routes: Route[] = [];
  let remainingPassengers = passengerCount;
  let passengerIndex = 0;
  
  for (const vehicle of vehicles) {
    if (remainingPassengers <= 0) break;
    
    let vehiclePassengers: number;
    let maxDistance: number;
    let avgSpeed: number;
    
    if (scenario === 'cost-saving') {
      // Cost-saving: Accept longer distances, use larger vehicles
      vehiclePassengers = Math.min(vehicle.capacity, remainingPassengers);
      maxDistance = constraints.maxDistance * 1.2; // Allow 20% more distance
      avgSpeed = 35; // Slightly slower due to larger vehicles
    } else {
      // Experience-optimizing: Shorter distances, better coordination
      vehiclePassengers = Math.min(Math.floor(vehicle.capacity * 0.95), remainingPassengers);
      maxDistance = constraints.maxDistance * 0.8; // 20% less distance
      avgSpeed = 45; // Faster due to smaller vehicles and better routes
    }
    
    const pickupPoints = generatePickupPoints(
      officeLocation,
      vehiclePassengers,
      maxDistance
    );
    
    const path = generatePath(pickupPoints.map(p => ({ lat: p.lat, lng: p.lng })), officeLocation);
    
    // Calculate total distance
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      totalDistance += calculateDistance(path[i], path[i + 1]);
    }
    
    // Estimate time based on scenario
    const totalTime = Math.round((totalDistance / avgSpeed) * 60); // minutes
    
    routes.push({
      id: `route-${routes.length}-${scenario}`,
      vehicle,
      pickupPoints,
      path,
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalTime: Math.min(totalTime, constraints.maxTime * (scenario === 'cost-saving' ? 1.2 : 0.9)),
    });
    
    remainingPassengers -= vehiclePassengers;
    passengerIndex++;
  }
  
  return routes;
}

// Generate current/preview routes (before optimization)
export function generateCurrentRoutes(
  officeLocation: OfficeLocation,
  passengerCount: number,
  constraints: Constraints
): Route[] {
  // Simulate inefficient current process - uses random vehicle mix
  const vehicles = [VEHICLES[0], VEHICLES[1]]; // Mix of sedan and van
  return generateRoutes(officeLocation, passengerCount, constraints, vehicles, 'cost-saving');
}

