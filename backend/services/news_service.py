"""PLACEHOLDER - News data service using GDELT DOC API.

To be implemented by Data Pipeline Engineer.
API: https://api.gdeltproject.org/api/v2/doc/doc
- No auth required
- Returns news articles with geolocation and tone analysis
"""

from schemas import NewsArticle


async def fetch_news() -> list[NewsArticle]:
    """Fetch trending news articles from GDELT DOC API."""
    # PLACEHOLDER - implement API call
    return []
