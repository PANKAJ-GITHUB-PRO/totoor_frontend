import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Plus, TrendingUp, Calendar, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, Tag, Chip } from "@/components/ui-kit/Card";
import { PillButton } from "@/components/ui-kit/PillButton";
import { TuddorCard } from "@/components/ui-kit/TuddorCard";
import { useSession } from "@/lib/session";
import { TUDDORS, FEED } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const { role, name } = useSession();
  const isTuddor = role === "tuddor";

  return (
    <AppShell showBell>
      <div className="rounded-3xl bg-brand-gradient p-5 text-white shadow-glow">
        <p className="text-xs opacity-80">{isTuddor ? "Tuddor dashboard" : "Welcome back"}</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight">Hi {name ?? (isTuddor ? "Tuddor" : "learner")} 👋</h1>
        <p className="mt-1 text-sm opacity-90">
          {isTuddor ? "3 new student requests today." : "Find your next Tuddor in seconds."}
        </p>
        <Link to="/search" className="mt-4 flex h-12 items-center gap-2 rounded-full bg-white/95 px-4 text-sm text-foreground">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Search subjects, Tuddors…</span>
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          { i: TrendingUp, l: isTuddor ? "Bids" : "Posts", v: isTuddor ? "12" : "3" },
          { i: Calendar, l: "Sessions", v: "4" },
          { i: Users, l: isTuddor ? "Students" : "Tuddors", v: isTuddor ? "28" : "6" },
        ].map(({ i: Icon, l, v }) => (
          <Card key={l} className="p-3 text-center">
            <Icon className="mx-auto h-4 w-4 text-primary" />
            <div className="mt-1 text-lg font-bold">{v}</div>
            <div className="text-[11px] text-muted-foreground">{l}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        {isTuddor ? (
          <>
            <Link to="/bids" className="flex-1"><PillButton variant="primary" fullWidth>Manage bids</PillButton></Link>
            <Link to="/feed" className="flex-1"><PillButton variant="outline" fullWidth leftIcon={<Plus className="h-4 w-4" />}>Post</PillButton></Link>
          </>
        ) : (
          <>
            <Link to="/search" className="flex-1"><PillButton variant="primary" fullWidth>Find Tuddors</PillButton></Link>
            <Link to="/feed" className="flex-1"><PillButton variant="outline" fullWidth leftIcon={<Plus className="h-4 w-4" />}>Post requirement</PillButton></Link>
          </>
        )}
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">{isTuddor ? "Student requirements" : "Nearby Tuddors"}</h2>
          <Link to="/search" className="text-xs font-medium text-primary">See all</Link>
        </div>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 no-scrollbar">
          {["All", "Online", "Nearby", "Top rated"].map((c, i) => <Chip key={c} active={i === 0}>{c}</Chip>)}
        </div>
        <div className="mt-3 grid gap-3">
          {TUDDORS.slice(0, 3).map((t) => <TuddorCard key={t.id} t={t} />)}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">From the feed</h2>
          <Link to="/feed" className="text-xs font-medium text-primary">Open</Link>
        </div>
        <div className="grid gap-3">
          {FEED.slice(0, 2).map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-center gap-2">
                <img src={p.authorAvatar} className="h-8 w-8 rounded-full" alt="" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.authorName}</p>
                  <p className="text-xs text-muted-foreground">{p.createdAt}</p>
                </div>
                <Tag tone={p.kind === "requirement" ? "warning" : "primary"}>{p.kind}</Tag>
              </div>
              <p className="mt-2 text-sm font-medium">{p.title}</p>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
