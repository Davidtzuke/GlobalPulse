import { useEffect, useRef, useCallback, useState } from 'react';
import useStore from '../store/useStore';

export function useWebSocket() {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectDelayRef = useRef(1000);
  const mountedRef = useRef(true);

  const setConnected = useStore((s) => s.setConnected);
  const setFlights = useStore((s) => s.setFlights);
  const setConflicts = useStore((s) => s.setConflicts);
  const setEarthquakes = useStore((s) => s.setEarthquakes);
  const setNews = useStore((s) => s.setNews);
  const setStats = useStore((s) => s.setStats);
  const setAllData = useStore((s) => s.setAllData);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('[WS] Connected');
      setConnected(true);
      reconnectDelayRef.current = 1000; // Reset backoff on successful connect
    };

    ws.onclose = (event) => {
      console.log('[WS] Disconnected', event.code);
      setConnected(false);

      if (mountedRef.current) {
        const delay = Math.min(reconnectDelayRef.current, 30000);
        console.log(`[WS] Reconnecting in ${delay}ms...`);
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectDelayRef.current = delay * 2;
          connect();
        }, delay);
      }
    };

    ws.onerror = (error) => {
      console.error('[WS] Error:', error);
      ws.close();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { type } = data;

        switch (type) {
          case 'flights':
            setFlights(data.data || data.flights || []);
            break;
          case 'conflicts':
            setConflicts(data.data || data.conflicts || []);
            break;
          case 'earthquakes':
            setEarthquakes(data.data || data.earthquakes || []);
            break;
          case 'news':
            setNews(data.data || data.news || []);
            break;
          case 'stats':
            setStats(data.data || data.stats || {});
            break;
          case 'all':
            setAllData(data.data || data);
            break;
          default:
            console.warn('[WS] Unknown message type:', type);
        }
      } catch (err) {
        console.error('[WS] Failed to parse message:', err);
      }
    };

    wsRef.current = ws;
  }, [setConnected, setFlights, setConflicts, setEarthquakes, setNews, setStats, setAllData]);

  const reconnect = useCallback(() => {
    reconnectDelayRef.current = 1000;
    connect();
  }, [connect]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const isConnected = useStore((s) => s.isConnected);

  return { isConnected, reconnect };
}

export default useWebSocket;
