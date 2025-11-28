import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchTrackingHistory, formatTrackingDataForMap } from '@/services/tracking.service';
import type { TrackingHistoryResponse, TrackingPoint } from '@/types';

interface UseTrackingDataState {
  points: TrackingPoint[];
  coordinates: [number, number][];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

interface UseTrackingDataReturn extends UseTrackingDataState {
  refetch: () => Promise<void>;
  startPolling: (intervalMs?: number) => void;
  stopPolling: () => void;
  clear: () => void;
}

const DEFAULT_POLLING_INTERVAL = 15000; // 15 detik

/**
 * Custom hook untuk mengelola tracking data dan polling
 */
export function useTrackingData(userId: string | null, autoStart = true): UseTrackingDataReturn {
  const [state, setState] = useState<UseTrackingDataState>({
    points: [],
    coordinates: [],
    isLoading: false,
    error: null,
    lastUpdate: null,
  });

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const refetch = useCallback(async () => {
    if (!userId) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await fetchTrackingHistory(userId);
      const formatted = formatTrackingDataForMap(data);

      setState((prev) => ({
        ...prev,
        points: formatted.points,
        coordinates: formatted.coordinates,
        isLoading: false,
        lastUpdate: new Date(),
      }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal memuat data tracking';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
    }
  }, [userId]);

  const startPolling = useCallback((intervalMs = DEFAULT_POLLING_INTERVAL) => {
    // Fetch data immediately
    refetch();

    // Set up polling
    pollingIntervalRef.current = setInterval(() => {
      refetch();
    }, intervalMs);
  }, [refetch]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const clear = useCallback(() => {
    stopPolling();
    setState({
      points: [],
      coordinates: [],
      isLoading: false,
      error: null,
      lastUpdate: null,
    });
  }, [stopPolling]);

  // Auto-fetch ketika userId berubah
  useEffect(() => {
    if (!userId) {
      clear();
      return;
    }

    if (autoStart) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [userId, autoStart, startPolling, stopPolling, clear]);

  return {
    ...state,
    refetch,
    startPolling,
    stopPolling,
    clear,
  };
}
