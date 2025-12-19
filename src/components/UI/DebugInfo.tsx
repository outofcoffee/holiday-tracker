import { useState, useEffect } from 'react';
import {
  getCurrentTime,
  getGlobalHolidayStart,
  getGlobalHolidayEnd,
  getHolidayDate,
  getHolidayName,
} from '../../utils/timeUtils';
import { useTracker } from '../../hooks/useTracker';
import logger from '../../utils/logger';

const DebugInfo = () => {
  const { isHolidayDay, nextHolidayFormatted, currentPosition } = useTracker();
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [showDebug, setShowDebug] = useState(false);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check if debug mode is enabled via environment variable
  useEffect(() => {
    try {
      // Check for debug mode from multiple sources
      const isViteDebug = import.meta.env.VITE_DEBUG === 'true';
      const isDev = import.meta.env.DEV === true;
      const hasDebugParam = new URLSearchParams(window.location.search).get('debug') === 'true';

      // Show debug panel if any debug condition is true
      setShowDebug(isViteDebug || isDev || hasDebugParam);

      // Log debug mode status
      if (isViteDebug || isDev || hasDebugParam) {
        logger.debug('Debug panel initialized');
      }
    } catch (e) {
      setShowDebug(false);
    }
  }, []);

  if (!showDebug) {
    return null;
  }

  // Calculate global holiday period for display
  const year = currentTime.getFullYear();
  const holidayDate = getHolidayDate(year);
  const globalStart = getGlobalHolidayStart(holidayDate);
  const globalEnd = getGlobalHolidayEnd(holidayDate);
  const holidayName = getHolidayName();

  return (
    <div className="fixed bottom-0 right-0 bg-gray-800 text-white p-2 text-xs z-50 opacity-70 hover:opacity-100">
      <div>
        <strong>Current Time:</strong> {currentTime.toLocaleString()}
      </div>
      <div>
        <strong>Holiday Mode:</strong> {holidayName}
      </div>
      <div>
        <strong>Is {holidayName} Day:</strong> {isHolidayDay ? 'Yes' : 'No'}
      </div>
      {isHolidayDay ? (
        <>
          <div>
            <strong>{holidayName} Period:</strong> {globalStart.toISOString().slice(0, 16)} to{' '}
            {globalEnd.toISOString().slice(0, 16)}
          </div>
          {currentPosition && (
            <>
              <div>
                <strong>Current City:</strong> {currentPosition.currentCity?.name}
              </div>
              <div>
                <strong>Next City:</strong> {currentPosition.nextCity?.name}
              </div>
              <div>
                <strong>Progress:</strong> {Math.round(currentPosition.completionPercentage)}%
              </div>
            </>
          )}
        </>
      ) : (
        <div>
          <strong>Next {holidayName}:</strong> {nextHolidayFormatted}
        </div>
      )}
      <div className="text-gray-300 text-xs mt-1">
        Set VITE_MOCK_TIME or VITE_MOCK_DATE in .env to override
      </div>
    </div>
  );
};

export default DebugInfo;
