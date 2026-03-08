"""Flight data service using OpenSky Network API.

OpenSky state vector indices (CRITICAL - verified):
[0] icao24, [1] callsign, [2] origin_country, [3] time_position,
[4] last_contact, [5] longitude, [6] latitude, [7] baro_altitude,
[8] on_ground, [9] velocity, [10] true_track, [11] vertical_rate
"""

import logging
from datetime import datetime, timezone
from typing import List

import httpx

from schemas import Flight
from cache import flight_cache
from data_normalizer import clean_callsign, clamp_coordinates, safe_float

logger = logging.getLogger(__name__)

OPENSKY_API_URL = "https://opensky-network.org/api/states/all"


async def fetch_flights() -> List[Flight]:
    """Fetch real-time flight data from OpenSky Network."""
    cached = flight_cache.get("flights")
    if cached is not None:
        return cached

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(OPENSKY_API_URL)
            resp.raise_for_status()
            data = resp.json()

        states = data.get("states") or []
        flights: List[Flight] = []

        for s in states:
            if len(s) < 11:
                continue

            # Index 5 = longitude, 6 = latitude (verified against OpenSky docs)
            if s[5] is None or s[6] is None:
                continue

            coords = clamp_coordinates(s[6], s[5])  # lat, lng
            if coords is None:
                continue

            flights.append(Flight(
                icao24=str(s[0]).strip(),
                callsign=clean_callsign(s[1]),
                origin_country=str(s[2] or "Unknown").strip(),
                latitude=coords[0],
                longitude=coords[1],
                altitude=safe_float(s[7], default=None),
                velocity=safe_float(s[9], default=None),
                heading=safe_float(s[10], default=None),
                on_ground=bool(s[8]),
                last_update=datetime.fromtimestamp(s[4], tz=timezone.utc) if s[4] else None,
            ))

        flight_cache.set("flights", flights)
        logger.info("Fetched %d flights from OpenSky", len(flights))
        return flights

    except httpx.HTTPStatusError as exc:
        logger.error("OpenSky HTTP error: %s", exc.response.status_code)
        return flight_cache.get("flights") or []
    except httpx.RequestError as exc:
        logger.error("OpenSky request error: %s", exc)
        return flight_cache.get("flights") or []
    except Exception as e:
        logger.error("Failed to fetch flights: %s", e)
        return flight_cache.get("flights") or []
