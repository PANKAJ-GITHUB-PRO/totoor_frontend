import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { PillButton } from "@/components/ui-kit/PillButton";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/auth/otp")({ component: Otp });

function Otp() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { email, verify } = useSession();
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    const i = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(i);
  }, []);

  const onChange = (i: number, v: string) => {
    const val = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    verify();
    navigate({ to: "/auth/role" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto w-full max-w-screen-sm px-5 pt-8 pb-12 flex-1 flex flex-col">
        <Link to="/auth/login" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white font-bold shadow-glow">T</span>
          <span className="font-semibold">Tuddor</span>
        </Link>

        <div className="mt-10">
          <h1 className="text-3xl font-bold tracking-tight">Verify your email</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a 6-digit code to <span className="font-medium text-foreground">{email ?? "your inbox"}</span>.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8">
          <div className="flex justify-between gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                inputMode="numeric"
                value={d}
                onChange={(e) => onChange(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus(); }}
                className="h-14 w-12 rounded-2xl border border-input bg-card text-center text-xl font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {seconds > 0 ? `Resend in ${seconds}s` : <button type="button" onClick={() => setSeconds(30)} className="font-medium text-primary">Resend code</button>}
          </p>
          <PillButton size="lg" fullWidth className="mt-6" rightIcon={<ArrowRight className="h-4 w-4" />}>Verify</PillButton>
        </form>
      </div>
    </div>
  );
}
