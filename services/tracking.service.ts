import { apiCall } from './api-client';
import { TrackingHistoryResponse, UserValidationResult } from '@/types';

export async function fetchTrackingHistory(userId: string): Promise<TrackingHistoryResponse> {
  try {
    const response = await apiCall<TrackingHistoryResponse>(
      `/api/v1/tracking/history/${userId}`
    );
    return response;
  } catch (error) {
    throw new Error(`Gagal mengambil tracking history: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function validateUserExists(userId: string): Promise<UserValidationResult> {
  if (!userId || userId.trim() === '') {
    return {
      isValid: false,
      userId,
      error: 'User ID tidak boleh kosong',
    };
  }

  try {
    const response = await fetchTrackingHistory(userId);
    const pointCount = response.data?.length ?? 0;

    // User harus memiliki minimal 1 data tracking
    if (pointCount === 0) {
      return {
        isValid: false,
        userId,
        error: 'User Not Found',
      };
    }

    return {
      isValid: true,
      userId,
      pointCount,
    };
  } catch (error) {
    return {
      isValid: false,
      userId,
      error: 'User Not Found',
    };
  }
}

export function formatTrackingDataForMap(data: TrackingHistoryResponse) {
  return {
    points: data.data || [],
    coordinates: (data.data || []).map((point) => [
      point.latitude,
      point.longitude,
    ] as [number, number]),
  };
}
