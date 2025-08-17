import { useCreateOrganizationMutation } from "./mutations";
import { useGetUserOrganizationsQuery } from "./queries";

export const OrganizationService = {
  useCreateOrganizationMutation,
  useGetUserOrganizationsQuery,
};