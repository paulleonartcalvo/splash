import { supabase } from "./supabase";

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

  constructor(
    error: string,
    statusCode: number,
    message?: string,
    details?: any
  ) {
    super(message || error);
    this.name = "ApiRequestError";
    this.error = error;
    this.message = message || error;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const createRequest = async <T = any>(
  url: string,
  options?: RequestInit & {
    searchParams?: URLSearchParams | Record<string, string>;
    token?: string;
  }
): Promise<T> => {
  // Get current session token if not provided
  const token = options?.token ?? (await supabase.auth.getSession()).data.session?.access_token;

  // Handle search params
  let finalUrl = url;
  if (options?.searchParams) {
    const searchParams =
      options.searchParams instanceof URLSearchParams
        ? options.searchParams
        : new URLSearchParams(options.searchParams);

    const queryString = searchParams.toString();
    if (queryString) {
      finalUrl = `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
    }
  }

  const { searchParams, token: providedToken, ...requestOptions } = options || {};

  const headers: Record<string, string> = {
    ...(requestOptions?.headers as Record<string, string>),
  };

  // Only add Content-Type if there's a body
  if (requestOptions?.body) {
    headers["Content-Type"] = "application/json";
  }

  // Add Authorization header if user is authenticated
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(finalUrl, {
    headers,
    ...requestOptions,
  });

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

  return response.json();
};
