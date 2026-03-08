import React from 'react'
import { Plane, Activity, Swords, Globe } from 'lucide-react'

const LAYER_CONFIG = [
  { key: 'countries', label: 'Borders', icon: Globe, color: '#6b7280' },
  { key: 'flights', label: 'Flights', icon: Plane, color: '#00d4ff' },
  { key: 'earthquakes', label: 'Quakes', icon: Activity, color: '#f59e0b' },
  { key: 'conflicts', label: 'Conflicts', icon: Swords, color: '#ff4444' },
]

export default function MapControls({ layers, onToggle }) {
  return (
    <div className="absolute top-3 right-3 z-[1000] bg-pulse-darker/90 backdrop-blur-sm border border-pulse-border rounded-lg p-2 space-y-1">
      {LAYER_CONFIG.map(({ key, label, icon: Icon, color }) => (
        <button
          key={key}
          onClick={() => onToggle(key)}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs transition-all ${
            layers[key]
              ? 'text-white bg-pulse-card'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Icon
            className="w-3.5 h-3.5"
            style={{ color: layers[key] ? color : undefined }}
          />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
