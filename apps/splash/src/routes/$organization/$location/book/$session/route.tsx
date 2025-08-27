import { queryClient } from "@/main";
import { getSessionByIdQueryOptions } from "@/services/session/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$organization/$location/book/$session")({
  beforeLoad: async ({ params }) => {
    try {
      const sessionData = await queryClient.ensureQueryData(
        getSessionByIdQueryOptions({
          pathParams: {
            id: params.session,
          },
        })
      );

      return {
        session: sessionData.data,
      };
    } catch (error) {
      throw new Error("That session does not exist or is not available to you");
    }
  },
});
