import { redirect } from "@tanstack/react-router";
import { useSession } from "./session";

export const DEFAULT_AFTER_AUTH = "/dashboard";

export type AuthRedirectSearch = {
  redirect?: string;
};

export function validateAuthRedirectSearch(search: Record<string, unknown>): AuthRedirectSearch {
  return {
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  };
}

/** Only allow same-origin in-app paths (no open redirects). */
export function safeRedirectPath(path?: string | null): string {
  if (!path) return DEFAULT_AFTER_AUTH;
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/auth")) {
    return DEFAULT_AFTER_AUTH;
  }
  return path;
}

export function stashPostAuthRedirect(path: string) {
  useSession.setState({ postAuthRedirect: safeRedirectPath(path) });
}

export function consumePostAuthRedirect(): string {
  const target = safeRedirectPath(useSession.getState().postAuthRedirect);
  useSession.setState({ postAuthRedirect: null });
  return target;
}

export function requireAuth(returnTo: string): void {
  const { token } = useSession.getState();
  if (!token) {
    stashPostAuthRedirect(returnTo);
    throw redirect({
      to: "/auth/login",
      search: { redirect: returnTo },
    });
  }
}
