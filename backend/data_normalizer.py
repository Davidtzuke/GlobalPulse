"""Data normalization utilities for Global Pulse v2.

Shared cleaning functions used across all backend services to ensure
consistent, safe data parsing from external APIs.
"""

from datetime import datetime, timezone
from typing import Optional


def clean_callsign(raw: str | None) -> str:
    """Strip whitespace from callsign, return 'N/A' if empty or None."""
    if raw is None:
        return "N/A"
    cleaned = raw.strip()
    return cleaned if cleaned else "N/A"


def safe_float(value, default=0.0):
    """Safely convert a value to float, returning default on failure."""
    if value is None:
        return default
    try:
        return float(value)
    except (ValueError, TypeError):
        return default


def safe_int(value, default=0):
    """Safely convert a value to int, returning default on failure."""
    if value is None:
        return default
    try:
        return int(value)
    except (ValueError, TypeError):
        return default


def ms_to_iso(timestamp_ms: int | None) -> str | None:
    """Convert millisecond timestamp to ISO 8601 string. Returns None if invalid."""
    if timestamp_ms is None:
        return None
    try:
        dt = datetime.fromtimestamp(timestamp_ms / 1000, tz=timezone.utc)
        return dt.isoformat()
    except (OSError, ValueError, TypeError):
        return None


def unix_to_iso(timestamp: int | None) -> str | None:
    """Convert unix timestamp (seconds) to ISO 8601 string. Returns None if invalid."""
    if timestamp is None:
        return None
    try:
        dt = datetime.fromtimestamp(timestamp, tz=timezone.utc)
        return dt.isoformat()
    except (OSError, ValueError, TypeError):
        return None


def clamp_coordinates(lat: float, lng: float) -> tuple[float, float] | None:
    """Return (lat, lng) if within valid range, None otherwise.

    Valid ranges: latitude [-90, 90], longitude [-180, 180].
    """
    try:
        lat_f = float(lat)
        lng_f = float(lng)
    except (ValueError, TypeError):
        return None
    if -90 <= lat_f <= 90 and -180 <= lng_f <= 180:
        return (lat_f, lng_f)
    return None


def clean_text(text: str | None, max_length: int = 500) -> str | None:
    """Clean text: strip whitespace, truncate to max_length. Returns None if empty."""
    if text is None:
        return None
    cleaned = text.strip()
    if not cleaned:
        return None
    return cleaned[:max_length] if len(cleaned) > max_length else cleaned
