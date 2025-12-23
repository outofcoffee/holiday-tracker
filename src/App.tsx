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

  // Set CSS custom properties for theming
  useEffect(() => {
    document.documentElement.style.setProperty('--holiday-map-border-color', holidayColors.mapBorder);
    document.documentElement.style.setProperty('--holiday-primary', holidayColors.primary);
  }, []);

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
        style={{ background: holidayColors.gradient }}
      >
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-card-solid p-10 text-center max-w-md mx-4">
            <div className="inline-block mb-6">
              <span className="text-7xl">{holidaySleepingDecorations.characterEmoji}</span>
            </div>
            <h2
              className="text-2xl font-title font-semibold mb-4"
              style={{ color: holidayColors.dark }}
            >
              {holidayMessages.loadingMessage}
            </h2>
            <p className="text-gray-600 italic leading-relaxed">{fact.text}</p>
            <div className="mt-6 flex justify-center">
              <div className="spinner" style={{ color: holidayColors.primary }} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: holidayColors.gradient }}
    >
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {isHolidayDay ? (
          <div className="space-y-6">
            {/* Hero Map Section */}
            <div className="relative">
              <div className="h-[60vh] min-h-[400px] max-h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Map />
              </div>

              {/* Floating Status Banner */}
              {currentPosition?.currentCity && (
                <div
                  className={`absolute bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:min-w-[400px] md:max-w-[600px] status-banner text-white text-center ${
                    currentPosition.currentCity.id === currentPosition.nextCity?.id
                      ? 'delivering'
                      : ''
                  }`}
                  style={{
                    backgroundColor:
                      currentPosition.currentCity.id === currentPosition.nextCity?.id
                        ? holidayColors.primary
                        : holidayColors.secondary,
                  }}
                >
                  {currentPosition.currentCity.id === currentPosition.nextCity?.id ? (
                    <div>
                      <p className="font-semibold text-lg">
                        {holidayMessages.deliveringMessage(
                          currentPosition.currentCity.name,
                          currentPosition.currentCity.country
                        )}
                      </p>
                      <p className="text-sm mt-1 opacity-90">
                        {holidayMessages.deliveringSubMessage}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-lg">
                        {holidayMessages.travelingMessage(
                          currentPosition.currentCity.name,
                          currentPosition.nextCity?.name || ''
                        )}
                      </p>
                      <p className="text-sm mt-1 opacity-90">
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

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Progress Card */}
              <ProgressTracker />

              {/* Location Card */}
              <LocationInfo />

              {/* Fun Fact Card */}
              <div
                className="glass-card p-6 fact-card"
                style={
                  {
                    '--fact-accent': holidayColors.primary,
                  } as React.CSSProperties
                }
              >
                <div
                  className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
                  style={{ backgroundColor: holidayColors.primary }}
                />
                <h2
                  className="text-xl font-title font-semibold mb-4 flex items-center gap-2"
                  style={{ color: holidayColors.dark }}
                >
                  <span className="text-2xl">💡</span>
                  {holidayMessages.funFactTitle}
                </h2>
                <p className="text-gray-700 leading-relaxed italic">{fact.text}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card-solid overflow-hidden">
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
