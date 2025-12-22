import { useEffect, useState } from 'react';
import { useTracker } from '../../hooks/useTracker';
import { getCurrentTime, formatTime } from '../../utils/timeUtils';
import { holidayMessages, holidayColors } from '../../config';
import logger from '../../utils/logger';

const LocationInfo = () => {
  const { viewerLocation, estimatedArrivalTime, isNearby, isHolidayDay } = useTracker();
  const [permissionStatus, setPermissionStatus] = useState<string>('prompt');

  // Check geolocation permission status - only if it's the holiday day
  useEffect(() => {
    // Skip permission check if it's not the holiday day
    if (!isHolidayDay) return;

    const checkPermission = async () => {
      try {
        if ('permissions' in navigator) {
          const status = await navigator.permissions.query({
            name: 'geolocation' as PermissionName,
          });
          setPermissionStatus(status.state);

          // Listen for permission changes
          status.addEventListener('change', () => {
            setPermissionStatus(status.state);
          });
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Error checking permission status');
        }
      }
    };

    checkPermission();
  }, [isHolidayDay]);

  // Don't show location info at all if it's not the holiday
  if (!isHolidayDay) {
    return null;
  }

  // Handle prompt permission or loading state
  if (!viewerLocation) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-title mb-3" style={{ color: holidayColors.dark }}>
          {holidayMessages.yourLocationTitle}
        </h2>
        {permissionStatus === 'denied' ? (
          <div>
            <p>{holidayMessages.locationPermissionRequest}</p>
            <p className="text-sm mt-2 text-gray-500">
              Check your browser's permissions settings for this site.
            </p>
          </div>
        ) : (
          <div>
            <p>{holidayMessages.locationPrompt}</p>
            <div className="mt-3 flex justify-center">
              <div
                className="w-6 h-6 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: `${holidayColors.primary} transparent transparent transparent` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If we have location but no nearest city yet
  if (!viewerLocation.nearestCity) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-title mb-3" style={{ color: holidayColors.dark }}>
          {holidayMessages.yourLocationTitle}
        </h2>
        <p>Finding the nearest city to you...</p>
        <div className="mt-3 flex justify-center">
          <div
            className="w-6 h-6 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${holidayColors.primary} transparent transparent transparent` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-title mb-3" style={{ color: holidayColors.dark }}>
        {holidayMessages.yourLocationTitle}
      </h2>

      <div className="text-center">
        <p className="font-medium">
          You're near {viewerLocation.nearestCity.name}, {viewerLocation.nearestCity.country}
        </p>

        {isNearby ? (
          <div
            className="mt-4 p-3 rounded-lg animate-pulse"
            style={{ backgroundColor: holidayColors.primary }}
          >
            <p className="font-bold text-white">{holidayMessages.nearbyNotification}</p>
            <p className="text-white text-sm">{holidayMessages.nearbySubMessage}</p>
          </div>
        ) : estimatedArrivalTime ? (
          <div className="mt-4">
            <p className="text-sm">
              {formatTime(getCurrentTime()) > estimatedArrivalTime
                ? holidayMessages.visitedLabel
                : holidayMessages.willVisitLabel}
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: holidayColors.dark }}>
              {estimatedArrivalTime}
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm">{holidayMessages.calculatingVisit}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationInfo;
