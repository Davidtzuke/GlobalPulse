"""Earthquake data service using USGS GeoJSON feed.

API: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
Free, no auth required. Updated every 5 minutes.
"""

import httpx
from typing import List

from schemas import Earthquake

USGS_API_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


async def fetch_earthquakes() -> List[Earthquake]:
    """Fetch recent earthquakes from USGS.

    GeoJSON features[] where each feature has:
    - properties: mag, place, time, url, tsunami, type
    - geometry.coordinates: [longitude, latitude, depth]

    TODO: Backend Engineer - implement full fetch logic
    """
    return []
