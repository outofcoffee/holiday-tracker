import logger from './logger';
import { holidayDate, holidayName } from '../config';

// Format time to display in a user-friendly way
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Calculate Easter date for a given year using Butcher's algorithm.
 * This is used when the holiday date type is 'calculated' with algorithm 'easter'.
 */
const calculateEasterDate = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  // Create a date in UTC (avoiding Date.UTC for better compatibility)
  const easterDate = new Date();
  easterDate.setUTCFullYear(year, month - 1, day);
  easterDate.setUTCHours(0, 0, 0, 0);
  return easterDate;
};

/**
 * Get the holiday date for a given year.
 * Supports both fixed dates (like Christmas on Dec 25) and calculated dates (like Easter).
 */
export const getHolidayDate = (year: number): Date => {
  if (holidayDate.type === 'fixed') {
    // Fixed date (e.g., Christmas on December 25)
    const fixedDate = new Date();
    fixedDate.setUTCFullYear(year, (holidayDate.fixedMonth || 12) - 1, holidayDate.fixedDay || 25);
    fixedDate.setUTCHours(0, 0, 0, 0);
    return fixedDate;
  } else if (holidayDate.type === 'calculated') {
    // Calculated date based on algorithm
    if (holidayDate.calculationAlgorithm === 'easter') {
      return calculateEasterDate(year);
    }
    // Default to a fallback (shouldn't happen with proper config)
    logger.warn(`Unknown calculation algorithm: ${holidayDate.calculationAlgorithm}`);
    return calculateEasterDate(year);
  }

  // Fallback (shouldn't reach here)
  logger.warn(`Unknown date type: ${holidayDate.type}`);
  return calculateEasterDate(year);
};

// Legacy alias for backward compatibility
export const getEasterDate = getHolidayDate;

// Define timezone constants
const EASTERNMOST_TIMEZONE = 14; // UTC+14 (Kiritimati/Christmas Island)
const WESTERNMOST_TIMEZONE = -12; // UTC-12 (Baker Island)

/**
 * Get when the holiday begins globally (in easternmost timezone UTC+14).
 * This is the start of the extended time window that covers the holiday
 * in ALL timezones around the world.
 */
export const getGlobalHolidayStart = (holidayDateValue: Date): Date => {
  // Create a new date object to avoid modifying the original
  const holidayStart = new Date(holidayDateValue);

  // Set to midnight UTC
  holidayStart.setUTCHours(0, 0, 0, 0);

  // Adjust for easternmost timezone (UTC+14)
  // Holiday in UTC+14 starts 14 hours before UTC
  // So we need to subtract 14 hours from Holiday at UTC
  holidayStart.setUTCHours(holidayStart.getUTCHours() - EASTERNMOST_TIMEZONE);

  return holidayStart;
};

// Legacy alias for backward compatibility
export const getGlobalEasterStart = getGlobalHolidayStart;

/**
 * Get when the holiday ends globally (in westernmost timezone UTC-12).
 * This is the end of the extended time window that covers the holiday
 * in ALL timezones around the world.
 */
export const getGlobalHolidayEnd = (holidayDateValue: Date): Date => {
  // Create a new date object to avoid modifying the original
  const holidayEnd = new Date(holidayDateValue);

  // Set to end of day UTC (23:59:59.999)
  holidayEnd.setUTCHours(23, 59, 59, 999);

  // Adjust for westernmost timezone (UTC-12)
  // Holiday in UTC-12 ends 12 hours after UTC
  // So we need to add 12 hours to Holiday end at UTC
  holidayEnd.setUTCHours(holidayEnd.getUTCHours() - WESTERNMOST_TIMEZONE);

  return holidayEnd;
};

// Legacy alias for backward compatibility
export const getGlobalEasterEnd = getGlobalHolidayEnd;

// Get current time, possibly overridden for testing
interface GetCurrentTimeFunction {
  (): Date;
  hasLoggedMockTime: boolean;
  hasLoggedMockDate: boolean;
  hasLoggedError: boolean;
}

export const getCurrentTime = ((): GetCurrentTimeFunction => {
  const func = (): Date => {
    // Check for testing overrides via query parameters first, then environment variables
    let mockTimeString, mockDateString;

    // Check URL query parameters (using snake_case param names)
    const urlParams = new URLSearchParams(window.location.search);
    mockTimeString = urlParams.get('mock_time');
    mockDateString = urlParams.get('mock_date');

    // If not found in query params, check environment variables
    if (!mockTimeString && !mockDateString) {
      try {
        mockTimeString = import.meta.env.VITE_MOCK_TIME;
        mockDateString = import.meta.env.VITE_MOCK_DATE;
      } catch (e) {
        // No mock values available
      }
    }

    // VITE_MOCK_TIME takes precedence over VITE_MOCK_DATE
    if (mockTimeString) {
      try {
        // Parse ISO format YYYY-MM-DDTHH:MM:SS
        const mockTime = new Date(mockTimeString);

        // Validate that the date is valid
        if (!isNaN(mockTime.getTime())) {
          // Only log once when the app starts
          if (!getCurrentTime.hasLoggedMockTime) {
            logger.info(`Using mock time: ${mockTime.toISOString()}`);
            getCurrentTime.hasLoggedMockTime = true;
          }
          return mockTime;
        } else {
          // Only log error once
          if (!getCurrentTime.hasLoggedError) {
            logger.error(`Invalid mock time format: ${mockTimeString}, using real time instead`);
            getCurrentTime.hasLoggedError = true;
          }
        }
      } catch (error) {
        // Only log error once
        if (!getCurrentTime.hasLoggedError) {
          logger.error(`Error parsing mock time: ${error}`);
          getCurrentTime.hasLoggedError = true;
        }
      }
    }
    // If no VITE_MOCK_TIME but VITE_MOCK_DATE is specified
    else if (mockDateString) {
      try {
        // Get current time
        const now = new Date();

        // Parse date format YYYY-MM-DD
        const mockDate = new Date(mockDateString);

        // Validate that the date is valid
        if (!isNaN(mockDate.getTime())) {
          // Create a date with mock date but current time
          const hybridTime = new Date(
            mockDate.getFullYear(),
            mockDate.getMonth(),
            mockDate.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds()
          );

          // Only log once when the app starts
          if (!getCurrentTime.hasLoggedMockDate) {
            logger.info(`Using mock date with real time: ${hybridTime.toISOString()}`);
            getCurrentTime.hasLoggedMockDate = true;
          }
          return hybridTime;
        } else {
          // Only log error once
          if (!getCurrentTime.hasLoggedError) {
            logger.error(`Invalid mock date format: ${mockDateString}, using real date instead`);
            getCurrentTime.hasLoggedError = true;
          }
        }
      } catch (error) {
        // Only log error once
        if (!getCurrentTime.hasLoggedError) {
          logger.error(`Error parsing mock date: ${error}`);
          getCurrentTime.hasLoggedError = true;
        }
      }
    }

    // Default to actual current time
    return new Date();
  };

  // Add static properties
  func.hasLoggedMockTime = false;
  func.hasLoggedMockDate = false;
  func.hasLoggedError = false;

  return func;
})();

/**
 * Check if a given time is within the global holiday period.
 * The global holiday period spans from when the holiday begins in the
 * easternmost timezone (UTC+14) to when it ends in the westernmost
 * timezone (UTC-12) - approximately 38 hours total.
 */
export const isWithinGlobalHoliday = (time: Date, holidayDateValue: Date): boolean => {
  const globalStart = getGlobalHolidayStart(holidayDateValue);
  const globalEnd = getGlobalHolidayEnd(holidayDateValue);

  return time >= globalStart && time <= globalEnd;
};

// Legacy alias for backward compatibility
export const isWithinGlobalEaster = isWithinGlobalHoliday;

/**
 * Check if today is the holiday (anywhere in the world).
 * Returns true if the current time falls within the extended global
 * holiday window that covers all timezones.
 */
export const isHolidayDay = (): boolean => {
  const now = getCurrentTime();
  const currentYear = now.getFullYear();
  const holidayDateThisYear = getHolidayDate(currentYear);

  // Check if we're in the global holiday period
  if (isWithinGlobalHoliday(now, holidayDateThisYear)) {
    return true;
  }

  // Also check the previous year's holiday (edge case at year boundary)
  const lastYearHoliday = getHolidayDate(currentYear - 1);
  if (isWithinGlobalHoliday(now, lastYearHoliday)) {
    return true;
  }

  // Also check next year's holiday (edge case at year boundary)
  const nextYearHoliday = getHolidayDate(currentYear + 1);
  if (isWithinGlobalHoliday(now, nextYearHoliday)) {
    return true;
  }

  return false;
};

// Legacy alias for backward compatibility
export const isEaster = isHolidayDay;

// Format a date nicely with month name
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Get the next holiday date (current year if not passed, otherwise next year).
 */
export const getNextHolidayDate = (): Date => {
  const now = getCurrentTime();
  const currentYear = now.getFullYear();
  const holidayThisYear = getHolidayDate(currentYear);

  // If current time is before holiday this year, return this year's holiday
  if (now < getGlobalHolidayStart(holidayThisYear)) {
    return holidayThisYear;
  }

  // If we're within holiday period, return this year's holiday
  if (isWithinGlobalHoliday(now, holidayThisYear)) {
    return holidayThisYear;
  }

  // If holiday has passed, look to next year
  return getHolidayDate(currentYear + 1);
};

// Legacy alias for backward compatibility
export const getNextEasterDate = getNextHolidayDate;

/**
 * Calculate global holiday progress percentage.
 * Returns a value from 0-100 representing how far through the global
 * holiday window we currently are.
 */
export const getGlobalHolidayProgress = (): number => {
  const now = getCurrentTime();
  const currentYear = now.getFullYear();

  // Try this year's holiday
  let holidayDateValue = getHolidayDate(currentYear);
  let start = getGlobalHolidayStart(holidayDateValue);
  let end = getGlobalHolidayEnd(holidayDateValue);

  // If not within this year's holiday period, try previous year
  if (now < start || now > end) {
    const previousHoliday = getHolidayDate(currentYear - 1);
    const prevStart = getGlobalHolidayStart(previousHoliday);
    const prevEnd = getGlobalHolidayEnd(previousHoliday);

    if (now >= prevStart && now <= prevEnd) {
      start = prevStart;
      end = prevEnd;
      holidayDateValue = previousHoliday;
    }
  }

  // If not within this or previous year's holiday, try next year
  if (now < start || now > end) {
    const nextHoliday = getHolidayDate(currentYear + 1);
    const nextStart = getGlobalHolidayStart(nextHoliday);
    const nextEnd = getGlobalHolidayEnd(nextHoliday);

    if (now >= nextStart && now <= nextEnd) {
      start = nextStart;
      end = nextEnd;
      holidayDateValue = nextHoliday;
    }
  }

  // If not currently holiday, return 0
  if (now < start || now > end) {
    return 0;
  }

  // Calculate progress through the entire global holiday period
  const totalHolidayMs = end.getTime() - start.getTime();
  const elapsedMs = now.getTime() - start.getTime();

  // Return percentage (0-100)
  return (elapsedMs / totalHolidayMs) * 100;
};

// Legacy alias for backward compatibility
export const getGlobalEasterProgress = getGlobalHolidayProgress;

// Get timezone abbreviation based on offset in minutes
export const getTimezoneAbbr = (timezoneOffset: number): string => {
  // Convert minutes to hours
  const hours = Math.abs(Math.floor(timezoneOffset / 60));
  const mins = Math.abs(timezoneOffset % 60);

  // Format: UTC+/-HH:MM
  return `UTC${timezoneOffset <= 0 ? '+' : '-'}${hours.toString().padStart(2, '0')}${
    mins > 0 ? `:${mins.toString().padStart(2, '0')}` : ''
  }`;
};

// Get local midnight for a specific place based on its timezone
export const getLocalMidnight = (date: Date, timezoneOffset: number): Date => {
  // Create a new date object to avoid modifying the original
  const localMidnight = new Date(date);

  // Set to UTC midnight
  localMidnight.setUTCHours(0, 0, 0, 0);

  // Adjust for the timezone offset
  // timezoneOffset is in minutes, negative for east, positive for west
  // But getTimezoneOffset() returns the opposite, so we invert it
  const adjustedOffset = -timezoneOffset;
  localMidnight.setMinutes(localMidnight.getMinutes() + adjustedOffset);

  return localMidnight;
};

/**
 * Calculate the ideal arrival time for a city.
 * Should be around midnight on the holiday morning in the local timezone.
 */
export const calculateIdealArrivalTime = (
  city: { timezone: string },
  holidayDateValue: Date
): Date => {
  // Parse the timezone from string format (e.g., "America/New_York")
  // For simplicity, we'll extract the UTC offset directly
  const timezoneMatch = city.timezone.match(/([+-])(\d{2}):?(\d{2})?/);
  let timezoneOffsetMinutes = 0;

  if (timezoneMatch) {
    const sign = timezoneMatch[1] === '-' ? -1 : 1;
    const hours = parseInt(timezoneMatch[2], 10);
    const minutes = timezoneMatch[3] ? parseInt(timezoneMatch[3], 10) : 0;
    timezoneOffsetMinutes = sign * (hours * 60 + minutes);
  } else {
    // If we can't parse, assume UTC
    logger.warn(`Could not parse timezone: ${city.timezone}, defaulting to UTC`);
  }

  // Get the holiday date and set it to local midnight
  const idealTime = new Date(holidayDateValue);

  // Set to midnight UTC, then adjust by timezone offset
  idealTime.setUTCHours(0, 0, 0, 0);
  idealTime.setMinutes(idealTime.getMinutes() - timezoneOffsetMinutes);

  return idealTime;
};

/**
 * Get the current holiday name (for display purposes)
 */
export const getHolidayName = (): string => {
  return holidayName;
};
