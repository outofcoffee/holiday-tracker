import { useEffect, useState, ReactNode } from 'react';
import { calculateCurrentPosition } from '../utils/geoUtils';
import { calculateItemsDelivered } from '../utils/basketCalculator';
import { BunnyPosition, ViewerLocation, DEFAULT_MAP_ZOOM } from '../types';
import { isHolidayDay, getNextHolidayDate, formatDate } from '../utils/timeUtils';
import { TrackerContext } from './TrackerContextDefinition';
import { preloadLandmassData } from '../utils/landmassDetector';
import logger from '../utils/logger';

interface TrackerProviderProps {
  children: ReactNode;
}

export const TrackerProvider = ({ children }: TrackerProviderProps) => {
  const [currentPosition, setCurrentPosition] = useState<BunnyPosition | null>(null);
  const [totalCities, setTotalCities] = useState(0);
  const [itemsDelivered, setItemsDelivered] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [viewerLocation, setViewerLocation] = useState<ViewerLocation | null>(null);
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState<string | null>(null);
  const [isNearby, setIsNearby] = useState(false);
  const [isHoliday, setIsHoliday] = useState(isHolidayDay());
  const [nextHoliday, setNextHoliday] = useState(getNextHolidayDate());
  const [nextHolidayFormatted, setNextHolidayFormatted] = useState(formatDate(getNextHolidayDate()));
  const [mapZoomLevel, setMapZoomLevel] = useState(DEFAULT_MAP_ZOOM);

  // Preload the GeoJSON data at component mount
  useEffect(() => {
    const preloadData = async () => {
      try {
        logger.debug('Preloading GeoJSON data...');
        await preloadLandmassData();
        logger.debug('GeoJSON data loaded successfully');
      } catch (error) {
        logger.error('Failed to preload GeoJSON data:', error);
      }
    };

    preloadData();
  }, []);

  // Check if it's the holiday day and update relevant information
  useEffect(() => {
    const checkHoliday = () => {
      // Update holiday status
      const holidayDay = isHolidayDay();
      setIsHoliday(holidayDay);

      // Update next holiday date if needed
      const nextHolidayDate = getNextHolidayDate();
      setNextHoliday(nextHolidayDate);
      setNextHolidayFormatted(formatDate(nextHolidayDate));
    };

    // Check initially
    checkHoliday();

    // Check periodically (every minute is enough for date changes)
    const interval = setInterval(checkHoliday, 60000);
    return () => clearInterval(interval);
  }, []);

  // Update character position every second (only on the holiday)
  useEffect(() => {
    // If it's not the holiday, don't track position
    if (!isHoliday) {
      setCurrentPosition(null);
      setCompletionPercentage(0);
      setItemsDelivered(0);
      return;
    }

    const updatePosition = async () => {
      const position = await calculateCurrentPosition(mapZoomLevel);

      if (position) {
        setCurrentPosition(position);
        setTotalCities(position.totalCities);
        setCompletionPercentage(position.completionPercentage);

        // Calculate items delivered
        const items = calculateItemsDelivered(position.completionPercentage);
        setItemsDelivered(items);

        // Check if character is near viewer
        if (viewerLocation) {
          const isNear = position.nearestCity?.name === viewerLocation.nearestCity?.name;
          setIsNearby(isNear);
        }
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 1000);

    return () => clearInterval(interval);
  }, [viewerLocation, isHoliday, viewerLocation?.nearestCity, mapZoomLevel]);

  // Update arrival time every minute when we have a viewer location
  useEffect(() => {
    if (!isHoliday || !viewerLocation?.nearestCity) {
      return;
    }

    const updateArrivalTime = async () => {
      const { calculateArrivalTime } = await import('../utils/geoUtils');
      const arrivalTime = await calculateArrivalTime(viewerLocation.nearestCity!);
      setEstimatedArrivalTime(arrivalTime);
    };

    // Calculate immediately
    updateArrivalTime();

    // Update every minute to keep relative time current
    const interval = setInterval(updateArrivalTime, 60000);

    return () => clearInterval(interval);
  }, [viewerLocation?.nearestCity, isHoliday]);

  // Get viewer's location ONCE at startup, but only during holiday period
  useEffect(() => {
    // Only get location if:
    // 1. We don't already have it
    // 2. Geolocation is available
    // 3. It's the holiday day (do not request in development when not the holiday)
    const shouldRequestLocation = !viewerLocation && navigator.geolocation && isHoliday;

    if (shouldRequestLocation) {
      logger.debug(`Getting user location once during holiday period (isHolidayDay: ${isHoliday})`);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            logger.debug('Got user location:', latitude, longitude);

            // Import getUserNearestCity directly to avoid circular imports
            const { getUserNearestCity } = await import('../utils/geoUtils');
            const nearestCity = await getUserNearestCity(latitude, longitude);

            setViewerLocation({
              latitude,
              longitude,
              nearestCity,
            });
          } catch (error) {
            logger.error('Error processing location:', error);
          }
        },
        (error) => {
          logger.error('Error getting location:', error.message);

          // Try once more after a delay (user might have dismissed the prompt)
          setTimeout(() => {
            if (!viewerLocation && isHoliday) {
              logger.debug('Retrying geolocation once...');
              navigator.geolocation.getCurrentPosition(
                async (position) => {
                  const { latitude, longitude } = position.coords;
                  const { getUserNearestCity } = await import(
                    '../utils/geoUtils'
                  );
                  const nearestCity = await getUserNearestCity(latitude, longitude);

                  setViewerLocation({
                    latitude,
                    longitude,
                    nearestCity,
                  });
                },
                (retryError) => {
                  logger.error('Retry failed:', retryError.message);
                },
                { timeout: 10000, maximumAge: 0 }
              );
            }
          }, 3000);
        },
        {
          timeout: 10000,
          enableHighAccuracy: true,
          // Cache position for 24 hours
          maximumAge: 24 * 60 * 60 * 1000,
        }
      );
    }
  }, [viewerLocation, isHoliday]);

  return (
    <TrackerContext.Provider
      value={{
        currentPosition,
        totalCities,
        // New property names
        itemsDelivered,
        isHolidayDay: isHoliday,
        nextHolidayDate: nextHoliday,
        nextHolidayFormatted,
        // Legacy property names for backward compatibility
        basketsDelivered: itemsDelivered,
        isEasterDay: isHoliday,
        nextEasterDate: nextHoliday,
        nextEasterFormatted: nextHolidayFormatted,
        // Other properties
        completionPercentage,
        viewerLocation,
        estimatedArrivalTime,
        isNearby,
        mapZoomLevel,
        setMapZoomLevel,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};
