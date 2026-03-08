import React, { useEffect } from 'react';
import { Globe } from 'lucide-react';
import Globe3D from './components/Globe3D';
import StatsBar from './components/StatsBar';
import DashboardPanel from './components/DashboardPanel';
import LiveFeed from './components/LiveFeed';
import FilterPanel from './components/FilterPanel';
import useWebSocket from './hooks/useWebSocket';
import useStore from './store/useStore';
import { fetchAllData, fetchFlights, fetchConflicts, fetchEarthquakes, fetchNews, fetchStats } from './api/client';

function App() {
  const { isConnected } = useWebSocket();
  const setFlights = useStore((s) => s.setFlights);
  const setConflicts = useStore((s) => s.setConflicts);
  const setEarthquakes = useStore((s) => s.setEarthquakes);
  const setNews = useStore((s) => s.setNews);
  const setStats = useStore((s) => s.setStats);
  const setAllData = useStore((s) => s.setAllData);

  // Initial data fetch via REST API
  useEffect(() => {
    async function loadInitialData() {
      // Try bulk endpoint first
      const allData = await fetchAllData();
      if (allData) {
        setAllData(allData);
        return;
      }
      // Fallback to individual endpoints
      const [flights, conflicts, earthquakes, news, stats] = await Promise.all([
        fetchFlights(),
        fetchConflicts(),
        fetchEarthquakes(),
        fetchNews(),
        fetchStats(),
      ]);
      if (flights) setFlights(flights);
      if (conflicts) setConflicts(conflicts);
      if (earthquakes) setEarthquakes(earthquakes);
      if (news) setNews(news);
      if (stats) setStats(stats);
    }

    loadInitialData();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-pulse-bg">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-pulse-border bg-pulse-surface/50 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-pulse-accent animate-pulse" />
          <h1 className="text-lg font-bold tracking-tight">Global Pulse</h1>
          <span className="text-xs text-gray-500 ml-2">Real-time World Dashboard</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <FilterPanel />
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs">{isConnected ? 'Live' : 'Offline'}</span>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Stats & Charts */}
        <aside className="w-80 border-r border-pulse-border bg-pulse-surface/30 overflow-y-auto p-4 flex flex-col gap-4">
          <StatsBar />
          <div className="border-t border-pulse-border pt-3">
            <DashboardPanel />
          </div>
        </aside>

        {/* Globe area */}
        <main className="flex-1 relative">
          <Globe3D />

          {/* Live feed overlay - bottom right */}
          <div className="absolute bottom-4 right-4 w-80 z-10">
            <LiveFeed />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
