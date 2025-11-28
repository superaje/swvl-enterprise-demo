// SWVL Brand Colors - Extracted from official website
export const SWVL_COLORS = {
  primary: "#FC153B", // SWVL Red - Primary brand color (from logo and CTAs)
  secondary: "#004E89", // Blue secondary
  accent: "#FF6B35", // Orange/Red accent
  dark: "#1A1A1A", // Dark text
  light: "#F5F5F5", // Light background
  white: "#FFFFFF",
  gray: {
    100: "#F7F7F7",
    200: "#E5E5E5",
    300: "#CCCCCC",
    400: "#999999",
    500: "#666666",
    600: "#333333",
  },
} as const;

// Vehicle Types
export interface Vehicle {
  id: string;
  name: string;
  capacity: number;
  type: "sedan" | "van" | "bus";
  color: string;
  icon: string;
}

export const VEHICLES: Vehicle[] = [
  {
    id: "sedan",
    name: "Sedan Car",
    capacity: 4,
    type: "sedan",
    color: SWVL_COLORS.primary,
    icon: "🚗",
  },
  {
    id: "van",
    name: "14-Seater Van",
    capacity: 14,
    type: "van",
    color: SWVL_COLORS.secondary,
    icon: "🚐",
  },
  {
    id: "bus",
    name: "50-Seater Bus",
    capacity: 50,
    type: "bus",
    color: SWVL_COLORS.accent,
    icon: "🚌",
  },
];

// UAE Default Location (Dubai)
export const UAE_DEFAULT_LOCATION = {
  lat: 25.2048,
  lng: 55.2708,
  zoom: 11,
};

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
} as const;

// Spacing
export const SPACING = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
} as const;

