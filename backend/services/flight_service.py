"""PLACEHOLDER - Flight data service using OpenSky Network API.

To be implemented by Data Pipeline Engineer.
API: https://opensky-network.org/api/states/all
- No auth required
- Returns all current flight states
- Rate limit: ~10 requests/minute for anonymous
"""

from schemas import Flight


async def fetch_flights() -> list[Flight]:
    """Fetch current flight data from OpenSky Network."""
    # PLACEHOLDER - implement API call
    return []
