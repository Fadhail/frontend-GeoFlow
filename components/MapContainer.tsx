'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapLegend } from './MapLegend';
import type { TrackingPoint } from '@/types';
import type L from 'leaflet';

interface MapContainerProps {
  coordinates: [number, number][];
  points: TrackingPoint[];
  isLoading: boolean;
}

export function MapContainer({ coordinates, points, isLoading }: MapContainerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [leaflet, setLeaflet] = useState<typeof L | null>(null);

  // Load leaflet dynamically to avoid SSR issues
  useEffect(() => {
    import('leaflet').then((module) => {
      setLeaflet(module.default);
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leaflet || !mapContainerRef.current || mapRef.current) return;

    mapRef.current = leaflet.map(mapContainerRef.current).setView([-6.2088, 106.8456], 12);

    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Force map to recalculate size
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);

    return () => {
      if (mapRef.current) {
      }
    };
  }, [leaflet]);

  // Update map dengan data tracking
  useEffect(() => {
    if (!leaflet || !mapRef.current || coordinates.length === 0) return;

    // Hapus polyline lama
    if (polylineRef.current) {
      mapRef.current.removeLayer(polylineRef.current);
    }

    // Hapus markers lama
    markersRef.current.forEach((marker) => {
      mapRef.current!.removeLayer(marker);
    });
    markersRef.current = [];

    // Buat polyline baru
    polylineRef.current = leaflet.polyline(coordinates, {
      color: '#667eea',
      weight: 3,
      opacity: 0.8,
      dashArray: '5, 5',
    }).addTo(mapRef.current);

    // Add start marker (green)
    const startMarker = leaflet.marker(coordinates[0], {
      icon: leaflet.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCA4Yy0xLjEgMC0yLS45LTItMnMyLjktMiAyLTIgLjktMi45IDIgLjktMi45IDIgMnMyID0uOSAyIDJ6Ii8+PC9zdmc+',
        iconSize: [32, 32],
        popupAnchor: [0, -16],
      }),
    })
      .bindPopup(
        `<strong>Start Location</strong><br>Lat: ${coordinates[0][0].toFixed(6)}<br>Lon: ${coordinates[0][1].toFixed(6)}`
      )
      .addTo(mapRef.current);

    markersRef.current.push(startMarker);

    // Add end marker (red)
    const endCoord = coordinates[coordinates.length - 1];
    const endMarker = leaflet.marker(endCoord, {
      icon: leaflet.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iI2Y0NDMzNiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
        iconSize: [32, 32],
        popupAnchor: [0, -16],
      }),
    })
      .bindPopup(
        `<strong>Current Location</strong><br>Lat: ${endCoord[0].toFixed(6)}<br>Lon: ${endCoord[1].toFixed(6)}`
      )
      .addTo(mapRef.current);

    markersRef.current.push(endMarker);

    // Fit bounds
    const bounds = leaflet.latLngBounds(coordinates);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  }, [leaflet, coordinates]);

  return (
    <div className="relative bg-gray-100 overflow-hidden w-full h-full flex-1">
      <div ref={mapContainerRef} className="w-full h-full" />
      {coordinates.length > 0 && <MapLegend />}
      {isLoading && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none z-30">
          <div className="bg-white/90 px-4 py-2 rounded-lg">
            <p className="text-sm font-medium">⏳ Updating...</p>
          </div>
        </div>
      )}
    </div>
  );
}
