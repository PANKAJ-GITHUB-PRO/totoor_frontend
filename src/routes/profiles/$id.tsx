import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, GraduationCap, Briefcase } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageContent } from "@/components/layout/StickySubheader";
import { Card, Tag } from "@/components/ui-kit/Card";
import { PostCard } from "@/components/ui-kit/PostCard";
import { RatingBreakdown } from "@/components/ui-kit/RatingBreakdown";
import { SkeletonList } from "@/components/ui-kit/Skeletons";
import { api } from "@/lib/api";

export const Route = createFileRoute("/profiles/$id")({
  component: PublicProfile,
  pendingComponent: () => (
    <AppShell title="Profile" back="/feed">
      <SkeletonList count={1} variant="profile" />
      <div className="mt-4"><SkeletonList count={2} variant="card" /></div>
    </AppShell>
  ),
  loader: async ({ params }) => {
    try {
      const [profile, posts] = await Promise.all([api.profile(params.id), api.userPosts(params.id)]);
      return { profile, posts };
    } catch {
      throw notFound();
    }
  },
  notFoundComponent: () => <div className="p-8 text-center">Profile not found</div>,
});

function PublicProfile() {
  const { profile, posts } = Route.useLoaderData();
  const isTutor = profile.role === "tutor";

  return (
    <AppShell title="Profile" back="/feed">
      <PageContent>
      <Card variant="floating" className="overflow-hidden">
        <div className="bg-brand-gradient h-20" />
        <div className="-mt-10 px-5 pb-5">
          <img src={profile.avatar} alt={profile.name} className="h-20 w-20 rounded-2xl object-cover ring-4 ring-card shadow-soft" />
          <div className="mt-3 flex items-center gap-2">
            <h1 className="text-xl font-bold">{profile.name}</h1>
            <Tag tone="primary">{isTutor ? "Tutor" : "Student"}</Tag>
          </div>
          <p className="text-sm text-muted-foreground">{isTutor ? profile.headline : profile.grade}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{profile.city}</span>
          </div>
        </div>
      </Card>

      {isTutor && (
        <div className="mt-4">
          <RatingBreakdown
            rating={profile.rating}
            total={profile.ratingTotal ?? profile.reviews}
            breakdown={profile.ratingBreakdown ?? { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }}
          />
        </div>
      )}

      <Card className="mt-4 p-4">
        <h2 className="text-sm font-semibold">Information</h2>
        {profile.bio && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>}
        <div className="mt-4 grid gap-3 text-sm">
          {profile.education && <Row icon={<GraduationCap className="h-4 w-4" />} label="Education" value={profile.education} />}
          {isTutor && <Row icon={<Briefcase className="h-4 w-4" />} label="Experience" value={`${profile.experienceYears ?? 0} years`} />}
        </div>
      </Card>

      {isTutor && (
        <Card className="mt-4 p-4">
          <h2 className="text-sm font-semibold">Subjects & skills</h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(profile.subjects ?? []).map((s: string) => <Tag key={s} tone="primary">{s}</Tag>)}
            {(profile.skills ?? []).map((s: string) => <Tag key={s} tone="muted">#{s}</Tag>)}
          </div>
          <Link to="/tutors/$id" params={{ id: profile.id }} className="mt-4 block text-sm font-medium text-primary">Open tutor profile</Link>
        </Card>
      )}

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">Posts</h2>
        <div className="grid gap-3">
          {posts.map((post: any) => <PostCard key={post.id} post={post} />)}
          {!posts.length && <p className="py-8 text-center text-sm text-muted-foreground">No visible posts yet.</p>}
        </div>
      </section>
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
