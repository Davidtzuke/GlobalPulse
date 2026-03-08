/** Hook for fetching and preparing map layer data
 *
 * - Fetches flight, earthquake, conflict data on interval
 * - Transforms data for Leaflet map markers/layers
 * - Manages polling when WebSocket is disconnected
 *
 * TODO: Data Pipeline Engineer - implement polling and data transforms
 */
import { useEffect } from 'react'
import useStore from '../store/useStore'
import { fetchFlights, fetchEarthquakes, fetchConflicts } from '../api/client'

export default function useMapData() {
  const connected = useStore(s => s.connected)

  useEffect(() => {
    if (connected) return // WebSocket handles updates when connected

    // TODO: implement polling fallback
    // const interval = setInterval(async () => { ... }, 30000)
    // return () => clearInterval(interval)
  }, [connected])
}
