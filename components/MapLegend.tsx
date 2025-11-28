'use client';

import React from 'react';

export function MapLegend() {
  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-40 pointer-events-auto">
      <h3 className="font-semibold text-gray-900 mb-3">Legend</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🟢</span>
          <span className="text-sm text-gray-600">Start Location</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">🔴</span>
          <span className="text-sm text-gray-600">Current Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 bg-blue-600"></div>
          <span className="text-sm text-gray-600">Travel Path</span>
        </div>
      </div>
    </div>
  );
}
