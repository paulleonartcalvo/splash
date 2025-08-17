import { createRequest } from "@/lib/api";
import { useQuery, skipToken } from "@tanstack/react-query";
import type { SkipToken } from "@tanstack/react-query";

export interface UserOrganization {
  id: string;
  name: string;
  slug: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface GetUserOrganizationsSuccessResponse {
  data: UserOrganization[];
}

interface GetUserOrganizationsErrorResponse {
  error: string;
}

interface GetUserOrganizationsArgs {}

export const useGetUserOrganizationsQuery = (args: GetUserOrganizationsArgs | SkipToken = {}) => {
  return useQuery({
    queryKey: ["organizations", "user"],
    queryFn: args === skipToken ? skipToken : () =>
      createRequest<GetUserOrganizationsSuccessResponse>(
        `${import.meta.env["VITE_BOOKING_API_URL"]}/organizations`
      ),
  });
};
