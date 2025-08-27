import { LoadingMessage } from "@/components/LoadingMessage";
import { useAuth } from "@/contexts/AuthContext";
import { queryClient } from "@/main";
import { getLocationsQueryOptions, type GetLocationsSuccessResponse } from "@/services/location/queries";
import {
  getOrganizationByIdQueryOptions,
  type GetOrganizationByIdSuccessResponse,
} from "@/services/organization/queries";
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

    const [orgData, locationsData] = await Promise.all([
      queryClient.ensureQueryData<GetOrganizationByIdSuccessResponse>(
        getOrganizationByIdQueryOptions({
          pathParams: {
            id: params.organization,
          },
        })
      ),
      queryClient.ensureQueryData<GetLocationsSuccessResponse>(getLocationsQueryOptions({
        'searchParams': {
          'organization_id': params.organization,
        }
      })),
    ]);

    
    return { organization: orgData.data, locations: locationsData.data};
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
