/**
 * PLACEHOLDER - Zustand store for Global Pulse state management.
 *
 * To be implemented by Dashboard Engineer.
 *
 * State shape:
 *   - flights: Flight[]
 *   - conflicts: Conflict[]
 *   - earthquakes: Earthquake[]
 *   - news: NewsArticle[]
 *   - stats: DashboardStats
 *   - filters: { flights: bool, conflicts: bool, earthquakes: bool, news: bool }
 *   - selectedEvent: object | null
 *   - isConnected: bool (WebSocket status)
 *   - lastUpdated: Date | null
 */

import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Data
  flights: [],
  conflicts: [],
  earthquakes: [],
  news: [],
  stats: {},

  // UI state
  filters: {
    flights: true,
    conflicts: true,
    earthquakes: true,
    news: true,
  },
  selectedEvent: null,
  isConnected: false,
  lastUpdated: null,

  // Actions
  setFlights: (flights) => set({ flights }),
  setConflicts: (conflicts) => set({ conflicts }),
  setEarthquakes: (earthquakes) => set({ earthquakes }),
  setNews: (news) => set({ news }),
  setStats: (stats) => set({ stats }),
  toggleFilter: (key) =>
    set((state) => ({
      filters: { ...state.filters, [key]: !state.filters[key] },
    })),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setConnected: (connected) => set({ isConnected: connected }),
  setLastUpdated: (date) => set({ lastUpdated: date }),
}));

export default useStore;
