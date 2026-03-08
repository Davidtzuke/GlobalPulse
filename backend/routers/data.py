"""REST API endpoints for dashboard data."""

from fastapi import APIRouter

from services.flight_service import fetch_flights
from services.earthquake_service import fetch_earthquakes
from services.conflict_service import fetch_conflicts
from services.news_service import fetch_news
from stats_service import compute_stats

router = APIRouter(prefix="/api")


@router.get("/flights")
async def get_flights():
    flights = await fetch_flights()
    return {"flights": [f.model_dump(mode="json") for f in flights], "count": len(flights)}


@router.get("/earthquakes")
async def get_earthquakes():
    earthquakes = await fetch_earthquakes()
    return {"earthquakes": [e.model_dump(mode="json") for e in earthquakes], "count": len(earthquakes)}


@router.get("/conflicts")
async def get_conflicts():
    conflicts = await fetch_conflicts()
    return {"conflicts": [c.model_dump(mode="json") for c in conflicts], "count": len(conflicts)}


@router.get("/news")
async def get_news():
    news = await fetch_news()
    return {"news": [n.model_dump(mode="json") for n in news], "count": len(news)}


@router.get("/stats")
async def get_stats():
    flights = await fetch_flights()
    earthquakes = await fetch_earthquakes()
    conflicts = await fetch_conflicts()
    news = await fetch_news()
    stats = compute_stats(flights, earthquakes, conflicts, news)
    return stats.model_dump()


@router.get("/all")
async def get_all():
    """Bulk endpoint returning all data streams in a single request."""
    flights = await fetch_flights()
    earthquakes = await fetch_earthquakes()
    conflicts = await fetch_conflicts()
    news = await fetch_news()
    stats = compute_stats(flights, earthquakes, conflicts, news)
    return {
        "flights": [f.model_dump(mode="json") for f in flights],
        "earthquakes": [e.model_dump(mode="json") for e in earthquakes],
        "conflicts": [c.model_dump(mode="json") for c in conflicts],
        "news": [n.model_dump(mode="json") for n in news],
        "stats": stats.model_dump(),
    }
