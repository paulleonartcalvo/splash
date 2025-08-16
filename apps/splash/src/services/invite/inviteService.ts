import { useCreateInviteMutation, useAcceptInviteMutation, useRejectInviteMutation } from "./mutations";
import { useGetUserInvitesQuery } from "./queries";

export const InviteService = {
  useCreateInviteMutation,
  useAcceptInviteMutation,
  useRejectInviteMutation,
  useGetUserInvitesQuery,
};