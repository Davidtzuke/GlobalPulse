"""TTL-based in-memory cache for API responses."""

import time
from typing import Any, Optional


class TTLCache:
    """Simple TTL cache with per-key expiration."""

    def __init__(self, default_ttl: int = 60):
        self._store: dict[str, tuple[Any, float]] = {}  # key -> (data, expiry_time)
        self.default_ttl = default_ttl

    def get(self, key: str) -> Optional[Any]:
        """Return cached value if not expired, else None."""
        if key not in self._store:
            return None
        data, expiry = self._store[key]
        if time.time() > expiry:
            del self._store[key]
            return None
        return data

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Store value with TTL in seconds."""
        ttl = ttl if ttl is not None else self.default_ttl
        self._store[key] = (value, time.time() + ttl)

    def clear(self, key: Optional[str] = None) -> None:
        """Clear a specific key or the entire cache."""
        if key is not None:
            self._store.pop(key, None)
        else:
            self._store.clear()


cache = TTLCache()
