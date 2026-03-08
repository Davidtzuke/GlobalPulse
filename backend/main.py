"""Global Pulse v2 - FastAPI Backend

Real-time global data dashboard with APScheduler polling and WebSocket broadcast.
APIs: OpenSky (flights), USGS (earthquakes), GDELT (conflicts + news).
"""

import asyncio
import logging
from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from api_health import router as health_router, run_health_checks
from routers.data import router as data_router
from services.flight_service import fetch_flights
from services.earthquake_service import fetch_earthquakes
from services.conflict_service import fetch_conflicts
from services.news_service import fetch_news
from stats_service import compute_stats
from ws_manager import manager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def _broadcast_flights():
    """Fetch flights and broadcast to WebSocket clients."""
    try:
        flights = await fetch_flights()
        data = [f.model_dump(mode="json") for f in flights]
        await manager.broadcast_update("flight", data)
        logger.info("Broadcast %d flights", len(flights))
    except Exception as e:
        logger.error("Flight broadcast error: %s", e)


async def _broadcast_earthquakes():
    """Fetch earthquakes and broadcast to WebSocket clients."""
    try:
        earthquakes = await fetch_earthquakes()
        data = [eq.model_dump(mode="json") for eq in earthquakes]
        await manager.broadcast_update("earthquake", data)
        logger.info("Broadcast %d earthquakes", len(earthquakes))
    except Exception as e:
        logger.error("Earthquake broadcast error: %s", e)


async def _broadcast_conflicts():
    """Fetch conflicts and broadcast to WebSocket clients."""
    try:
        conflicts = await fetch_conflicts()
        data = [c.model_dump(mode="json") for c in conflicts]
        await manager.broadcast_update("conflict", data)
        logger.info("Broadcast %d conflicts", len(conflicts))
    except Exception as e:
        logger.error("Conflict broadcast error: %s", e)


async def _broadcast_news():
    """Fetch news and broadcast to WebSocket clients."""
    try:
        news = await fetch_news()
        data = [n.model_dump(mode="json") for n in news]
        await manager.broadcast_update("news", data)
        logger.info("Broadcast %d news articles", len(news))
    except Exception as e:
        logger.error("News broadcast error: %s", e)


async def _broadcast_stats():
    """Compute and broadcast dashboard stats."""
    try:
        flights = await fetch_flights()
        earthquakes = await fetch_earthquakes()
        conflicts = await fetch_conflicts()
        news = await fetch_news()
        stats = compute_stats(flights, earthquakes, conflicts, news)
        await manager.broadcast_update("stats", stats.model_dump(mode="json"))
    except Exception as e:
        logger.error("Stats broadcast error: %s", e)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: start/stop APScheduler for periodic data fetching."""
    logger.info("Global Pulse v2 backend starting up...")

    # Schedule periodic data fetches
    scheduler.add_job(_broadcast_flights, "interval", seconds=60, id="flights",
                      next_run_time=None)  # Don't run immediately, wait for initial fetch
    scheduler.add_job(_broadcast_earthquakes, "interval", seconds=300, id="earthquakes",
                      next_run_time=None)
    scheduler.add_job(_broadcast_conflicts, "interval", seconds=600, id="conflicts",
                      next_run_time=None)
    scheduler.add_job(_broadcast_news, "interval", seconds=300, id="news",
                      next_run_time=None)
    scheduler.add_job(_broadcast_stats, "interval", seconds=120, id="stats",
                      next_run_time=None)
    scheduler.add_job(run_health_checks, "interval", seconds=300, id="health_checks",
                      next_run_time=None)

    scheduler.start()

    # Initial data fetch after startup (staggered to avoid hammering APIs)
    async def initial_fetch():
        await asyncio.sleep(2)
        await _broadcast_flights()
        await asyncio.sleep(1)
        await _broadcast_earthquakes()
        await asyncio.sleep(1)
        await _broadcast_conflicts()
        await asyncio.sleep(1)
        await _broadcast_news()
        await asyncio.sleep(1)
        await _broadcast_stats()

    asyncio.create_task(initial_fetch())

    yield

    scheduler.shutdown(wait=False)
    logger.info("Global Pulse v2 backend shut down.")


app = FastAPI(
    title="Global Pulse v2",
    description="Real-time global data dashboard - flights, earthquakes, conflicts, and news",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(data_router)
app.include_router(health_router)


@app.get("/health")
async def health_check():
    """Basic health check endpoint."""
    return {"status": "ok", "version": "2.0.0"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time data updates."""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            logger.debug("Received from client: %s", data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("Client disconnected from WebSocket.")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
