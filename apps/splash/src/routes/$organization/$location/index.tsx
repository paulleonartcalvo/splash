import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$organization/$location/")({
  component: RouteComponent,
  loader: ({ context, params }) => {
    const location = context.locations.find(
      (location) => location.id.toString() === params.location
    );

    if (!location) {
      throw new Error(
        "That location does not exist or is not available to you"
      );
    }
    return { location, organization: context.organization };
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
