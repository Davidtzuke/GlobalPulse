"""Conflict event service using GDELT DOC 2.0 API.

API: https://api.gdeltproject.org/api/v2/doc/doc?query=conflict OR war OR military OR attack&mode=artlist&format=json
Free, no auth. Searches global news for conflict-related events.
"""

import httpx
from typing import List

from schemas import Conflict

GDELT_CONFLICT_URL = "https://api.gdeltproject.org/api/v2/doc/doc"
CONFLICT_KEYWORDS = "conflict OR war OR military OR attack OR bombing OR airstrike"


async def fetch_conflicts() -> List[Conflict]:
    """Fetch conflict events from GDELT news analysis.

    Query params: query=<keywords>&mode=artlist&format=json&maxrecords=50
    Response: articles[] with title, url, source, seendate, socialimage, domain, language, sourcecountry

    TODO: Backend Engineer - implement full fetch with geocoding
    """
    return []
