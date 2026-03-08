import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import CountryLayer from './CountryLayer'
import FlightLayer from './FlightLayer'
import EarthquakeLayer from './EarthquakeLayer'
import ConflictLayer from './ConflictLayer'
import MapControls from './MapControls'
import useStore from '../store/useStore'

function MapBoundsTracker() {
  const map = useMap()
  const setBounds = useStore((s) => s.setMapBounds)

  useEffect(() => {
    const update = () => {
      const b = map.getBounds()
      setBounds({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      })
    }
    update()
    map.on('moveend', update)
    map.on('zoomend', update)
    return () => {
      map.off('moveend', update)
      map.off('zoomend', update)
    }
  }, [map, setBounds])

  return null
}

export default function WorldMap() {
  const flights = useStore((s) => s.flights)
  const earthquakes = useStore((s) => s.earthquakes)
  const conflicts = useStore((s) => s.conflicts)
  const selectedLayer = useStore((s) => s.selectedLayer)

  const [layers, setLayers] = useState({
    countries: true,
    flights: true,
    earthquakes: true,
    conflicts: true,
  })

  const toggleLayer = (key) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const showLayer = (key) => {
    if (!layers[key]) return false
    if (selectedLayer === 'all') return true
    return selectedLayer === key
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        zoomControl={false}
        worldCopyJump={true}
        className="w-full h-full"
        style={{ background: '#0a0f1a' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        <ZoomControl position="bottomright" />
        <MapBoundsTracker />

        {showLayer('countries') && (
          <CountryLayer conflicts={conflicts} earthquakes={earthquakes} />
        )}
        {showLayer('flights') && <FlightLayer flights={flights} />}
        {showLayer('earthquakes') && <EarthquakeLayer earthquakes={earthquakes} />}
        {showLayer('conflicts') && <ConflictLayer conflicts={conflicts} />}
      </MapContainer>

      <MapControls layers={layers} onToggle={toggleLayer} />
    </div>
  )
}
