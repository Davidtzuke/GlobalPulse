/** Hook for fetching map data with polling fallback
 *
 * When WebSocket is connected, data comes via WS.
 * When disconnected, polls REST endpoints every 30s.
 * Also does an initial fetch on mount regardless of WS state.
 */
import { useEffect, useRef, useCallback } from 'react'
import useStore from '../store/useStore'
import { fetchAllData } from '../api/client'

export default function useMapData() {
  const connected = useStore(s => s.connected)
  const initialFetched = useRef(false)

  const pollAll = useCallback(async () => {
    const data = await fetchAllData()
    if (!data) return
    const store = useStore.getState()

    if (Array.isArray(data.flights)) store.setFlights(data.flights)
    if (Array.isArray(data.earthquakes)) store.setEarthquakes(data.earthquakes)
    if (Array.isArray(data.conflicts)) store.setConflicts(data.conflicts)
    if (Array.isArray(data.news)) store.setNews(data.news)
    if (data.stats) store.setStats(data.stats)
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

  return { refresh: pollAll }
}
