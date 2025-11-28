import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { UAE_DEFAULT_LOCATION } from '@/lib/constants';

export function useGoogleMap(containerRef: React.RefObject<HTMLDivElement>) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<Loader | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setError('Google Maps API key is not configured');
      return;
    }

    if (!containerRef.current) return;

    const initMap = async () => {
      try {
        if (!loaderRef.current) {
          loaderRef.current = new Loader({
            apiKey,
            version: 'weekly',
            libraries: ['places', 'geometry'],
          });
        }

        const { Map } = await loaderRef.current.importLibrary('maps');
        
        const mapInstance = new Map(containerRef.current, {
          center: {
            lat: UAE_DEFAULT_LOCATION.lat,
            lng: UAE_DEFAULT_LOCATION.lng,
          },
          zoom: UAE_DEFAULT_LOCATION.zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });

        setMap(mapInstance);
        setIsLoaded(true);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps');
      }
    };

    initMap();
  }, [containerRef]);

  return { map, isLoaded, error };
}

