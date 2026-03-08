/**
 * Flight visualization layer - formats flight data for globe.gl points
 * Color: cyan (#22d3ee / pulse-flight)
 */

export function formatFlightPoints(flights) {
  if (!Array.isArray(flights)) return [];
  return flights
    .filter((f) => f.latitude != null && f.longitude != null)
    .map((f) => ({
      lat: f.latitude,
      lng: f.longitude,
      size: 0.3,
      color: '#22d3ee',
      altitude: 0.01,
      type: 'flight',
      label: `✈ ${f.callsign || 'Unknown'} (${f.origin_country || '?'})`,
      data: f,
    }));
}

export default function FlightLayer() {
  return null; // Data rendered via globe.gl layers
}
