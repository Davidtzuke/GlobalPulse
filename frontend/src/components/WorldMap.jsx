/** 2D World Map using react-leaflet
 *
 * Features:
 * - Dark-themed OpenStreetMap tiles
 * - Flight markers with heading arrows (rotated plane icons)
 * - Earthquake markers (circles sized by magnitude, colored by depth)
 * - Conflict markers (red pins with event descriptions)
 * - Country borders visible
 * - Click handlers for marker details
 *
 * TODO: Globe Engineer - implement full map with all layers
 */
import React from 'react'

export default function WorldMap() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-pulse-dark">
      <p className="text-gray-500">Map loading... (Globe Engineer will implement)</p>
    </div>
  )
}
