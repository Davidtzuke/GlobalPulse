"""PLACEHOLDER - Earthquake data service using USGS API.

To be implemented by Data Pipeline Engineer.
API: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson
- No auth required
- Returns earthquake events with magnitude, location, depth
"""

from schemas import Earthquake


async def fetch_earthquakes() -> list[Earthquake]:
    """Fetch recent earthquake data from USGS."""
    # PLACEHOLDER - implement API call
    return []
