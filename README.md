# Global Pulse

Real-time world dashboard that visualizes live flights, conflict events, earthquakes, and trending news on an interactive 3D globe.

Data sources (all free, no API keys needed):
- **Flights** — OpenSky Network
- **Conflicts** — GDELT GeoJSON API
- **Earthquakes** — USGS GeoJSON Feed
- **News** — GDELT DOC API

## Quick Start

```bash
./run.sh
```

This starts both servers. Open **http://localhost:5173** in your browser.

### Manual Start

**Backend** (port 8000):
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend** (port 5173):
```bash
cd frontend
npm install
npm run dev
```

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 18, Vite, TailwindCSS, Zustand, globe.gl, Recharts |
| Backend | FastAPI, httpx, APScheduler, WebSocket |

## How It Works

1. Backend fetches all data sources every 30 seconds and caches results
2. Frontend loads initial data via `GET /api/all`
3. Live updates stream over WebSocket at `/ws`
4. Zustand store feeds data into the 3D globe, charts, stats bar, and live feed panel
5. Filter buttons in the header toggle each data layer on/off
