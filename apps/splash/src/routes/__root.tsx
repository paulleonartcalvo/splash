import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/AuthContext";
import { InviteService } from "@/services/invite/inviteService";
import type { Session } from "@supabase/supabase-js";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { BellDotIcon, BellIcon, UserIcon } from "lucide-react";
import { toast } from "react-toastify";
import Splash from "../assets/splash.svg?react";

export type AppRouterContext = {
  session: Session | null;
};

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { session, signOut } = useAuth();

  const mutation = InviteService.useCreateInviteMutation();

  const invitesResult = InviteService.useGetUserInvitesQuery();

  return (
    <div className="flex flex-col gap-4 justify-center items-start h-full w-full p-3">
      <div className="flex justify-space-between items-center gap-4 w-full">
        <Splash className="text-teal-400" height="32px" />
        <NavigationMenu viewport={false} orientation="horizontal">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/">Pool sessions</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/">My Reservations</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/dashboard">Dashboard</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {/* <NavigationMenuItem>
              <NavigationMenuLink asChild><Link to="/">How it Works</Link></NavigationMenuLink>
            </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex flex-1 justify-end items-center gap-4">
          <Button variant="secondary" size="icon" className="size-8">
            {invitesResult.data && invitesResult.data.length > 0 ? (
              <BellDotIcon className="text-emerald-400" />
            ) : (
              <BellIcon />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarFallback className="select-none">
                  {session?.user.email?.at(0)?.toUpperCase() ?? <UserIcon />}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Billing
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Keyboard shortcuts
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    toast.promise(
                      mutation.mutateAsync({
                        email: "plleonartcalvo@gmail.com",
                        organizationId: "0843547e-4f9d-4dfe-a6e1-facb4d1ebf1a",
                        locationId: 1,
                      }),
                      {
                        pending: "Creating invite",
                        success: "Invite created",
                        error: "Error creating invite",
                      }
                    );
                  }}
                >
                  Invite users by email
                </DropdownMenuItem>

                <DropdownMenuItem>
                  New Team
                  <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>GitHub</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem disabled>API</DropdownMenuItem>

              {session && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 w-full">
        <Outlet />
      </div>
    </div>
  );
}
