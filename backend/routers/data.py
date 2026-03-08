"""PLACEHOLDER - REST API endpoints for Global Pulse data.

To be implemented by Backend Engineer.
Endpoints:
  GET /api/flights     - Current flight positions
  GET /api/conflicts   - Active conflict events
  GET /api/earthquakes - Recent earthquakes
  GET /api/news        - Trending news articles
  GET /api/stats       - Aggregated dashboard statistics
"""

from fastapi import APIRouter

router = APIRouter(tags=["data"])


@router.get("/flights")
async def get_flights():
    """Get current flight data."""
    # PLACEHOLDER - call flight_service
    return {"data": [], "count": 0}


@router.get("/conflicts")
async def get_conflicts():
    """Get active conflict events."""
    # PLACEHOLDER - call conflict_service
    return {"data": [], "count": 0}


@router.get("/earthquakes")
async def get_earthquakes():
    """Get recent earthquake data."""
    # PLACEHOLDER - call earthquake_service
    return {"data": [], "count": 0}


@router.get("/news")
async def get_news():
    """Get trending news articles."""
    # PLACEHOLDER - call news_service
    return {"data": [], "count": 0}


@router.get("/stats")
async def get_stats():
    """Get aggregated dashboard statistics."""
    # PLACEHOLDER - call stats_service
    return {"data": {}}
