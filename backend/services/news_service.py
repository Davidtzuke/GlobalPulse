"""Global news service using GDELT DOC 2.0 API."""

import logging
from datetime import datetime, timezone
from typing import List

import httpx

from schemas import NewsArticle
from cache import news_cache
from data_normalizer import clean_text

logger = logging.getLogger(__name__)

GDELT_DOC_URL = "https://api.gdeltproject.org/api/v2/doc/doc"


async def fetch_news() -> List[NewsArticle]:
    """Fetch latest global news from GDELT DOC 2.0 API."""
    cached = news_cache.get("news")
    if cached is not None:
        return cached

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.get(GDELT_DOC_URL, params={
                "query": "world news OR breaking news OR global",
                "mode": "artlist",
                "format": "json",
                "maxrecords": "100",
                "sort": "datedesc",
            })
            resp.raise_for_status()
            text = resp.text.strip()
            if not text or text.startswith("<"):
                logger.warning("GDELT news returned non-JSON response")
                return news_cache.get("news") or []
            data = resp.json()

        articles = data.get("articles") or []
        news: List[NewsArticle] = []

        for art in articles:
            title = clean_text(art.get("title"))
            url = art.get("url", "")
            if not title or not url:
                continue

            published_at = None
            seendate = art.get("seendate", "")
            if seendate:
                try:
                    published_at = datetime.strptime(seendate, "%Y%m%dT%H%M%SZ").replace(tzinfo=timezone.utc)
                except ValueError:
                    if len(seendate) >= 8:
                        try:
                            published_at = datetime.strptime(seendate[:8], "%Y%m%d").replace(tzinfo=timezone.utc)
                        except ValueError:
                            pass

            news.append(NewsArticle(
                title=title,
                description=clean_text(art.get("title")),
                url=url,
                source=art.get("source") or art.get("domain"),
                image_url=art.get("socialimage"),
                published_at=published_at,
                language=art.get("language"),
                domain=art.get("domain"),
            ))

        news_cache.set("news", news)
        logger.info("Fetched %d news articles from GDELT", len(news))
        return news

    except httpx.HTTPStatusError as exc:
        logger.error("GDELT news HTTP error: %s", exc.response.status_code)
        return news_cache.get("news") or []
    except httpx.RequestError as exc:
        logger.error("GDELT news request error: %s", exc)
        return news_cache.get("news") or []
    except Exception as e:
        logger.error("Failed to fetch news: %s", e)
        return news_cache.get("news") or []
