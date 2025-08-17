import { supabase } from './supabase';

export interface ApiError {
  error: string;
  message?: string;
  statusCode: number;
  details?: any;
}

export class ApiRequestError extends Error implements ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: any;

  constructor(error: string, statusCode: number, message?: string, details?: any) {
    super(message || error);
    this.name = 'ApiRequestError';
    this.error = error;
    this.message = message || error;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const createRequest = async <T = any>(url: string, options?: RequestInit): Promise<T> => {
  // Get current session token
  const { data: { session } } = await supabase.auth.getSession()
  
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  }

  // Only add Content-Type if there's a body
  if (options?.body) {
    headers['Content-Type'] = 'application/json';
  }

  // Add Authorization header if user is authenticated
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  const response = await fetch(url, {
    headers,
    ...options,
  })

  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      // If response is not JSON, create a generic error
      errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
    }

    throw new ApiRequestError(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData.message,
      errorData
    );
  }

  return response.json()
}