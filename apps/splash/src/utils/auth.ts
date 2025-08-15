import type { AppRouterContext } from "@/routes/__root";
import { redirect } from "@tanstack/react-router";

export function requireAuth(context: AppRouterContext) {
  if (!context.session) {
    throw redirect({ to: "/" });
  }

  return {
    session: context.session,
  };
}
