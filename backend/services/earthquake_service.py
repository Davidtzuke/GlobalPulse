"""Earthquake data service using USGS GeoJSON API."""

import httpx
import logging

from schemas import Earthquake
from cache import cache
from data_normalizer import safe_float, safe_int, clamp_coordinates

logger = logging.getLogger(__name__)

USGS_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
CACHE_KEY = "earthquakes"
CACHE_TTL = 60


async def fetch_earthquakes() -> list[Earthquake]:
    """Fetch recent earthquake data from USGS."""
    cached = cache.get(CACHE_KEY)
    if cached is not None:
        logger.debug("Returning cached earthquake data")
        return cached

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(USGS_URL)
            resp.raise_for_status()
            data = resp.json()

        features = data.get("features") or []
        earthquakes: list[Earthquake] = []

        for feat in features:
            if not isinstance(feat, dict):
                continue

            props = feat.get("properties", {})
            geom = feat.get("geometry", {})
            coords = geom.get("coordinates", [0, 0, 0])

            # GeoJSON: [longitude, latitude, depth]
            if not coords or len(coords) < 3:
                continue

            lng = coords[0]
            lat = coords[1]
            depth = safe_float(coords[2], default=0.0)

            if lat is None or lng is None:
                continue

            valid_coords = clamp_coordinates(lat, lng)
            if valid_coords is None:
                continue

            earthquakes.append(Earthquake(
                event_id=str(feat.get("id", "")),
                magnitude=safe_float(props.get("mag"), default=0.0),
                place=str(props.get("place", "Unknown")),
                time=safe_int(props.get("time"), default=0),
                latitude=valid_coords[0],
                longitude=valid_coords[1],
                depth=depth,
                tsunami=safe_int(props.get("tsunami"), default=0),
                alert=props.get("alert"),
                felt=safe_int(props.get("felt"), default=None),
                significance=safe_int(props.get("sig"), default=None),
                event_type=str(props.get("type", "earthquake")),
                url=props.get("url"),
            ))

        cache.set(CACHE_KEY, earthquakes, CACHE_TTL)
        logger.info(f"Fetched {len(earthquakes)} earthquakes from USGS")
        return earthquakes

    except httpx.HTTPStatusError as e:
        logger.error(f"USGS API HTTP error: {e.response.status_code}")
        return []
    except httpx.RequestError as e:
        logger.error(f"USGS API request error: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching earthquakes: {e}")
        return []
