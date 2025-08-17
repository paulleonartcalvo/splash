import { useGetLocationsQuery, useGetLocationByIdQuery } from "./queries";
import { useCreateLocationMutation } from "./mutations";

export const LocationService = {
  useGetLocationsQuery,
  useGetLocationByIdQuery,
  useCreateLocationMutation,
};

// Export types
export type {
  Location,
  GetLocationsArgs,
  GetLocationsSuccessResponse,
  GetLocationByIdArgs,
  GetLocationByIdSuccessResponse,
} from "./queries";

export type {
  CreateLocationArgs,
  CreateLocationSuccessResponse,
  CreateLocationErrorResponse,
} from "./mutations";