"""TTL cache for API responses.

Provides a simple dictionary-based cache with time-to-live (TTL) expiration
to reduce redundant API calls and respect rate limits.
"""

import time
from typing import Any, Optional


class TTLCache:
    """Simple dictionary-based cache with per-entry TTL expiration.

    Each cached entry is stored alongside its insertion timestamp.
    Entries are considered expired once their age exceeds the configured TTL.
    """

    def __init__(self, ttl_seconds: int) -> None:
        """Initialize the cache.

        Args:
            ttl_seconds: Time-to-live in seconds for each cache entry.
        """
        self.ttl_seconds = ttl_seconds
        self._store: dict[str, dict[str, Any]] = {}

    def is_expired(self, key: str) -> bool:
        """Check whether a cache entry has expired or does not exist.

        Args:
            key: The cache key to check.

        Returns:
            True if the entry is missing or older than the TTL.
        """
        if key not in self._store:
            return True
        entry = self._store[key]
        return (time.time() - entry["timestamp"]) > self.ttl_seconds

    def get(self, key: str) -> Optional[Any]:
        """Retrieve a cached value if it exists and has not expired.

        Args:
            key: The cache key.

        Returns:
            The cached value, or None if missing/expired.
        """
        if self.is_expired(key):
            # Clean up expired entry
            self._store.pop(key, None)
            return None
        return self._store[key]["value"]

    def set(self, key: str, value: Any) -> None:
        """Store a value in the cache with the current timestamp.

        Args:
            key: The cache key.
            value: The value to cache.
        """
        self._store[key] = {
            "value": value,
            "timestamp": time.time(),
        }

    def clear(self) -> None:
        """Remove all entries from the cache."""
        self._store.clear()


# ---------------------------------------------------------------------------
# Pre-configured cache instances for each data stream
# ---------------------------------------------------------------------------

# Flights refresh frequently (OpenSky has 10s resolution, we cache for 60s)
flight_cache = TTLCache(ttl_seconds=60)

# Earthquakes update every 5 minutes on USGS side
earthquake_cache = TTLCache(ttl_seconds=300)

# Conflict events change less frequently
conflict_cache = TTLCache(ttl_seconds=600)

# News articles update every few minutes
news_cache = TTLCache(ttl_seconds=300)

