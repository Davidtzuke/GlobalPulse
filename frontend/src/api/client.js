/** API client for Global Pulse backend
 *
 * Endpoints:
 * - GET /api/flights -> { flights: Flight[], count: number }
 * - GET /api/earthquakes -> { earthquakes: Earthquake[], count: number }
 * - GET /api/conflicts -> { conflicts: Conflict[], count: number }
 * - GET /api/news -> { news: NewsArticle[], count: number }
 * - GET /api/stats -> DashboardStats
 *
 * TODO: Data Pipeline Engineer - implement full API client
 */

const BASE_URL = '/api'

export async function fetchFlights() {
  const res = await fetch(`${BASE_URL}/flights`)
  return res.json()
}

export async function fetchEarthquakes() {
  const res = await fetch(`${BASE_URL}/earthquakes`)
  return res.json()
}

export async function fetchConflicts() {
  const res = await fetch(`${BASE_URL}/conflicts`)
  return res.json()
}

export async function fetchNews() {
  const res = await fetch(`${BASE_URL}/news`)
  return res.json()
}

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/stats`)
  return res.json()
}
