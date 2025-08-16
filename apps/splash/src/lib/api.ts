import { supabase } from './supabase';

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
    const errorData = await response.json()
    throw new Error(errorData.error || 'Request failed')
  }

  return response.json()
}