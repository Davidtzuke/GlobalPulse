"""Conflict event service using GDELT DOC 2.0 API.

Adds approximate geocoding from sourcecountry to display conflicts on map.
"""

import hashlib
import logging
from datetime import datetime, timezone
from typing import List

import httpx

from schemas import Conflict
from cache import conflict_cache
from data_normalizer import clean_text

logger = logging.getLogger(__name__)

GDELT_DOC_URL = "https://api.gdeltproject.org/api/v2/doc/doc"
CONFLICT_QUERY = "conflict OR war OR military OR attack OR bombing OR airstrike"

# Approximate country centroids for geocoding GDELT sourcecountry
COUNTRY_COORDS = {
    "United States": (38.0, -97.0), "United Kingdom": (54.0, -2.0),
    "Ukraine": (49.0, 32.0), "Russia": (60.0, 100.0), "China": (35.0, 105.0),
    "India": (20.0, 77.0), "Israel": (31.5, 34.8), "Palestine": (31.9, 35.2),
    "Syria": (35.0, 38.0), "Iraq": (33.0, 44.0), "Iran": (32.0, 53.0),
    "Afghanistan": (33.0, 65.0), "Yemen": (15.5, 48.0), "Somalia": (5.0, 46.0),
    "Sudan": (15.0, 30.0), "Myanmar": (19.8, 96.0), "Lebanon": (33.9, 35.5),
    "Libya": (27.0, 17.0), "Nigeria": (10.0, 8.0), "Ethiopia": (9.0, 38.7),
    "Pakistan": (30.0, 70.0), "Mexico": (23.0, -102.0), "Colombia": (4.0, -72.0),
    "Brazil": (-14.0, -51.0), "France": (46.0, 2.0), "Germany": (51.0, 10.0),
    "Turkey": (39.0, 35.0), "Egypt": (27.0, 30.0), "Saudi Arabia": (24.0, 45.0),
    "Japan": (36.0, 138.0), "South Korea": (36.0, 128.0),
    "North Korea": (40.0, 127.0), "Taiwan": (23.7, 121.0),
    "Australia": (-25.0, 134.0), "Canada": (56.0, -106.0),
    "South Africa": (-29.0, 24.0), "Kenya": (0.0, 38.0),
    "Democratic Republic of the Congo": (-4.0, 22.0), "Mali": (17.6, -4.0),
    "Mozambique": (-18.7, 35.5), "Burkina Faso": (12.4, -1.6),
    "Niger": (17.6, 8.1), "Chad": (15.5, 18.7), "Philippines": (13.0, 122.0),
    "Indonesia": (-2.5, 118.0), "Thailand": (15.9, 100.9),
}


def _country_to_coords(country_name: str | None) -> tuple[float, float] | None:
    """Map a country name to approximate coordinates."""
    if not country_name:
        return None
    if country_name in COUNTRY_COORDS:
        return COUNTRY_COORDS[country_name]
    lower = country_name.lower()
    for name, coords in COUNTRY_COORDS.items():
        if lower in name.lower() or name.lower() in lower:
            return coords
    return None


async def fetch_conflicts() -> List[Conflict]:
    """Fetch conflict events from GDELT with approximate geocoding."""
    cached = conflict_cache.get("conflicts")
    if cached is not None:
        return cached

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.get(GDELT_DOC_URL, params={
                "query": CONFLICT_QUERY,
                "mode": "artlist",
                "format": "json",
                "maxrecords": "75",
                "sort": "datedesc",
            })
            resp.raise_for_status()
            text = resp.text.strip()
            if not text or text.startswith("<"):
                logger.warning("GDELT conflicts returned non-JSON response")
                return conflict_cache.get("conflicts") or []
            data = resp.json()

        articles = data.get("articles") or []
        conflicts: List[Conflict] = []

        for art in articles:
            title = clean_text(art.get("title"))
            url = art.get("url", "")
            if not title:
                continue

            art_id = hashlib.md5(url.encode()).hexdigest()[:12]

            event_date = None
            seendate = art.get("seendate", "")
            if seendate:
                try:
                    event_date = datetime.strptime(seendate, "%Y%m%dT%H%M%SZ").replace(tzinfo=timezone.utc)
                except ValueError:
                    if len(seendate) >= 8:
                        try:
                            event_date = datetime.strptime(seendate[:8], "%Y%m%d").replace(tzinfo=timezone.utc)
                        except ValueError:
                            pass

            country = art.get("sourcecountry")
            coords = _country_to_coords(country)

            conflicts.append(Conflict(
                id=art_id,
                title=title,
                description=clean_text(art.get("title")),
                source_url=url,
                latitude=coords[0] if coords else None,
                longitude=coords[1] if coords else None,
                country=country,
                event_date=event_date,
                source_name=art.get("source") or art.get("domain"),
            ))

        conflict_cache.set("conflicts", conflicts)
        logger.info("Fetched %d conflicts from GDELT", len(conflicts))
        return conflicts

    except httpx.HTTPStatusError as exc:
        logger.error("GDELT conflict HTTP error: %s", exc.response.status_code)
        return conflict_cache.get("conflicts") or []
    except httpx.RequestError as exc:
        logger.error("GDELT conflict request error: %s", exc)
        return conflict_cache.get("conflicts") or []
    except Exception as e:
        logger.error("Failed to fetch conflicts: %s", e)
        return conflict_cache.get("conflicts") or []
