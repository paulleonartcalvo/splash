import { LoginForm } from "@/components/login-form";
import { createFileRoute } from "@tanstack/react-router";
import Splash from "../assets/splash.svg?react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full gap-16">
      <Splash height="96px" className="text-teal-400" />
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold ">
        Pool reservations made easy
      </h1>
      <LoginForm className="w-1/3" />
    </div>
  );
}
