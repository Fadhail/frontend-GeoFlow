'use client';

import React, { useCallback } from 'react';
import { UserIdModal } from '@/components/UserIdModal';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { MapContainer } from '@/components/MapContainer';
import { useUserId, useTrackingData } from '@/hooks';

export function GeoFlowTrackerPage() {
  const [showUserModal, setShowUserModal] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  
  const userIdState = useUserId();

  const trackingData = useTrackingData(userIdState.userId, Boolean(userIdState.userId));

  const handleUserIdSubmit = useCallback(
    async (userId: string) => {
      const success = await userIdState.setUserId(userId);
      if (success) {
        setShowUserModal(false);
      }
    },
    [userIdState]
  );

  const handleChangeUser = useCallback(() => {
    userIdState.reset();
    trackingData.clear();
    setShowUserModal(true);
  }, [userIdState, trackingData]);

  if (!userIdState.userId) {
    return (
      <>
        <UserIdModal
          open={showUserModal}
          onOpenChange={setShowUserModal}
          onSubmit={handleUserIdSubmit}
          isValidating={userIdState.isValidating}
          error={userIdState.error}
          onErrorClear={userIdState.clearError}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* User ID Modal */}
      <UserIdModal
        open={showUserModal}
        onOpenChange={setShowUserModal}
        onSubmit={handleUserIdSubmit}
        isValidating={userIdState.isValidating}
        error={userIdState.error}
        onErrorClear={userIdState.clearError}
      />

      {/* Navbar */}
      <Navbar
        userId={userIdState.userId}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onChangeUser={handleChangeUser}
        isLoading={trackingData.isLoading}
      />

      {/* Main Content: Sidebar + Map */}
      <div className="flex flex-1 overflow-hidden w-full">
        {/* Sidebar */}
        <Sidebar
          userId={userIdState.userId}
          onChangeUser={handleChangeUser}
          locationCount={trackingData.points.length}
          lastUpdate={trackingData.lastUpdate}
          isLoading={trackingData.isLoading}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content Area - Full width and height */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <MapContainer
            coordinates={trackingData.coordinates}
            points={trackingData.points}
            isLoading={trackingData.isLoading}
          />

          {trackingData.error && (
            <div className="bg-red-50 border-t border-red-200 px-6 py-4">
              <p className="text-red-700 text-sm">
                ❌ Error: {trackingData.error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
