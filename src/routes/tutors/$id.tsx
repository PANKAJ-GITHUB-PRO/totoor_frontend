import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Star, MapPin, GraduationCap, Briefcase, Check } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageContent } from "@/components/layout/StickySubheader";
import { Card, Tag } from "@/components/ui-kit/Card";
import { PillButton } from "@/components/ui-kit/PillButton";
import { ContactUnlock } from "@/components/ui-kit/ContactUnlock";
import { RatingBreakdown } from "@/components/ui-kit/RatingBreakdown";
import { SkeletonList } from "@/components/ui-kit/Skeletons";
import { api } from "@/lib/api";
import { formatIndiaDateDay } from "@/lib/datetime";
import { requireAuth } from "@/lib/authRedirect";
import { useSession } from "@/lib/session";
import type { Tutor } from "@/lib/types";

export const Route = createFileRoute("/tutors/$id")({
  beforeLoad: ({ params }) => requireAuth(`/tutors/${params.id}`),
  component: TutorProfile,
  pendingComponent: () => (
    <AppShell back="/search">
      <SkeletonList count={1} variant="profile" />
      <div className="mt-4"><SkeletonList count={1} variant="card" /></div>
    </AppShell>
  ),
  notFoundComponent: () => <div className="p-8 text-center">Tutor not found</div>,
  errorComponent: ({ error }) => <div className="p-8 text-center text-sm">{error.message}</div>,
  loader: async ({ params }): Promise<Tutor> => {
    try {
      return await api.tutor(params.id);
    } catch {
      throw notFound();
    }
  },
});

function TutorProfile() {
  const loaded = Route.useLoaderData();
  const [tutor, setTutor] = useState(loaded);
  const [busy, setBusy] = useState(false);
  const [ratingBusy, setRatingBusy] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState({ stars: 5, review: "" });
  const { role } = useSession();

  const requestStatus = tutor.requestStatus ?? null;
  const hasRequest = Boolean(tutor.contactUnlocked) || requestStatus === "pending" || requestStatus === "accepted" || requestStatus === "rejected";
  const canConnect = role === "student" && !hasRequest;

  const sendRequest = async () => {
    if (!canConnect || busy) return;
    setBusy(true);
    setError("");
    try {
      const request = await api.createRequest(tutor.id);
      setTutor({ ...tutor, requestStatus: request.status ?? "pending" });
    } finally {
      setBusy(false);
    }
  };

  const submitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRatingBusy(true);
    try {
      const updated = await api.rateTutor(tutor.id, { stars: rating.stars, review: rating.review || undefined });
      setTutor({ ...tutor, ...updated, myRating: updated.myRating ?? { stars: rating.stars, review: rating.review, createdAt: "now" } });
      setRating({ stars: 5, review: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit rating");
    } finally {
      setRatingBusy(false);
    }
  };

  return (
    <AppShell back="/search">
      <PageContent>
      <Card variant="floating" className="overflow-hidden">
        <div className="bg-brand-gradient h-24" />
        <div className="-mt-10 px-5 pb-5">
          <img src={tutor.avatar} alt={tutor.name} className="h-20 w-20 rounded-2xl object-cover ring-4 ring-card shadow-soft" />
          <h1 className="mt-3 text-xl font-bold">{tutor.name}</h1>
          <p className="text-sm text-muted-foreground">{tutor.headline}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-[oklch(0.78_0.16_75)] text-[oklch(0.78_0.16_75)]" />{tutor.rating} ({tutor.reviews})</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{tutor.city}</span>
            <span className="font-semibold text-foreground">Rs {tutor.pricePerHour}/hr</span>
          </div>
          {role === "student" && (
            <div className="mt-4 flex gap-2 border-t border-border pt-4">
              <PillButton variant="outline" fullWidth disabled>{tutor.contactUnlocked ? "Contact unlocked" : "Contact hidden"}</PillButton>
              {canConnect ? (
                <PillButton fullWidth loading={busy} disabled={busy} onClick={sendRequest}>Connect</PillButton>
              ) : (
                <PillButton fullWidth disabled>
                  {tutor.contactUnlocked || requestStatus === "accepted"
                    ? "Connected"
                    : requestStatus === "rejected"
                      ? "Rejected"
                      : "Request Sent"}
                </PillButton>
              )}
            </div>
          )}
        </div>
      </Card>

      <div className="mt-4">
        <RatingBreakdown
          rating={tutor.rating}
          total={tutor.ratingTotal ?? tutor.reviews}
          breakdown={tutor.ratingBreakdown ?? { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }}
        />
      </div>

      <Card className="mt-4 p-4">
        <h2 className="text-sm font-semibold">About</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{tutor.bio}</p>
        <div className="mt-4 grid gap-3 text-sm">
          <Row icon={<GraduationCap className="h-4 w-4" />} label="Education" value={tutor.education} />
          <Row icon={<Briefcase className="h-4 w-4" />} label="Experience" value={`${tutor.experienceYears} years`} />
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <h2 className="text-sm font-semibold">Subjects & skills</h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tutor.subjects.map((s) => <Tag key={s} tone="primary">{s}</Tag>)}
          {tutor.skills.map((s) => <Tag key={s} tone="muted">#{s}</Tag>)}
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <h2 className="text-sm font-semibold">Teaching modes</h2>
        <div className="mt-3 grid gap-2">
          {tutor.modes.map((m) => (
            <div key={m} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" /><span className="capitalize">{m.replace("-", " ")}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-4">
        <ContactUnlock unlocked={Boolean(tutor.contactUnlocked)} phone={tutor.phone} whatsapp={tutor.whatsapp} />
      </div>

      {role === "student" && tutor.contactUnlocked && !tutor.myRating && (
        <Card className="mt-4 p-4">
          <h2 className="text-sm font-semibold">Rate tutor</h2>
          <form onSubmit={submitRating} className="mt-3 grid gap-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating({ ...rating, stars: star })} className={star <= rating.stars ? "text-[oklch(0.78_0.16_75)]" : "text-muted-foreground"}>
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
              <input value={rating.review} onChange={(e) => setRating({ ...rating, review: e.target.value })} className="h-11 rounded-xl border border-input bg-card px-3 text-sm outline-none" placeholder="Optional review" />
              {error && <p className="text-sm text-[color:var(--error)]">{error}</p>}
              <PillButton size="sm" loading={ratingBusy}>Submit rating</PillButton>
            </form>
        </Card>
      )}

      {role === "student" && tutor.contactUnlocked && tutor.myRating && (
        <Card className="mt-4 p-4">
          <h2 className="text-sm font-semibold">Your rating</h2>
          <div className="mt-3 space-y-2">
            <p className="text-xs text-muted-foreground">You have already rated this tutor.</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`h-5 w-5 ${star <= tutor.myRating!.stars ? "fill-[oklch(0.78_0.16_75)] text-[oklch(0.78_0.16_75)]" : "text-muted-foreground"}`} />
              ))}
            </div>
            {tutor.myRating.review && (
              <p className="text-sm text-muted-foreground leading-relaxed">"{tutor.myRating.review}"</p>
            )}
            <p className="text-[11px] text-muted-foreground">Rated on {formatIndiaDateDay(tutor.myRating.createdAt)}</p>
          </div>
        </Card>
      )}
      </PageContent>
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
