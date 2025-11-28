'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import type { Route } from '@/lib/store';
import { motion } from 'framer-motion';
import { VEHICLES } from '@/lib/constants';

interface RouteVisualizationProps {
  map: google.maps.Map | null;
  isLoaded: boolean;
  routes?: Route[]; // Optional routes prop, defaults to store routes
}

export default function RouteVisualization({ map, isLoaded, routes: propRoutes }: RouteVisualizationProps) {
  const storeRoutes = useAppStore((state) => state.routes);
  const routes = propRoutes || storeRoutes;
  const officeLocation = useAppStore((state) => state.officeLocation);
  const [vehicleProgress, setVehicleProgress] = useState<Record<string, number>>({});
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const vehicleMarkersRef = useRef<Record<string, google.maps.Marker>>({});
  const animationRef = useRef<number>();

  // Initialize routes and markers
  useEffect(() => {
    if (!map || !isLoaded || routes.length === 0) {
      // Clear existing routes
      polylinesRef.current.forEach((polyline) => polyline.setMap(null));
      markersRef.current.forEach((marker) => marker.setMap(null));
      Object.values(vehicleMarkersRef.current).forEach((marker) => marker.setMap(null));
      polylinesRef.current = [];
      markersRef.current = [];
      vehicleMarkersRef.current = {};
      setVehicleProgress({});
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    // Clear previous routes
    polylinesRef.current.forEach((polyline) => polyline.setMap(null));
    markersRef.current.forEach((marker) => marker.setMap(null));
    Object.values(vehicleMarkersRef.current).forEach((marker) => marker.setMap(null));
    polylinesRef.current = [];
    markersRef.current = [];
    vehicleMarkersRef.current = {};

    const colors = ['#FC153B', '#004E89', '#FF6B35', '#00C896', '#9B59B6'];

    routes.forEach((route, routeIndex) => {
      const color = colors[routeIndex % colors.length];

      // Create polyline for route path
      const polyline = new google.maps.Polyline({
        path: route.path.map((p) => ({ lat: p.lat, lng: p.lng })),
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.6,
        strokeWeight: 3,
        map,
      });

      polylinesRef.current.push(polyline);

      // Create markers for pickup points with passenger count
      route.pickupPoints.forEach((point, pointIndex) => {
        const marker = new google.maps.Marker({
          position: { lat: point.lat, lng: point.lng },
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 3,
          },
          title: `Pickup ${pointIndex + 1}: ${point.passengers} passengers`,
        });

        markersRef.current.push(marker);
      });

      // Initialize vehicle progress
      setVehicleProgress((prev) => ({
        ...prev,
        [route.id]: 0,
      }));
    });

    // Fit bounds to show all routes
    if (routes.length > 0 && officeLocation) {
      const bounds = new google.maps.LatLngBounds();
      
      routes.forEach((route) => {
        route.path.forEach((point) => {
          bounds.extend({ lat: point.lat, lng: point.lng });
        });
        bounds.extend({ lat: officeLocation.lat, lng: officeLocation.lng });
      });

      map.fitBounds(bounds, { padding: 80 });
    }
  }, [map, isLoaded, routes, officeLocation]);

  // Animate vehicles along routes
  useEffect(() => {
    if (!map || !isLoaded || routes.length === 0) return;

    const colors = ['#FC153B', '#004E89', '#FF6B35', '#00C896', '#9B59B6'];
    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000; // seconds
      const duration = 30; // Total animation duration in seconds
      const progress = Math.min((elapsed % duration) / duration, 1);

      routes.forEach((route, routeIndex) => {
        const color = colors[routeIndex % colors.length];
        const routeProgress = progress;

        // Update vehicle position
        const pathIndex = Math.floor(routeProgress * (route.path.length - 1));
        const currentPoint = route.path[pathIndex];

        // Calculate rotation
        let rotation = 0;
        if (pathIndex < route.path.length - 1) {
          const next = route.path[pathIndex + 1];
          // Simple heading calculation
          const dLat = next.lat - currentPoint.lat;
          const dLng = next.lng - currentPoint.lng;
          rotation = Math.atan2(dLng, dLat) * 180 / Math.PI;
        }

        // Get vehicle icon emoji based on type
        const getVehicleEmoji = (vehicleType: string) => {
          const vehicle = VEHICLES.find(v => v.type === vehicleType);
          return vehicle?.icon || '🚗';
        };

        if (!vehicleMarkersRef.current[route.id]) {
          // Create custom vehicle icon using canvas
          const canvas = document.createElement('canvas');
          canvas.width = 40;
          canvas.height = 40;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Draw circle background
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(20, 20, 18, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw white border
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw vehicle emoji
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(getVehicleEmoji(route.vehicle.type), 20, 20);
          }

          const icon: any = {
            url: canvas.toDataURL(),
            scaledSize: { width: 40, height: 40 },
            anchor: { x: 20, y: 20 },
          };
          
          vehicleMarkersRef.current[route.id] = new google.maps.Marker({
            position: currentPoint,
            map,
            icon: icon,
            title: `${route.vehicle.name}`,
          });
        } else {
          vehicleMarkersRef.current[route.id].setPosition(currentPoint);
          
          // Update icon with rotation (recreate canvas)
          const canvas = document.createElement('canvas');
          canvas.width = 40;
          canvas.height = 40;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.save();
            ctx.translate(20, 20);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-20, -20);
            
            // Draw circle background
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(20, 20, 18, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw white border
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw vehicle emoji
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(getVehicleEmoji(route.vehicle.type), 20, 20);
            
            ctx.restore();
          }

          const icon: any = {
            url: canvas.toDataURL(),
            scaledSize: { width: 40, height: 40 },
            anchor: { x: 20, y: 20 },
          };
          
          (vehicleMarkersRef.current[route.id] as any).setIcon(icon);
        }

        setVehicleProgress((prev) => ({
          ...prev,
          [route.id]: routeProgress,
        }));
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [map, isLoaded, routes]);

  // Animate polyline drawing effect
  const animatePolyline = (
    polyline: google.maps.Polyline,
    path: Array<{ lat: number; lng: number }>,
    duration: number
  ) => {
    const startTime = Date.now();
    const totalPoints = path.length;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentPoints = Math.floor(progress * totalPoints);

      if (currentPoints < totalPoints) {
        polyline.setPath(path.slice(0, currentPoints + 1).map((p) => ({ lat: p.lat, lng: p.lng })));
        requestAnimationFrame(animate);
      } else {
        polyline.setPath(path.map((p) => ({ lat: p.lat, lng: p.lng })));
      }
    };

    animate();
  };

  return null;
}

