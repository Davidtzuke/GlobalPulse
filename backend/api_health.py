"""API health monitoring for external data sources."""

import time
import logging
from datetime import datetime, timezone

import httpx

logger = logging.getLogger(__name__)


class APIHealthMonitor:
    """Monitors health of external APIs used by Global Pulse."""

    def __init__(self):
        self._status: dict[str, dict] = {}

    async def check(self, name: str, url: str, timeout: float = 10.0) -> bool:
        """Check if an external API is reachable. Returns True if healthy."""
        start = time.monotonic()
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, timeout=timeout)
                elapsed_ms = (time.monotonic() - start) * 1000
                healthy = resp.status_code < 500
                self._status[name] = {
                    "healthy": healthy,
                    "last_check": datetime.now(timezone.utc).isoformat(),
                    "error": None if healthy else f"HTTP {resp.status_code}",
                    "response_time_ms": round(elapsed_ms, 1),
                    "status_code": resp.status_code,
                }
                return healthy
        except Exception as e:
            elapsed_ms = (time.monotonic() - start) * 1000
            self._status[name] = {
                "healthy": False,
                "last_check": datetime.now(timezone.utc).isoformat(),
                "error": str(e)[:200],
                "response_time_ms": round(elapsed_ms, 1),
                "status_code": None,
            }
            logger.warning(f"Health check failed for {name}: {e}")
            return False

    def get_status(self) -> dict:
        """Get health status of all monitored APIs."""
        return dict(self._status)

    def is_healthy(self, name: str) -> bool:
        """Check if a specific API is healthy."""
        entry = self._status.get(name)
        if entry is None:
            return False
        return entry.get("healthy", False)


# Singleton
health_monitor = APIHealthMonitor()

# API endpoints to monitor
MONITORED_APIS = {
    "opensky": "https://opensky-network.org/api/states/all?lamin=45&lomin=5&lamax=50&lomax=10",
    "gdelt_events": "https://api.gdeltproject.org/api/v2/events/events?query=protest&format=json&maxrecords=1",
    "gdelt_news": "https://api.gdeltproject.org/api/v2/doc/doc?query=world&format=json&maxrecords=1&mode=artlist",
    "usgs": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson",
}
