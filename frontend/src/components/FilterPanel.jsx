import React from 'react';
import { Plane, AlertTriangle, Activity, Newspaper } from 'lucide-react';
import useStore from '../store/useStore';

const FILTER_CONFIG = [
  { key: 'flights', icon: Plane, label: 'Flights', activeColor: 'bg-pulse-flight text-black', inactiveColor: 'text-pulse-flight' },
  { key: 'conflicts', icon: AlertTriangle, label: 'Conflicts', activeColor: 'bg-pulse-conflict text-white', inactiveColor: 'text-pulse-conflict' },
  { key: 'earthquakes', icon: Activity, label: 'Quakes', activeColor: 'bg-pulse-earthquake text-black', inactiveColor: 'text-pulse-earthquake' },
  { key: 'news', icon: Newspaper, label: 'News', activeColor: 'bg-pulse-news text-white', inactiveColor: 'text-pulse-news' },
];

function FilterPanel() {
  const filters = useStore((s) => s.filters);
  const toggleFilter = useStore((s) => s.toggleFilter);

  return (
    <div className="flex items-center gap-1.5">
      {FILTER_CONFIG.map(({ key, icon: Icon, label, activeColor, inactiveColor }) => {
        const active = filters[key];
        return (
          <button
            key={key}
            onClick={() => toggleFilter(key)}
            className={`
              flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              transition-all duration-200 border
              ${active
                ? `${activeColor} border-transparent shadow-sm`
                : `${inactiveColor} bg-transparent border-pulse-border opacity-50 hover:opacity-80`
              }
            `}
            title={`${active ? 'Hide' : 'Show'} ${label}`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default FilterPanel;
