"""FastAPI application for Global Pulse - Real-time World Dashboard."""

from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import logging

from ws_manager import manager
from routers import data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown events."""
    logger.info("Global Pulse starting up...")
    # TODO: Start APScheduler for periodic data fetching
    # scheduler = AsyncIOScheduler()
    # scheduler.add_job(fetch_all_data, 'interval', seconds=30)
    # scheduler.start()
    yield
    logger.info("Global Pulse shutting down...")
    # TODO: Shutdown scheduler
    # scheduler.shutdown()


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
            # Keep connection alive, handle client messages if needed
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
    }
