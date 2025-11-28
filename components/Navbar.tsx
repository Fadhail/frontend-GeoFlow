'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  userId: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onChangeUser: () => void;
  isLoading: boolean;
}

export function Navbar({
  userId,
  sidebarOpen,
  onToggleSidebar,
  onChangeUser,
  isLoading,
}: NavbarProps) {
  return (
    <nav className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6">
      {/* Left: Toggle Button */}
      <button
        onClick={onToggleSidebar}
        className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-300"
        title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
      >
        {sidebarOpen ? '✕' : '≡'}
      </button>

      {/* Center: Logo/Title */}
      <div className="flex-1 text-center">
        <h1 className="text-xl font-bold text-blue-600">GeoFlow</h1>
      </div>

      {/* Right: User Info and Change Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onChangeUser}
          className="whitespace-nowrap"
        >
          Change
          <p className="text-sm font-semibold text-gray-900">{userId}</p>
        </Button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="ml-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">Updating...</span>
        </div>
      )}
    </nav>
  );
}
