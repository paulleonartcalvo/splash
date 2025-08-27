import { PoolLayout } from "@/components/layout/PoolLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$organization/$location/layouts/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full h-full">
      <PoolLayout />
    </div>
  );
}
