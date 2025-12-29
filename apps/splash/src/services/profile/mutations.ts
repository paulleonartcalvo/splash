import { createRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Profile } from "./queries";

export interface UpdateProfileArgs {
  body: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

export interface UpdateProfileSuccessResponse {
  data: Profile;
}

export interface UpdateProfileErrorResponse {
  error: string;
}

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: UpdateProfileArgs) =>
      createRequest<UpdateProfileSuccessResponse>(
        `${import.meta.env["VITE_BOOKING_API_URL"]}/profile`,
        {
          method: "PUT",
          body: JSON.stringify(args.body),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
};
