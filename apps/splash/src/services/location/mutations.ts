import { createRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Location } from "./queries";

export interface CreateLocationArgs {
  name: string;
  slug: string;
  address: string;
  timezone: string;
  organizationId: string;
}

export interface CreateLocationSuccessResponse {
  data: Location;
}

export interface CreateLocationErrorResponse {
  error: string;
}

export const useCreateLocationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: CreateLocationArgs) =>
      createRequest<CreateLocationSuccessResponse>(
        `${import.meta.env["VITE_BOOKING_API_URL"]}/locations`,
        {
          method: "POST",
          body: JSON.stringify(args),
        }
      ),
    onSuccess: (_, variables) => {
      // Invalidate and refetch locations for the organization
      queryClient.invalidateQueries({
        queryKey: ["locations", variables.organizationId],
      });
      // Also invalidate the general locations query
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
    },
  });
};