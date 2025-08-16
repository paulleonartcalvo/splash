import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sessions/$organization/$location/")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();

  return (
    <div>
      Hello {params.organization} {params.location}!
    </div>
  );
}
