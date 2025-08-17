import { createRequest } from "@/lib/api";
import { useQuery, skipToken } from "@tanstack/react-query";
import type { SkipToken } from "@tanstack/react-query";

export interface Location {
  id: number;
  name: string;
  slug: string;
  address: string;
  timezone: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

interface GetLocationsSuccessResponse {
  data: Location[];
}

interface GetLocationsErrorResponse {
  error: string;
}

interface GetLocationsArgs {
  organizationId?: string;
}

export const useGetLocationsQuery = (args: GetLocationsArgs | SkipToken) => {
  return useQuery({
    queryKey: ["locations", args === skipToken ? undefined : args.organizationId],
    queryFn: args === skipToken ? skipToken : () => {
      const params = new URLSearchParams();
      if (args.organizationId) {
        params.append("organization_id", args.organizationId);
      }
      const queryString = params.toString();
      const url = `${import.meta.env["VITE_BOOKING_API_URL"]}/locations${queryString ? `?${queryString}` : ""}`;
      return createRequest<GetLocationsSuccessResponse>(url);
    },
  });
};
