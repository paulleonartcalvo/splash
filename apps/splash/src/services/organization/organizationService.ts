import { useCreateOrganizationMutation } from "./mutations";
import { useGetUserOrganizationsQuery, useGetOrganizationByIdQuery } from "./queries";

export const OrganizationService = {
  useCreateOrganizationMutation,
  useGetUserOrganizationsQuery,
  useGetOrganizationByIdQuery,
};