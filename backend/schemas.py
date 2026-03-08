"""Pydantic models for Global Pulse data types."""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Flight(BaseModel):
    """Real-time flight data from OpenSky Network."""
    icao24: str
    callsign: Optional[str] = None
    origin_country: str
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    altitude: Optional[float] = None
    velocity: Optional[float] = None
    heading: Optional[float] = None
    on_ground: bool = False
    last_contact: Optional[int] = None


class Conflict(BaseModel):
    """Conflict/protest event from GDELT."""
    event_id: str
    event_date: str
    actor1: Optional[str] = None
    actor2: Optional[str] = None
    event_type: str
    latitude: float
    longitude: float
    country: str
    source_url: Optional[str] = None
    goldstein_scale: Optional[float] = None
    num_mentions: Optional[int] = None
    avg_tone: Optional[float] = None


class Earthquake(BaseModel):
    """Earthquake event from USGS."""
    event_id: str
    magnitude: float
    place: str
    time: int
    latitude: float
    longitude: float
    depth: float
    tsunami: int = 0
    alert: Optional[str] = None
    felt: Optional[int] = None
    significance: Optional[int] = None
    event_type: str = "earthquake"
    url: Optional[str] = None


class NewsArticle(BaseModel):
    """News article from GDELT DOC API."""
    url: str
    title: str
    source: str
    language: Optional[str] = None
    source_country: Optional[str] = None
    image_url: Optional[str] = None
    published_at: Optional[str] = None
    domain: Optional[str] = None
    tone: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class DashboardStats(BaseModel):
    """Aggregated statistics for the dashboard."""
    total_flights: int = 0
    total_conflicts: int = 0
    total_earthquakes: int = 0
    total_news: int = 0
    avg_earthquake_magnitude: Optional[float] = None
    max_earthquake_magnitude: Optional[float] = None
    conflict_countries: list[str] = []
    top_news_sources: list[str] = []
    last_updated: Optional[datetime] = None


class LiveUpdate(BaseModel):
    """WebSocket live update message."""
    event_type: str  # "flight" | "conflict" | "earthquake" | "news" | "stats"
    data: dict
    timestamp: datetime
