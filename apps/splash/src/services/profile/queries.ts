import { queryOptions } from "@/lib/queryOptions";
import type { SkipToken } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export interface Profile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
}

export interface GetProfileSuccessResponse {
  data: Profile;
}

export interface GetProfileErrorResponse {
  error: string;
}

export interface GetProfileArgs {}

export const getProfileQueryOptions = (args: GetProfileArgs | SkipToken = {}) => {
  return queryOptions<GetProfileSuccessResponse, GetProfileArgs>({
    queryKey: ["profile"],
    url: () => `${import.meta.env["VITE_BOOKING_API_URL"]}/profile`,
    args,
  });
};

export const useGetProfileQuery = (args: GetProfileArgs | SkipToken = {}) => {
  return useQuery(getProfileQueryOptions(args));
};
