"""FastAPI application for Global Pulse - Real-time World Dashboard."""

import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import logging

from ws_manager import manager
from routers import data
from services.flight_service import fetch_flights
from services.conflict_service import fetch_conflicts
from services.earthquake_service import fetch_earthquakes
from services.news_service import fetch_news
from stats_service import compute_stats

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def fetch_and_broadcast():
    """Fetch all data sources and broadcast updates via WebSocket."""
    try:
        results = await asyncio.gather(
            fetch_flights(),
            fetch_conflicts(),
            fetch_earthquakes(),
            fetch_news(),
            return_exceptions=True,
        )

        flights = results[0] if not isinstance(results[0], Exception) else []
        conflicts = results[1] if not isinstance(results[1], Exception) else []
        earthquakes = results[2] if not isinstance(results[2], Exception) else []
        news_articles = results[3] if not isinstance(results[3], Exception) else []

        for i, name in enumerate(["flights", "conflicts", "earthquakes", "news"]):
            if isinstance(results[i], Exception):
                logger.error(f"{name} fetch error: {results[i]}")

        stats = compute_stats(flights, conflicts, earthquakes, news_articles)
        now = datetime.now(timezone.utc).isoformat()

        if manager.active_connections:
            await manager.broadcast({
                "event_type": "update",
                "data": {
                    "flights": {"count": len(flights)},
                    "conflicts": {"count": len(conflicts)},
                    "earthquakes": {"count": len(earthquakes)},
                    "news": {"count": len(news_articles)},
                    "stats": stats.model_dump(),
                },
                "timestamp": now,
            })

        logger.info(
            f"Data refresh: {len(flights)} flights, {len(conflicts)} conflicts, "
            f"{len(earthquakes)} earthquakes, {len(news_articles)} news"
        )
    except Exception as e:
        logger.error(f"Error in fetch_and_broadcast: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown events."""
    logger.info("Global Pulse starting up...")

    # Initial data fetch
    asyncio.create_task(fetch_and_broadcast())

    # Schedule periodic fetching every 30 seconds
    scheduler.add_job(fetch_and_broadcast, "interval", seconds=30, id="data_refresh")
    scheduler.start()
    logger.info("Scheduler started - fetching data every 30s")

    yield

    logger.info("Global Pulse shutting down...")
    scheduler.shutdown(wait=False)


app = FastAPI(
    title="Global Pulse API",
    description="Real-time world dashboard API providing flights, conflicts, earthquakes, and news data",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include REST API router
app.include_router(data.router, prefix="/api")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for live data updates."""
    await manager.connect(websocket)
    try:
        while True:
            message = await websocket.receive_text()
            logger.info(f"Received from client: {message}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "global-pulse",
        "connections": len(manager.active_connections),
        "scheduler_running": scheduler.running,
    }
