/**
 * Holiday Configuration Index
 *
 * This file exports the current holiday configuration based on the build-time
 * environment variable VITE_HOLIDAY_MODE.
 *
 * Usage:
 * - VITE_HOLIDAY_MODE=easter npm run build  (or dev)
 * - VITE_HOLIDAY_MODE=christmas npm run build (or dev)
 *
 * If not specified, defaults to 'easter'.
 */

import { HolidayConfig, HolidayFact } from '../holiday.types';
import { easterConfig } from './easter';
import { christmasConfig } from './christmas';

// Map of available holiday configurations
const holidayConfigs: Record<string, HolidayConfig> = {
  easter: easterConfig,
  christmas: christmasConfig,
};

// Get the holiday mode from environment variable, default to 'easter'
const holidayMode = import.meta.env.VITE_HOLIDAY_MODE || 'easter';

// Validate and get the configuration
if (!holidayConfigs[holidayMode]) {
  console.warn(
    `Unknown holiday mode "${holidayMode}", falling back to "easter". Available modes: ${Object.keys(holidayConfigs).join(', ')}`
  );
}

/**
 * The current holiday configuration, determined at build time
 */
export const holidayConfig: HolidayConfig = holidayConfigs[holidayMode] || easterConfig;

/**
 * Export individual parts of the config for convenience
 */
export const {
  id: holidayId,
  name: holidayName,
  date: holidayDate,
  messages: holidayMessages,
  colors: holidayColors,
  assets: holidayAssets,
  animations: holidayAnimations,
  deliveryItems: holidayDeliveryItems,
  sleepingDecorations: holidaySleepingDecorations,
  facts: holidayFacts,
  itemsDeliveredName: holidayItemsDeliveredName,
  peoplePerItem: holidayPeoplePerItem,
} = holidayConfig;

/**
 * Get a random fact from the holiday facts
 */
export const getRandomFact = (): HolidayFact => {
  const randomIndex = Math.floor(Math.random() * holidayFacts.length);
  return holidayFacts[randomIndex];
};

/**
 * Get a fact for a specific country if available
 */
export const getFactForCountry = (country: string): HolidayFact | null => {
  const countryFacts = holidayFacts.filter((fact) => fact.country === country);

  if (countryFacts.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * countryFacts.length);
  return countryFacts[randomIndex];
};

// Re-export types
export type { HolidayConfig, HolidayFact } from '../holiday.types';
