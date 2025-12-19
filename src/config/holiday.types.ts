/**
 * Holiday Configuration Types
 *
 * This file defines the types for holiday configurations that allow the tracker
 * to be used for different holidays (Easter, Christmas, etc.)
 */

/**
 * A fact to display about the holiday, optionally country-specific
 */
export interface HolidayFact {
  id: number;
  text: string;
  country?: string;
}

/**
 * Configuration for delivery items that the character drops
 */
export interface DeliveryItemConfig {
  type: string;
  emoji: string;
  fontSize: number;
  borderRadius: string;
  colors: string[];
  size: number;
}

/**
 * Messages displayed in the UI
 */
export interface HolidayMessages {
  // Main title and subtitle
  title: string;
  subtitle: string;

  // Loading states
  loadingMessage: string;

  // Progress tracker
  progressTitle: string;
  itemsDeliveredLabel: string;
  journeyCompleteLabel: string;

  // Location info
  yourLocationTitle: string;
  locationPermissionRequest: string;
  locationPrompt: string;
  nearbyNotification: string;
  nearbySubMessage: string;
  visitedLabel: string;
  willVisitLabel: string;
  calculatingVisit: string;

  // Sleeping/off-season
  sleepingTitle: string;
  sleepingDescription: string;
  comeBackMessage: string;
  sleepingFunFact: string;

  // Active delivery
  deliveringMessage: (city: string, country: string) => string;
  deliveringSubMessage: string;
  travelingMessage: (fromCity: string, toCity: string) => string;
  nextDeliveryMessage: (city: string, country: string) => string;

  // Popup
  characterName: string;
  popupDeliveringMessage: (city: string) => string;
  popupTravelingMessage: (fromCity: string, toCity: string) => string;

  // Footer
  footerGreeting: string;
  footerDescription: string;

  // Fun fact section
  funFactTitle: string;
}

/**
 * Color theme for the holiday
 */
export interface HolidayColors {
  primary: string;
  secondary: string;
  accent: string;
  light: string;
  dark: string;
  highlight: string;
}

/**
 * Emoji decorations for the sleeping/off-season screen
 */
export interface SleepingDecorations {
  characterEmoji: string;
  sleepEmoji: string;
  decorationEmojis: string[];
  accentEmoji: string;
}

/**
 * Date calculation configuration
 */
export interface DateConfig {
  /**
   * Type of date calculation:
   * - 'fixed': Same date every year (e.g., Dec 25 for Christmas)
   * - 'calculated': Dynamically calculated (e.g., Easter)
   */
  type: 'fixed' | 'calculated';

  /**
   * For 'fixed' type: the month (1-12)
   */
  fixedMonth?: number;

  /**
   * For 'fixed' type: the day (1-31)
   */
  fixedDay?: number;

  /**
   * For 'calculated' type: the calculation algorithm name
   * Currently supports: 'easter'
   */
  calculationAlgorithm?: 'easter';
}

/**
 * Asset paths for the holiday
 */
export interface HolidayAssets {
  /**
   * Main character sprite/image
   */
  characterImage: string;

  /**
   * Character image alt text
   */
  characterAlt: string;

  /**
   * Favicon path (optional, will use default if not specified)
   */
  favicon?: string;

  /**
   * Theme color for manifest/browser
   */
  themeColor: string;
}

/**
 * Animation configuration
 */
export interface HolidayAnimations {
  /**
   * Name of the movement animation (e.g., 'hop' for bunny, 'fly' for sleigh)
   */
  movementAnimation: string;

  /**
   * CSS keyframes for the movement animation
   */
  movementKeyframes: {
    name: string;
    keyframes: string;
  };
}

/**
 * Complete holiday configuration
 */
export interface HolidayConfig {
  /**
   * Unique identifier for this holiday
   */
  id: string;

  /**
   * Display name of the holiday
   */
  name: string;

  /**
   * Date configuration
   */
  date: DateConfig;

  /**
   * UI messages
   */
  messages: HolidayMessages;

  /**
   * Color theme
   */
  colors: HolidayColors;

  /**
   * Asset paths
   */
  assets: HolidayAssets;

  /**
   * Animation configuration
   */
  animations: HolidayAnimations;

  /**
   * Delivery item configurations
   */
  deliveryItems: DeliveryItemConfig[];

  /**
   * Sleeping/off-season decorations
   */
  sleepingDecorations: SleepingDecorations;

  /**
   * Holiday facts
   */
  facts: HolidayFact[];

  /**
   * Items delivered label (e.g., "Baskets" for Easter, "Presents" for Christmas)
   */
  itemsDeliveredName: string;

  /**
   * People per item ratio for calculating deliveries
   */
  peoplePerItem: number;
}
