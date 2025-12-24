/**
 * Configuration Module
 *
 * Main entry point for all configuration exports.
 */

// Export the holiday configuration and related utilities
export {
  holidayConfig,
  holidayId,
  holidayName,
  holidayDate,
  holidayMessages,
  holidayColors,
  holidayAssets,
  holidayAnimations,
  holidayDeliveryItems,
  holidayIncomingItems,
  holidaySleepingDecorations,
  holidayFacts,
  holidayJokes,
  holidayItemsDeliveredName,
  holidayPeoplePerItem,
  getRandomFact,
  getFactForCountry,
  getRandomJoke,
} from './holidays';

// Export types
export type { HolidayConfig, HolidayFact, HolidayJoke } from './holiday.types';
