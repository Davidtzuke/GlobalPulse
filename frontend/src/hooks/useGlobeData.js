/**
 * Hook to transform Zustand store data into globe.gl-compatible format.
 * Merges all data layers into unified points and rings arrays.
 */

import { useMemo } from 'react';
import useStore from '../store/useStore';
import { formatFlightPoints } from '../components/FlightLayer';
import { formatConflictPoints, formatConflictRings } from '../components/ConflictLayer';
import { formatEarthquakePoints, formatEarthquakeRings } from '../components/EarthquakeLayer';

export function useGlobeData() {
  const flights = useStore((s) => s.flights);
  const conflicts = useStore((s) => s.conflicts);
  const earthquakes = useStore((s) => s.earthquakes);
  const filters = useStore((s) => s.filters);

  const points = useMemo(() => {
    const allPoints = [];
    if (filters.flights) allPoints.push(...formatFlightPoints(flights));
    if (filters.conflicts) allPoints.push(...formatConflictPoints(conflicts));
    if (filters.earthquakes) allPoints.push(...formatEarthquakePoints(earthquakes));
    return allPoints;
  }, [flights, conflicts, earthquakes, filters]);

  const rings = useMemo(() => {
    const allRings = [];
    if (filters.conflicts) allRings.push(...formatConflictRings(conflicts));
    if (filters.earthquakes) allRings.push(...formatEarthquakeRings(earthquakes));
    return allRings;
  }, [conflicts, earthquakes, filters]);

  return { points, rings };
}

export default useGlobeData;
