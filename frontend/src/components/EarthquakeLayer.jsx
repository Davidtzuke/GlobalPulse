import React from 'react'
import { CircleMarker, Popup, Tooltip } from 'react-leaflet'

function getMagnitudeColor(mag) {
  if (mag == null) return '#9ca3af'
  if (mag < 3) return '#10b981'
  if (mag < 5) return '#f59e0b'
  if (mag < 7) return '#f97316'
  return '#ef4444'
}

function getMagnitudeRadius(mag) {
  if (mag == null) return 4
  if (mag < 2) return 3
  if (mag < 3) return 5
  if (mag < 5) return 8
  if (mag < 7) return 13
  return 20
}

function isRecent(time) {
  if (!time) return false
  const diff = Date.now() - new Date(time).getTime()
  return diff < 24 * 60 * 60 * 1000
}

function formatTime(time) {
  if (!time) return 'Unknown'
  return new Date(time).toLocaleString()
}

export default function EarthquakeLayer({ earthquakes = [] }) {
  if (!earthquakes.length) return null

  return (
    <>
      {earthquakes.map((eq) => {
        const mag = eq.magnitude
        const color = getMagnitudeColor(mag)
        const radius = getMagnitudeRadius(mag)
        const recent = isRecent(eq.time)

        return (
          <CircleMarker
            key={eq.id}
            center={[eq.latitude, eq.longitude]}
            radius={radius}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: recent ? 0.7 : 0.45,
              weight: recent ? 2 : 1,
              className: recent ? 'earthquake-pulse' : '',
            }}
          >
            <Tooltip direction="top" className="quake-tooltip">
              <div className="text-xs">
                <div className="font-bold" style={{ color }}>
                  M{mag?.toFixed(1) || '?'}
                </div>
                <div>{eq.place || 'Unknown location'}</div>
              </div>
            </Tooltip>
            <Popup className="dark-popup">
              <div className="text-sm min-w-[200px]">
                <div className="font-bold text-lg mb-1" style={{ color }}>
                  M{mag?.toFixed(1) || '?'} Earthquake
                </div>
                <div className="space-y-1 text-gray-700">
                  <div>Location: {eq.place || 'Unknown'}</div>
                  <div>Depth: {eq.depth?.toFixed(1) || '?'} km</div>
                  <div>Time: {formatTime(eq.time)}</div>
                  {eq.tsunami && (
                    <div className="text-red-600 font-bold">⚠ Tsunami Alert</div>
                  )}
                  {eq.url && (
                    <a
                      href={eq.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline block mt-1"
                    >
                      USGS Details
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </>
  )
}
