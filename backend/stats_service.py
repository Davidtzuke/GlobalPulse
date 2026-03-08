"""Stats aggregation service for dashboard."""

from collections import Counter
from datetime import datetime, timezone
from schemas import DashboardStats, Flight, Conflict, Earthquake, NewsArticle


def compute_stats(
    flights: list[Flight],
    conflicts: list[Conflict],
    earthquakes: list[Earthquake],
    news: list[NewsArticle],
) -> DashboardStats:
    """Aggregate statistics from all data sources."""
    # Earthquake stats
    mags = [e.magnitude for e in earthquakes if e.magnitude is not None]
    avg_mag = round(sum(mags) / len(mags), 2) if mags else None
    max_mag = round(max(mags), 2) if mags else None

    # Conflict countries
    country_counts = Counter(c.country for c in conflicts if c.country)
    conflict_countries = [c for c, _ in country_counts.most_common(10)]

    # Top news sources
    source_counts = Counter(n.source for n in news if n.source)
    top_sources = [s for s, _ in source_counts.most_common(10)]

    return DashboardStats(
        total_flights=len(flights),
        total_conflicts=len(conflicts),
        total_earthquakes=len(earthquakes),
        total_news=len(news),
        avg_earthquake_magnitude=avg_mag,
        max_earthquake_magnitude=max_mag,
        conflict_countries=conflict_countries,
        top_news_sources=top_sources,
        last_updated=datetime.now(timezone.utc),
    )
