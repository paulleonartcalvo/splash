import type { SkipToken, UseQueryOptions } from "@tanstack/react-query";
import { skipToken } from "@tanstack/react-query";
import { createRequest } from "./api";
import { supabase } from "./supabase";

// Helper to create a query function
export function createQueryFn<T = any, TArgs = any>(
  urlCallback: (args: TArgs) => string,
  args: TArgs | SkipToken,
  options?: {
    authorized?: boolean;
    searchParams?: (args: TArgs) => URLSearchParams | Record<string, string> | undefined;
  }
) {
  const { authorized = true, searchParams } = options || {};

  // If args are skipToken, return skipToken
  if (args === skipToken) {
    return skipToken;
  }

  const url = urlCallback(args);
  const params = searchParams ? searchParams(args) : undefined;

  // If authorization is required, check for session
  if (authorized) {
    const session = supabase.auth.getSession().then(({ data }) => data.session);
    
    return async (): Promise<T> => {
      const currentSession = await session;
      if (!currentSession) {
        throw new Error("No active session");
      }

      return createRequest<T>(url, {
        searchParams: params,
        token: currentSession.access_token,
      });
    };
  }

  // For non-authorized requests
  return (): Promise<T> => createRequest<T>(url, { searchParams: params });
}

// Main queryOptions helper
export function queryOptions<T = any, TArgs = any>(
  options: Omit<UseQueryOptions<T, Error>, "queryFn"> & {
    url: (args: TArgs) => string;
    args: TArgs | SkipToken;
    authorized?: boolean;
    searchParams?: (args: TArgs) => URLSearchParams | Record<string, string> | undefined;
  }
): UseQueryOptions<T, Error> {
  const { url, args, authorized = true, searchParams, ...restOptions } = options;

  return {
    ...restOptions,
    queryFn: createQueryFn<T, TArgs>(url, args, { authorized, searchParams }),
  };
}