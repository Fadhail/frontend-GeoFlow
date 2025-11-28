import React from 'react';
import { GeoFlowTrackerPage } from '@/components/GeoFlowTrackerPage';

export const metadata = {
  title: 'GeoFlow',
  description: 'Track GPS locations in real-time with a beautiful interactive map',
};

export default function Home() {
  return (
    <main className="w-full h-screen">
      <GeoFlowTrackerPage />
    </main>
  );
}

