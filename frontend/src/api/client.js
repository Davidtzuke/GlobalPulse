const BASE_URL = '/api';

async function apiFetch(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`[API] Failed to fetch ${endpoint}:`, err);
    return null;
  }
}

export async function fetchAllData() {
  const result = await apiFetch('/all');
  if (!result) return null;
  return result.data || result;
}

export async function fetchFlights() {
  const result = await apiFetch('/flights');
  return result?.data || null;
}

export async function fetchConflicts() {
  const result = await apiFetch('/conflicts');
  return result?.data || null;
}

export async function fetchEarthquakes() {
  const result = await apiFetch('/earthquakes');
  return result?.data || null;
}

export async function fetchNews() {
  const result = await apiFetch('/news');
  return result?.data || null;
}

export async function fetchStats() {
  const result = await apiFetch('/stats');
  return result?.data || null;
}
