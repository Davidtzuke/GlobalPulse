/**
 * PLACEHOLDER - API client for Global Pulse backend.
 *
 * To be implemented by Dashboard Engineer.
 * Base URL: /api (proxied to localhost:8000)
 *
 * Endpoints:
 *   GET /api/flights     - Current flight positions
 *   GET /api/conflicts   - Active conflict events
 *   GET /api/earthquakes - Recent earthquakes
 *   GET /api/news        - Trending news articles
 *   GET /api/stats       - Aggregated dashboard statistics
 */

const BASE_URL = '/api';

export async function fetchFlights() {
  const res = await fetch(`${BASE_URL}/flights`);
  return res.json();
}

export async function fetchConflicts() {
  const res = await fetch(`${BASE_URL}/conflicts`);
  return res.json();
}

export async function fetchEarthquakes() {
  const res = await fetch(`${BASE_URL}/earthquakes`);
  return res.json();
}

export async function fetchNews() {
  const res = await fetch(`${BASE_URL}/news`);
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  return res.json();
}
