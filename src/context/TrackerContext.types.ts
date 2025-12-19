import { BunnyPosition, ViewerLocation, DEFAULT_MAP_ZOOM } from '../types';
import { getNextHolidayDate, formatDate } from '../utils/timeUtils';

// Define the type for our context
export interface TrackerContextType {
  currentPosition: BunnyPosition | null;
  totalCities: number;
  /** Number of items delivered (baskets for Easter, presents for Christmas, etc.) */
  itemsDelivered: number;
  /** @deprecated Use itemsDelivered instead */
  basketsDelivered: number;
  completionPercentage: number;
  viewerLocation: ViewerLocation | null;
  estimatedArrivalTime: string | null;
  isNearby: boolean;
  /** Whether it's currently the holiday day (anywhere in the world) */
  isHolidayDay: boolean;
  /** @deprecated Use isHolidayDay instead */
  isEasterDay: boolean;
  /** The next holiday date */
  nextHolidayDate: Date;
  /** @deprecated Use nextHolidayDate instead */
  nextEasterDate: Date;
  /** The next holiday date formatted for display */
  nextHolidayFormatted: string;
  /** @deprecated Use nextHolidayFormatted instead */
  nextEasterFormatted: string;
  mapZoomLevel: number;
  setMapZoomLevel: (zoom: number) => void;
}

// Create a default context with sensible defaults
export const defaultContext: TrackerContextType = {
  currentPosition: null,
  totalCities: 0,
  itemsDelivered: 0,
  basketsDelivered: 0, // Legacy alias
  completionPercentage: 0,
  viewerLocation: null,
  estimatedArrivalTime: null,
  isNearby: false,
  isHolidayDay: false,
  isEasterDay: false, // Legacy alias
  nextHolidayDate: getNextHolidayDate(),
  nextEasterDate: getNextHolidayDate(), // Legacy alias
  nextHolidayFormatted: formatDate(getNextHolidayDate()),
  nextEasterFormatted: formatDate(getNextHolidayDate()), // Legacy alias
  mapZoomLevel: DEFAULT_MAP_ZOOM,
  setMapZoomLevel: () => {}, // No-op function as placeholder
};
