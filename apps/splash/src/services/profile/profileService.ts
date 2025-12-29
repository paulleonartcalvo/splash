import { useGetProfileQuery } from "./queries";
import { useUpdateProfileMutation } from "./mutations";

export const ProfileService = {
  useGetProfileQuery,
  useUpdateProfileMutation,
};

// Export types
export type {
  Profile,
  GetProfileArgs,
  GetProfileSuccessResponse,
  GetProfileErrorResponse,
} from "./queries";

export type {
  UpdateProfileArgs,
  UpdateProfileSuccessResponse,
  UpdateProfileErrorResponse,
} from "./mutations";
