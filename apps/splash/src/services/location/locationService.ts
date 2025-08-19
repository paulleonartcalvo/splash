import { useCreateLocationMutation } from "./mutations";
import { useGetLocationByIdQuery, useGetLocationsQuery } from "./queries";

export const LocationService = {
  useGetLocationsQuery,
  useGetLocationByIdQuery,
  useCreateLocationMutation,
};

// Export types
export type {
  GetLocationByIdArgs,
  GetLocationByIdSuccessResponse,
  GetLocationsArgs,
  GetLocationsSuccessResponse,
  Location
} from "./queries";

export type {
  CreateLocationArgs,
  CreateLocationErrorResponse,
  CreateLocationSuccessResponse
} from "./mutations";

