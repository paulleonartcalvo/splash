import { createRequest } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface CreateInviteRequest {
  email: string;
  organizationId: string;
  locationId: number;
}

interface CreateInviteSuccessResponse {
  success: true;
  data: {
    id: number;
    createdAt: string;
    createdBy: string;
    invitedUserEmail: string;
    organizationId: string;
    locationId: number;
  };
}

interface CreateInviteErrorResponse {
  success: false;
  error: string;
}

type CreateInviteResponse = CreateInviteSuccessResponse | CreateInviteErrorResponse;

export const useCreateInviteMutation = () => {
  return useMutation({
    mutationFn: (request: CreateInviteRequest) =>
      createRequest<CreateInviteResponse>(
        `${import.meta.env["VITE_BOOKING_API_URL"]}/invites`,
        {
          method: "POST",
          body: JSON.stringify(request),
        }
      ),
    onSuccess: (data) => {
      if (data.success) {
        console.log("Invite created successfully:", data.data);
      }
    },
    onError: (error) => {
      console.error("Failed to create invite:", error.message);
    },
  });
};