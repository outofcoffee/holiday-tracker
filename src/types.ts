export interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  population: number;
  timezone: string; // Format: "UTC+/-HH:MM"
  timezoneOffsetMinutes: number; // Minutes from UTC, negative for east, positive for west
}

// Default map zoom level - single source of truth
export const DEFAULT_MAP_ZOOM = 4;

/**
 * Position of the holiday character (Easter Bunny, Santa, etc.)
 */
export interface CharacterPosition {
  latitude: number;
  longitude: number;
  currentCity: City | null;
  nextCity: City | null;
  nearestCity: City | null;
  totalCities: number;
  visitedCities: number;
  completionPercentage: number;
  transitionProgress: number;
  mapZoomLevel?: number; // Optional zoom level for position calculation
  overLand: boolean; // Whether the character is currently over land (not ocean)
}

// Legacy alias for backward compatibility
export type BunnyPosition = CharacterPosition;

export interface ViewerLocation {
  latitude: number;
  longitude: number;
  nearestCity: City | null;
}

/**
 * A fact about the holiday to display
 */
export interface HolidayFact {
  id: number;
  text: string;
  country?: string;
}

// Legacy alias for backward compatibility
export type EasterFact = HolidayFact;
