## About This Project
Global Pulse is a real-time world dashboard that visualizes live flights (OpenSky Network), conflict events (GDELT), earthquakes (USGS), and trending news (GDELT DOC) on an interactive 3D globe with charts and a live feed.

## Tech Stack
- **Frontend**: React 18 + Vite + TailwindCSS + Zustand (state) + globe.gl (3D globe) + Recharts (charts) + Lucide (icons)
- **Backend**: FastAPI + httpx (async HTTP) + APScheduler (30s data refresh) + WebSocket broadcasting
- **Data flow**: REST `/api/*` endpoints for initial load → WebSocket `/ws` for live updates → Zustand store → React components

## What This Branch Does
Full implementation of the Global Pulse dashboard. The Integration Engineer fixed cross-agent mismatches: API client URLs, response unwrapping, WebSocket URL/message format alignment, and added a bulk `/all` endpoint.

## Key Files
- `frontend/src/App.jsx` — Main layout: header, sidebar (StatsBar + DashboardPanel), globe area, LiveFeed overlay
- `frontend/src/api/client.js` — REST API client with response unwrapping
- `frontend/src/hooks/useWebSocket.js` — WebSocket connection with auto-reconnect
- `frontend/src/store/useStore.js` — Zustand store for all app state
- `frontend/src/components/Globe3D.jsx` — Interactive 3D globe using globe.gl
- `frontend/src/hooks/useGlobeData.js` — Transforms store data into globe points/rings via layer formatters
- `backend/main.py` — FastAPI app with scheduler, WebSocket endpoint, CORS
- `backend/routers/data.py` — REST endpoints: `/flights`, `/conflicts`, `/earthquakes`, `/news`, `/stats`, `/all`
- `backend/services/` — Data fetchers for OpenSky, GDELT, USGS with caching
- `run.sh` — Start script for both backend (:8000) and frontend (:5173)