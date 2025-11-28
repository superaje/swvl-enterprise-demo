import { UAE_DEFAULT_LOCATION } from './constants';

export interface LatLng {
  lat: number;
  lng: number;
}

// Calculate distance between two points in km
export function calculateDistance(point1: LatLng, point2: LatLng): number {
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

// Get bounds for multiple points
export function getBounds(points: LatLng[]): { north: number; south: number; east: number; west: number } {
  if (points.length === 0) {
    return {
      north: UAE_DEFAULT_LOCATION.lat + 0.1,
      south: UAE_DEFAULT_LOCATION.lat - 0.1,
      east: UAE_DEFAULT_LOCATION.lng + 0.1,
      west: UAE_DEFAULT_LOCATION.lng - 0.1,
    };
  }
  
  let north = points[0].lat;
  let south = points[0].lat;
  let east = points[0].lng;
  let west = points[0].lng;
  
  for (const point of points) {
    north = Math.max(north, point.lat);
    south = Math.min(south, point.lat);
    east = Math.max(east, point.lng);
    west = Math.min(west, point.lng);
  }
  
  return { north, south, east, west };
}

