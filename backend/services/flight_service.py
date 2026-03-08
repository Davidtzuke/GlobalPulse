"""Flight data service using OpenSky Network API.

API: https://opensky-network.org/api/states/all
Free anonymous access, 400 credits/day, 10s resolution.
Returns: icao24, callsign, origin_country, longitude, latitude, baro_altitude, velocity, true_track, on_ground
"""

import httpx
from typing import List

from schemas import Flight

OPENSKY_API_URL = "https://opensky-network.org/api/states/all"


async def fetch_flights() -> List[Flight]:
    """Fetch real-time flight data from OpenSky Network.

    Response format: states[] array where each state is:
    [0] icao24, [1] callsign, [2] origin_country, [3] time_position,
    [4] last_contact, [5] longitude, [6] latitude, [7] baro_altitude,
    [8] on_ground, [9] velocity, [10] true_track, [11] vertical_rate,
    ...

    TODO: Backend Engineer - implement full fetch logic with error handling
    """
    return []
