"""REST API endpoints for Global Pulse data."""

import logging
from fastapi import APIRouter

from services.flight_service import fetch_flights
from services.conflict_service import fetch_conflicts
from services.earthquake_service import fetch_earthquakes
from services.news_service import fetch_news
from stats_service import compute_stats
from api_health import health_monitor, MONITORED_APIS

logger = logging.getLogger(__name__)

router = APIRouter(tags=["data"])


@router.get("/flights")
async def get_flights():
    """Get current flight data."""
    flights = await fetch_flights()
    return {"data": [f.model_dump() for f in flights], "count": len(flights)}


@router.get("/conflicts")
async def get_conflicts():
    """Get active conflict events."""
    conflicts = await fetch_conflicts()
    return {"data": [c.model_dump() for c in conflicts], "count": len(conflicts)}


@router.get("/earthquakes")
async def get_earthquakes():
    """Get recent earthquake data."""
    earthquakes = await fetch_earthquakes()
    return {"data": [e.model_dump() for e in earthquakes], "count": len(earthquakes)}


@router.get("/news")
async def get_news():
    """Get trending news articles."""
    news = await fetch_news()
    return {"data": [n.model_dump() for n in news], "count": len(news)}


@router.get("/stats")
async def get_stats():
    """Get aggregated dashboard statistics."""
    flights = await fetch_flights()
    conflicts = await fetch_conflicts()
    earthquakes = await fetch_earthquakes()
    news = await fetch_news()
    stats = compute_stats(flights, conflicts, earthquakes, news)
    return {"data": stats.model_dump()}


@router.get("/health")
async def api_health():
    """Get health status of all external APIs."""
    for name, url in MONITORED_APIS.items():
        await health_monitor.check(name, url, timeout=10.0)
    return {
        "apis": health_monitor.get_status(),
        "all_healthy": all(health_monitor.is_healthy(n) for n in MONITORED_APIS),
    }
