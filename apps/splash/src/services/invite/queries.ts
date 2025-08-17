import { createRequest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface UserInvite {
  id: number;
  createdAt: string;
  invitedUserEmail: string;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  locationId: number;
  locationName: string;
  locationSlug: string;
}

export const useGetUserInvitesQuery = () => {
  return useQuery({
    queryKey: ["invites", "user"],
    queryFn: () =>
      createRequest<{ data: UserInvite[] }>(
        `${import.meta.env["VITE_BOOKING_API_URL"]}/invites`
      ),
    select: (data) => data.data,
  });
};
