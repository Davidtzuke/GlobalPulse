/**
 * Conflict visualization layer - formats conflict data for globe.gl
 * Color: red (#ef4444 / pulse-conflict)
 */

export function formatConflictPoints(conflicts) {
  if (!Array.isArray(conflicts)) return [];
  return conflicts
    .filter((c) => c.latitude != null && c.longitude != null)
    .map((c) => ({
      lat: c.latitude,
      lng: c.longitude,
      size: 0.8,
      color: '#ef4444',
      altitude: 0.02,
      type: 'conflict',
      label: `⚠ ${c.event_type || 'Conflict'} — ${c.country || 'Unknown'}`,
      data: c,
    }));
}

export function formatConflictRings(conflicts) {
  if (!Array.isArray(conflicts)) return [];
  return conflicts
    .filter((c) => c.latitude != null && c.longitude != null)
    .map((c) => ({
      lat: c.latitude,
      lng: c.longitude,
      maxR: 3,
      propagationSpeed: 2,
      repeatPeriod: 1500,
      color: () => '#ef4444',
      type: 'conflict',
    }));
}

export default function ConflictLayer() {
  return null;
}
