/**
 * Earthquake visualization layer - formats earthquake data for globe.gl
 * Color: amber (#f59e0b / pulse-earthquake)
 */

export function formatEarthquakePoints(earthquakes) {
  if (!Array.isArray(earthquakes)) return [];
  return earthquakes
    .filter((e) => e.latitude != null && e.longitude != null)
    .map((e) => {
      const mag = e.magnitude || 1;
      return {
        lat: e.latitude,
        lng: e.longitude,
        size: Math.max(0.3, mag * 0.3),
        color: '#f59e0b',
        altitude: 0.02,
        type: 'earthquake',
        label: `🌍 M${mag.toFixed(1)} — ${e.place || 'Unknown location'}`,
        data: e,
      };
    });
}

export function formatEarthquakeRings(earthquakes) {
  if (!Array.isArray(earthquakes)) return [];
  return earthquakes
    .filter((e) => e.latitude != null && e.longitude != null)
    .map((e) => {
      const mag = e.magnitude || 1;
      return {
        lat: e.latitude,
        lng: e.longitude,
        maxR: Math.max(2, mag * 1.5),
        propagationSpeed: 3,
        repeatPeriod: 1000,
        color: () => '#f59e0b',
        type: 'earthquake',
      };
    });
}

export default function EarthquakeLayer() {
  return null;
}
