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
  return apiFetch('/data/all');
}

export async function fetchFlights() {
  return apiFetch('/data/flights');
}

export async function fetchConflicts() {
  return apiFetch('/data/conflicts');
}

export async function fetchEarthquakes() {
  return apiFetch('/data/earthquakes');
}

export async function fetchNews() {
  return apiFetch('/data/news');
}

export async function fetchStats() {
  return apiFetch('/data/stats');
}
