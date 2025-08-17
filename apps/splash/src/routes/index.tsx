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
    <div className="flex flex-col justify-center items-center h-full w-full gap-8">
      <EtheralShadow
        color="turquoise"
        // className="text-teal-400"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
      >
        <div className="flex flex-col justify-center items-center h-full w-full gap-8">
          <Splash height="96px" className="text-teal-400 z-10" />
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold z-10 text-muted-foreground">
            {/* linear-gradient(90deg, #3b82f6 0%, #a855f7 20%, #ec4899 50%, #a855f7 80%, #3b82f6 100%) */}
            {/* <GradientText
              className="text-4xl font-bold"
              text="Pool reservations made easy"
              gradient="linear-gradient(90deg, #3bf6f0 0%, #55a9f7 20%, #314060 50%, #0e8fd4 80%, #3bf6f0 100%)"
            /> */}
            Pool reservations made easy
          </h1>
        </div>

        {!auth.session && <LoginForm className="w-1/3" />}
      </EtheralShadow>
    </div>
  );
}
