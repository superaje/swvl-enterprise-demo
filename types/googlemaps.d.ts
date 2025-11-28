/// <reference types="@types/google.maps" />

declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options?: MapOptions);
      setCenter(latlng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
      fitBounds(bounds: LatLngBounds, options?: { padding?: number }): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      styles?: MapTypeStyle[];
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface LatLngBounds {
      extend(latlng: LatLng | LatLngLiteral): void;
    }

    class Marker {
      constructor(options?: MarkerOptions);
      setPosition(position: LatLng | LatLngLiteral): void;
      setMap(map: Map | null): void;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map | null;
      title?: string;
      icon?: string | Icon | Symbol;
    }

    interface Icon {
      url?: string;
      scaledSize?: Size;
      anchor?: Point;
    }

    interface Symbol {
      path?: SymbolPath | string;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
    }

    enum SymbolPath {
      CIRCLE,
      BACKWARD_CLOSED_ARROW,
      FORWARD_CLOSED_ARROW,
    }

    interface Size {
      width: number;
      height: number;
    }

    interface Point {
      x: number;
      y: number;
    }

    class Polyline {
      constructor(options?: PolylineOptions);
      setPath(path: (LatLng | LatLngLiteral)[]): void;
      setMap(map: Map | null): void;
    }

    interface PolylineOptions {
      path?: (LatLng | LatLngLiteral)[];
      geodesic?: boolean;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      map?: Map | null;
    }

    interface MapMouseEvent {
      latLng?: LatLng | null;
    }

    interface MapsEventListener {
      remove(): void;
    }

    namespace event {
      function removeListener(listener: MapsEventListener): void;
    }

    class Geocoder {
      geocode(
        request: GeocoderRequest,
        callback: (results: GeocoderResult[] | null, status: GeocoderStatus) => void
      ): void;
    }

    interface GeocoderRequest {
      location?: LatLngLiteral;
      placeId?: string;
    }

    interface GeocoderResult {
      formatted_address?: string;
      geometry?: GeocoderGeometry;
    }

    interface GeocoderGeometry {
      location?: LatLng;
    }

    enum GeocoderStatus {
      OK = 'OK',
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      extend(latlng: LatLng | LatLngLiteral): void;
    }

    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, options?: AutocompleteOptions);
        getPlace(): PlaceResult;
        setBounds(bounds: LatLngBounds): void;
        addListener(eventName: string, handler: Function): MapsEventListener;
      }

      interface AutocompleteOptions {
        componentRestrictions?: { country: string };
        fields?: string[];
        types?: string[];
      }

      interface PlaceResult {
        place_id?: string;
        formatted_address?: string;
        name?: string;
        geometry?: {
          location?: LatLng;
        };
      }

      class AutocompleteService {
        getPlacePredictions(
          request: AutocompletionRequest,
          callback: (
            predictions: AutocompletePrediction[] | null,
            status: PlacesServiceStatus
          ) => void
        ): void;
      }

      interface AutocompletionRequest {
        input: string;
        componentRestrictions?: { country: string };
        locationBias?: {
          lat: number;
          lng: number;
          radius: number;
        };
      }

      interface AutocompletePrediction {
        place_id: string;
        description: string;
        structured_formatting: {
          main_text: string;
          secondary_text: string;
        };
      }

      enum PlacesServiceStatus {
        OK = 'OK',
      }

      class PlacesService {
        constructor(map: Map);
      }
    }

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers?: Array<{ [key: string]: any }>;
    }
  }
}

