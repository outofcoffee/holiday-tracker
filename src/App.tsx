import { useEffect, useState } from 'react';
import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import Map from './components/Map/Map';
import ProgressTracker from './components/ProgressTracker/ProgressTracker';
import LocationInfo from './components/LocationInfo/LocationInfo';
import DebugInfo from './components/UI/DebugInfo';
import OffSeasonCharacter from './components/UI/OffSeasonCharacter';
import { useTracker } from './hooks/useTracker';
import { getRandomFact, holidayMessages, holidayColors, holidaySleepingDecorations } from './config';

function App() {
  const { currentPosition, isHolidayDay } = useTracker();
  const [loading, setLoading] = useState(true);
  const [fact, setFact] = useState(getRandomFact());

  // Simulate loading time to ensure all data is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Change fact every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFact(getRandomFact());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: `${holidayColors.secondary}33` }}
      >
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="inline-block animate-bounce mb-4">
              <span className="text-5xl">{holidaySleepingDecorations.characterEmoji}</span>
            </div>
            <h2 className="text-xl font-bold" style={{ color: holidayColors.dark }}>
              {holidayMessages.loadingMessage}
            </h2>
            <p className="mt-3 text-gray-600 italic">{fact.text}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: `${holidayColors.secondary}33` }}
    >
      <Header />

      <main className="flex-1 container mx-auto p-4 pb-8">
        {isHolidayDay ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Sidebar with stats */}
            <div className="lg:col-span-1 space-y-4">
              <ProgressTracker />
              <LocationInfo />

              {/* Fun Fact Card */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-3" style={{ color: holidayColors.highlight }}>
                  {holidayMessages.funFactTitle}
                </h2>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${holidayColors.accent}66` }}
                >
                  <p className="italic">{fact.text}</p>
                </div>
              </div>
            </div>

            {/* Main map area */}
            <div className="lg:col-span-3 flex flex-col">
              <div className="h-[500px] mb-4">
                <Map />
              </div>

              {/* Current location banner with status indication */}
              {currentPosition?.currentCity && (
                <div
                  className="mb-8 text-white p-3 rounded-lg text-center"
                  style={{
                    backgroundColor:
                      currentPosition.currentCity.id === currentPosition.nextCity?.id
                        ? holidayColors.primary
                        : holidayColors.secondary,
                    animation:
                      currentPosition.currentCity.id === currentPosition.nextCity?.id
                        ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        : 'none',
                  }}
                >
                  {currentPosition.currentCity.id === currentPosition.nextCity?.id ? (
                    // Delivering at a city
                    <div>
                      <p className="font-bold">
                        {holidayMessages.deliveringMessage(
                          currentPosition.currentCity.name,
                          currentPosition.currentCity.country
                        )}
                      </p>
                      <p className="text-sm mt-1">{holidayMessages.deliveringSubMessage}</p>
                    </div>
                  ) : (
                    // Traveling between cities
                    <div>
                      <p className="font-bold">
                        {holidayMessages.travelingMessage(
                          currentPosition.currentCity.name,
                          currentPosition.nextCity?.name || ''
                        )}
                      </p>
                      <p className="text-sm mt-1">
                        {holidayMessages.nextDeliveryMessage(
                          currentPosition.nextCity?.name || '',
                          currentPosition.nextCity?.country || ''
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg">
            <OffSeasonCharacter />
          </div>
        )}
      </main>

      <Footer />
      <DebugInfo />
    </div>
  );
}

export default App;
