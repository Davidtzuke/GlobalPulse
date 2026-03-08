"""Conflict data service using GDELT GeoJSON API."""

import httpx
import hashlib
import logging

from schemas import Conflict
from cache import cache
from data_normalizer import safe_float, safe_int, clamp_coordinates

logger = logging.getLogger(__name__)

GDELT_GEO_URL = "https://api.gdeltproject.org/api/v2/geo/geo"
CACHE_KEY = "conflicts"
CACHE_TTL = 300


async def fetch_conflicts() -> list[Conflict]:
    """Fetch conflict events from GDELT GeoJSON API."""
    cached = cache.get(CACHE_KEY)
    if cached is not None:
        logger.debug("Returning cached conflict data")
        return cached

    try:
        params = {
            "query": "conflict",
            "format": "GeoJSON",
            "maxrows": "250",
        }
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(GDELT_GEO_URL, params=params)
            resp.raise_for_status()
            data = resp.json()

        features = data.get("features") or []
        conflicts: list[Conflict] = []

        for feat in features:
            if not isinstance(feat, dict):
                continue

            props = feat.get("properties", {})
            geom = feat.get("geometry", {})
            coords = geom.get("coordinates", [None, None])

            lng = coords[0] if len(coords) > 0 else None
            lat = coords[1] if len(coords) > 1 else None
            if lat is None or lng is None:
                continue

            valid_coords = clamp_coordinates(lat, lng)
            if valid_coords is None:
                continue

            name = props.get("name", "")
            url = props.get("url", "")
            event_id = props.get("id") or hashlib.md5(
                f"{name}{lat}{lng}".encode()
            ).hexdigest()[:12]

            conflicts.append(Conflict(
                event_id=str(event_id),
                event_date=str(props.get("date", "")),
                actor1=props.get("actor1"),
                actor2=props.get("actor2"),
                event_type=str(props.get("eventtype", "conflict")),
                latitude=valid_coords[0],
                longitude=valid_coords[1],
                country=str(props.get("country", props.get("name", "Unknown"))),
                source_url=url or None,
                goldstein_scale=safe_float(props.get("goldsteinscale"), default=None),
                num_mentions=safe_int(props.get("nummentions"), default=None),
                avg_tone=safe_float(props.get("tone"), default=None),
            ))

        cache.set(CACHE_KEY, conflicts, CACHE_TTL)
        logger.info(f"Fetched {len(conflicts)} conflicts from GDELT")
        return conflicts

    except httpx.HTTPStatusError as e:
        logger.error(f"GDELT GeoJSON API HTTP error: {e.response.status_code}")
        return []
    except httpx.RequestError as e:
        logger.error(f"GDELT GeoJSON API request error: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching conflicts: {e}")
        return []
