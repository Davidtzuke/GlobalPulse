"""Flight data service using OpenSky Network API.

OpenSky state vector indices (CRITICAL - verified from docs):
  0: icao24        - ICAO24 transponder address (hex string)
  1: callsign      - Callsign (string, may have trailing spaces)
  2: origin_country - Country of origin
  3: time_position - Unix timestamp of last position update
  4: last_contact  - Unix timestamp of last contact
  5: longitude     - WGS-84 longitude in degrees
  6: latitude      - WGS-84 latitude in degrees
  7: baro_altitude - Barometric altitude in meters
  8: on_ground     - Boolean
  9: velocity      - Ground speed in m/s
  10: true_track   - Heading in degrees clockwise from north
  11: vertical_rate - Vertical rate in m/s
  12: sensors      - IDs of receivers
  13: geo_altitude  - Geometric altitude in meters
  14: squawk       - Squawk code
  15: spi          - Special purpose indicator
  16: position_source - 0=ADS-B, 1=ASTERIX, 2=MLAT, 3=FLARM
"""

import httpx
import logging

from schemas import Flight
from cache import cache
from data_normalizer import clean_callsign, safe_float, clamp_coordinates

logger = logging.getLogger(__name__)

OPENSKY_URL = "https://opensky-network.org/api/states/all"
CACHE_KEY = "flights"
CACHE_TTL = 15


async def fetch_flights() -> list[Flight]:
    """Fetch current flight data from OpenSky Network."""
    cached = cache.get(CACHE_KEY)
    if cached is not None:
        logger.debug("Returning cached flight data")
        return cached

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(OPENSKY_URL)
            resp.raise_for_status()
            data = resp.json()

        states = data.get("states") or []
        flights: list[Flight] = []

        for s in states:
            if not isinstance(s, list) or len(s) < 17:
                continue

            # CRITICAL: Index 5 = longitude, Index 6 = latitude
            lon = s[5]
            lat = s[6]
            if lat is None or lon is None:
                continue

            coords = clamp_coordinates(lat, lon)
            if coords is None:
                continue

            flights.append(Flight(
                icao24=str(s[0] or "").strip(),
                callsign=clean_callsign(s[1]),
                origin_country=str(s[2] or "Unknown"),
                longitude=coords[1],
                latitude=coords[0],
                altitude=safe_float(s[7]),         # baro_altitude
                velocity=safe_float(s[9]),          # ground speed
                heading=safe_float(s[10]),           # true_track
                on_ground=bool(s[8]),
                last_contact=s[4] if isinstance(s[4], int) else None,
            ))

        cache.set(CACHE_KEY, flights, CACHE_TTL)
        logger.info(f"Fetched {len(flights)} flights from OpenSky")
        return flights

    except httpx.HTTPStatusError as e:
        logger.error(f"OpenSky API HTTP error: {e.response.status_code}")
        return []
    except httpx.RequestError as e:
        logger.error(f"OpenSky API request error: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching flights: {e}")
        return []
