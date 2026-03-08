/** API client for Global Pulse v2 backend */

const BASE_URL = '/api'

async function apiFetch(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error(`[API] ${endpoint}:`, err.message)
    return null
  }
}

export async function fetchFlights() {
  const data = await apiFetch('/flights')
  return data?.flights ?? []
}

export async function fetchEarthquakes() {
  const data = await apiFetch('/earthquakes')
  return data?.earthquakes ?? []
}

export async function fetchConflicts() {
  const data = await apiFetch('/conflicts')
  return data?.conflicts ?? []
}

export async function fetchNews() {
  const data = await apiFetch('/news')
  return data?.news ?? []
}

export async function fetchStats() {
  return apiFetch('/stats')
}

/** Bulk fetch all data in a single request */
export async function fetchAllData() {
  const data = await apiFetch('/all')
  if (!data) return null
  // /api/all returns flat arrays directly (not wrapped in {flights: {flights: [...]}} )
  return data
}
