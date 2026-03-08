"""Pydantic models for Global Pulse v2 backend.

Defines data schemas for all four data streams:
- Flights (OpenSky Network)
- Earthquakes (USGS GeoJSON)
- Conflicts (GDELT DOC 2.0)
- News Articles (GDELT DOC 2.0)

Plus aggregated stats and WebSocket update envelope.
"""

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class Flight(BaseModel):
    """Real-time flight position from OpenSky Network."""

    icao24: str = Field(..., description="Unique ICAO 24-bit transponder address (hex)")
    callsign: Optional[str] = Field(None, description="Callsign of the vehicle, may be None")
    origin_country: str = Field(..., description="Country of registration")
    latitude: Optional[float] = Field(None, description="WGS-84 latitude in degrees")
    longitude: Optional[float] = Field(None, description="WGS-84 longitude in degrees")
    altitude: Optional[float] = Field(None, description="Barometric altitude in meters")
    velocity: Optional[float] = Field(None, description="Ground speed in m/s")
    heading: Optional[float] = Field(None, description="True track / heading in degrees clockwise from north")
    on_ground: bool = Field(False, description="Whether the aircraft is on the ground")
    last_update: Optional[datetime] = Field(None, description="Timestamp of last position update")


class Earthquake(BaseModel):
    """Earthquake event from USGS GeoJSON feed."""

    id: str = Field(..., description="Unique USGS event identifier")
    magnitude: Optional[float] = Field(None, description="Earthquake magnitude")
    place: Optional[str] = Field(None, description="Human-readable location description")
    latitude: float = Field(..., description="WGS-84 latitude in degrees")
    longitude: float = Field(..., description="WGS-84 longitude in degrees")
    depth: Optional[float] = Field(None, description="Depth in kilometers")
    time: datetime = Field(..., description="Origin time of the event")
    url: Optional[str] = Field(None, description="USGS event detail URL")
    tsunami: bool = Field(False, description="Whether a tsunami alert was issued")


class Conflict(BaseModel):
    """Conflict event derived from GDELT DOC 2.0 news analysis."""

    id: str = Field(..., description="Generated unique identifier for the conflict event")
    title: str = Field(..., description="Article/event headline")
    description: Optional[str] = Field(None, description="Brief summary or snippet")
    source_url: Optional[str] = Field(None, description="URL of the source article")
    latitude: Optional[float] = Field(None, description="Approximate latitude of the event")
    longitude: Optional[float] = Field(None, description="Approximate longitude of the event")
    country: Optional[str] = Field(None, description="Country where the event occurred")
    event_date: Optional[datetime] = Field(None, description="Date/time of the conflict event")
    source_name: Optional[str] = Field(None, description="Name of the news source")


class NewsArticle(BaseModel):
    """Global news article from GDELT DOC 2.0 API."""

    title: str = Field(..., description="Article headline")
    description: Optional[str] = Field(None, description="Article snippet or description")
    url: str = Field(..., description="Full URL to the article")
    source: Optional[str] = Field(None, description="News source name")
    image_url: Optional[str] = Field(None, description="URL of the article's social/preview image")
    published_at: Optional[datetime] = Field(None, description="Publication date/time")
    language: Optional[str] = Field(None, description="Language code of the article")
    domain: Optional[str] = Field(None, description="Domain of the source website")


class DashboardStats(BaseModel):
    """Aggregated statistics for the dashboard overview."""

    total_flights: int = Field(0, description="Number of tracked flights")
    total_earthquakes: int = Field(0, description="Number of recent earthquakes")
    total_conflicts: int = Field(0, description="Number of detected conflict events")
    latest_news_count: int = Field(0, description="Number of recent news articles")
    avg_magnitude: Optional[float] = Field(None, description="Average earthquake magnitude")
    max_magnitude: Optional[float] = Field(None, description="Maximum earthquake magnitude")


class LiveUpdate(BaseModel):
    """WebSocket message envelope for real-time updates."""

    type: str = Field(
        ...,
        description="Update category: 'flight' | 'earthquake' | 'conflict' | 'news' | 'stats'",
    )
    data: Any = Field(..., description="Payload data for this update")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="When this update was generated")
