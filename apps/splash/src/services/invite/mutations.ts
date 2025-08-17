import { createRequest } from "@/lib/api";
import { queryClient } from "@/main";
import { useMutation } from "@tanstack/react-query";

export interface CreateInviteRequest {
  email: string;
  organizationId: string;
  locationId: number;
}

export interface CreateInviteSuccessResponse {
  data: {
    id: number;
    createdAt: string;
    createdBy: string;
    invitedUserEmail: string;
    organizationId: string;
    locationId: number;
  };
}

export interface CreateInviteErrorResponse {
  error: string;
}

export type CreateInviteResponse =
  | CreateInviteSuccessResponse
  | CreateInviteErrorResponse;

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites", "user"] });
    },
    onError: (error) => {
      console.error("Failed to create invite:", error.message);
    },
  });
};

export interface AcceptInviteResponse {
  data: {
    organizationId: string;
    locationId: number;
  };
}

export const useAcceptInviteMutation = () => {
  return useMutation({
    mutationFn: (inviteId: number) =>
      createRequest<AcceptInviteResponse>(
        `${import.meta.env["VITE_BOOKING_API_URL"]}/invites/${inviteId}/accept`,
        {
          method: "POST",
        }
      ),
    onSuccess: (data) => {
      console.log("Invite accepted successfully:", data.data);
      // Invalidate user invites query to refetch
      queryClient.invalidateQueries({ queryKey: ["invites", "user"] });
    },
    onError: (error) => {
      console.error("Failed to accept invite:", error.message);
    },
  });
};

export interface RejectInviteResponse {
  data: {
    inviteId: number;
  };
}

export const useRejectInviteMutation = () => {
  return useMutation({
    mutationFn: (inviteId: number) =>
      createRequest<RejectInviteResponse>(
        `${import.meta.env["VITE_BOOKING_API_URL"]}/invites/${inviteId}/reject`,
        {
          method: "POST",
        }
      ),
    onSuccess: (data) => {
      console.log("Invite rejected successfully:", data.data);
      // Invalidate user invites query to refetch
      queryClient.invalidateQueries({ queryKey: ["invites", "user"] });
    },
    onError: (error) => {
      console.error("Failed to reject invite:", error.message);
    },
  });
};
