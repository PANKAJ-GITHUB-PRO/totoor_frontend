import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, User, ArrowRight } from "lucide-react";
import { PillButton } from "@/components/ui-kit/PillButton";
import { Field, Input } from "@/components/ui-kit/Field";
import { useSession } from "@/lib/session";
import { GoogleIcon } from "./login";

export const Route = createFileRoute("/auth/register")({ component: Register });

function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
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
          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join Tuddor in under a minute.</p>
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
          <Field label="Full name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" leftIcon={<User className="h-4 w-4" />} />
          </Field>
          <Field label="Email" hint="We'll send a 6-digit OTP to verify.">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@tuddor.com" leftIcon={<Mail className="h-4 w-4" />} required />
          </Field>
          <PillButton size="lg" fullWidth rightIcon={<ArrowRight className="h-4 w-4" />}>Send OTP</PillButton>
        </form>

        <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth/login" className="font-medium text-primary">Log in</Link>
        </p>
      </div>
    </div>
  );
}
