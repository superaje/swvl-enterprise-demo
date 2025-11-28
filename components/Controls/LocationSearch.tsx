'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Loader } from '@googlemaps/js-api-loader';

export default function LocationSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const officeLocation = useAppStore((state) => state.officeLocation);
  const setOfficeLocation = useAppStore((state) => state.setOfficeLocation);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAutocomplete = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey || !inputRef.current) return;

      try {
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places'],
        });

        await loader.importLibrary('places');

        if (inputRef.current && !autocompleteRef.current) {
          // Create Autocomplete widget
          autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: 'ae' }, // UAE only
            fields: ['place_id', 'geometry', 'formatted_address', 'name'],
            types: ['establishment', 'geocode'],
          });

          // Bias results towards UAE
          const bounds = new google.maps.LatLngBounds(
            { lat: 24.0, lng: 50.0 }, // Southwest corner
            { lat: 26.0, lng: 56.0 }  // Northeast corner
          );
          autocompleteRef.current.setBounds(bounds);

          // Listen for place selection
          autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();
            if (place && place.geometry?.location) {
              const location = place.geometry.location;
              setOfficeLocation({
                lat: location.lat(),
                lng: location.lng(),
                address: place.formatted_address || place.name || '',
              });
            }
          });

          setIsInitialized(true);
        }
      } catch (err) {
        console.error('Error loading Places API:', err);
      }
    };

    initAutocomplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (officeLocation && inputRef.current && autocompleteRef.current) {
      inputRef.current.value = officeLocation.address;
    }
  }, [officeLocation]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for your office location in UAE..."
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-9 sm:pr-10 bg-white border border-swvl-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-swvl-primary focus:border-transparent transition-all text-swvl-dark placeholder-swvl-gray-400 text-sm sm:text-base"
        />
        <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-swvl-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      {!isInitialized && (
        <motion.p 
          className="mt-2 text-xs text-swvl-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading search...
        </motion.p>
      )}
    </div>
  );
}

