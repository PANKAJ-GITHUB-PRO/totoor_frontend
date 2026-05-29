import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, Search, Users, Sparkles, GraduationCap, MessageCircle } from "lucide-react";
import { PillButton } from "@/components/ui-kit/PillButton";
import { Card, Tag } from "@/components/ui-kit/Card";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tuddor — Learn beautifully" },
      { name: "description", content: "Find expert Tuddors near you. Learn online or in-person — a modern education marketplace." },
      { property: "og:title", content: "Tuddor — Learn beautifully" },
      { property: "og:description", content: "Modern education marketplace for students and Tuddors." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const { onboarded } = useSession();
  useEffect(() => {
    if (onboarded) navigate({ to: "/dashboard" });
  }, [onboarded, navigate]);

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-screen-md items-center justify-between px-5 py-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white font-bold shadow-glow">T</span>
          <span className="font-semibold tracking-tight">Tuddor</span>
        </Link>
        <Link to="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Log in</Link>
      </header>

      <section className="mx-auto max-w-screen-md px-5 pt-6 pb-12">
        <Tag tone="primary"><Sparkles className="mr-1 h-3 w-3" /> New · Tuddor 2.0</Tag>
        <h1 className="mt-4 text-[40px] leading-[1.05] font-bold tracking-tight md:text-6xl">
          Learn <span className="text-brand-gradient">beautifully.</span><br />
          Teach freely.
        </h1>
        <p className="mt-4 max-w-prose text-base text-muted-foreground md:text-lg">
          A premium education marketplace connecting students with verified Tuddors —
          online, one-to-one, in groups, or at home.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/auth/register">
            <PillButton size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>Get started</PillButton>
          </Link>
          <Link to="/search">
            <PillButton size="lg" variant="outline" leftIcon={<Search className="h-4 w-4" />}>Browse Tuddors</PillButton>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-3 text-center">
          {[
            ["12k+", "Tuddors"],
            ["64", "Subjects"],
            ["4.9★", "Avg rating"],
          ].map(([n, l]) => (
            <Card key={l} className="py-4">
              <div className="text-xl font-bold">{n}</div>
              <div className="text-xs text-muted-foreground">{l}</div>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {[
            { i: Search, t: "Search smart", d: "By subject, pincode, mode, or budget." },
            { i: Users, t: "Verified Tuddors", d: "KYC-checked profiles with reviews." },
            { i: MessageCircle, t: "Unlock & chat", d: "WhatsApp opens after approval." },
            { i: GraduationCap, t: "For every learner", d: "School, JEE, NEET, languages, coding." },
          ].map(({ i: Icon, t, d }) => (
            <Card key={t} className="p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-3 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </Card>
          ))}
        </div>

        <Card variant="floating" className="mt-10 overflow-hidden">
          <div className="bg-brand-gradient p-6 text-white">
            <h2 className="text-2xl font-bold leading-tight">Ready to start?</h2>
            <p className="mt-1 text-sm opacity-90">Join thousands learning the modern way.</p>
            <div className="mt-4 flex gap-2">
              <Link to="/auth/register"><PillButton variant="secondary">Create account</PillButton></Link>
              <Link to="/auth/login"><PillButton variant="ghost" className="bg-white/10 text-white hover:bg-white/20">Log in</PillButton></Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
