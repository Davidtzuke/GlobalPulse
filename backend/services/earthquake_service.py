"""Earthquake data service using USGS GeoJSON feed.

GeoJSON coordinates: [longitude, latitude, depth]
"""

import logging
from datetime import datetime, timezone
from typing import List

import httpx

from schemas import Earthquake
from cache import earthquake_cache
from data_normalizer import clamp_coordinates, safe_float

logger = logging.getLogger(__name__)

USGS_API_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


async def fetch_earthquakes() -> List[Earthquake]:
    """Fetch recent earthquakes from USGS GeoJSON feed."""
    cached = earthquake_cache.get("earthquakes")
    if cached is not None:
        return cached

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.get(USGS_API_URL)
            resp.raise_for_status()
            data = resp.json()

        features = data.get("features") or []
        earthquakes: List[Earthquake] = []

        for f in features:
            props = f.get("properties", {})
            geom_coords = f.get("geometry", {}).get("coordinates", [])

            if len(geom_coords) < 2:
                continue

            # GeoJSON: [longitude, latitude, depth]
            coords = clamp_coordinates(geom_coords[1], geom_coords[0])
            if coords is None:
                continue

            depth = safe_float(geom_coords[2], default=None) if len(geom_coords) > 2 else None
            time_ms = props.get("time")

            earthquakes.append(Earthquake(
                id=str(f.get("id", "")),
                magnitude=safe_float(props.get("mag"), default=None),
                place=props.get("place"),
                latitude=coords[0],
                longitude=coords[1],
                depth=depth,
                time=datetime.fromtimestamp(time_ms / 1000, tz=timezone.utc) if time_ms else datetime.now(timezone.utc),
                url=props.get("url"),
                tsunami=bool(props.get("tsunami", 0)),
            ))

        earthquake_cache.set("earthquakes", earthquakes)
        logger.info("Fetched %d earthquakes from USGS", len(earthquakes))
        return earthquakes

    except httpx.HTTPStatusError as exc:
        logger.error("USGS HTTP error: %s", exc.response.status_code)
        return earthquake_cache.get("earthquakes") or []
    except httpx.RequestError as exc:
        logger.error("USGS request error: %s", exc)
        return earthquake_cache.get("earthquakes") or []
    except Exception as e:
        logger.error("Failed to fetch earthquakes: %s", e)
        return earthquake_cache.get("earthquakes") or []
