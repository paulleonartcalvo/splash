import { queryClient } from "@/main";
import { getLocationByIdQueryOptions } from "@/services/location/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$organization/$location")({
  beforeLoad: async ({ context, params }) => {
    try {
      const locationData = await queryClient.ensureQueryData(
        getLocationByIdQueryOptions({
          pathParams: {
            id: params.location,
          },
        })
      );

      return {
        location: locationData.data,
        organization: context.organization,
      };
    } catch (error) {
      throw new Error(
        "That location does not exist or is not available to you"
      );
    }
  },
});
