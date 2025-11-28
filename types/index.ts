export interface TrackingPoint {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface TrackingHistoryResponse {
  data: TrackingPoint[];
  total?: number;
  status?: string;
}

export interface LatLngTuple {
  latitude: number;
  longitude: number;
}

export interface UserValidationResult {
  isValid: boolean;
  userId: string;
  error?: string;
  pointCount?: number;
}

export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
