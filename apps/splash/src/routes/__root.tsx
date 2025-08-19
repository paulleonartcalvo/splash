import { CreateLocationForm } from "@/components/CreateLocationForm";
import { CreateOrganizationForm } from "@/components/CreateOrganizationForm";
import { InviteUserForm } from "@/components/InviteUserForm";
import { LocationPicker } from "@/components/LocationPicker";
import { OrganizationPicker } from "@/components/OrganizationPicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Navbar05,
  type NotificationItem,
  type UserMenuItem,
} from "@/components/ui/shadcn-io/navbar-05";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "@/main";
import { InviteService } from "@/services/invite/inviteService";
import { LocationService } from "@/services/location/locationService";
import { OrganizationService } from "@/services/organization/organizationService";
import type { Session } from "@supabase/supabase-js";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Splash from "../assets/splash.svg?react";

export type AppRouterContext = {
  session: Session | null;
  loading: boolean;
};

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "Splash",
      },
    ],
  }),
});

function RootComponent() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const params = useParams({ strict: false });

  // Extract organization and location from route parameters
  const urlOrganization = params.organization || "";
  const urlLocation = params.location || "";

  const [selectedOrganization, setSelectedOrganization] =
    useState<string>(urlOrganization);
  const [selectedLocation, setSelectedLocation] = useState<string>(urlLocation);

  // Update state when URL changes
  useEffect(() => {
    setSelectedOrganization(urlOrganization);
    setSelectedLocation(urlLocation);
  }, [urlOrganization, urlLocation]);

  const inviteMutation = InviteService.useCreateInviteMutation();

  const invitesResult = InviteService.useGetUserInvitesQuery();

  const createOrganizationMutation =
    OrganizationService.useCreateOrganizationMutation();
  const createLocationMutation = LocationService.useCreateLocationMutation();

  // Convert invites to notifications
  const notifications: NotificationItem[] = [
    ...(invitesResult.data ?? []).map((invite) => ({
      id: invite.id.toString(),
      type: "item" as const,
      title: `Invite to ${invite.organizationName}`,
      subtitle: invite.locationName,
      href: `/invites/${invite.id}`,
    })),
    // Add "View all" notification
    {
      id: "view-all",
      type: "all" as const,
      title: "View all notifications",
      href: "/invites",
    },
  ];

  const userMenuItems: UserMenuItem[] = [
    {
      id: "team",
      component: <DropdownMenuItem>Team</DropdownMenuItem>,
    },
    {
      id: "invite-users",
      component: (
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Invite users by email
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite user</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization and locations
              </DialogDescription>
            </DialogHeader>
            <InviteUserForm
              formId="invite-user-form"
              organization="0843547e-4f9d-4dfe-a6e1-facb4d1ebf1a"
              onSubmit={(values) => {
                toast.promise(
                  inviteMutation.mutateAsync({
                    email: values.email,
                    organizationId: values.organizationId,
                    locationId: values.location[0], // Use first selected location
                  }),
                  {
                    loading: "Creating invite...",
                    success: "Invite sent successfully!",
                    error: "Failed to send invite",
                  }
                );
              }}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button form="invite-user-form" type="submit">
                Send Invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      id: "new-organization",
      component: (
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              New organization
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New organization</DialogTitle>
              <DialogDescription>
                You will be automatically added to it
              </DialogDescription>
            </DialogHeader>
            <CreateOrganizationForm
              formId="create-org-form"
              onSubmit={(values) => {
                if (!session?.user?.id) {
                  toast.error(
                    "You must be logged in to create an organization"
                  );
                  return;
                }

                toast.promise(
                  createOrganizationMutation.mutateAsync({
                    body: {
                      name: values.name,
                      slug: values.slug,
                      createdBy: session.user.id,
                    },
                  }),
                  {
                    loading: "Creating organization...",
                    success: "Organization created successfully!",
                    error: "Failed to create organization",
                  }
                );
              }}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button form="create-org-form" type="submit">
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      id: "new-location",
      component: (
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              New location
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New location</DialogTitle>
              <DialogDescription>
                You will be automatically added to it
              </DialogDescription>
            </DialogHeader>
            <CreateLocationForm
              defaultOrganization={params.organization}
              formId="create-location-form"
              onSubmit={(values) => {
                if (!session?.user?.id) {
                  toast.error("You must be logged in to create a location");
                  return;
                }

                toast.promise(
                  createLocationMutation.mutateAsync({
                    body: values,
                  }),
                  {
                    loading: "Creating location...",
                    success: "Location created successfully!",
                    error: "Failed to create location",
                  }
                );
              }}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button form="create-location-form" type="submit">
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <>
      <HeadContent />
      <Scripts />
      <div className="flex flex-col justify-center items-start h-full w-full overflow-hidden">
        <div className="w-full">
          <Navbar05
            userEmail={session?.user.email}
            userName={session?.user.email}
            logo={<Splash className="text-teal-400" height="32px" />}
            notifications={notifications}
            navigationLinks={[
              { href: "/", label: "Home" },
              { href: "/", label: "Sessions" },
              { href: "/", label: "My Reservations" },
              { href: "/", label: "Dashboard" },
            ]}
            onNavItemClick={(href) => router.navigate({ to: href })}
            onNotificationClick={(notification) => {
              if (notification.href) {
                router.navigate({ to: notification.href });
              } else if (notification.onClick) {
                notification.onClick();
              }
            }}
            onReadNotification={(notification) => {
              // Mark notification as read
              console.log("Marking notification as read:", notification.id);
              // This is where you would typically call an API to mark as read
              // e.g., markNotificationAsRead(notification.id)
            }}
            userMenuItems={userMenuItems}
            onUserItemClick={(item) => {
              if (item === "logout") {
                signOut();
              }
            }}
            rightSideContent={
              session && (
                <div className="flex items-center gap-2">
                  <OrganizationPicker
                    value={selectedOrganization}
                    onChange={(org) => {
                      if (org) {
                        navigate({ to: `/${org}` });
                      } else {
                        return;
                      }
                    }}
                    // placeholder="Organization"
                    className="min-w-32 h-9 "
                  />
                  <span className="text-muted-foreground text-sm">/</span>
                  <LocationPicker
                    organizationId={selectedOrganization || undefined}
                    value={selectedLocation}
                    onChange={(loc) => {
                      if (loc && selectedOrganization) {
                        navigate({ to: `/${selectedOrganization}/${loc}` });
                      } else if (selectedOrganization) {
                        navigate({ to: `/${selectedOrganization}` });
                      }
                    }}
                    className="min-w-32 h-9 "
                    disabled={!selectedOrganization}
                  />
                </div>
              )
            }
          />
        </div>

        <div className="flex-1 w-full overflow-hidden">
          <Outlet />
        </div>
      </div>
    </>
  );
}
