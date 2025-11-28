'use client';

import React from 'react';

interface SidebarProps {
  userId: string;
  onChangeUser: () => void;
  locationCount: number;
  lastUpdate: Date | null;
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  locationCount,
  lastUpdate,
  isLoading,
  isOpen,
}: SidebarProps) {
  const formattedLastUpdate = lastUpdate
    ? lastUpdate.toLocaleTimeString('id-ID')
    : 'Never';

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`bg-white text-gray-900 shadow-lg overflow-hidden transition-all duration-300 ease-in-out border-r border-gray-200 flex-shrink-0`}
        style={{
          width: isOpen ? '320px' : '0px',
          minWidth: isOpen ? '320px' : '0px',
        }}
      >
        <div className="p-6 h-full overflow-y-auto w-80">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-600">GeoFlow</h1>
            <p className="text-sm text-gray-600 mt-1">Real-time GPS Tracker</p>
          </div>

          {/* Stats Section */}
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Statistics
            </h2>

            <div className="space-y-3">
              {/* Locations Count */}
              <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">📍 Total Locations</p>
                <p className="text-2xl font-bold text-blue-600">{locationCount}</p>
              </div>

              {/* Last Update */}
              <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">🕐 Last Update</p>
                <p className="text-sm font-mono text-gray-700">{formattedLastUpdate}</p>
              </div>

              {/* Status */}
              <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
                    }`}
                  ></div>
                  <p className="text-sm font-medium text-gray-700">
                    {isLoading ? 'Updating...' : 'Connected'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-auto pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">GeoFlow Tracker v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
