import { useCreateInviteMutation } from "./mutations";
import { useGetUserInvitesQuery } from "./queries";

export const InviteService = {
  useCreateInviteMutation,
  useGetUserInvitesQuery,
};