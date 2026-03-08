/**
 * Interactive 3D Globe component using globe.gl
 * Renders flights, conflicts, and earthquakes as data layers
 */

import React, { useEffect, useRef, useCallback } from 'react';
import Globe from 'globe.gl';
import useGlobeData from '../hooks/useGlobeData';

const GLOBE_IMAGE = '//unpkg.com/three-globe/example/img/earth-night.jpg';
const BG_IMAGE = '//unpkg.com/three-globe/example/img/night-sky.png';

function Globe3D() {
  const containerRef = useRef(null);
  const globeRef = useRef(null);
  const { points, rings } = useGlobeData();

  // Initialize globe
  useEffect(() => {
    if (!containerRef.current || globeRef.current) return;

    const globe = Globe()(containerRef.current)
      .globeImageUrl(GLOBE_IMAGE)
      .backgroundImageUrl(BG_IMAGE)
      .atmosphereColor('#3a86ff')
      .atmosphereAltitude(0.25)
      .pointOfView({ lat: 20, lng: 0, altitude: 2.5 })
      // Points layer config
      .pointsMerge(true)
      .pointsData([])
      .pointLat('lat')
      .pointLng('lng')
      .pointAltitude('altitude')
      .pointRadius('size')
      .pointColor('color')
      .pointLabel('label')
      // Rings layer config
      .ringsData([])
      .ringLat('lat')
      .ringLng('lng')
      .ringMaxRadius('maxR')
      .ringPropagationSpeed('propagationSpeed')
      .ringRepeatPeriod('repeatPeriod')
      .ringColor('color');

    // Auto-rotate
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    // Set initial size
    const { clientWidth, clientHeight } = containerRef.current;
    globe.width(clientWidth).height(clientHeight);

    globeRef.current = globe;

    return () => {
      globeRef.current = null;
      // Clean up globe DOM
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) canvas.remove();
      }
    };
  }, []);

  // Update data layers when points/rings change
  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointsData(points);
  }, [points]);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.ringsData(rings);
  }, [rings]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!globeRef.current || !containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      globeRef.current.width(clientWidth).height(clientHeight);
    };

    window.addEventListener('resize', handleResize);
    // Also observe container resize
    let observer;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(handleResize);
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />

      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 glass-panel p-3 text-xs space-y-1.5 z-10">
        <div className="text-gray-400 font-semibold mb-1">Layers</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22d3ee]" />
          <span className="text-gray-300">Flights</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
          <span className="text-gray-300">Conflicts</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
          <span className="text-gray-300">Earthquakes</span>
        </div>
      </div>
    </div>
  );
}

export default Globe3D;
