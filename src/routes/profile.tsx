import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, ChevronRight, Star, BookMarked, Users, MessageCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageContent } from "@/components/layout/StickySubheader";
import { EducationSelect } from "@/components/forms/EducationSelect";
import { LocationFields } from "@/components/forms/LocationFields";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { Card, Tag } from "@/components/ui-kit/Card";
import { SkeletonStatsRow } from "@/components/ui-kit/Skeletons";
import { PillButton } from "@/components/ui-kit/PillButton";
import { Field, Input, Textarea } from "@/components/ui-kit/Field";
import { useSession } from "@/lib/session";
import { api } from "@/lib/api";
import { formatIndianMobile, validateIndianMobile } from "@/lib/contact";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const { name, email, role, signOut, completeOnboarding } = useSession();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    name: name ?? "", phone: "", whatsapp: "", education: "", customEducation: "", grade: "",
    headline: "", bio: "", skills: "", subjects: "", state: "Karnataka", district: "Bengaluru Urban", city: "Bangalore", pincode: "560001"
  });
  const [stats, setStats] = useState({ posts: 0, requests: 0, sentRequests: 0, bids: 0, connections: 0, rating: null as number | null, reviews: null as number | null });
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.me().then((me) => setProfile({
      name: me.name ?? "", phone: me.phone ?? "", whatsapp: me.whatsapp ?? "",
      education: me.education ?? "", customEducation: me.customEducation ?? "", grade: me.grade ?? "",
      headline: me.headline ?? "", bio: me.bio ?? "",
      skills: (me.skills ?? []).join(", "), subjects: (me.subjects ?? []).join(", "),
      state: me.state ?? me.location?.state ?? "Karnataka",
      district: me.district ?? me.location?.district ?? "Bengaluru Urban",
      city: me.city ?? me.location?.city ?? "Bangalore",
      pincode: me.pincode ?? me.location?.pincode ?? "560001"
    })).catch(() => undefined);
    api.meStats().then(setStats).catch(() => undefined).finally(() => setStatsLoading(false));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateIndianMobile(profile.phone) || !validateIndianMobile(profile.whatsapp)) {
      setError("Enter valid 10-digit Indian phone and WhatsApp numbers.");
      return;
    }
    setSaving(true);
    try {
      await completeOnboarding({
        name: profile.name,
        phone: formatIndianMobile(profile.phone),
        whatsapp: formatIndianMobile(profile.whatsapp),
        education: profile.education,
        customEducation: profile.customEducation,
        grade: profile.grade,
        headline: profile.headline,
        bio: profile.bio,
        skills: profile.skills.split(",").map((s) => s.trim()).filter(Boolean),
        subjects: profile.subjects.split(",").map((s) => s.trim()).filter(Boolean),
        location: { state: profile.state, district: profile.district || profile.city, city: profile.city, pincode: profile.pincode }
      });
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Profile">
      <PageContent>
      <Card variant="floating" className="overflow-hidden">
        <div className="bg-brand-gradient h-20" />
        <div className="-mt-10 px-5 pb-5">
          <div className="h-20 w-20 rounded-2xl bg-card ring-4 ring-card shadow-soft grid place-items-center text-2xl font-bold text-primary">
            {(name ?? "U")[0]}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h1 className="min-w-0 break-words text-xl font-bold">{name ?? "Your name"}</h1>
            <Tag tone="primary">{role === "tutor" ? "Tutor" : role ?? "Member"}</Tag>
          </div>
          <p className="break-words text-sm text-muted-foreground">{email ?? "-"}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <PillButton variant="outline" size="sm" onClick={() => setOpen(true)}>Edit profile</PillButton>
          </div>
        </div>
      </Card>

      <div className="mt-4">
        {statsLoading ? (
          <SkeletonStatsRow count={3} />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {(role === "tutor" ? [
              { i: Star, l: "Rating", v: stats.rating ? stats.rating.toFixed(1) : "-" },
              { i: BookMarked, l: "Posts", v: String(stats.posts) },
              { i: Users, l: "Connections", v: String(stats.connections) },
            ] : [
              { i: BookMarked, l: "Posts", v: String(stats.posts) },
              { i: MessageCircle, l: "Sent", v: String(stats.sentRequests) },
              { i: Users, l: "Connections", v: String(stats.connections) },
            ]).map(({ i: Icon, l, v }) => (
              <Card key={l} className="p-3 text-center">
                <Icon className="mx-auto h-4 w-4 text-primary" />
                <div className="mt-1 text-base font-bold">{v}</div>
                <div className="text-[11px] text-muted-foreground">{l}</div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-2">
        {[
          { to: "/my-posts", label: "My Posts" },
          { to: "/requests", label: "Connection requests" },
          { to: "/connections", label: "Connections" },
          { to: "/bids", label: role === "tutor" ? "Bid history" : "Bid requests" },
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
      </PageContent>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-foreground/30" onClick={() => setOpen(false)}>
          <form onSubmit={save} className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-background p-5 shadow-floating sm:mx-auto sm:max-w-screen-sm sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 border-b border-border pb-4">
              <h3 className="font-semibold">Edit profile</h3>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{email ?? "Update your Tudoor profile"}</p>
            </div>
            <div className="grid gap-3">
              <Field label="Name"><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></Field>
              {role === "student" ? (
                <EducationSelect label="Current education" value={profile.grade} onChange={(value) => setProfile({ ...profile, grade: value, education: value, customEducation: value })} />
              ) : (
                <>
                  <Field label="Headline"><Input value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} /></Field>
                  <Field label="About"><Textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></Field>
                  <EducationSelect label="Education" value={profile.education} onChange={(value) => setProfile({ ...profile, education: value, customEducation: value })} />
                  <Field label="Subjects"><Input value={profile.subjects} onChange={(e) => setProfile({ ...profile, subjects: e.target.value })} placeholder="Mathematics, Physics" /></Field>
                  <Field label="Skills"><Input value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} placeholder="JEE, Algebra" /></Field>
                </>
              )}
              <PhoneInput label="Contact number" value={profile.phone} onChange={(value) => setProfile({ ...profile, phone: value })} />
              <PhoneInput label="WhatsApp number" value={profile.whatsapp} onChange={(value) => setProfile({ ...profile, whatsapp: value })} icon={<MessageCircle className="h-4 w-4" />} />
              <LocationFields value={profile} onChange={(location) => setProfile({ ...profile, ...location })} />
              {error && <p className="text-sm text-[color:var(--error)]">{error}</p>}
              <div className="mt-1 border-t border-border pt-4">
                <PillButton fullWidth size="lg" loading={saving} disabled={saving}>Save</PillButton>
              </div>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}
