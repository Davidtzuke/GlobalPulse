/** Live update feed at bottom of sidebar
 *
 * Shows scrolling ticker of recent events:
 * - "New earthquake M5.2 in Japan"
 * - "Flight BA123 departed London"
 * - "Conflict reported in..."
 * - Color-coded by type
 * - Auto-scrolls, max 20 items
 *
 * TODO: Dashboard Engineer - implement live feed ticker
 */
import React from 'react'

export default function LiveFeed() {
  return (
    <div className="p-3 max-h-32">
      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Live Feed</h4>
      <p className="text-xs text-gray-600">Waiting for data...</p>
    </div>
  )
}
