import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/auth/authService";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "react-toastify";
import Splash from "../assets/splash.svg?react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useAuth();
  const mutation = AuthService.useLoginMutation();

  return (
    <div className="flex flex-col justify-center items-center h-full w-full gap-16">
      <Splash height="96px" className="text-teal-400" />
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold ">
        Pool reservations made easy
      </h1>
      {!auth.session && (
        <LoginForm
          className="w-1/3"
          onSubmitLoginForm={(values) => {
            toast.promise(mutation.mutateAsync(values.email), {
              pending: "Sending magic link",
              success: "Magic link sent",
              error: "Failed to send magic link",
            });
          }}
        />
      )}
    </div>
  );
}
