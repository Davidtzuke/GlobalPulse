import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import useStore from '../store/useStore';

const COLORS = {
  flight: '#22d3ee',
  conflict: '#ef4444',
  earthquake: '#f59e0b',
  news: '#8b5cf6',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel p-2 text-xs">
      <p className="text-gray-300 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
        </p>
      ))}
    </div>
  );
}

function EarthquakeMagnitudeChart({ earthquakes }) {
  const data = useMemo(() => {
    if (!earthquakes.length) return [];
    // Group by magnitude ranges
    const ranges = [
      { range: '0-1', min: 0, max: 1, count: 0 },
      { range: '1-2', min: 1, max: 2, count: 0 },
      { range: '2-3', min: 2, max: 3, count: 0 },
      { range: '3-4', min: 3, max: 4, count: 0 },
      { range: '4-5', min: 4, max: 5, count: 0 },
      { range: '5+', min: 5, max: 99, count: 0 },
    ];
    earthquakes.forEach((eq) => {
      const mag = eq.magnitude || 0;
      const bucket = ranges.find((r) => mag >= r.min && mag < r.max);
      if (bucket) bucket.count++;
    });
    return ranges.map(({ range, count }) => ({ range, count }));
  }, [earthquakes]);

  if (!data.length) return <p className="text-xs text-gray-500 text-center py-4">No earthquake data</p>;

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
        <XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="Earthquakes" fill={COLORS.earthquake} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function DataDistributionChart({ flights, conflicts, earthquakes, news }) {
  const data = useMemo(() => [
    { name: 'Flights', value: flights.length, color: COLORS.flight },
    { name: 'Conflicts', value: conflicts.length, color: COLORS.conflict },
    { name: 'Earthquakes', value: earthquakes.length, color: COLORS.earthquake },
    { name: 'News', value: news.length, color: COLORS.news },
  ].filter(d => d.value > 0), [flights, conflicts, earthquakes, news]);

  if (!data.length) return <p className="text-xs text-gray-500 text-center py-4">No data yet</p>;

  return (
    <ResponsiveContainer width="100%" height={140}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={55}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          verticalAlign="middle"
          align="right"
          layout="vertical"
          iconSize={8}
          wrapperStyle={{ fontSize: 10, color: '#9ca3af' }}
        />
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ConflictTimeline({ conflicts }) {
  const data = useMemo(() => {
    if (!conflicts.length) return [];
    // Group by country, show top 6
    const byCountry = {};
    conflicts.forEach((c) => {
      const country = c.country || c.location || 'Unknown';
      byCountry[country] = (byCountry[country] || 0) + 1;
    });
    return Object.entries(byCountry)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name: name.slice(0, 12), count }));
  }, [conflicts]);

  if (!data.length) return <p className="text-xs text-gray-500 text-center py-4">No conflict data</p>;

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="Events" fill={COLORS.conflict} radius={[0, 3, 3, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function DashboardPanel() {
  const flights = useStore((s) => s.flights);
  const conflicts = useStore((s) => s.conflicts);
  const earthquakes = useStore((s) => s.earthquakes);
  const news = useStore((s) => s.news);

  return (
    <div className="flex flex-col gap-3">
      {/* Earthquake Magnitude Distribution */}
      <div className="glass-panel p-3">
        <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
          Earthquake Magnitudes
        </h3>
        <EarthquakeMagnitudeChart earthquakes={earthquakes} />
      </div>

      {/* Conflict by Region */}
      <div className="glass-panel p-3">
        <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
          Conflicts by Region
        </h3>
        <ConflictTimeline conflicts={conflicts} />
      </div>

      {/* Data Distribution */}
      <div className="glass-panel p-3">
        <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
          Data Distribution
        </h3>
        <DataDistributionChart flights={flights} conflicts={conflicts} earthquakes={earthquakes} news={news} />
      </div>
    </div>
  );
}

export default DashboardPanel;
