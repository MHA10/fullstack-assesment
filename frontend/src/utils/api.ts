/**
 * Base API configuration
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Simple API response type for basic usage
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: string | null;
}