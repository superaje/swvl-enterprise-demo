'use client';

import { useEffect, useRef, useState } from 'react';
import { useGoogleMap } from '@/hooks/useMap';
import { useAppStore } from '@/lib/store';
import { UAE_DEFAULT_LOCATION } from '@/lib/constants';
import { motion } from 'framer-motion';

interface GoogleMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  onMapReady?: (map: google.maps.Map, isLoaded: boolean) => void;
}

export default function GoogleMap({ onLocationSelect, onMapReady }: GoogleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { map, isLoaded, error } = useGoogleMap(mapContainerRef);
  const officeLocation = useAppStore((state) => state.officeLocation);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Notify parent when map is ready
  useEffect(() => {
    if (map && isLoaded && onMapReady) {
      onMapReady(map, isLoaded);
    }
  }, [map, isLoaded, onMapReady]);

  // Initialize marker when map is loaded
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Create marker for office location
    if (officeLocation) {
      if (markerRef.current) {
        markerRef.current.setPosition({
          lat: officeLocation.lat,
          lng: officeLocation.lng,
        });
      } else {
        markerRef.current = new google.maps.Marker({
          position: {
            lat: officeLocation.lat,
            lng: officeLocation.lng,
          },
          map,
          title: 'Office Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#FC153B',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        });
      }
      
      map.setCenter({
        lat: officeLocation.lat,
        lng: officeLocation.lng,
      });
      map.setZoom(14);
    } else {
      // Reset to default UAE view
      map.setCenter({
        lat: UAE_DEFAULT_LOCATION.lat,
        lng: UAE_DEFAULT_LOCATION.lng,
      });
      map.setZoom(UAE_DEFAULT_LOCATION.zoom);
      
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    }
  }, [map, isLoaded, officeLocation]);

  // Handle map click
  useEffect(() => {
    if (!map || !isLoaded || officeLocation) return;

    const clickListener = map.addListener('click', async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const address = results[0].formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            if (onLocationSelect) {
              onLocationSelect({ lat, lng, address });
            }
          } else {
            console.error('Geocoding error:', status);
            if (onLocationSelect) {
              onLocationSelect({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
            }
          }
        }
      );
    });

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map, isLoaded, officeLocation, onLocationSelect]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-swvl-light">
        <div className="text-center p-8">
          <p className="text-swvl-dark text-lg mb-2">Map Error</p>
          <p className="text-swvl-gray-500 text-sm">{error}</p>
          <p className="text-swvl-gray-400 text-xs mt-4">
            Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full rounded-xl overflow-hidden" />
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
        >
          <div className="text-center">
            <motion.div 
              className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-3 border-swvl-primary border-t-transparent mx-auto mb-3 sm:mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-swvl-dark text-sm sm:text-base">Loading map...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

