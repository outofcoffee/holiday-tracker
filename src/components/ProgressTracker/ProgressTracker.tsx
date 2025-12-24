import { useTracker } from '../../hooks/useTracker';
import { formatNumber } from '../../utils/basketCalculator';
import { holidayMessages, holidayColors } from '../../config';

const ProgressTracker = () => {
  const { itemsDelivered, completionPercentage, currentPosition } = useTracker();

  return (
    <div className="glass-card p-6">
      <h2
        className="text-xl font-title font-semibold mb-5 flex items-center gap-2"
        style={{ color: holidayColors.dark }}
      >
        <span className="text-2xl">📊</span>
        {holidayMessages.progressTitle}
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="stat-card">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {holidayMessages.itemsDeliveredLabel}
          </p>
          <p
            className="text-2xl font-bold counter-value"
            style={{ color: holidayColors.primary }}
          >
            {formatNumber(itemsDelivered)}
          </p>
        </div>

        <div className="stat-card">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Mince Pies Eaten
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: holidayColors.highlight }}
          >
            {formatNumber(Math.floor(itemsDelivered / 10))}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{
            width: `${completionPercentage}%`,
            background: `linear-gradient(90deg, ${holidayColors.primary}, ${holidayColors.highlight})`,
          }}
        />
      </div>

      {/* Journey Complete Text */}
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-500">
          {holidayMessages.journeyCompleteLabel}:{' '}
          <span
            className="font-bold"
            style={{ color: holidayColors.highlight }}
          >
            {Math.round(completionPercentage)}%
          </span>
        </p>
      </div>

      {/* Current Location */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        {currentPosition?.currentCity && (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Currently in</p>
            <p className="font-semibold" style={{ color: holidayColors.dark }}>
              {currentPosition.currentCity.name}, {currentPosition.currentCity.country}
            </p>
          </div>
        )}
        {currentPosition?.nextCity &&
          currentPosition.nextCity.id !== currentPosition?.currentCity?.id && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Next stop: {currentPosition.nextCity.name}, {currentPosition.nextCity.country}
            </p>
          )}
      </div>
    </div>
  );
};

export default ProgressTracker;
