import { queryOptions } from "@/lib/queryOptions";
import { createSearchParams } from "@/lib/searchParams";
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
  searchParams?: {
    organization_id?: string;
  };
}

export const getLocationsQueryOptions = (args: GetLocationsArgs | SkipToken) => {
  return queryOptions<GetLocationsSuccessResponse, GetLocationsArgs>({
    queryKey: ["locations", args],
    url: () => `${import.meta.env["VITE_BOOKING_API_URL"]}/locations`,
    args,
    searchParams: (args) => args.searchParams ? createSearchParams(args.searchParams) : createSearchParams({}),
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
  pathParams: {
    id: string;
  };
}

export const getLocationByIdQueryOptions = (args: GetLocationByIdArgs | SkipToken) =>
  queryOptions<GetLocationByIdSuccessResponse, GetLocationByIdArgs>({
    queryKey: ["locations", "single", args],
    url: (args) => `${import.meta.env["VITE_BOOKING_API_URL"]}/locations/${args.pathParams.id}`,
    args,
  });

export const useGetLocationByIdQuery = (
  args: GetLocationByIdArgs | SkipToken
) => {
  return useQuery(getLocationByIdQueryOptions(args));
};
