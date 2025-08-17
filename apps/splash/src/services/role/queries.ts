import { createRequest } from "@/lib/api";
import type { SkipToken } from "@tanstack/react-query";
import { skipToken, useQuery } from "@tanstack/react-query";

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface GetRolesSuccessResponse {
  data: Role[];
}

export interface GetRolesErrorResponse {
  error: string;
}

export interface GetRoleSuccessResponse {
  data: Role;
}

export interface GetRoleErrorResponse {
  error: string;
}

export type GetRoleResponse = GetRoleSuccessResponse | GetRoleErrorResponse;

export interface GetRolesArgs {}

export const useGetRolesQuery = (args: GetRolesArgs | SkipToken = {}) => {
  return useQuery({
    queryKey: ["roles"],
    queryFn:
      args === skipToken
        ? skipToken
        : () =>
            createRequest<GetRolesSuccessResponse>(
              `${import.meta.env["VITE_BOOKING_API_URL"]}/roles`
            ),
  });
};

export interface GetRoleArgs {
  roleId: string;
}

export const useGetRoleQuery = (args: GetRoleArgs | SkipToken) => {
  return useQuery({
    queryKey: ["roles", args === skipToken ? undefined : args.roleId],
    queryFn:
      args === skipToken
        ? skipToken
        : () =>
            createRequest<GetRoleResponse>(
              `${import.meta.env["VITE_BOOKING_API_URL"]}/roles/${args.roleId}`
            ),
  });
};
