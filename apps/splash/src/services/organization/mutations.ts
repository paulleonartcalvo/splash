import { createRequest } from "@/lib/api";
import { queryClient } from "@/main";
import { useMutation } from "@tanstack/react-query";

export interface CreateOrganizationArgs {
  body: {
    name: string;
    slug: string;
    createdBy: string;
  };
}

export interface CreateOrganizationSuccessResponse {
  data: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CreateOrganizationErrorResponse {
  error: string;
}

export type CreateOrganizationResponse =
  | CreateOrganizationSuccessResponse
  | CreateOrganizationErrorResponse;

export const useCreateOrganizationMutation = () => {
  return useMutation({
    mutationFn: (args: CreateOrganizationArgs) =>
      createRequest<CreateOrganizationResponse>(
        `${import.meta.env["VITE_BOOKING_API_URL"]}/organizations`,
        {
          method: "POST",
          body: JSON.stringify(args.body),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations", "user"] });
    },
    onError: (error) => {
      console.error("Failed to create organization:", error.message);
    },
  });
};