/** News articles panel
 *
 * Shows real readable news articles with:
 * - Article title (linked to source)
 * - Description/excerpt text
 * - Source name and publish time
 * - Thumbnail image if available
 * - Scrollable list
 *
 * TODO: Dashboard Engineer - implement full news panel
 */
import React from 'react'

export default function NewsPanel() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Latest News</h3>
      <p className="text-xs text-gray-600">Dashboard Engineer will implement</p>
    </div>
  )
}
