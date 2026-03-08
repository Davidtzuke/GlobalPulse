"""Global Pulse v2 - FastAPI Backend

Real-time global data dashboard aggregating multiple free API sources:

  1. Flights    - OpenSky Network (https://opensky-network.org/api/states/all)
                  Free anonymous access, 400 credits/day, 10s resolution.

  2. Earthquakes - USGS GeoJSON (https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson)
                   Free, no auth. Updated every 5 minutes.

  3. Conflicts  - GDELT DOC 2.0 (https://api.gdeltproject.org/api/v2/doc/doc)
                  Filtered for war/conflict/military keywords. Free, no auth.

  4. News       - GDELT DOC 2.0 (https://api.gdeltproject.org/api/v2/doc/doc)
                  General world news query. Free, no auth.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from routers.data import router as data_router
from ws_manager import manager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown hooks.

    # TODO: Data Pipeline Engineer - add APScheduler jobs here:
    #   - fetch_flights every 60s
    #   - fetch_earthquakes every 300s
    #   - fetch_conflicts every 600s
    #   - fetch_news every 300s
    #   - broadcast updates via ws_manager after each fetch
    """
    logger.info("Global Pulse v2 backend starting up...")
    # TODO: Data Pipeline Engineer - start APScheduler here
    yield
    logger.info("Global Pulse v2 backend shutting down...")
    # TODO: Data Pipeline Engineer - shutdown APScheduler here


app = FastAPI(
    title="Global Pulse v2",
    description="Real-time global data dashboard - flights, earthquakes, conflicts, and news",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS middleware - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include REST API routes
app.include_router(data_router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "version": "2.0.0"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time data updates.

    Clients connect here to receive live updates for flights,
    earthquakes, conflicts, news, and dashboard stats.
    """
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive; listen for any client messages
            data = await websocket.receive_text()
            logger.debug("Received from client: %s", data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("Client disconnected from WebSocket.")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
