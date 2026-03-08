import React, { useState, useEffect, useMemo } from 'react'
import { GeoJSON, useMap } from 'react-leaflet'
import * as topojson from 'topojson-client'

export default function CountryLayer({ conflicts = [], earthquakes = [] }) {
  const [geoData, setGeoData] = useState(null)
  const map = useMap()

  useEffect(() => {
    fetch('/world-110m.json')
      .then((r) => r.json())
      .then((topo) => {
        const geo = topojson.feature(topo, topo.objects.countries)
        setGeoData(geo)
      })
      .catch((err) => console.error('Failed to load country borders:', err))
  }, [])

  // Build sets of country IDs that have active events
  const conflictCountries = useMemo(() => {
    const set = new Set()
    conflicts.forEach((c) => {
      if (c.country) set.add(c.country.toLowerCase())
    })
    return set
  }, [conflicts])

  const earthquakeCountries = useMemo(() => {
    const set = new Set()
    earthquakes.forEach((eq) => {
      if (eq.place) {
        // Extract country-like info from place string
        const parts = eq.place.split(',')
        if (parts.length > 1) set.add(parts[parts.length - 1].trim().toLowerCase())
      }
    })
    return set
  }, [earthquakes])

  const style = (feature) => {
    const name = (feature.properties?.name || '').toLowerCase()
    let fillColor = 'transparent'
    let fillOpacity = 0

    if (conflictCountries.has(name)) {
      fillColor = '#ff4444'
      fillOpacity = 0.12
    } else if (earthquakeCountries.has(name)) {
      fillColor = '#f59e0b'
      fillOpacity = 0.1
    }

    return {
      color: '#374151',
      weight: 0.8,
      opacity: 0.6,
      fillColor,
      fillOpacity,
    }
  }

  const onEachFeature = (feature, layer) => {
    const name = feature.properties?.name || 'Unknown'
    const cName = name.toLowerCase()

    const conflictCount = conflicts.filter(
      (c) => c.country && c.country.toLowerCase() === cName
    ).length
    const quakeCount = earthquakes.filter((eq) => {
      if (!eq.place) return false
      const parts = eq.place.split(',')
      return parts.length > 1 && parts[parts.length - 1].trim().toLowerCase() === cName
    }).length

    let tooltipContent = `<strong>${name}</strong>`
    if (conflictCount > 0) tooltipContent += `<br/>⚔️ ${conflictCount} conflict${conflictCount > 1 ? 's' : ''}`
    if (quakeCount > 0) tooltipContent += `<br/>🌍 ${quakeCount} earthquake${quakeCount > 1 ? 's' : ''}`

    layer.bindTooltip(tooltipContent, {
      sticky: true,
      className: 'country-tooltip',
    })

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          weight: 1.5,
          color: '#6b7280',
          fillOpacity: e.target.options.fillOpacity > 0 ? e.target.options.fillOpacity + 0.08 : 0.05,
          fillColor: e.target.options.fillColor || '#3b82f6',
        })
      },
      mouseout: (e) => {
        e.target.setStyle(style(feature))
      },
    })
  }

  if (!geoData) return null

  return (
    <GeoJSON
      key={`countries-${conflicts.length}-${earthquakes.length}`}
      data={geoData}
      style={style}
      onEachFeature={onEachFeature}
    />
  )
}
