import { useTracker } from '../../hooks/useTracker';
import { holidayMessages, holidayColors, holidaySleepingDecorations } from '../../config';
import { getGlobalHolidayStart } from '../../utils/timeUtils';

/**
 * Component shown when it's not the holiday day.
 * Displays the sleeping/resting character with decorations.
 */
const OffSeasonCharacter = () => {
  const { nextHolidayDate } = useTracker();

  // Get the global start time (when tracking begins in the earliest timezone)
  const globalStartTime = getGlobalHolidayStart(nextHolidayDate);

  // Format the start time in the user's local timezone
  const formatStartTime = (date: Date): string => {
    const dayOfWeek = date.toLocaleDateString(undefined, { weekday: 'long' });
    const monthDay = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
    const time = date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `${dayOfWeek}, ${monthDay} at ${time}`;
  };

  const formattedStartTime = formatStartTime(globalStartTime);

  // Format the comeback message with the start time
  const comeBackMessage = holidayMessages.comeBackMessage.replace('{date}', formattedStartTime);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-3" style={{ color: holidayColors.primary }}>
          {holidayMessages.sleepingTitle}
        </h2>
        <p className="text-gray-600 mb-4">{holidayMessages.sleepingDescription}</p>
        <p className="text-lg font-medium" style={{ color: holidayColors.primary }}>
          {comeBackMessage}
        </p>
      </div>

      <div className="w-full max-w-md relative">
        <div
          className="rounded-full w-64 h-64 mx-auto flex items-center justify-center"
          style={{ backgroundColor: `${holidayColors.secondary}33` }} // 33 = 20% opacity
        >
          <div className="relative">
            {/* Character emoji with sleep animation */}
            <span className="text-8xl">{holidaySleepingDecorations.characterEmoji}</span>
            <div className="absolute -top-4 -right-4 animate-bounce">
              <span className="text-3xl">{holidaySleepingDecorations.sleepEmoji}</span>
            </div>
          </div>
        </div>

        {/* Decoration emojis */}
        {holidaySleepingDecorations.decorationEmojis[0] && (
          <div className="absolute bottom-0 left-0 transform -translate-x-1/4">
            <span className="text-4xl">{holidaySleepingDecorations.decorationEmojis[0]}</span>
          </div>
        )}
        {holidaySleepingDecorations.decorationEmojis[1] && (
          <div className="absolute bottom-4 right-0 transform translate-x-1/4">
            <span className="text-4xl">{holidaySleepingDecorations.decorationEmojis[1]}</span>
          </div>
        )}
        {holidaySleepingDecorations.accentEmoji && (
          <div className="absolute top-4 right-8">
            <span className="text-3xl">{holidaySleepingDecorations.accentEmoji}</span>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white p-4 rounded-lg shadow-md max-w-lg">
        <h3 className="font-title text-lg mb-2" style={{ color: holidayColors.highlight }}>
          Fun Fact
        </h3>
        <p>{holidayMessages.sleepingFunFact}</p>
      </div>
    </div>
  );
};

export default OffSeasonCharacter;
