import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { PillButton } from "@/components/ui-kit/PillButton";
import { Field, Input } from "@/components/ui-kit/Field";
import { Logo } from "@/components/ui-kit/Logo";
import { stashPostAuthRedirect, validateAuthRedirectSearch } from "@/lib/authRedirect";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/auth/login")({
  validateSearch: validateAuthRedirectSearch,
  component: Login,
});

function Login() {
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { startAuth } = useSession();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setLoading(true);
    try {
      if (redirect) stashPostAuthRedirect(redirect);
      await startAuth(email, "login");
      navigate({ to: "/auth/otp", search: redirect ? { redirect } : {} });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto w-full max-w-screen-sm px-5 pt-8 pb-12 flex-1 flex flex-col">
        <Logo size="md" to="/" />

        <div className="mt-10">
          <h1 className="text-3xl font-bold tracking-tight">{redirect === "/search" ? "Log in to browse tutors" : "Welcome back"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {redirect === "/search"
              ? "Sign in with OTP to search tutors by subject, city, and budget."
              : "Log in with OTP to continue learning."}
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 grid gap-3">
          <Field label="Email" hint="We'll send a 6-digit OTP. No password needed.">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@tudoor.com"
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />
          </Field>
          <PillButton size="lg" fullWidth loading={loading} disabled={loading} rightIcon={<ArrowRight className="h-4 w-4" />}>
            Send OTP
          </PillButton>
          {error && <p className="text-sm text-[color:var(--error)]">{error}</p>}
        </form>

        <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/auth/register" className="font-medium text-primary">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
