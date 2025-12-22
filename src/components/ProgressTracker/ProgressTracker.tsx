import { useTracker } from '../../hooks/useTracker';
import { formatNumber } from '../../utils/basketCalculator';
import { holidayMessages, holidayColors } from '../../config';

const ProgressTracker = () => {
  const { itemsDelivered, completionPercentage, currentPosition } = useTracker();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-title mb-3" style={{ color: holidayColors.dark }}>
        {holidayMessages.progressTitle}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <h3 className="text-md font-semibold">{holidayMessages.itemsDeliveredLabel}</h3>
          <div
            className="text-2xl font-bold animate-bounce"
            style={{ color: holidayColors.primary }}
          >
            {formatNumber(itemsDelivered)}
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-md font-semibold">{holidayMessages.journeyCompleteLabel}</h3>
          <div className="text-2xl font-bold" style={{ color: holidayColors.highlight }}>
            {Math.round(completionPercentage)}%
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="h-4 rounded-full transition-all duration-500"
            style={{
              width: `${completionPercentage}%`,
              backgroundColor: holidayColors.primary,
            }}
          ></div>
        </div>
      </div>

      <div className="mt-4 text-center">
        {currentPosition?.currentCity && (
          <p className="font-medium">
            Currently in {currentPosition.currentCity.name}, {currentPosition.currentCity.country}
          </p>
        )}
        {currentPosition?.nextCity &&
          currentPosition.nextCity.id !== currentPosition?.currentCity?.id && (
            <p className="text-sm text-gray-600 mt-1">
              Next stop: {currentPosition.nextCity.name}, {currentPosition.nextCity.country}
            </p>
          )}
      </div>
    </div>
  );
};

export default ProgressTracker;
