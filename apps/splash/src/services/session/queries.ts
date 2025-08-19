import { queryOptions } from "@/lib/queryOptions";
import { createSearchParams } from "@/lib/searchParams";
import type { SkipToken } from "@tanstack/react-query";
import { skipToken, useQuery } from "@tanstack/react-query";

export interface Session {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  startTime: string;
  endTime: string;
  locationId: string;
  rrule: string | null;
  status: 'draft' | 'active' | 'disabled';
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: number;
  sessionId: string;
  userId: string;
  instanceDatetime: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionBooking {
  id: number;
  sessionId: string;
  userId: string;
  instanceDatetime: string;
  createdAt: string;
  updatedAt: string;
  session: {
    id: string;
    title: string;
    description: string | null;
    startDate: string;
    startTime: string;
    endTime: string;
    locationId: string;
    rrule: string | null;
    status: 'draft' | 'active' | 'disabled';
  };
}

export interface GetSessionsSuccessResponse {
  data: Session[];
}

export interface GetSessionsErrorResponse {
  error: string;
}

export interface GetSessionsArgs {
  searchParams?: {
    location_id?: string;
  };
}

export const getSessionsQueryOptions = (args: GetSessionsArgs | SkipToken) => {
  return queryOptions<GetSessionsSuccessResponse, GetSessionsArgs>({
    queryKey: ["sessions", args],
    url: () => `${import.meta.env["VITE_BOOKING_API_URL"]}/sessions`,
    args,
    searchParams: (args) => createSearchParams(args.searchParams),
  });
};

export const useGetSessionsQuery = (args: GetSessionsArgs | SkipToken) => {
  return useQuery(getSessionsQueryOptions(args));
};

export interface GetSessionByIdSuccessResponse {
  data: Session;
}

export interface GetSessionByIdErrorResponse {
  error: string;
}

export interface GetSessionByIdArgs {
  pathParams: {
    id: string;
  };
}

export const getSessionByIdQueryOptions = (args: GetSessionByIdArgs | SkipToken) =>
  queryOptions<GetSessionByIdSuccessResponse, GetSessionByIdArgs>({
    queryKey: ["sessions", "single", args],
    url: (args) => `${import.meta.env["VITE_BOOKING_API_URL"]}/sessions/${args.pathParams.id}`,
    args,
  });

export const useGetSessionByIdQuery = (
  args: GetSessionByIdArgs | SkipToken
) => {
  return useQuery(getSessionByIdQueryOptions(args));
};

export interface GetReservationsSuccessResponse {
  data: Reservation[];
}

export interface GetReservationsErrorResponse {
  error: string;
}

export interface GetReservationsArgs {
  pathParams: {
    id: string;
  };
}

export const getReservationsQueryOptions = (args: GetReservationsArgs | SkipToken) =>
  queryOptions<GetReservationsSuccessResponse, GetReservationsArgs>({
    queryKey: ["sessions", args, "reservations"],
    url: (args) => `${import.meta.env["VITE_BOOKING_API_URL"]}/sessions/${args.pathParams.id}/reservations`,
    args,
  });

export const useGetReservationsQuery = (
  args: GetReservationsArgs | SkipToken
) => {
  return useQuery(getReservationsQueryOptions(args));
};

export interface FindSessionsSuccessResponse {
  data: Session[];
}

export interface FindSessionsErrorResponse {
  error: string;
}

export interface FindSessionsArgs {
  searchParams?: {
    user_id?: string;
    location_id?: string;
  };
}

export const findSessionsQueryOptions = (args: FindSessionsArgs | SkipToken) => {
  return queryOptions<FindSessionsSuccessResponse, FindSessionsArgs>({
    queryKey: ["sessions", "find", args],
    url: () => `${import.meta.env["VITE_BOOKING_API_URL"]}/sessions/find`,
    args,
    searchParams: (args) => createSearchParams(args.searchParams),
  });
};

export const useFindSessionsQuery = (args: FindSessionsArgs | SkipToken) => {
  return useQuery(findSessionsQueryOptions(args));
};

export interface FindSessionBookingsSuccessResponse {
  data: SessionBooking[];
}

export interface FindSessionBookingsErrorResponse {
  error: string;
}

export interface FindSessionBookingsArgs {
  searchParams?: {
    user_id?: string;
    location_id?: string;
    instance_date_from?: string;
    instance_date_to?: string;
  };
}

export const findSessionBookingsQueryOptions = (args: FindSessionBookingsArgs | SkipToken) => {
  return queryOptions<FindSessionBookingsSuccessResponse, FindSessionBookingsArgs>({
    queryKey: ["sessions", "bookings", args],
    url: () => `${import.meta.env["VITE_BOOKING_API_URL"]}/sessions/bookings`,
    args,
    searchParams: (args) => createSearchParams(args.searchParams),
  });
};

export const useFindSessionBookingsQuery = (args: FindSessionBookingsArgs | SkipToken) => {
  return useQuery(findSessionBookingsQueryOptions(args));
};