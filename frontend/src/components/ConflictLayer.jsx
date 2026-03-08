import React from 'react'
import { CircleMarker, Popup, Tooltip } from 'react-leaflet'

function isRecent(date) {
  if (!date) return false
  const diff = Date.now() - new Date(date).getTime()
  return diff < 24 * 60 * 60 * 1000
}

function formatDate(date) {
  if (!date) return 'Unknown'
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ConflictLayer({ conflicts = [] }) {
  const located = conflicts.filter((c) => c.latitude != null && c.longitude != null)
  if (!located.length) return null

  return (
    <>
      {located.map((conflict, idx) => {
        const recent = isRecent(conflict.event_date)

        return (
          <CircleMarker
            key={conflict.id || idx}
            center={[conflict.latitude, conflict.longitude]}
            radius={recent ? 8 : 6}
            pathOptions={{
              color: '#ff4444',
              fillColor: '#ff4444',
              fillOpacity: recent ? 0.7 : 0.4,
              weight: recent ? 2 : 1.5,
              className: recent ? 'conflict-pulse' : '',
            }}
          >
            <Tooltip direction="top" className="conflict-tooltip">
              <div className="text-xs max-w-[200px]">
                <div className="font-bold text-red-600">Conflict</div>
                <div className="truncate">{conflict.title}</div>
              </div>
            </Tooltip>
            <Popup className="dark-popup" maxWidth={300}>
              <div className="text-sm min-w-[220px]">
                <div className="font-bold text-red-600 mb-1">{conflict.title}</div>
                {conflict.description && (
                  <p className="text-gray-600 text-xs mb-2 leading-relaxed">
                    {conflict.description}
                  </p>
                )}
                <div className="space-y-0.5 text-xs text-gray-500">
                  {conflict.country && <div>Location: {conflict.country}</div>}
                  <div>Date: {formatDate(conflict.event_date)}</div>
                  {conflict.source_name && <div>Source: {conflict.source_name}</div>}
                  {conflict.source_url && (
                    <a
                      href={conflict.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline block mt-1"
                    >
                      Read Source
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
