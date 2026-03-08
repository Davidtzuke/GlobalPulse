"""API health monitoring for Global Pulse v2.

Tracks health status of all external API dependencies and exposes
a health check endpoint for monitoring.
"""

import logging
import time
from datetime import datetime, timezone
from typing import Optional

import httpx
from fastapi import APIRouter

logger = logging.getLogger(__name__)

router = APIRouter()


class APIHealthMonitor:
    """Monitors health status of external API dependencies."""

    def __init__(self) -> None:
        self._status: dict[str, dict] = {}

    async def check(self, name: str, url: str, timeout: float = 10.0) -> bool:
        """Check if an external API is reachable.

        Args:
            name: Identifier for the API (e.g., 'opensky', 'usgs').
            url: URL to probe.
            timeout: Request timeout in seconds.

        Returns:
            True if the API responded with a 2xx status.
        """
        start = time.monotonic()
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, timeout=timeout)
                elapsed = (time.monotonic() - start) * 1000
                healthy = resp.status_code < 400
                self._status[name] = {
                    "healthy": healthy,
                    "last_check": datetime.now(timezone.utc).isoformat(),
                    "error": None if healthy else f"HTTP {resp.status_code}",
                    "response_time_ms": round(elapsed, 1),
                }
                return healthy
        except Exception as exc:
            elapsed = (time.monotonic() - start) * 1000
            self._status[name] = {
                "healthy": False,
                "last_check": datetime.now(timezone.utc).isoformat(),
                "error": str(exc)[:200],
                "response_time_ms": round(elapsed, 1),
            }
            logger.warning("Health check failed for %s: %s", name, exc)
            return False

    def get_status(self) -> dict:
        """Return health status of all monitored APIs."""
        return dict(self._status)

    def is_healthy(self, name: str) -> bool:
        """Check if a specific API was healthy at last check."""
        entry = self._status.get(name)
        return entry["healthy"] if entry else False


# Singleton
health_monitor = APIHealthMonitor()

# API endpoints to probe
API_ENDPOINTS = {
    "opensky": "https://opensky-network.org/api/states/all?lamin=0&lamax=1&lomin=0&lomax=1",
    "usgs": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
    "gdelt_news": "https://api.gdeltproject.org/api/v2/doc/doc?query=test&mode=artlist&format=json&maxrecords=1",
    "gdelt_conflicts": "https://api.gdeltproject.org/api/v2/doc/doc?query=conflict&mode=artlist&format=json&maxrecords=1",
}


@router.get("/api/health")
async def api_health():
    """Return health status of all external API dependencies."""
    # Run checks for any APIs not yet checked
    for name, url in API_ENDPOINTS.items():
        if name not in health_monitor._status:
            await health_monitor.check(name, url)

    all_healthy = all(
        s.get("healthy", False) for s in health_monitor._status.values()
    )
    return {
        "status": "healthy" if all_healthy else "degraded",
        "apis": health_monitor.get_status(),
    }


async def run_health_checks():
    """Run health checks on all external APIs. Called by scheduler."""
    for name, url in API_ENDPOINTS.items():
        await health_monitor.check(name, url)
    logger.info("Health checks complete: %s", {
        k: v["healthy"] for k, v in health_monitor._status.items()
    })
