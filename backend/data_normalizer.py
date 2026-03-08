"""Data normalization utilities for Global Pulse backend services."""

from datetime import datetime, timezone


def clean_callsign(raw: str | None) -> str:
    """Strip whitespace, return 'N/A' if empty."""
    if raw is None:
        return "N/A"
    cleaned = raw.strip()
    return cleaned if cleaned else "N/A"


def safe_float(value, default=0.0):
    """Safely convert to float, return default on failure."""
    if value is None:
        return default
    try:
        return float(value)
    except (ValueError, TypeError):
        return default


def safe_int(value, default=0):
    """Safely convert to int, return default on failure."""
    if value is None:
        return default
    try:
        return int(float(value))
    except (ValueError, TypeError):
        return default


def ms_to_iso(timestamp_ms: int | None) -> str | None:
    """Convert millisecond timestamp to ISO 8601 string."""
    if timestamp_ms is None:
        return None
    try:
        dt = datetime.fromtimestamp(timestamp_ms / 1000, tz=timezone.utc)
        return dt.isoformat()
    except (OSError, ValueError, TypeError):
        return None


def unix_to_iso(timestamp: int | None) -> str | None:
    """Convert unix timestamp to ISO 8601 string."""
    if timestamp is None:
        return None
    try:
        dt = datetime.fromtimestamp(timestamp, tz=timezone.utc)
        return dt.isoformat()
    except (OSError, ValueError, TypeError):
        return None


def clamp_coordinates(lat: float, lng: float) -> tuple[float, float] | None:
    """Return (lat, lng) if valid, None if out of range."""
    try:
        lat_f = float(lat)
        lng_f = float(lng)
    except (ValueError, TypeError):
        return None
    if -90 <= lat_f <= 90 and -180 <= lng_f <= 180:
        return (lat_f, lng_f)
    return None
