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
      <div className="glass-card p-6">
        <h2
          className="text-xl font-title font-semibold mb-4 flex items-center gap-2"
          style={{ color: holidayColors.dark }}
        >
          <span className="text-2xl">📍</span>
          {holidayMessages.yourLocationTitle}
        </h2>
        {permissionStatus === 'denied' ? (
          <div className="text-center">
            <p className="text-gray-600 mb-2">{holidayMessages.locationPermissionRequest}</p>
            <p className="text-sm text-gray-400">
              Check your browser's permissions settings for this site.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">{holidayMessages.locationPrompt}</p>
            <div className="flex justify-center">
              <div className="spinner" style={{ color: holidayColors.primary }} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // If we have location but no nearest city yet
  if (!viewerLocation.nearestCity) {
    return (
      <div className="glass-card p-6">
        <h2
          className="text-xl font-title font-semibold mb-4 flex items-center gap-2"
          style={{ color: holidayColors.dark }}
        >
          <span className="text-2xl">📍</span>
          {holidayMessages.yourLocationTitle}
        </h2>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Finding the nearest city to you...</p>
          <div className="flex justify-center">
            <div className="spinner" style={{ color: holidayColors.primary }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h2
        className="text-xl font-title font-semibold mb-4 flex items-center gap-2"
        style={{ color: holidayColors.dark }}
      >
        <span className="text-2xl">📍</span>
        {holidayMessages.yourLocationTitle}
      </h2>

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">You're near</p>
        <p className="font-semibold text-lg" style={{ color: holidayColors.dark }}>
          {viewerLocation.nearestCity.name}, {viewerLocation.nearestCity.country}
        </p>

        {isNearby ? (
          <div
            className="mt-4 p-4 rounded-xl text-white"
            style={{
              backgroundColor: holidayColors.primary,
              animation: 'gentle-pulse 2s ease-in-out infinite',
            }}
          >
            <p className="font-bold">{holidayMessages.nearbyNotification}</p>
            <p className="text-sm opacity-90 mt-1">{holidayMessages.nearbySubMessage}</p>
          </div>
        ) : estimatedArrivalTime ? (
          <div className="mt-4 stat-card">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {formatTime(getCurrentTime()) > estimatedArrivalTime
                ? holidayMessages.visitedLabel
                : holidayMessages.willVisitLabel}
            </p>
            <p
              className="text-3xl font-bold"
              style={{ color: holidayColors.dark }}
            >
              {estimatedArrivalTime}
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-gray-500">{holidayMessages.calculatingVisit}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationInfo;
