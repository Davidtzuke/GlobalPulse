"""PLACEHOLDER - Conflict data service using GDELT API.

To be implemented by Data Pipeline Engineer.
API: https://api.gdeltproject.org/api/v2/events/events
- No auth required
- Returns conflict/protest events with geolocation
"""

from schemas import Conflict


async def fetch_conflicts() -> list[Conflict]:
    """Fetch conflict/protest events from GDELT."""
    # PLACEHOLDER - implement API call
    return []
