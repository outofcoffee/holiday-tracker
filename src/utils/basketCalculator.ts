import { holidayPeoplePerItem, holidayItemsDeliveredName } from '../config';

// Estimated world population for 2025
const WORLD_POPULATION = 8_100_000_000;

/**
 * Calculate how many items have been delivered based on completion percentage.
 * The item type (baskets, presents, etc.) is determined by the holiday configuration.
 */
export const calculateItemsDelivered = (completionPercentage: number): number => {
  const totalItems = Math.ceil(WORLD_POPULATION / holidayPeoplePerItem);
  const deliveredItems = Math.floor(totalItems * (completionPercentage / 100));
  return deliveredItems;
};

// Legacy alias for backward compatibility (used in existing code)
export const calculateBasketsDelivered = calculateItemsDelivered;

/**
 * Get the name of items being delivered (e.g., "Baskets" or "Presents")
 */
export const getItemsDeliveredName = (): string => {
  return holidayItemsDeliveredName;
};

// Format large numbers with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-GB');
};
