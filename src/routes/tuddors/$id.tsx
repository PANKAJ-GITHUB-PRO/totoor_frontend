import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Star, MapPin, GraduationCap, Briefcase, Check } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, Tag } from "@/components/ui-kit/Card";
import { PillButton } from "@/components/ui-kit/PillButton";
import { ContactUnlock } from "@/components/ui-kit/ContactUnlock";
import { TUDDORS } from "@/lib/mock-data";

export const Route = createFileRoute("/tuddors/$id")({
  component: TuddorProfile,
  notFoundComponent: () => <div className="p-8 text-center">Tuddor not found</div>,
  errorComponent: ({ error }) => <div className="p-8 text-center text-sm">{error.message}</div>,
  loader: ({ params }) => {
    const t = TUDDORS.find((x) => x.id === params.id);
    if (!t) throw notFound();
    return t;
  },
});

function TuddorProfile() {
  const t = Route.useLoaderData();
  const [requested, setRequested] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  return (
    <AppShell back="/search" showBell>
      <Card variant="floating" className="overflow-hidden">
        <div className="bg-brand-gradient h-24" />
        <div className="-mt-10 px-5 pb-5">
          <img src={t.avatar} alt={t.name} className="h-20 w-20 rounded-2xl object-cover ring-4 ring-card shadow-soft" />
          <h1 className="mt-3 text-xl font-bold">{t.name}</h1>
          <p className="text-sm text-muted-foreground">{t.headline}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-[oklch(0.78_0.16_75)] text-[oklch(0.78_0.16_75)]" />{t.rating} ({t.reviews})</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{t.city}</span>
            <span className="font-semibold text-foreground">₹{t.pricePerHour}/hr</span>
          </div>
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <h2 className="text-sm font-semibold">About</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.bio}</p>
        <div className="mt-4 grid gap-3 text-sm">
          <Row icon={<GraduationCap className="h-4 w-4" />} label="Education" value={t.education} />
          <Row icon={<Briefcase className="h-4 w-4" />} label="Experience" value={`${t.experienceYears} years`} />
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <h2 className="text-sm font-semibold">Subjects & skills</h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {t.subjects.map((s) => <Tag key={s} tone="primary">{s}</Tag>)}
          {t.skills.map((s) => <Tag key={s} tone="muted">#{s}</Tag>)}
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <h2 className="text-sm font-semibold">Teaching modes</h2>
        <div className="mt-3 grid gap-2">
          {t.modes.map((m) => (
            <div key={m} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" /><span className="capitalize">{m.replace("-", " ")}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-4">
        <ContactUnlock unlocked={unlocked} phone={t.phone} whatsapp={t.whatsapp} />
      </div>

      <div className="sticky bottom-24 mt-6 flex gap-2 rounded-full bg-background/80 p-1 backdrop-blur-xl shadow-floating">
        <PillButton variant="outline" fullWidth onClick={() => setUnlocked(true)}>Simulate unlock</PillButton>
        <PillButton fullWidth onClick={() => setRequested(true)} disabled={requested}>
          {requested ? "Request sent" : "Send request"}
        </PillButton>
      </div>
    </AppShell>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
