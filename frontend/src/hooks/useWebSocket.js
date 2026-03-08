/** WebSocket hook for real-time data updates
 *
 * Connects to ws://localhost:8000/ws (proxied via Vite in dev)
 * Receives LiveUpdate messages: { type, data, timestamp }
 * Types: "flight", "earthquake", "conflict", "news", "stats"
 *
 * TODO: Data Pipeline Engineer - implement full WebSocket logic
 */
import { useEffect, useRef } from 'react'
import useStore from '../store/useStore'

export default function useWebSocket() {
  const wsRef = useRef(null)
  const setConnected = useStore(s => s.setConnected)

  useEffect(() => {
    // TODO: Data Pipeline Engineer - implement WebSocket connection
    // const ws = new WebSocket(`ws://${window.location.host}/ws`)
    // ws.onopen = () => setConnected(true)
    // ws.onclose = () => setConnected(false)
    // ws.onmessage = (event) => { ... dispatch to store ... }
    return () => wsRef.current?.close()
  }, [])
}
