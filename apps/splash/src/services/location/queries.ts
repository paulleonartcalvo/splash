import { queryOptions } from "@/lib/queryOptions";
import type { SkipToken } from "@tanstack/react-query";
import { skipToken, useQuery } from "@tanstack/react-query";

export interface Location {
  id: string;
  name: string;
  slug: string;
  address: string;
  timezone: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetLocationsSuccessResponse {
  data: Location[];
}

export interface GetLocationsErrorResponse {
  error: string;
}

export interface GetLocationsArgs {
  organizationId?: string;
}

export const getLocationsQueryOptions = (args: GetLocationsArgs | SkipToken) => {
  const searchParams: Record<string, string> = {};
  if (args !== skipToken && args.organizationId) {
    searchParams.organization_id = args.organizationId;
  }

  return queryOptions<GetLocationsSuccessResponse, GetLocationsArgs>({
    queryKey: [
      "locations",
      args === skipToken ? undefined : args.organizationId,
    ],
    url: () => `${import.meta.env["VITE_BOOKING_API_URL"]}/locations`,
    args,
    searchParams: args === skipToken ? undefined : searchParams,
  });
};

export const useGetLocationsQuery = (args: GetLocationsArgs | SkipToken) => {
  return useQuery(getLocationsQueryOptions(args));
};

export interface GetLocationByIdSuccessResponse {
  data: Location;
}

export interface GetLocationByIdErrorResponse {
  error: string;
}

export interface GetLocationByIdArgs {
  locationId: string;
}

export const getLocationByIdQueryOptions = (args: GetLocationByIdArgs | SkipToken) =>
  queryOptions<GetLocationByIdSuccessResponse, GetLocationByIdArgs>({
    queryKey: [
      "locations",
      "single",
      args === skipToken ? undefined : args.locationId,
    ],
    url: (args) => `${import.meta.env["VITE_BOOKING_API_URL"]}/locations/${args.locationId}`,
    args,
  });

export const useGetLocationByIdQuery = (
  args: GetLocationByIdArgs | SkipToken
) => {
  return useQuery(getLocationByIdQueryOptions(args));
};
