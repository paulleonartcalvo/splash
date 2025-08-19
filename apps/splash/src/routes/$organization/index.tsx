import { CreateLocationForm } from "@/components/CreateLocationForm";
import { LoadingMessage } from "@/components/LoadingMessage";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LocationService } from "@/services/location/locationService";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/$organization/")({
  component: RouteComponent,
  pendingMs: 0,
});

function RouteComponent() {
  const navigate = useNavigate({
    from: "/$organization",
  });
  const { organization, locations } = Route.useRouteContext();
  const params = Route.useParams();

  const createLocationMutation = LocationService.useCreateLocationMutation();

  useEffect(() => {
    // If we have locations, redirect to the first one
    if (locations.length > 0) {
      const firstLocation = locations[0];
      navigate({
        to: `/${params.organization}/${firstLocation.id}`,
        replace: true,
      });
    }
  }, [locations, navigate, params.organization]);

  if (locations.length > 0) {
    return (
      <LoadingMessage message={`Redirecting you to your ${organization.name} location...`}/>
    );
  }

  // Show loading message while redirecting
  return (
    <div className="text-center flex flex-col justify-center items-center gap-4 h-full w-full">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Create your first location</CardTitle>
          <CardDescription>
            This organization has no locations yet!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateLocationForm
            formId="create-first-location"
            defaultOrganization={organization.id}
            onSubmit={async (newLocation) => {
              toast
                .promise(createLocationMutation.mutateAsync({
                    body: newLocation
                }), {
                  success: "Location created",
                  loading: "Creating location...",
                  error: "Failed to create location",
                })
                .unwrap()
                .then((v) => {
                  navigate({
                    to: "$location",
                    params: {
                      location: v.data.id,
                    },
                  });
                });
            }}
          />
        </CardContent>
        <CardFooter className="flex justify-end items-center">
          <CardAction>
            <Button type="submit" form="create-first-location">
              Create
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
