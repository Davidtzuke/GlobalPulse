import React, { useMemo } from 'react';
import { Plane, AlertTriangle, Activity, Newspaper } from 'lucide-react';
import useStore from '../store/useStore';

const TYPE_CONFIG = {
  flight: {
    icon: Plane,
    color: 'text-pulse-flight',
    bgColor: 'bg-pulse-flight/10',
    borderColor: 'border-pulse-flight/20',
    label: 'Flight',
  },
  conflict: {
    icon: AlertTriangle,
    color: 'text-pulse-conflict',
    bgColor: 'bg-pulse-conflict/10',
    borderColor: 'border-pulse-conflict/20',
    label: 'Conflict',
  },
  earthquake: {
    icon: Activity,
    color: 'text-pulse-earthquake',
    bgColor: 'bg-pulse-earthquake/10',
    borderColor: 'border-pulse-earthquake/20',
    label: 'Earthquake',
  },
  news: {
    icon: Newspaper,
    color: 'text-pulse-news',
    bgColor: 'bg-pulse-news/10',
    borderColor: 'border-pulse-news/20',
    label: 'News',
  },
};

function FeedItem({ item }) {
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.news;
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-2 p-2 rounded-lg ${config.bgColor} border ${config.borderColor} transition-all hover:scale-[1.01]`}>
      <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${config.color}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-200 leading-tight truncate">{item.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {item.location && (
            <span className="text-[10px] text-gray-500 truncate">{item.location}</span>
          )}
          {item.time && (
            <span className="text-[10px] text-gray-600">{item.time}</span>
          )}
        </div>
      </div>
      {item.value && (
        <span className={`text-xs font-mono font-bold ${config.color} flex-shrink-0`}>
          {item.value}
        </span>
      )}
    </div>
  );
}

function LiveFeed() {
  const flights = useStore((s) => s.flights);
  const conflicts = useStore((s) => s.conflicts);
  const earthquakes = useStore((s) => s.earthquakes);
  const news = useStore((s) => s.news);
  const filters = useStore((s) => s.filters);

  const feedItems = useMemo(() => {
    const items = [];

    // Add earthquakes (most urgent)
    if (filters.earthquakes) {
      earthquakes.slice(0, 5).forEach((eq) => {
        items.push({
          type: 'earthquake',
          title: eq.place || eq.title || 'Earthquake detected',
          location: eq.place || eq.location,
          value: eq.magnitude ? `M${eq.magnitude.toFixed(1)}` : null,
          time: eq.time ? new Date(eq.time).toLocaleTimeString() : null,
          timestamp: eq.time || Date.now(),
        });
      });
    }

    // Add conflicts
    if (filters.conflicts) {
      conflicts.slice(0, 5).forEach((c) => {
        items.push({
          type: 'conflict',
          title: c.title || c.event_type || c.description || 'Conflict event',
          location: c.country || c.location,
          time: c.date ? new Date(c.date).toLocaleDateString() : null,
          timestamp: c.date ? new Date(c.date).getTime() : Date.now(),
        });
      });
    }

    // Add news
    if (filters.news) {
      news.slice(0, 5).forEach((n) => {
        items.push({
          type: 'news',
          title: n.title || 'News article',
          location: n.source_country || n.source,
          time: n.published ? new Date(n.published).toLocaleTimeString() : null,
          timestamp: n.published ? new Date(n.published).getTime() : Date.now(),
        });
      });
    }

    // Add recent flights (just a few notable ones)
    if (filters.flights && flights.length > 0) {
      flights.slice(0, 3).forEach((f) => {
        items.push({
          type: 'flight',
          title: f.callsign ? `${f.callsign.trim()}` : 'Aircraft',
          location: f.origin_country || f.country,
          value: f.altitude ? `${Math.round(f.altitude)}m` : null,
          timestamp: Date.now(),
        });
      });
    }

    // Sort by timestamp, most recent first
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    return items.slice(0, 15);
  }, [flights, conflicts, earthquakes, news, filters]);

  return (
    <div className="glass-panel p-3 max-h-80 overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Live Feed</h3>
        <span className="text-[10px] text-gray-600">{feedItems.length} events</span>
      </div>
      {feedItems.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-xs text-gray-600">Waiting for data...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {feedItems.map((item, i) => (
            <FeedItem key={`${item.type}-${i}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LiveFeed;
