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
      hour12: true,
    });

    return `${dayOfWeek}, ${monthDay} at ${time}`;
  };

  const formattedStartTime = formatStartTime(globalStartTime);

  // Format the comeback message with the start time
  const comeBackMessage = holidayMessages.comeBackMessage.replace('{date}', formattedStartTime);

  return (
    <div className="py-12 px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Character Display */}
        <div className="relative inline-block mb-8">
          <div
            className="w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center mx-auto"
            style={{
              background: `linear-gradient(135deg, ${holidayColors.secondary}40, ${holidayColors.primary}30)`,
              boxShadow: `0 20px 60px ${holidayColors.primary}20`,
            }}
          >
            <div className="relative">
              <span className="text-8xl md:text-9xl">{holidaySleepingDecorations.characterEmoji}</span>
              <div
                className="absolute -top-2 -right-2 animate-bounce"
                style={{ animationDuration: '2s' }}
              >
                <span className="text-4xl">{holidaySleepingDecorations.sleepEmoji}</span>
              </div>
            </div>
          </div>

          {/* Floating Decorations */}
          {holidaySleepingDecorations.decorationEmojis[0] && (
            <div
              className="absolute bottom-4 -left-4 animate-bounce"
              style={{ animationDuration: '3s', animationDelay: '0.5s' }}
            >
              <span className="text-4xl">{holidaySleepingDecorations.decorationEmojis[0]}</span>
            </div>
          )}
          {holidaySleepingDecorations.decorationEmojis[1] && (
            <div
              className="absolute bottom-8 -right-4 animate-bounce"
              style={{ animationDuration: '2.5s', animationDelay: '1s' }}
            >
              <span className="text-4xl">{holidaySleepingDecorations.decorationEmojis[1]}</span>
            </div>
          )}
          {holidaySleepingDecorations.accentEmoji && (
            <div
              className="absolute -top-4 right-4 animate-pulse"
              style={{ animationDuration: '2s' }}
            >
              <span className="text-3xl">{holidaySleepingDecorations.accentEmoji}</span>
            </div>
          )}
        </div>

        {/* Title & Message */}
        <h2
          className="text-3xl md:text-4xl font-title font-bold mb-4"
          style={{ color: holidayColors.dark }}
        >
          {holidayMessages.sleepingTitle}
        </h2>
        <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
          {holidayMessages.sleepingDescription}
        </p>

        {/* Countdown / Come Back Message */}
        <div
          className="inline-block px-6 py-3 rounded-full font-semibold text-lg"
          style={{
            backgroundColor: `${holidayColors.primary}15`,
            color: holidayColors.dark,
          }}
        >
          {comeBackMessage}
        </div>

        {/* Fun Fact */}
        <div className="mt-10">
          <div className="glass-card p-6 max-w-lg mx-auto text-left">
            <h3
              className="font-title font-semibold text-lg mb-3 flex items-center gap-2"
              style={{ color: holidayColors.dark }}
            >
              <span className="text-xl">💡</span>
              Fun Fact
            </h3>
            <p className="text-gray-600 leading-relaxed">{holidayMessages.sleepingFunFact}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffSeasonCharacter;
