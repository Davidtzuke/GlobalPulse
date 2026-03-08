import React, { useState, useEffect } from 'react'
import { Activity, Newspaper, Swords, Radio, RefreshCw, Wifi, WifiOff, MapPin } from 'lucide-react'
import WorldMap from './components/WorldMap'
import StatsBar from './components/StatsBar'
import NewsPanel from './components/NewsPanel'
import ConflictPanel from './components/ConflictPanel'
import EarthquakePanel from './components/EarthquakePanel'
import LiveFeed from './components/LiveFeed'

export default function App() {
  const [activeTab, setActiveTab] = useState('stats')
  const [connected, setConnected] = useState(false)

  const tabs = [
    { id: 'stats', label: 'Live Stats', icon: Activity },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'conflicts', label: 'Conflicts', icon: Swords },
    { id: 'earthquakes', label: 'Quakes', icon: Radio },
  ]

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-pulse-darker border-b border-pulse-border px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-pulse-accent" />
          <h1 className="text-xl font-bold">Global Pulse</h1>
          <span className="text-xs text-gray-500 bg-pulse-card px-2 py-0.5 rounded">v2</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-1.5 hover:bg-pulse-card rounded transition-colors">
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
          <div className="flex items-center gap-1.5">
            {connected ? (
              <><Wifi className="w-4 h-4 text-pulse-success" /><span className="text-xs text-pulse-success">Live</span></>
            ) : (
              <><WifiOff className="w-4 h-4 text-gray-500" /><span className="text-xs text-gray-500">Offline</span></>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-pulse-darker border-r border-pulse-border flex flex-col shrink-0">
          {/* Tab Navigation */}
          <nav className="flex border-b border-pulse-border">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-1 text-xs flex flex-col items-center gap-1 transition-colors ${
                  activeTab === tab.id ? 'text-pulse-accent border-b-2 border-pulse-accent' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === 'stats' && <StatsBar />}
            {activeTab === 'news' && <NewsPanel />}
            {activeTab === 'conflicts' && <ConflictPanel />}
            {activeTab === 'earthquakes' && <EarthquakePanel />}
          </div>

          {/* Live Feed */}
          <div className="border-t border-pulse-border">
            <LiveFeed />
          </div>
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative">
          <WorldMap />
        </main>
      </div>
    </div>
  )
}
