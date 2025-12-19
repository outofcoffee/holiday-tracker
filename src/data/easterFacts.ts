/**
 * Holiday Facts
 *
 * This file re-exports the holiday facts from the config for backward compatibility.
 * The actual facts are now defined in the holiday configuration files.
 */

// Re-export the holiday facts functions from the config
export { getRandomFact, getFactForCountry, holidayFacts } from '../config';

// Re-export the type (using the new name with legacy alias)
export type { HolidayFact, HolidayFact as EasterFact } from '../config';
