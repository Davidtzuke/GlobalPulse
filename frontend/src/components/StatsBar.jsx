import React, { useEffect, useRef, useState } from 'react';
import { Plane, Swords, Activity, Globe2, Gauge, Clock } from 'lucide-react';
import useStore from '../store/useStore';

function AnimatedCount({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    if (value === null || value === undefined) return;

    const start = prevRef.current;
    const end = typeof value === 'number' ? value : 0;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevRef.current = end;
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{display.toLocaleString()}</span>;
}

function StatCard({ icon: Icon, label, value, color, subValue }) {
  return (
    <div className="stat-card group hover:scale-[1.02] transition-transform">
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${color}`}>
          <Icon className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</span>
        </div>
      </div>
      <div className="mt-1.5">
        <span className="text-2xl font-bold tabular-nums">
          {value !== null && value !== undefined ? <AnimatedCount value={value} /> : '--'}
        </span>
        {subValue && (
          <span className="text-xs text-gray-500 ml-2">{subValue}</span>
        )}
      </div>
    </div>
  );
}

function StatsBar() {
  const flights = useStore((s) => s.flights);
  const conflicts = useStore((s) => s.conflicts);
  const earthquakes = useStore((s) => s.earthquakes);
  const stats = useStore((s) => s.stats);
  const isConnected = useStore((s) => s.isConnected);
  const lastUpdated = useStore((s) => s.lastUpdated);

  const avgMagnitude = earthquakes.length > 0
    ? (earthquakes.reduce((sum, eq) => sum + (eq.magnitude || 0), 0) / earthquakes.length).toFixed(1)
    : null;

  const lastUpdateStr = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString()
    : '--:--:--';

  return (
    <div className="flex flex-col gap-3">
      {/* Connection status */}
      <div className="flex items-center gap-2 px-1">
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-xs text-gray-400">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <StatCard
        icon={Plane}
        label="Flights"
        value={flights.length}
        color="text-pulse-flight"
        subValue="tracked"
      />
      <StatCard
        icon={Swords}
        label="Conflicts"
        value={conflicts.length}
        color="text-pulse-conflict"
        subValue="active"
      />
      <StatCard
        icon={Activity}
        label="Earthquakes"
        value={earthquakes.length}
        color="text-pulse-earthquake"
        subValue="past hour"
      />
      {stats && (
        <>
          <StatCard
            icon={Globe2}
            label="Countries"
            value={stats.countries_tracked || stats.countriesTracked || 0}
            color="text-pulse-accent"
          />
          <StatCard
            icon={Gauge}
            label="Avg Magnitude"
            value={avgMagnitude ? parseFloat(avgMagnitude) : 0}
            color="text-pulse-earthquake"
          />
        </>
      )}
      <div className="stat-card">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider opacity-70">Last Updated</span>
        </div>
        <div className="mt-1.5">
          <span className="text-sm font-mono text-gray-300">{lastUpdateStr}</span>
        </div>
      </div>
    </div>
  );
}

export default StatsBar;
