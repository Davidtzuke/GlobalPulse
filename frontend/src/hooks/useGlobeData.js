/**
 * PLACEHOLDER - Hook to transform store data into globe.gl-compatible format.
 *
 * To be implemented by Globe Engineer.
 *
 * Converts flights, conflicts, earthquakes, and news into
 * points, arcs, and labels for the 3D globe.
 */

import { useMemo } from 'react';
import useStore from '../store/useStore';

export function useGlobeData() {
  const flights = useStore((s) => s.flights);
  const conflicts = useStore((s) => s.conflicts);
  const earthquakes = useStore((s) => s.earthquakes);
  const news = useStore((s) => s.news);
  const filters = useStore((s) => s.filters);

  const points = useMemo(() => {
    // PLACEHOLDER - transform data to globe points
    return [];
  }, [flights, conflicts, earthquakes, news, filters]);

  const arcs = useMemo(() => {
    // PLACEHOLDER - flight arcs
    return [];
  }, [flights, filters]);

  return { points, arcs };
}

export default useGlobeData;
