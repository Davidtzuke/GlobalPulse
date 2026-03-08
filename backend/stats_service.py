"""Dashboard statistics aggregation service.

Computes summary statistics from all four data streams for the
dashboard overview panel.
"""

from typing import List, Optional

from schemas import Conflict, DashboardStats, Earthquake, Flight, NewsArticle


def compute_stats(
    flights: List[Flight],
    earthquakes: List[Earthquake],
    conflicts: List[Conflict],
    news: List[NewsArticle],
) -> DashboardStats:
    """Compute aggregated dashboard statistics from current data.

    Args:
        flights: List of current flight positions.
        earthquakes: List of recent earthquake events.
        conflicts: List of detected conflict events.
        news: List of recent news articles.

    Returns:
        DashboardStats with counts and basic magnitude calculations.
    """
    # Basic magnitude calculations
    magnitudes = [eq.magnitude for eq in earthquakes if eq.magnitude is not None]
    avg_magnitude: Optional[float] = None
    max_magnitude: Optional[float] = None

    if magnitudes:
        avg_magnitude = round(sum(magnitudes) / len(magnitudes), 2)
        max_magnitude = max(magnitudes)

    return DashboardStats(
        total_flights=len(flights),
        total_earthquakes=len(earthquakes),
        total_conflicts=len(conflicts),
        latest_news_count=len(news),
        avg_magnitude=avg_magnitude,
        max_magnitude=max_magnitude,
    )

