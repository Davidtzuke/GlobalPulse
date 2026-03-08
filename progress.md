# Global Pulse v2 - DAG Progress

**Run ID**: 098f0947-e5db-4c8e-8e34-4f090fba042e
**Started**: 2026-03-08 21:59 UTC

---

## Project Architect ✅ COMPLETE

**Status**: Done
**Files Created**: 35 files (14 backend + 21 frontend)

### API Research Summary (Brave Search)
| Data Source | API | Auth | URL |
|---|---|---|---|
| Flights | OpenSky Network | Free anonymous (400 credits/day) | `https://opensky-network.org/api/states/all` |
| Earthquakes | USGS GeoJSON Feed | Free, no auth | `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson` |
| News | GDELT DOC 2.0 | Free, no auth | `https://api.gdeltproject.org/api/v2/doc/doc?query=...&mode=artlist&format=json` |
| Conflicts | GDELT DOC 2.0 | Free, no auth | Same as news, filtered with conflict keywords |

### v2 Key Changes from v1
- **Map**: Replaced 3D globe.gl with 2D react-leaflet (Leaflet) map
- **APIs**: All free, no auth keys needed
- **Flights**: Show heading arrows using true_track from OpenSky
- **Conflicts**: Real conflict events from GDELT news analysis with descriptions
- **News**: Readable articles with title, description, source from GDELT
- **Real-time**: All data via WebSocket + polling fallback

### Architecture
```
backend/
├── main.py              # FastAPI app, CORS, WebSocket, health check
├── schemas.py           # 6 Pydantic models
├── ws_manager.py        # WebSocket connection manager
├── cache.py             # TTL cache (Data Pipeline Engineer)
├── stats_service.py     # Stats aggregation (Data Pipeline Engineer)
├── services/
│   ├── flight_service.py    # OpenSky API (Backend Engineer)
│   ├── conflict_service.py  # GDELT conflicts (Backend Engineer)
│   ├── earthquake_service.py # USGS API (Backend Engineer)
│   └── news_service.py      # GDELT news (Backend Engineer)
└── routers/
    └── data.py              # REST endpoints (Backend Engineer)

frontend/
├── src/
│   ├── App.jsx          # Shell: header + tabbed sidebar + map
│   ├── store/useStore.js # Zustand state
│   ├── api/client.js    # REST client (Data Pipeline Engineer)
│   ├── hooks/
│   │   ├── useWebSocket.js  # WS connection (Data Pipeline Engineer)
│   │   └── useMapData.js    # Map data hook (Data Pipeline Engineer)
│   └── components/
│       ├── WorldMap.jsx       # Leaflet map (Globe Engineer)
│       ├── FlightLayer.jsx    # Plane icons (Globe Engineer)
│       ├── EarthquakeLayer.jsx # Quake circles (Globe Engineer)
│       ├── ConflictLayer.jsx  # Conflict markers (Globe Engineer)
│       ├── StatsBar.jsx       # Stats panel (Dashboard Engineer)
│       ├── NewsPanel.jsx      # News articles (Dashboard Engineer)
│       ├── ConflictPanel.jsx  # Conflict list (Dashboard Engineer)
│       ├── EarthquakePanel.jsx # Quake list (Dashboard Engineer)
│       └── LiveFeed.jsx       # Live ticker (Dashboard Engineer)
```

### Notes for Downstream Agents
- **Backend Engineer**: Implement all 4 service files + wire up routers/data.py. See docstrings for API response formats.
- **Globe Engineer**: Implement WorldMap.jsx with react-leaflet + 3 layer components. Flight heading arrows are critical.
- **Dashboard Engineer**: Implement StatsBar, NewsPanel, ConflictPanel, EarthquakePanel, LiveFeed with Recharts.
- **Data Pipeline Engineer**: Implement cache.py, stats_service.py, useWebSocket.js, useMapData.js, client.js. Wire up APScheduler in main.py lifespan.

---

## Backend Engineer
**Status**: Pending
**Scope**: Implement services/, routers/data.py

---

## Globe Engineer (Map Engineer)
**Status**: Pending
**Scope**: Implement WorldMap.jsx, FlightLayer, EarthquakeLayer, ConflictLayer

---

## Dashboard Engineer
**Status**: Pending
**Scope**: Implement StatsBar, NewsPanel, ConflictPanel, EarthquakePanel, LiveFeed

---

## Data Pipeline Engineer
**Status**: Pending
**Scope**: Implement cache, stats, WebSocket, polling, APScheduler

---

## Integration Engineer
**Status**: Pending (depends on all above)
**Scope**: Wire everything together, test end-to-end
