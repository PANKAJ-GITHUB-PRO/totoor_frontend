import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Settings, LogOut, ChevronRight, Star, Wallet, BookMarked } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, Tag } from "@/components/ui-kit/Card";
import { PillButton } from "@/components/ui-kit/PillButton";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const { name, email, role, signOut } = useSession();
  const navigate = useNavigate();

  return (
    <AppShell title="Profile">
      <Card variant="floating" className="overflow-hidden">
        <div className="bg-brand-gradient h-20" />
        <div className="-mt-10 px-5 pb-5">
          <div className="h-20 w-20 rounded-2xl bg-card ring-4 ring-card shadow-soft grid place-items-center text-2xl font-bold text-primary">
            {(name ?? "U")[0]}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <h1 className="text-xl font-bold">{name ?? "Your name"}</h1>
            <Tag tone="primary">{role ?? "Member"}</Tag>
          </div>
          <p className="text-sm text-muted-foreground">{email ?? "—"}</p>
          <div className="mt-4 flex gap-2">
            <PillButton variant="outline" size="sm">Edit profile</PillButton>
            <PillButton variant="ghost" size="sm">Share</PillButton>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { i: Star, l: "Rating", v: "4.9" },
          { i: BookMarked, l: "Sessions", v: "24" },
          { i: Wallet, l: "Earnings", v: "₹12k" },
        ].map(({ i: Icon, l, v }) => (
          <Card key={l} className="p-3 text-center">
            <Icon className="mx-auto h-4 w-4 text-primary" />
            <div className="mt-1 text-base font-bold">{v}</div>
            <div className="text-[11px] text-muted-foreground">{l}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-2">
        {[
          { to: "/bids", label: "Bid history" },
          { to: "/settings", label: "Settings" },
          { to: "/notifications", label: "Notifications" },
        ].map((r) => (
          <Link key={r.to} to={r.to}>
            <Card className="flex items-center justify-between p-4">
              <span className="font-medium">{r.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Card>
          </Link>
        ))}
      </div>

      <button onClick={() => { signOut(); navigate({ to: "/" }); }}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-medium text-[color:var(--error)]">
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </AppShell>
  );
}
