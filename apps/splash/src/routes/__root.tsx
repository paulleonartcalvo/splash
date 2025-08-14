import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { BellIcon } from "lucide-react";
import Splash from "../assets/splash.svg?react";
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
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
            {/* <NavigationMenuItem>
              <NavigationMenuLink asChild><Link to="/">How it Works</Link></NavigationMenuLink>
            </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex flex-1 justify-end items-center gap-4">
          <Button variant="secondary" size="icon" className="size-8">
            <BellIcon />
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full">
        <Outlet />
      </div>
    </div>
  );
}
