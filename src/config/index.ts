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
  holidaySleepingDecorations,
  holidayFacts,
  holidayItemsDeliveredName,
  holidayPeoplePerItem,
  getRandomFact,
  getFactForCountry,
} from './holidays';

// Export types
export type { HolidayConfig, HolidayFact } from './holiday.types';
