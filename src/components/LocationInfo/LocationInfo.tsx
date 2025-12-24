import { useEffect, useState } from 'react';
import { useTracker } from '../../hooks/useTracker';
import { getCurrentTime, getHolidayDate, calculateIdealArrivalTime } from '../../utils/timeUtils';
import { holidayMessages, holidayColors, holidayConfig } from '../../config';
import logger from '../../utils/logger';

const LocationInfo = () => {
  const { viewerLocation, estimatedArrivalTime, isNearby, isHolidayDay } = useTracker();
  const [permissionStatus, setPermissionStatus] = useState<string>('prompt');
  const [hasVisited, setHasVisited] = useState<boolean>(false);
  const [treatChoice, setTreatChoice] = useState<'yes' | 'no' | null>(null);
  const [showResponse, setShowResponse] = useState<boolean>(false);

  // Calculate whether the holiday character has already visited based on actual arrival time
  useEffect(() => {
    const calculateVisitStatus = () => {
      if (!viewerLocation?.nearestCity || !isHolidayDay) {
        setHasVisited(false);
        return;
      }

      try {
        // Calculate the actual arrival time as a Date object
        const now = new Date();
        const holidayDate = getHolidayDate(now.getFullYear());
        const arrivalDate = calculateIdealArrivalTime(viewerLocation.nearestCity, holidayDate);

        // Compare current time with arrival time
        const currentTime = getCurrentTime();
        setHasVisited(currentTime >= arrivalDate);
      } catch (error) {
        logger.error('Error calculating visit status:', error);
        setHasVisited(false);
      }
    };

    calculateVisitStatus();

    // Update every minute to keep the status current
    const interval = setInterval(calculateVisitStatus, 60000);
    return () => clearInterval(interval);
  }, [viewerLocation?.nearestCity, isHolidayDay]);

  // Load treat choice from localStorage when user has been visited
  useEffect(() => {
    if (!hasVisited || !isHolidayDay) {
      setTreatChoice(null);
      setShowResponse(false);
      return;
    }

    try {
      const year = new Date().getFullYear();
      const storageKey = `holiday-treat-choice-${holidayConfig.id}-${year}`;
      const saved = localStorage.getItem(storageKey);

      if (saved === 'yes' || saved === 'no') {
        setTreatChoice(saved);
        setShowResponse(true);
      }
    } catch (error) {
      // localStorage unavailable, silently continue without persistence
      logger.debug('localStorage unavailable for treat choice');
    }
  }, [hasVisited, isHolidayDay]);

  // Handler for treat choice
  const handleTreatChoice = (choice: 'yes' | 'no') => {
    setTreatChoice(choice);
    setShowResponse(true);

    try {
      const year = new Date().getFullYear();
      const storageKey = `holiday-treat-choice-${holidayConfig.id}-${year}`;
      localStorage.setItem(storageKey, choice);
    } catch (error) {
      // localStorage unavailable, choice just won't persist
      logger.debug('Could not save treat choice to localStorage');
    }
  };

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
          <>
            <div className="mt-4 stat-card">
              {hasVisited ? (
                <p
                  className="text-lg font-bold"
                  style={{ color: holidayColors.dark }}
                >
                  {holidayMessages.hasVisitedMessage}
                </p>
              ) : (
                <>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {holidayMessages.willVisitLabel}
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: holidayColors.dark }}
                  >
                    {estimatedArrivalTime}
                  </p>
                </>
              )}
            </div>

            {/* Interactive treat question - only show after visit if config exists */}
            {hasVisited && holidayMessages.postVisitQuestion && (
              <div className="mt-4">
                {!showResponse ? (
                  // Show question and buttons
                  <div className="stat-card">
                    <p className="text-sm font-medium mb-3" style={{ color: holidayColors.dark }}>
                      {holidayMessages.postVisitQuestion.question}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleTreatChoice('yes')}
                        className="flex-1 py-2 px-4 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                        style={{ backgroundColor: holidayColors.primary }}
                      >
                        {holidayMessages.postVisitQuestion.yesButton}
                      </button>
                      <button
                        onClick={() => handleTreatChoice('no')}
                        className="flex-1 py-2 px-4 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                        style={{ backgroundColor: holidayColors.secondary }}
                      >
                        {holidayMessages.postVisitQuestion.noButton}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Show response message
                  <div
                    className="stat-card animate-fade-in-up"
                    style={{ borderLeft: `4px solid ${holidayColors.accent}` }}
                  >
                    <div className="flex items-start gap-3">
                      {holidayMessages.postVisitQuestion.responseEmoji && (
                        <span className="text-3xl">{holidayMessages.postVisitQuestion.responseEmoji}</span>
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium" style={{ color: holidayColors.dark }}>
                          {treatChoice === 'yes'
                            ? holidayMessages.postVisitQuestion.yesResponse
                            : holidayMessages.postVisitQuestion.noResponse}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
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
