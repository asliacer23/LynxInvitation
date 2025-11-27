// Re-export all types from lib/validators
export type {
  Client,
  Event,
  RSVP,
  RSVPResponse,
  Guest,
  Gallery,
  Gift,
  RSVPFormData,
  FindInvitationFormData,
  GuestSearchData,
} from '@/lib/validators';

// Additional application types

export interface AppConfig {
  name: string;
  url: string;
  env: 'development' | 'production' | 'staging';
  supabaseUrl: string;
  enableEmailNotifications: boolean;
  enableRealTimeUpdates: boolean;
  enablePaymentIntegration: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClientError extends Error {
  statusCode?: number;
  code?: string;
}
