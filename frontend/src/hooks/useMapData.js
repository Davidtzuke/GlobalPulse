/** Hook for fetching map data with polling fallback
 *
 * When WebSocket is connected, data comes via WS.
 * When disconnected, polls REST endpoints every 30s.
 * Also does an initial fetch on mount regardless of WS state.
 */
import { useEffect, useRef, useCallback } from 'react'
import useStore from '../store/useStore'
import { fetchFlights, fetchEarthquakes, fetchConflicts, fetchNews, fetchStats } from '../api/client'

export default function useMapData() {
  const connected = useStore(s => s.connected)
  const initialFetched = useRef(false)

  const pollAll = useCallback(async () => {
    const store = useStore.getState()

    const [flightData, eqData, conflictData, newsData, statsData] = await Promise.allSettled([
      fetchFlights(),
      fetchEarthquakes(),
      fetchConflicts(),
      fetchNews(),
      fetchStats(),
    ])

    if (flightData.status === 'fulfilled' && flightData.value?.flights) {
      store.setFlights(flightData.value.flights)
    }
    if (eqData.status === 'fulfilled' && eqData.value?.earthquakes) {
      store.setEarthquakes(eqData.value.earthquakes)
    }
    if (conflictData.status === 'fulfilled' && conflictData.value?.conflicts) {
      store.setConflicts(conflictData.value.conflicts)
    }
    if (newsData.status === 'fulfilled' && newsData.value?.news) {
      store.setNews(newsData.value.news)
    }
    if (statsData.status === 'fulfilled' && statsData.value) {
      store.setStats(statsData.value)
    }
  }, [])

  // Initial fetch on mount
  useEffect(() => {
    if (!initialFetched.current) {
      initialFetched.current = true
      pollAll()
    }
  }, [pollAll])

  // Polling fallback when WebSocket is disconnected
  useEffect(() => {
    if (connected) return

    const interval = setInterval(pollAll, 30000)
    return () => clearInterval(interval)
  }, [connected, pollAll])
}
