import { useEffect, useState } from 'react';
import { Polyline } from 'react-leaflet';
import { useTracker } from '../../hooks/useTracker';
import { getJourneyPath } from '../../utils/geoUtils';
import { holidayColors } from '../../config';

/**
 * JourneyPath component renders a polyline showing the character's traveled path.
 * Only shows the path behind the character (visited cities), not ahead.
 */
const JourneyPath = () => {
  const { currentPosition } = useTracker();
  const [path, setPath] = useState<[number, number][]>([]);

  useEffect(() => {
    const updatePath = async () => {
      if (currentPosition) {
        const journeyPath = await getJourneyPath(currentPosition);
        setPath(journeyPath);
      } else {
        setPath([]);
      }
    };

    updatePath();
  }, [currentPosition]);

  // Don't render if we don't have a path with at least 2 points
  if (path.length < 2) {
    return null;
  }

  return (
    <Polyline
      positions={path}
      pathOptions={{
        color: holidayColors.accent,
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 5',
        lineCap: 'round',
        lineJoin: 'round',
      }}
    />
  );
};

export default JourneyPath;
