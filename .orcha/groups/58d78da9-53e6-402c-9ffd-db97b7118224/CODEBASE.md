## About This Project
Global Pulse v2 is a real-time world dashboard that visualizes live flights (OpenSky Network), conflict events (GDELT DOC 2.0), earthquakes (USGS GeoJSON), and global news on an interactive 2D Leaflet map with dark CartoDB tiles, sidebar panels, sparkline charts, and a live event feed.

## Tech Stack
- **Frontend**: React 18 + Vite + TailwindCSS + Zustand (state) + react-leaflet (2D map) + Recharts (sparklines) + Lucide (icons) + topojson-client (country borders)
- **Backend**: FastAPI + httpx (async HTTP) + APScheduler (interval polling: flights 60s, earthquakes 300s, conflicts 600s, news 300s) + WebSocket broadcast via ConnectionManager
- **Data flow**: REST `/api/all` bulk endpoint for initial load → WebSocket `/ws` for live push updates → Zustand store → React re-renders map layers + panels. Polling fallback every 30s when WS disconnects.

## What This Branch Does
Complete v2 rewrite replacing the 3D globe with a 2D react-leaflet map. Integration Engineer fixed: APScheduler jobs that were permanently paused (`next_run_time=None` bug), added bulk `/api/all` endpoint, simplified App.jsx to use `useMapData` hook with polling fallback, fixed API client response unwrapping, and removed duplicate Leaflet CSS loading.

## Key Files
- `frontend/src/App.jsx` — Main layout: header with WS status, sidebar (tabs: Stats/News/Conflicts/Quakes + LiveFeed), map area
- `frontend/src/components/WorldMap.jsx` — MapContainer with CartoDB dark tiles, CountryLayer, FlightLayer, EarthquakeLayer, ConflictLayer, MapControls
- `frontend/src/components/FlightLayer.jsx` — Flight markers with heading-rotated arrow SVG icons
- `frontend/src/hooks/useWebSocket.js` — Auto-reconnecting WebSocket with exponential backoff
- `frontend/src/hooks/useMapData.js` — Initial fetch via `/api/all` + 30s polling fallback
- `frontend/src/api/client.js` — REST client with response envelope unwrapping
- `frontend/src/store/useStore.js` — Zustand store: flights, earthquakes, conflicts, news, stats, connected, selectedLayer
- `backend/main.py` — FastAPI app with APScheduler, WS endpoint, staggered initial data fetch
- `backend/routers/data.py` — REST: `/api/flights`, `/api/earthquakes`, `/api/conflicts`, `/api/news`, `/api/stats`, `/api/all`
- `backend/services/` — flight_service.py (OpenSky), earthquake_service.py (USGS), conflict_service.py (GDELT), news_service.py (GDELT)
- `run.sh` — Starts backend (port 8000) + frontend (port 5173) with venv setup
