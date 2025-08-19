import { 
  useGetSessionsQuery, 
  useGetSessionByIdQuery, 
  useGetReservationsQuery,
  useFindSessionsQuery,
  useFindSessionBookingsQuery 
} from "./queries";
import { useCreateSessionMutation, useCreateReservationMutation } from "./mutations";

export const SessionService = {
  useGetSessionsQuery,
  useGetSessionByIdQuery,
  useGetReservationsQuery,
  useFindSessionsQuery,
  useFindSessionBookingsQuery,
  useCreateSessionMutation,
  useCreateReservationMutation,
};

// Export types
export type {
  Session,
  Reservation,
  SessionBooking,
  GetSessionsArgs,
  GetSessionsSuccessResponse,
  GetSessionByIdArgs,
  GetSessionByIdSuccessResponse,
  GetReservationsArgs,
  GetReservationsSuccessResponse,
  FindSessionsArgs,
  FindSessionsSuccessResponse,
  FindSessionBookingsArgs,
  FindSessionBookingsSuccessResponse,
} from "./queries";

export type {
  CreateSessionArgs,
  CreateSessionSuccessResponse,
  CreateSessionErrorResponse,
  CreateReservationArgs,
  CreateReservationSuccessResponse,
  CreateReservationErrorResponse,
} from "./mutations";