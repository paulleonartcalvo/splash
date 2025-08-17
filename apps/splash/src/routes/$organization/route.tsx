import { queryClient } from "@/main";
import { getLocationsQueryOptions } from "@/services/location/queries";
import { getOrganizationByIdQueryOptions } from "@/services/organization/queries";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$organization")({
  beforeLoad: async ({ params, context }) => {
    if (!context.session) {
      throw redirect({
        to: "/",
      });
    }

    const data = await queryClient.ensureQueryData(
      getOrganizationByIdQueryOptions({ organizationId: params.organization })
    );

    const locationsData = await queryClient.ensureQueryData(
      getLocationsQueryOptions({ organizationId: params.organization })
    );

    return { organization: data.data, locations: locationsData.data };
  },

  // loader: async ({ params }) => {
  //   const data = await queryClient.ensureQueryData<GetOrganizationByIdSuccessResponse>({
  //     queryKey: ["organizations", params.organization],
  //     queryFn: () =>
  //       createRequest(`${import.meta.env["VITE_BOOKING_API_URL"]}/organizations/${params.organization}`),
  //   });

  //   return { organization: data };
  // },
});
