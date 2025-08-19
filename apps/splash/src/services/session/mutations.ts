import { createRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Session, Reservation } from "./queries";

export interface CreateSessionArgs {
  body: {
    title: string;
    description?: string;
    startDate: string;
    startTime: string;
    endTime: string;
    locationId: string;
    rrule?: string;
    status?: 'draft' | 'active' | 'disabled';
  };
}

export interface CreateSessionSuccessResponse {
  data: Session;
}

export interface CreateSessionErrorResponse {
  error: string;
}

export const useCreateSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: CreateSessionArgs) =>
      createRequest<CreateSessionSuccessResponse>(
        `${import.meta.env["VITE_BOOKING_API_URL"]}/sessions`,
        {
          method: "POST",
          body: JSON.stringify(args.body),
        }
      ),
    onSuccess: (_, variables) => {
      // Invalidate and refetch sessions for the location
      queryClient.invalidateQueries({
        queryKey: ["sessions", { searchParams: { location_id: variables.body.locationId } }],
      });
      // Also invalidate the general sessions query
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
    },
  });
};

export interface CreateReservationArgs {
  pathParams: {
    id: string;
  };
  body: {
    instanceDatetime: string;
  };
}

export interface CreateReservationSuccessResponse {
  data: Reservation;
}

export interface CreateReservationErrorResponse {
  error: string;
}

export const useCreateReservationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: CreateReservationArgs) =>
      createRequest<CreateReservationSuccessResponse>(
        `${import.meta.env["VITE_BOOKING_API_URL"]}/sessions/${args.pathParams.id}/reservations`,
        {
          method: "POST",
          body: JSON.stringify(args.body),
        }
      ),
    onSuccess: (_, variables) => {
      // Invalidate and refetch reservations for the session
      queryClient.invalidateQueries({
        queryKey: ["sessions", { pathParams: { id: variables.pathParams.id } }, "reservations"],
      });
    },
  });
};