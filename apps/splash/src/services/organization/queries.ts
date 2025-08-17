import { queryOptions } from "@/lib/queryOptions";
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

export interface GetUserOrganizationsArgs {}

export const getUserOrganizationsQueryOptions = (args: GetUserOrganizationsArgs | SkipToken = {}) =>
  queryOptions<GetUserOrganizationsSuccessResponse, GetUserOrganizationsArgs>({
    queryKey: ["organizations", "user"],
    url: () => `${import.meta.env["VITE_BOOKING_API_URL"]}/organizations`,
    args,
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
  organizationId: string;
}

export const getOrganizationByIdQueryOptions = (args: GetOrganizationByIdArgs | SkipToken) =>
  queryOptions<GetOrganizationByIdSuccessResponse, GetOrganizationByIdArgs>({
    queryKey: ["organizations", args === skipToken ? undefined : args.organizationId],
    url: (args) => `${import.meta.env["VITE_BOOKING_API_URL"]}/organizations/${args.organizationId}`,
    args,
  });

export const useGetOrganizationByIdQuery = (args: GetOrganizationByIdArgs | SkipToken) => {
  return useQuery(getOrganizationByIdQueryOptions(args));
};
