import { LoadingMessage } from "@/components/LoadingMessage";
import { queryClient } from "@/main";
import { getLocationByIdQueryOptions } from "@/services/location/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$organization/$location/")({
  component: RouteComponent,
  pendingMs: 0,
  pendingComponent: () => <LoadingMessage message="Loading location data..." />,
  loader: async ({ context, params }) => {
    try {
      const locationData = await queryClient.ensureQueryData(
        getLocationByIdQueryOptions({ locationId: params.location })
      );
      
      return { 
        location: locationData.data, 
        organization: context.organization 
      };
    } catch (error) {
      throw new Error(
        "That location does not exist or is not available to you"
      );
    }
  },
});

function RouteComponent() {
  const { location, organization } = Route.useLoaderData();

  return (
    <div>
      Hello {organization.name} {location.name}!
    </div>
  );
}
