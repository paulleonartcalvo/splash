import { LoadingMessage } from "@/components/LoadingMessage";
import { useAuth } from "@/contexts/AuthContext";
import { createRequest } from "@/lib/api";
import { queryClient } from "@/main";
import { type GetLocationsSuccessResponse } from "@/services/location/queries";
import { type GetOrganizationByIdSuccessResponse } from "@/services/organization/queries";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$organization")({
  pendingComponent: () => {
    const { loading } = useAuth();
    if (loading) {
      return <LoadingMessage message="Checking authentication..." />;
    }
    return <LoadingMessage message="Loading organization data..." />;
  },
  pendingMs: 0,
  beforeLoad: async ({ params, context }) => {
    if (!context.session && !context.loading) {
      throw redirect({
        to: "/",
      });
    }

    const data =
      await queryClient.ensureQueryData<GetOrganizationByIdSuccessResponse>({
        queryKey: ["organizations", params.organization],
        queryFn: () =>
          createRequest(
            `${import.meta.env["VITE_BOOKING_API_URL"]}/organizations/${params.organization}`
          ),
      });

    const locationsData =
      await queryClient.ensureQueryData<GetLocationsSuccessResponse>({
        queryKey: ["locations", params.organization],
        queryFn: () =>
          createRequest(
            `${import.meta.env["VITE_BOOKING_API_URL"]}/locations`,
            {
              searchParams: new URLSearchParams({
                organizationId: params.organization,
              }),
            }
          ),
      });

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
