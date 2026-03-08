/**
 * PLACEHOLDER - WebSocket hook for live data updates.
 *
 * To be implemented by Dashboard Engineer.
 *
 * Connects to ws://localhost:5173/ws (proxied to backend :8000)
 * Receives LiveUpdate messages and dispatches to Zustand store.
 * Auto-reconnects on disconnect.
 */

import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';

export function useWebSocket() {
  const wsRef = useRef(null);
  const setConnected = useStore((s) => s.setConnected);

  useEffect(() => {
    // PLACEHOLDER - implement WebSocket connection
    // const ws = new WebSocket(`ws://${window.location.host}/ws`);
    // ws.onopen = () => setConnected(true);
    // ws.onclose = () => { setConnected(false); /* reconnect logic */ };
    // ws.onmessage = (event) => { /* dispatch to store */ };
    // wsRef.current = ws;
    // return () => ws.close();
  }, []);

  return wsRef;
}

export default useWebSocket;
