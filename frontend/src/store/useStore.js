import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Data
  flights: [],
  conflicts: [],
  earthquakes: [],
  news: [],
  stats: null,

  // UI state
  filters: {
    flights: true,
    conflicts: true,
    earthquakes: true,
    news: true,
  },
  activeTab: 'flights',
  selectedEvent: null,
  isConnected: false,
  lastUpdated: null,

  // Actions - Data setters
  setFlights: (flights) => set({ flights, lastUpdated: new Date() }),
  setConflicts: (conflicts) => set({ conflicts, lastUpdated: new Date() }),
  setEarthquakes: (earthquakes) => set({ earthquakes, lastUpdated: new Date() }),
  setNews: (news) => set({ news, lastUpdated: new Date() }),
  setStats: (stats) => set({ stats }),

  // Bulk setter for initial load
  setAllData: ({ flights, conflicts, earthquakes, news, stats }) =>
    set({
      ...(flights !== undefined && { flights }),
      ...(conflicts !== undefined && { conflicts }),
      ...(earthquakes !== undefined && { earthquakes }),
      ...(news !== undefined && { news }),
      ...(stats !== undefined && { stats }),
      lastUpdated: new Date(),
    }),

  // UI actions
  setActiveTab: (activeTab) => set({ activeTab }),
  toggleFilter: (key) =>
    set((state) => ({
      filters: { ...state.filters, [key]: !state.filters[key] },
    })),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setConnected: (connected) => set({ isConnected: connected }),
  setLastUpdated: (date) => set({ lastUpdated: date }),
}));

export default useStore;
