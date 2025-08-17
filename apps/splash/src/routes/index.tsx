import { LoginForm } from "@/components/login-form";
import { EtheralShadow } from "@/components/ui/shadcn-io/etheral-shadow";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/auth/authService";
import { createFileRoute } from "@tanstack/react-router";
import Splash from "../assets/splash.svg?react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useAuth();
  const mutation = AuthService.useLoginMutation();

  return (
    <div className="w-full h-full">
      <EtheralShadow
        color="turquoise"
        className="w-full flex flex-col gap-8 relative items-center justify-center"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
      >
        <div className="flex flex-col justify-center items-center h-full w-full gap-8">
          <Splash height="96px" className="text-teal-400 z-10" />
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold z-10 text-muted-foreground">
            Pool reservations made easy
          </h1>
          {!auth.session && <LoginForm className="w-8/10" />}
        </div>
        
      </EtheralShadow>
    </div>
  );
}
