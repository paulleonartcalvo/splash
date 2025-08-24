import { queryOptions } from "@/lib/queryOptions";
import { createSearchParams } from "@/lib/searchParams";
import type { SkipToken } from "@tanstack/react-query";
import { skipToken, useQuery } from "@tanstack/react-query";

export interface UserOrganization {
  id: string;
  name: string;
  slug: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserOrganizationsSuccessResponse {
  data: UserOrganization[];
}

export interface GetUserOrganizationsErrorResponse {
  error: string;
}

export interface GetUserOrganizationsArgs {
  searchParams?: {
    slug?: string;
  };
}

export const getUserOrganizationsQueryOptions = (args: GetUserOrganizationsArgs | SkipToken = {}) =>
  queryOptions<GetUserOrganizationsSuccessResponse, GetUserOrganizationsArgs>({
    queryKey: ["organizations", "user", args],
    url: () => `${import.meta.env["VITE_BOOKING_API_URL"]}/organizations`,
    args,
    searchParams: (args) => createSearchParams(args.searchParams),
  });

export const useGetUserOrganizationsQuery = (args: GetUserOrganizationsArgs | SkipToken = {}) => {
  return useQuery(getUserOrganizationsQueryOptions(args));
};

export interface GetOrganizationByIdSuccessResponse {
  data: UserOrganization;
}

export interface GetOrganizationByIdErrorResponse {
  error: string;
}

export interface GetOrganizationByIdArgs {
  pathParams: {
    id: string;
  };
}

export const getOrganizationByIdQueryOptions = (args: GetOrganizationByIdArgs | SkipToken) =>
  queryOptions<GetOrganizationByIdSuccessResponse, GetOrganizationByIdArgs>({
    queryKey: ["organizations", args],
    url: (args) => `${import.meta.env["VITE_BOOKING_API_URL"]}/organizations/${args.pathParams.id}`,
    args,
  });

export const useGetOrganizationByIdQuery = (args: GetOrganizationByIdArgs | SkipToken) => {
  return useQuery(getOrganizationByIdQueryOptions(args));
};
