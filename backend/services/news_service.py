"""Global news service using GDELT DOC 2.0 API.

API: https://api.gdeltproject.org/api/v2/doc/doc?query=world news&mode=artlist&format=json
Free, no auth. Real-time global news monitoring.
"""

import httpx
from typing import List

from schemas import NewsArticle

GDELT_NEWS_URL = "https://api.gdeltproject.org/api/v2/doc/doc"


async def fetch_news() -> List[NewsArticle]:
    """Fetch latest global news from GDELT.

    Query params: query=world news&mode=artlist&format=json&maxrecords=100
    Response: articles[] with title, url, source, seendate, socialimage, domain, language

    TODO: Backend Engineer - implement full fetch logic
    """
    return []
