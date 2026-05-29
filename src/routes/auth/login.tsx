import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { PillButton } from "@/components/ui-kit/PillButton";
import { Field, Input } from "@/components/ui-kit/Field";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/auth/login")({ component: Login });

function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();
  const { setEmail: saveEmail } = useSession();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    saveEmail(email);
    navigate({ to: "/auth/otp" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto w-full max-w-screen-sm px-5 pt-8 pb-12 flex-1 flex flex-col">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white font-bold shadow-glow">T</span>
          <span className="font-semibold">Tuddor</span>
        </Link>

        <div className="mt-10">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Log in to continue learning.</p>
        </div>

        <button
          onClick={() => { saveEmail(email || "you@gmail.com"); navigate({ to: "/auth/otp" }); }}
          className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-card text-sm font-medium shadow-soft hover:bg-secondary"
        >
          <GoogleIcon /> Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="grid gap-3">
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@tuddor.com" leftIcon={<Mail className="h-4 w-4" />} required />
          </Field>
          <Field label="Password">
            <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••••" leftIcon={<Lock className="h-4 w-4" />} />
          </Field>
          <PillButton size="lg" fullWidth rightIcon={<ArrowRight className="h-4 w-4" />}>Continue</PillButton>
        </form>

        <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/auth/register" className="font-medium text-primary">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
  );
}
