"""REST API endpoints for dashboard data.

Routes:
- GET /api/flights - real-time flight positions
- GET /api/earthquakes - recent earthquakes
- GET /api/conflicts - conflict events from news
- GET /api/news - latest global news articles
- GET /api/stats - aggregated dashboard statistics
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api")


@router.get("/flights")
async def get_flights():
    """TODO: Backend Engineer - wire up flight_service"""
    return {"flights": [], "count": 0}


@router.get("/earthquakes")
async def get_earthquakes():
    """TODO: Backend Engineer - wire up earthquake_service"""
    return {"earthquakes": [], "count": 0}


@router.get("/conflicts")
async def get_conflicts():
    """TODO: Backend Engineer - wire up conflict_service"""
    return {"conflicts": [], "count": 0}


@router.get("/news")
async def get_news():
    """TODO: Backend Engineer - wire up news_service"""
    return {"news": [], "count": 0}


@router.get("/stats")
async def get_stats():
    """TODO: Backend Engineer - wire up stats_service"""
    return {
        "total_flights": 0,
        "total_earthquakes": 0,
        "total_conflicts": 0,
        "latest_news_count": 0,
    }
