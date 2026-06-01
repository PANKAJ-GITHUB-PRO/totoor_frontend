import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  ArrowRight,
  Search,
  Users,
  Sparkles,
  GraduationCap,
  MessageCircle,
  FileText,
  HandCoins,
  Shield,
  MapPin,
  Star,
  Wifi,
  Home,
  UserPlus,
  LayoutGrid,
  CheckCircle2,
} from "lucide-react";
import { PillButton } from "@/components/ui-kit/PillButton";
import { Card, Tag } from "@/components/ui-kit/Card";
import { Logo } from "@/components/ui-kit/Logo";
import { AppDownloadSection } from "@/components/pwa/AppDownloadSection";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tudoor — Learn beautifully" },
      { name: "description", content: "Find expert tutors near you. Post requirements, receive bids, connect safely — a modern education marketplace for India." },
      { property: "og:title", content: "Tudoor — Learn beautifully" },
      { property: "og:description", content: "Modern education marketplace for students and tutors across India." },
    ],
  }),
  component: Landing,
});

const MODES = [
  { icon: Wifi, label: "Online" },
  { icon: Users, label: "One-to-one" },
  { icon: GraduationCap, label: "Group classes" },
  { icon: Home, label: "Home tuition" },
];

const STEPS = [
  { n: "1", title: "Create your profile", desc: "Sign up as a student or tutor in under a minute with OTP." },
  { n: "2", title: "Discover or post", desc: "Search by subject & pincode, or post a learning requirement." },
  { n: "3", title: "Connect & learn", desc: "Send requests, accept bids, unlock contact — start teaching." },
];

const STUDENT_FEATURES = [
  "Browse tutors by subject, city, pincode & budget",
  "Post requirement posts and receive tutor bids",
  "Send connection requests from feed & search",
  "Contact unlocks only after tutor approval",
  "Rate tutors once after you're connected",
];

const TUTOR_FEATURES = [
  "Build a rich profile with subjects, skills & modes",
  "Browse student requirements and place bids",
  "Announce classes on the community feed",
  "Manage connection requests in one dashboard",
  "Get discovered across your city & online",
];

const PLATFORM_FEATURES = [
  { icon: LayoutGrid, title: "Community feed", desc: "General posts, tutor announcements & requirement listings — role-based and clean." },
  { icon: FileText, title: "Requirement posts", desc: "Students describe what they need; tutors respond with competitive hourly bids." },
  { icon: HandCoins, title: "Bid management", desc: "Compare offers, accept the best fit, and track bid history from your dashboard." },
  { icon: UserPlus, title: "Connection requests", desc: "Separate from bids — request, approve, or reject before anyone sees your number." },
  { icon: Search, title: "Smart search", desc: "Filter tutors & students by location, mode, subject, rating, and price range." },
  { icon: Star, title: "Trusted ratings", desc: "Honest reviews from connected students — one rating per tutor, always visible." },
];

function Landing() {
  const navigate = useNavigate();
  const { onboarded } = useSession();
  useEffect(() => {
    if (onboarded) navigate({ to: "/dashboard" });
  }, [onboarded, navigate]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-md items-center justify-between px-5 py-4">
          <Logo size="md" to="/" />
          <div className="flex items-center gap-2">
            <Link to="/auth/login" search={{ redirect: "/search" }} className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline">Find tutors</Link>
            <Link to="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Log in</Link>
            <Link to="/auth/register">
              <PillButton size="sm">Sign up</PillButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-screen-md px-5 pt-8 pb-10">
        <Tag tone="primary"><Sparkles className="mr-1 h-3 w-3" /> India's tutoring marketplace</Tag>
        <h1 className="mt-4 text-[40px] leading-[1.05] font-bold tracking-tight md:text-6xl">
          Learn <span className="text-brand-gradient">beautifully.</span><br />
          Teach freely.
        </h1>
        <p className="mt-4 max-w-prose text-base text-muted-foreground md:text-lg">
          Tudoor connects students with verified tutors across India — search locally,
          post requirements, receive bids, and unlock contact only when both sides agree.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/auth/register">
            <PillButton size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>Get started free</PillButton>
          </Link>
          <Link to="/auth/login" search={{ redirect: "/search" }}>
            <PillButton size="lg" variant="outline" leftIcon={<Search className="h-4 w-4" />}>Browse tutors</PillButton>
          </Link>
        </div>

        <AppDownloadSection />

        <div className="mt-6 flex flex-wrap gap-2">
          {MODES.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-primary" />{label}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-screen-md px-5 pb-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { n: "2 roles", l: "Student & tutor" },
            { n: "4 modes", l: "Online to home" },
            { n: "Bids", l: "On requirements" },
            { n: "Private", l: "Contact unlock" },
          ].map(({ n, l }) => (
            <Card key={l} className="py-4 text-center">
              <div className="text-lg font-bold leading-tight">{n}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{l}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-surface/50 py-12">
        <div className="mx-auto max-w-screen-md px-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">How it works</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">Three steps to your first session</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {STEPS.map(({ n, title, desc }) => (
              <Card key={n} className="relative p-4">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-white">{n}</span>
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Students vs Tutors */}
      <section className="mx-auto max-w-screen-md px-5 py-12">
        <h2 className="text-2xl font-bold tracking-tight">Built for both sides</h2>
        <p className="mt-1 text-sm text-muted-foreground">Whether you're looking to learn or earn — Tudoor has you covered.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary"><GraduationCap className="h-5 w-5" /></span>
              <div>
                <h3 className="font-semibold">For students</h3>
                <div className="mt-1"><Tag tone="primary">Find help fast</Tag></div>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {STUDENT_FEATURES.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/auth/register" className="mt-5 inline-block">
              <PillButton size="sm" variant="outline" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>Join as student</PillButton>
            </Link>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent"><Users className="h-5 w-5" /></span>
              <div>
                <h3 className="font-semibold">For tutors</h3>
                <div className="mt-1"><Tag tone="accent">Grow your reach</Tag></div>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {TUTOR_FEATURES.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/auth/register" className="mt-5 inline-block">
              <PillButton size="sm" variant="outline" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>Join as tutor</PillButton>
            </Link>
          </Card>
        </div>
      </section>

      {/* Platform features */}
      <section className="border-t border-border bg-surface/30 py-12">
        <div className="mx-auto max-w-screen-md px-5">
          <h2 className="text-2xl font-bold tracking-tight">Everything in one app</h2>
          <p className="mt-1 text-sm text-muted-foreground">Feed, search, bids, connections & profiles — no scattered WhatsApp groups.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {PLATFORM_FEATURES.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-screen-md px-5 py-12">
        <Card variant="floating" className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary"><Shield className="h-6 w-6" /></span>
            <div>
              <h2 className="text-xl font-bold">Your privacy comes first</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Phone numbers and WhatsApp stay hidden until a connection request or bid is accepted.
                No spam, no random calls — you control who reaches you.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Tag tone="muted"><MessageCircle className="mr-1 h-3 w-3" />OTP login</Tag>
                <Tag tone="muted"><MapPin className="mr-1 h-3 w-3" />India pincode search</Tag>
                <Tag tone="muted"><Shield className="mr-1 h-3 w-3" />KYC for tutors</Tag>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-screen-md px-5 pb-16">
        <Card variant="floating" className="overflow-hidden">
          <div className="bg-brand-gradient p-6 text-white sm:p-8">
            <h2 className="text-2xl font-bold leading-tight sm:text-3xl">Ready to start learning or teaching?</h2>
            <p className="mt-2 max-w-md text-sm opacity-90 leading-relaxed">
              Create your free account in seconds. Pick student or tutor, complete your profile, and explore Tudoor today.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/auth/register"><PillButton variant="secondary" size="lg">Create account</PillButton></Link>
              <Link to="/auth/login"><PillButton variant="ghost" size="lg" className="bg-white/10 text-white hover:bg-white/20">Log in</PillButton></Link>
            </div>
          </div>
        </Card>

        <footer className="mt-10 flex flex-col items-center gap-3 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          <Logo size="sm" to="/" showText />
          <p>Made for learners & educators across India.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/auth/login" search={{ redirect: "/search" }} className="hover:text-foreground">Find tutors</Link>
            <Link to="/auth/register" className="hover:text-foreground">Sign up</Link>
            <Link to="/auth/login" className="hover:text-foreground">Log in</Link>
          </div>
        </footer>
      </section>
    </div>
  );
}
