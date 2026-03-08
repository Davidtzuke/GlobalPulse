"""News data service using GDELT DOC API."""

import httpx
import logging

from schemas import NewsArticle
from cache import cache
from data_normalizer import safe_float, clamp_coordinates

logger = logging.getLogger(__name__)

GDELT_DOC_URL = "https://api.gdeltproject.org/api/v2/doc/doc"
CACHE_KEY = "news"
CACHE_TTL = 120


async def fetch_news() -> list[NewsArticle]:
    """Fetch trending news articles from GDELT DOC API."""
    cached = cache.get(CACHE_KEY)
    if cached is not None:
        logger.debug("Returning cached news data")
        return cached

    try:
        params = {
            "query": "world",
            "mode": "ArtList",
            "format": "json",
            "maxrecords": "100",
            "sort": "DateDesc",
        }
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(GDELT_DOC_URL, params=params)
            resp.raise_for_status()
            data = resp.json()

        articles_raw = data.get("articles") or []
        articles: list[NewsArticle] = []

        for art in articles_raw:
            if not isinstance(art, dict):
                continue

            url = art.get("url", "")
            title = art.get("title", "")
            if not url or not title:
                continue

            # Extract tone value (first element if comma-delimited)
            tone_raw = art.get("tone")
            tone = None
            if tone_raw is not None:
                try:
                    tone = float(str(tone_raw).split(",")[0])
                except (ValueError, IndexError):
                    tone = safe_float(tone_raw, default=None)

            # Parse geo coordinates if available
            parsed_lat = None
            parsed_lon = None
            lat = art.get("sourcelat") or art.get("latitude")
            lon = art.get("sourcelong") or art.get("longitude")
            if lat is not None and lon is not None:
                coords = clamp_coordinates(lat, lon)
                if coords:
                    parsed_lat, parsed_lon = coords

            articles.append(NewsArticle(
                url=url,
                title=title.strip(),
                source=str(art.get("source", art.get("domain", "Unknown"))),
                language=art.get("language"),
                source_country=art.get("sourcecountry"),
                image_url=art.get("socialimage"),
                published_at=art.get("seendate"),
                domain=art.get("domain"),
                tone=tone,
                latitude=parsed_lat,
                longitude=parsed_lon,
            ))

        cache.set(CACHE_KEY, articles, CACHE_TTL)
        logger.info(f"Fetched {len(articles)} news articles from GDELT")
        return articles

    except httpx.HTTPStatusError as e:
        logger.error(f"GDELT DOC API HTTP error: {e.response.status_code}")
        return []
    except httpx.RequestError as e:
        logger.error(f"GDELT DOC API request error: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching news: {e}")
        return []
