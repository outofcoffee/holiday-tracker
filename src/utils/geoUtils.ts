import { City, BunnyPosition, DEFAULT_MAP_ZOOM } from '../types';
import { getCities } from '../data/cities';
// Import the GeoJSON-based land detector for more accurate landmass detection
import {
  isOverLand,
  getLandmassName
} from './landmassDetector';
import logger from './logger';

// Cached journey schedule for path rendering
let cachedJourneySchedule: { city: City; arrivalTime: Date }[] | null = null;
let cachedScheduleDate: Date | null = null;

// Calculate distance between two points using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Get nearest city to a location
export const getNearestCity = (
  latitude: number,
  longitude: number,
  cities: City[]
): City => {
  let nearestCity = cities[0];
  let minDistance = calculateDistance(
    latitude,
    longitude,
    cities[0].latitude,
    cities[0].longitude
  );

  for (let i = 1; i < cities.length; i++) {
    const distance = calculateDistance(
      latitude,
      longitude,
      cities[i].latitude,
      cities[i].longitude
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = cities[i];
    }
  }

  return nearestCity;
};

// Calculate the current position of the Easter Bunny
export const calculateCurrentPosition = async (mapZoomLevel?: number): Promise<BunnyPosition | null> => {
  try {
    // Import time utilities
    const { 
      isEaster,
      getEasterDate,
      getGlobalEasterStart,
      getGlobalEasterEnd,
      getCurrentTime,
      calculateIdealArrivalTime
    } = await import('./timeUtils');
    
    // If it's not Easter anywhere in the world, return null
    if (!isEaster()) {
      return null;
    }
    
    // Get the cities sorted by timezone (easternmost first)
    const cities = await getCities();
    
    // Get current time and Easter date
    const now = getCurrentTime();
    const currentYear = now.getFullYear();
    let easterDate = getEasterDate(currentYear);
    
    // Check if we're in Easter period for previous or next year
    const thisYearStart = getGlobalEasterStart(easterDate);
    const thisYearEnd = getGlobalEasterEnd(easterDate);
    
    if (now < thisYearStart || now > thisYearEnd) {
      // Check previous year
      const prevYearEaster = getEasterDate(currentYear - 1);
      const prevYearStart = getGlobalEasterStart(prevYearEaster);
      const prevYearEnd = getGlobalEasterEnd(prevYearEaster);
      
      if (now >= prevYearStart && now <= prevYearEnd) {
        easterDate = prevYearEaster;
      } else {
        // Check next year
        const nextYearEaster = getEasterDate(currentYear + 1);
        const nextYearStart = getGlobalEasterStart(nextYearEaster);
        const nextYearEnd = getGlobalEasterEnd(nextYearEaster);
        
        if (now >= nextYearStart && now <= nextYearEnd) {
          easterDate = nextYearEaster;
        }
      }
    }
    
    // Calculate delivery schedule for each city
    // Each city should be visited at midnight local time
    const citySchedule = cities.map(city => {
      const arrivalTime = calculateIdealArrivalTime(city, easterDate);
      return {
        city,
        arrivalTime
      };
    });
    
    // Sort schedule by arrival time
    citySchedule.sort((a, b) => a.arrivalTime.getTime() - b.arrivalTime.getTime());
    
    // Calculate global progress through Easter
    const globalStart = getGlobalEasterStart(easterDate);
    const globalEnd = getGlobalEasterEnd(easterDate);
    const totalDuration = globalEnd.getTime() - globalStart.getTime();
    const elapsedTime = now.getTime() - globalStart.getTime();
    const progress = Math.max(0, Math.min(1, elapsedTime / totalDuration));
    
    // Find current position in schedule
    let currentIndex = 0;
    let nextIndex = 1;
    let transitionProgress = 0;
    
    // If we're before the first city arrival time, we're en route to the first city
    if (now < citySchedule[0].arrivalTime) {
      currentIndex = 0;
      nextIndex = 0;
      
      // Calculate progress as percentage of time between start and first arrival
      const timeToFirstCity = citySchedule[0].arrivalTime.getTime() - globalStart.getTime();
      transitionProgress = timeToFirstCity > 0 ? elapsedTime / timeToFirstCity : 1;
    } 
    // If we're after the last city arrival time, we're at the last city
    else if (now >= citySchedule[citySchedule.length - 1].arrivalTime) {
      currentIndex = citySchedule.length - 1;
      nextIndex = citySchedule.length - 1;
      transitionProgress = 1;
    } 
    // Otherwise, find where we are in the schedule
    else {
      for (let i = 0; i < citySchedule.length - 1; i++) {
        if (now >= citySchedule[i].arrivalTime && now < citySchedule[i + 1].arrivalTime) {
          currentIndex = i;
          nextIndex = i + 1;
          
          // Calculate progress between cities
          const segmentDuration = citySchedule[nextIndex].arrivalTime.getTime() - 
                                 citySchedule[currentIndex].arrivalTime.getTime();
          const segmentElapsed = now.getTime() - citySchedule[currentIndex].arrivalTime.getTime();
          transitionProgress = segmentDuration > 0 ? segmentElapsed / segmentDuration : 1;
          break;
        }
      }
    }
    
    const currentCity = citySchedule[currentIndex].city;
    const nextCity = citySchedule[nextIndex].city;
    
    // Interpolate position between cities
    let latitude, longitude;
    
    if (currentIndex === nextIndex) {
      // At a city (not in transit) - implement "hopping" delivery pattern
      // Much more dramatic and visible movement
      
      // Use time to create discrete "hops" between delivery points
      const now = Date.now();
      const hopPeriod = 1000; // Time in ms between major position changes (1 second)
      const hopPhase = (now % hopPeriod) / hopPeriod; // 0-1 progress through current hop
      
      // Create "hop points" based on time
      // This creates a new random target every second
      const hopSeed = Math.floor(now / hopPeriod);
      
      // Use the hop seed to generate pseudo-random but consistent coordinates
      // This creates a random but not chaotic pattern of delivery points
      const rand1 = Math.sin(hopSeed * 123.456) * 0.5 + 0.5; // 0-1
      const rand2 = Math.cos(hopSeed * 789.012) * 0.5 + 0.5; // 0-1
      
      // Scale movement based on zoom level - but MUCH larger than before
      // At zoom level 4, we want movement to be easily visible
      const zoom = mapZoomLevel || DEFAULT_MAP_ZOOM;
      
      // Calculate delivery range based on zoom 
      // This is much more aggressive than before - up to 5-8 degrees at low zoom
      // which is very noticeable even on a world map
      let deliveryRange;
      if (zoom <= 2) {
        // World view - massive jumps (countries apart)
        deliveryRange = 8.0;
      } else if (zoom <= 4) {
        // Continental view - large jumps (regions apart)
        deliveryRange = 4.0;
      } else if (zoom <= 6) {
        // Country view - medium jumps (cities apart)
        deliveryRange = 2.0;
      } else if (zoom <= 8) {
        // Regional view - smaller jumps (neighborhoods apart)
        deliveryRange = 1.0;
      } else if (zoom <= 10) {
        // City view - very small jumps (blocks apart)
        deliveryRange = 0.5;
      } else {
        // Street view - tiny jumps (houses apart)
        deliveryRange = 0.2;
      }
      
      // Calculate current target position
      const targetLat = currentCity.latitude + (rand1 * 2 - 1) * deliveryRange;
      const targetLon = currentCity.longitude + (rand2 * 2 - 1) * deliveryRange;
      
      // Previous position (another random point)
      const prevRand1 = Math.sin((hopSeed - 1) * 123.456) * 0.5 + 0.5;
      const prevRand2 = Math.cos((hopSeed - 1) * 789.012) * 0.5 + 0.5;
      const prevLat = currentCity.latitude + (prevRand1 * 2 - 1) * deliveryRange;
      const prevLon = currentCity.longitude + (prevRand2 * 2 - 1) * deliveryRange;
      
      // Create a hopping effect with a slight pause at each delivery point
      // This makes the movement more deliberate and noticeable
      let effectivePhase = hopPhase;
      
      // Add "rest" at beginning and end of hop (20% of time)
      if (hopPhase < 0.1) {
        // Starting position - slight pause
        effectivePhase = 0;
      } else if (hopPhase > 0.9) {
        // Ending position - slight pause
        effectivePhase = 1;
      } else {
        // Rescale the middle portion for smooth transition
        effectivePhase = (hopPhase - 0.1) / 0.8;
        
        // Add a slight arc to the hop using a sine wave
        // This makes it look more like hopping than straight line movement
        const hopHeight = Math.sin(effectivePhase * Math.PI);
        effectivePhase = effectivePhase + hopHeight * 0.1; // Small arc effect
      }
      
      // Interpolate between previous and target positions
      latitude = prevLat + (targetLat - prevLat) * effectivePhase;
      longitude = prevLon + (targetLon - prevLon) * effectivePhase;
    } else {
      // Find position between cities, avoiding long water crossings
      const pathPosition = findOverlandPosition(
        currentCity.latitude, 
        currentCity.longitude,
        nextCity.latitude,
        nextCity.longitude,
        transitionProgress
      );
      
      latitude = pathPosition.latitude;
      longitude = pathPosition.longitude;
    }
    
    // Find nearest city to current position
    const nearestCity = getNearestCity(latitude, longitude, cities);
    
    // Determine if the bunny is over land (not ocean) using our landmass detector
    const overLand = isOverLand(latitude, longitude);
    
    // Debug land detection
    const landmassName = getLandmassName(latitude, longitude);
    logger.debug(`Character position: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    logger.debug(`Landmass detection: ${overLand ? 'YES' : 'NO'}, name: ${landmassName || 'NONE'}`);
    
    // If bunny is over water during travel, try to find a nearby land point
    if (!overLand && currentIndex !== nextIndex) {
      const nearbyLandPosition = findNearbyLandPosition(latitude, longitude, 2.0);
      if (nearbyLandPosition) {
        latitude = nearbyLandPosition.latitude;
        longitude = nearbyLandPosition.longitude;
        logger.debug(`Adjusted to nearby land: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    }

    return {
      latitude,
      longitude,
      currentCity,
      nextCity,
      nearestCity,
      totalCities: cities.length,
      visitedCities: currentIndex,
      completionPercentage: progress * 100,
      transitionProgress,
      mapZoomLevel,
      overLand
    };
  } catch (error) {
    logger.error('Error calculating bunny position:', error);
    return null;
  }
};

// Get the user's nearest city
export const getUserNearestCity = async (
  latitude: number,
  longitude: number
): Promise<City | null> => {
  try {
    const cities = await getCities();
    return getNearestCity(latitude, longitude, cities);
  } catch (error) {
    logger.error('Error finding nearest city:', error);
    return null;
  }
};

// Calculate arrival time for a specific city
export const calculateArrivalTime = async (city: City): Promise<string> => {
  // Import time utilities
  const { getEasterDate, calculateIdealArrivalTime, formatTime } = await import('./timeUtils');
  
  // Calculate for Easter this year
  const now = new Date();
  const easterDate = getEasterDate(now.getFullYear());
  
  // Calculate the ideal arrival time (midnight local time on Easter)
  const arrivalTime = calculateIdealArrivalTime(city, easterDate);
  
  // Format the time for display
  return formatTime(arrivalTime);
};

/**
 * Find a position along a path between two cities, preferring land routes
 * 
 * This function creates a path between two cities that tries to follow landmasses
 * instead of taking a direct route over water.
 * 
 * @param startLat Start latitude
 * @param startLon Start longitude
 * @param endLat End latitude
 * @param endLon End longitude
 * @param progress Progress between 0 and 1
 * @returns Object with latitude and longitude
 */
const findOverlandPosition = (
  startLat: number, 
  startLon: number, 
  endLat: number, 
  endLon: number, 
  progress: number
): { latitude: number; longitude: number } => {
  // Check if we're at the start or end
  if (progress <= 0) {
    return { latitude: startLat, longitude: startLon };
  }
  
  if (progress >= 1) {
    return { latitude: endLat, longitude: endLon };
  }
  
  // First, check if a direct path between the two cities crosses a lot of water
  // by sampling 10 points along the path
  const directPathOverWater = checkDirectPathOverWater(startLat, startLon, endLat, endLon);
  
  if (!directPathOverWater) {
    // If the direct path doesn't cross too much water, use simple interpolation
    return {
      latitude: startLat + (endLat - startLat) * progress,
      longitude: startLon + (endLon - startLon) * progress
    };
  }
  
  // For paths that cross a lot of water, we'll try to find an intermediate land point
  // that can serve as a waypoint between the two cities
  
  // Get the waypoints (can be multiple for very long routes)
  const waypoints = findLandWaypoints(startLat, startLon, endLat, endLon);
  
  // If no waypoints found (very rare), fall back to direct path
  if (waypoints.length === 0) {
    return {
      latitude: startLat + (endLat - startLat) * progress,
      longitude: startLon + (endLon - startLon) * progress
    };
  }
  
  // Add start and end points to create a full path
  const fullPath = [
    { latitude: startLat, longitude: startLon },
    ...waypoints,
    { latitude: endLat, longitude: endLon }
  ];
  
  // Calculate the total path length
  let totalDistance = 0;
  const segmentDistances = [];
  
  for (let i = 0; i < fullPath.length - 1; i++) {
    const dist = calculateDistance(
      fullPath[i].latitude, fullPath[i].longitude,
      fullPath[i + 1].latitude, fullPath[i + 1].longitude
    );
    segmentDistances.push(dist);
    totalDistance += dist;
  }
  
  // Calculate cumulative progress for each segment
  const cumulativeProgress = [0];
  let runningTotal = 0;
  
  for (const dist of segmentDistances) {
    runningTotal += dist / totalDistance;
    cumulativeProgress.push(runningTotal);
  }
  
  // Find which segment our progress falls into
  let segmentIndex = 0;
  for (let i = 0; i < cumulativeProgress.length - 1; i++) {
    if (progress >= cumulativeProgress[i] && progress <= cumulativeProgress[i + 1]) {
      segmentIndex = i;
      break;
    }
  }
  
  // Calculate progress within the segment
  const segmentProgress = 
    (progress - cumulativeProgress[segmentIndex]) / 
    (cumulativeProgress[segmentIndex + 1] - cumulativeProgress[segmentIndex]);
  
  // Interpolate position within the segment
  return {
    latitude: fullPath[segmentIndex].latitude + 
              (fullPath[segmentIndex + 1].latitude - fullPath[segmentIndex].latitude) * segmentProgress,
    longitude: fullPath[segmentIndex].longitude + 
               (fullPath[segmentIndex + 1].longitude - fullPath[segmentIndex].longitude) * segmentProgress
  };
};

/**
 * Check if a direct path between two points crosses a lot of water
 * 
 * @param startLat Start latitude
 * @param startLon Start longitude
 * @param endLat End latitude
 * @param endLon End longitude
 * @returns true if the path crosses a significant amount of water
 */
const checkDirectPathOverWater = (
  startLat: number, 
  startLon: number, 
  endLat: number, 
  endLon: number
): boolean => {
  // First check if both endpoints are over land
  const startIsLand = isOverLand(startLat, startLon);
  const endIsLand = isOverLand(endLat, endLon);
  
  // If both points are on land, check if they're close
  if (startIsLand && endIsLand) {
    const distance = calculateDistance(startLat, startLon, endLat, endLon);
    
    // For short distances between land points, assume not a water crossing
    if (distance < 500) { // 500km
      return false;
    }
  }
  
  // Check points along the path
  const numSamples = 8;
  let waterCount = 0;
  
  for (let i = 1; i < numSamples - 1; i++) {
    const progress = i / numSamples;
    const lat = startLat + (endLat - startLat) * progress;
    const lon = startLon + (endLon - startLon) * progress;
    
    if (!isOverLand(lat, lon)) {
      waterCount++;
      
      // For efficiency, if we've seen enough water points already,
      // we can return early
      if (waterCount > numSamples * 0.3) {
        return true;
      }
    }
  }
  
  // If more than 30% of the path is over water, it's a water crossing
  return waterCount > numSamples * 0.3;
};

/**
 * Find land waypoints between two points to avoid water crossings
 */
const findLandWaypoints = (
  startLat: number, 
  startLon: number, 
  endLat: number, 
  endLon: number
): { latitude: number; longitude: number }[] => {
  // Get the distance between the points
  const distance = calculateDistance(startLat, startLon, endLat, endLon);
  
  // For short distances, don't add waypoints
  if (distance < 1000) { // Less than 1000km
    return [];
  }
  
  // Predefined waypoints for common ocean crossings
  // These are strategic land points that help avoid long ocean crossings
  // Format: [startLat, startLon, endLat, endLon, waypoints[]]
  const knownCrossings: [number, number, number, number, { latitude: number; longitude: number }[]][] = [
    // North Atlantic crossing (Europe to North America)
    [50, -5, 40, -70, [
      { latitude: 63, longitude: -20 }, // Iceland
      { latitude: 60, longitude: -45 }, // Southern Greenland
      { latitude: 47, longitude: -56 }  // Newfoundland
    ]],
    
    // Pacific crossing (North America to Asia)
    [37, -122, 35, 140, [
      { latitude: 51, longitude: -176 }, // Aleutian Islands
      { latitude: 45, longitude: 150 }   // Northern Japan
    ]],
    
    // Europe to Africa
    [40, 10, 0, 10, [
      { latitude: 37, longitude: 11 }    // Sicily
    ]]
  ];
  
  // Check if this path matches any known crossing
  for (const crossing of knownCrossings) {
    const [crossStartLat, crossStartLon, crossEndLat, crossEndLon, waypoints] = crossing;
    
    // Calculate distances to crossing start and end points
    const distToStart = calculateDistance(startLat, startLon, crossStartLat, crossStartLon);
    const distToEnd = calculateDistance(endLat, endLon, crossEndLat, crossEndLon);
    
    // If we're close enough to this known crossing, use its waypoints
    if (distToStart < 1500 && distToEnd < 1500) {
      return waypoints;
    }
  }
  
  // If no known crossing matches, try to find a midpoint that's on land
  const midLat = (startLat + endLat) / 2;
  const midLon = (startLon + endLon) / 2;
  
  // Search for land near the midpoint
  const landPoint = findNearbyLandPosition(midLat, midLon, 10.0);
  if (landPoint) {
    return [landPoint];
  }
  
  // If we couldn't find a good land point, return an empty array
  // (will result in direct path)
  return [];
};

/**
 * Find a nearby land position 
 * 
 * @param latitude Start latitude
 * @param longitude Start longitude
 * @param maxSearchDegrees Maximum search radius in degrees
 * @returns Land position or null if none found
 */
const findNearbyLandPosition = (
  latitude: number,
  longitude: number,
  maxSearchDegrees: number
): { latitude: number; longitude: number } | null => {
  // Check if the current position is already over land
  if (isOverLand(latitude, longitude)) {
    return { latitude, longitude };
  }
  
  // Search in increasing radius until we find land or reach max search distance
  for (let radius = 0.5; radius <= maxSearchDegrees; radius += 0.5) {
    // Try 8 directions (N, NE, E, SE, S, SW, W, NW)
    for (let angle = 0; angle < 360; angle += 45) {
      const radians = angle * Math.PI / 180;
      const newLat = latitude + radius * Math.sin(radians);
      const newLon = longitude + radius * Math.cos(radians);
      
      // Check if this point is over land
      if (isOverLand(newLat, newLon)) {
        return { latitude: newLat, longitude: newLon };
      }
    }
  }
  
  // No land found within search radius
  return null;
};

/**
 * Get the journey path showing visited cities up to the current position
 * Returns an array of coordinates representing the path traveled so far
 *
 * @param currentPosition The current character position
 * @returns Array of [latitude, longitude] tuples representing the path
 */
export const getJourneyPath = async (
  currentPosition: BunnyPosition | null
): Promise<[number, number][]> => {
  if (!currentPosition) {
    return [];
  }

  try {
    // Import time utilities
    const {
      isEaster,
      getEasterDate,
      getGlobalEasterStart,
      getGlobalEasterEnd,
      getCurrentTime,
      calculateIdealArrivalTime
    } = await import('./timeUtils');

    // If it's not the holiday, return empty path
    if (!isEaster()) {
      return [];
    }

    // Get current time and check if we need to recalculate schedule
    const now = getCurrentTime();
    const currentYear = now.getFullYear();
    let easterDate = getEasterDate(currentYear);

    // Check if we're in holiday period for previous or next year
    const thisYearStart = getGlobalEasterStart(easterDate);
    const thisYearEnd = getGlobalEasterEnd(easterDate);

    if (now < thisYearStart || now > thisYearEnd) {
      const prevYearEaster = getEasterDate(currentYear - 1);
      const prevYearStart = getGlobalEasterStart(prevYearEaster);
      const prevYearEnd = getGlobalEasterEnd(prevYearEaster);

      if (now >= prevYearStart && now <= prevYearEnd) {
        easterDate = prevYearEaster;
      } else {
        const nextYearEaster = getEasterDate(currentYear + 1);
        const nextYearStart = getGlobalEasterStart(nextYearEaster);
        const nextYearEnd = getGlobalEasterEnd(nextYearEaster);

        if (now >= nextYearStart && now <= nextYearEnd) {
          easterDate = nextYearEaster;
        }
      }
    }

    // Check if we can use cached schedule
    const needsRecalc = !cachedJourneySchedule ||
      !cachedScheduleDate ||
      cachedScheduleDate.getTime() !== easterDate.getTime();

    if (needsRecalc) {
      // Get the cities sorted by timezone
      const cities = await getCities();

      // Calculate delivery schedule for each city
      const citySchedule = cities.map(city => {
        const arrivalTime = calculateIdealArrivalTime(city, easterDate);
        return { city, arrivalTime };
      });

      // Sort schedule by arrival time
      citySchedule.sort((a, b) => a.arrivalTime.getTime() - b.arrivalTime.getTime());

      // Cache the schedule
      cachedJourneySchedule = citySchedule;
      cachedScheduleDate = easterDate;
    }

    const schedule = cachedJourneySchedule!;

    // Build the path from visited cities
    const path: [number, number][] = [];
    const visitedCount = currentPosition.visitedCities;

    // Add all visited cities to the path
    for (let i = 0; i < visitedCount && i < schedule.length; i++) {
      const city = schedule[i].city;
      path.push([city.latitude, city.longitude]);
    }

    // Add the current position as the final point
    path.push([currentPosition.latitude, currentPosition.longitude]);

    return path;
  } catch (error) {
    logger.error('Error getting journey path:', error);
    return [];
  }
};