import React from 'react';
import { Globe, Activity, AlertTriangle, Newspaper, Plane } from 'lucide-react';

// Globe component (implemented by Globe Engineer)
import Globe3D from './components/Globe3D';
// Placeholders to be implemented by other agents
// import DashboardPanel from './components/DashboardPanel';
// import StatsBar from './components/StatsBar';
// import LiveFeed from './components/LiveFeed';
// import FilterPanel from './components/FilterPanel';

function App() {
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
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live</span>
          </div>
          {/* Filter toggles will go here */}
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Stats & Filters */}
        <aside className="w-80 border-r border-pulse-border bg-pulse-surface/30 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Stats cards placeholder */}
          <div className="stat-card">
            <div className="flex items-center gap-2 text-pulse-flight">
              <Plane className="w-4 h-4" />
              <span className="text-sm font-medium">Flights</span>
            </div>
            <span className="text-2xl font-bold">--</span>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 text-pulse-conflict">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Conflicts</span>
            </div>
            <span className="text-2xl font-bold">--</span>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 text-pulse-earthquake">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Earthquakes</span>
            </div>
            <span className="text-2xl font-bold">--</span>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 text-pulse-news">
              <Newspaper className="w-4 h-4" />
              <span className="text-sm font-medium">News</span>
            </div>
            <span className="text-2xl font-bold">--</span>
          </div>

          {/* Charts placeholder */}
          <div className="glass-panel p-4 flex-1 min-h-[200px]">
            <p className="text-xs text-gray-500">Charts will render here</p>
          </div>
        </aside>

        {/* Globe area */}
        <main className="flex-1 relative">
          <Globe3D />

          {/* Live feed overlay - bottom right */}
          <div className="absolute bottom-4 right-4 w-80">
            {/* LiveFeed component will render here */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
