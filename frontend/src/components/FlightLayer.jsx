import React, { useMemo } from 'react'
import { Marker, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import useStore from '../store/useStore'

function createFlightIcon(heading = 0) {
  return L.divIcon({
    className: 'flight-marker',
    html: `<div style="
      transform: rotate(${heading || 0}deg);
      width: 12px;
      height: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="#00d4ff" opacity="0.85">
        <path d="M12 2L8 10h3v10h2V10h3z"/>
      </svg>
    </div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })
}

function formatAltitude(meters) {
  if (meters == null) return 'N/A'
  return `${Math.round(meters * 3.28084).toLocaleString()} ft`
}

function formatSpeed(ms) {
  if (ms == null) return 'N/A'
  return `${Math.round(ms * 1.944)} kts`
}

export default function FlightLayer({ flights = [] }) {
  const map = useMap()
  const mapBounds = useStore((s) => s.mapBounds)
  const zoom = map.getZoom()

  // Filter flights to visible viewport for performance
  const visibleFlights = useMemo(() => {
    if (!flights.length) return []

    const filtered = flights.filter((f) => {
      if (f.latitude == null || f.longitude == null) return false
      if (f.on_ground) return false
      if (!mapBounds) return true
      return (
        f.latitude >= mapBounds.south &&
        f.latitude <= mapBounds.north &&
        f.longitude >= mapBounds.west &&
        f.longitude <= mapBounds.east
      )
    })

    // At low zoom, sample flights to avoid overwhelming the map
    if (zoom <= 3 && filtered.length > 800) {
      const step = Math.ceil(filtered.length / 800)
      return filtered.filter((_, i) => i % step === 0)
    }
    if (zoom <= 5 && filtered.length > 2000) {
      const step = Math.ceil(filtered.length / 2000)
      return filtered.filter((_, i) => i % step === 0)
    }

    return filtered
  }, [flights, mapBounds, zoom])

  if (!visibleFlights.length) return null

  return (
    <>
      {visibleFlights.map((flight) => (
        <Marker
          key={flight.icao24}
          position={[flight.latitude, flight.longitude]}
          icon={createFlightIcon(flight.heading)}
        >
          <Tooltip direction="top" offset={[0, -8]} className="flight-tooltip">
            <div className="text-xs">
              <div className="font-bold text-cyan-400">
                {flight.callsign?.trim() || flight.icao24}
              </div>
              <div>{flight.origin_country}</div>
              <div>Alt: {formatAltitude(flight.altitude)}</div>
              <div>Spd: {formatSpeed(flight.velocity)}</div>
              {flight.heading != null && (
                <div>Hdg: {Math.round(flight.heading)}°</div>
              )}
            </div>
          </Tooltip>
        </Marker>
      ))}
    </>
  )
}
