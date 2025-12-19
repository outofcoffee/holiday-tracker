import { useState, useEffect } from 'react';
import { formatTime, getCurrentTime } from '../../utils/timeUtils';
import { holidayMessages, holidayColors } from '../../config';

const Header = () => {
  // Update time every second using current time (real or mocked)
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="p-4 text-white text-center shadow-md"
      style={{
        background: `linear-gradient(to right, ${holidayColors.primary}, ${holidayColors.light})`,
      }}
    >
      <h1 className="text-3xl md:text-4xl font-bold">{holidayMessages.title}</h1>
      <p className="text-lg mt-2">{holidayMessages.subtitle}</p>
      <p className="text-sm mt-2">
        {time.toLocaleDateString()} • {formatTime(time)}
      </p>
    </header>
  );
};

export default Header;
