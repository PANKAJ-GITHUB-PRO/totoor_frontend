import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, MailCheck, RefreshCw } from "lucide-react";
import { PillButton } from "@/components/ui-kit/PillButton";
import { consumePostAuthRedirect, stashPostAuthRedirect, validateAuthRedirectSearch } from "@/lib/authRedirect";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/auth/otp")({
  validateSearch: validateAuthRedirectSearch,
  component: Otp,
});

function Otp() {
  const { redirect } = Route.useSearch();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { authMode, email, otpDeliverySent, startAuth, verifyOtp } = useSession();
  const [seconds, setSeconds] = useState(60);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(i);
  }, []);

  const onChange = (i: number, v: string) => {
    const cleaned = v.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const next = cleaned.slice(0, 6).split("");
      setDigits(Array.from({ length: 6 }, (_, index) => next[index] ?? ""));
      refs.current[Math.min(next.length, 5)]?.focus();
      return;
    }
    const val = cleaned.slice(-1);
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    setError("");
    if (otp.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    try {
      setVerifying(true);
      if (redirect) stashPostAuthRedirect(redirect);
      const verifiedRole = await verifyOtp(otp);
      const next = useSession.getState();
      if (next.onboarded) {
        navigate({ to: consumePostAuthRedirect() });
      } else if (authMode === "login" && verifiedRole) {
        navigate({ to: verifiedRole === "student" ? "/onboarding/student" : "/onboarding/tutor" });
      } else {
        navigate({ to: "/auth/role" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto w-full max-w-screen-sm px-5 pt-8 pb-12 flex-1 flex flex-col">
        <Link to="/auth/login" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white font-bold shadow-glow">T</span>
          <span className="font-semibold">Tudoor</span>
        </Link>

        <div className="mt-10">
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <MailCheck className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Verify your email</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a 6-digit code to <span className="font-medium text-foreground">{email ?? "your inbox"}</span>.
          </p>
          {otpDeliverySent === false && (
            <p className="mt-3 rounded-2xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground shadow-soft">
              Email delivery is unavailable right now. You can still use the development OTP <span className="font-semibold text-foreground">123456</span>.
            </p>
          )}
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
            {seconds > 0 ? `Resend in ${seconds}s` : <button type="button" onClick={async () => {
              if (!email || !authMode) return;
              if (resending) return;
              setError("");
              setResending(true);
              try {
                const result = await startAuth(email, authMode);
                setDigits(["", "", "", "", "", ""]);
                setSeconds(result.cooldownSeconds ?? 60);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Unable to resend OTP");
              } finally {
                setResending(false);
              }
            }} className="inline-flex items-center gap-1 font-medium text-primary"><RefreshCw className={`h-3 w-3 ${resending ? "animate-spin" : ""}`} />{resending ? "Sending..." : "Resend code"}</button>}
          </p>
          <PillButton size="lg" fullWidth className="mt-6" loading={verifying} disabled={verifying} rightIcon={<ArrowRight className="h-4 w-4" />}>Verify</PillButton>
          {error && <p className="mt-3 text-center text-sm text-[color:var(--error)]">{error}</p>}
        </form>
      </div>
    </div>
  );
}
