/** Global state store using Zustand
 *
 * State shape:
 * - flights: Flight[] - active flight positions with headings
 * - earthquakes: Earthquake[] - recent seismic events
 * - conflicts: Conflict[] - conflict events from news
 * - news: NewsArticle[] - latest global news
 * - stats: DashboardStats - aggregated counts
 * - connected: boolean - WebSocket connection status
 * - selectedLayer: string - 'flights' | 'earthquakes' | 'conflicts' | 'all'
 * - lastUpdate: Date | null
 *
 * TODO: Data Pipeline Engineer - wire up WebSocket updates
 */
import { create } from 'zustand'

const useStore = create((set, get) => ({
  // Data
  flights: [],
  earthquakes: [],
  conflicts: [],
  news: [],
  stats: {
    total_flights: 0,
    total_earthquakes: 0,
    total_conflicts: 0,
    latest_news_count: 0,
    avg_magnitude: 0,
    max_magnitude: 0,
  },

  // UI State
  connected: false,
  selectedLayer: 'all',
  lastUpdate: null,

  // Actions
  setFlights: (flights) => set({ flights, lastUpdate: new Date() }),
  setEarthquakes: (earthquakes) => set({ earthquakes, lastUpdate: new Date() }),
  setConflicts: (conflicts) => set({ conflicts, lastUpdate: new Date() }),
  setNews: (news) => set({ news, lastUpdate: new Date() }),
  setStats: (stats) => set({ stats }),
  setConnected: (connected) => set({ connected }),
  setSelectedLayer: (selectedLayer) => set({ selectedLayer }),
}))

export default useStore
