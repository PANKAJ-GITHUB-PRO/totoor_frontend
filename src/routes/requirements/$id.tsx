import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageContent } from "@/components/layout/StickySubheader";
import { Card, Tag } from "@/components/ui-kit/Card";
import { PillButton } from "@/components/ui-kit/PillButton";
import { BidListCard } from "@/components/ui-kit/BidListCard";
import { MapPin, Wallet, Clock, TrendingUp, TrendingDown, Send } from "lucide-react";
import { SkeletonList } from "@/components/ui-kit/Skeletons";
import { api } from "@/lib/api";
import { formatIndiaDateDay } from "@/lib/datetime";
import { useSession } from "@/lib/session";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/requirements/$id")({
  component: RequirementDetails,
  pendingComponent: () => (
    <AppShell back="/feed" title="Requirement">
      <SkeletonList count={2} variant="card" />
    </AppShell>
  ),
  loader: async ({ params }) => {
    try {
      return await api.requirement(params.id);
    } catch {
      throw notFound();
    }
  },
  notFoundComponent: () => <div className="p-8 text-center">Requirement not found</div>,
  errorComponent: ({ error }) => <div className="p-8 text-center text-sm">{error.message}</div>,
});

function RequirementDetails() {
  const { post, bids, analytics } = Route.useLoaderData() as {
    post: any;
    bids: any[];
    analytics?: { bidCount: number; highestBid: number | null; lowestBid: number | null; latestBid: { price: number; createdAt: string; tutorName: string } | null };
  };
  const { role } = useSession();
  const [bidForm, setBidForm] = useState({ price: "", note: "" });
  const [items, setItems] = useState(bids);
  const [hasMyBid, setHasMyBid] = useState(Boolean(post.hasMyBid));
  const [myId, setMyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [bidBusy, setBidBusy] = useState(false);
  const canBid = role === "tutor" && post.authorRole === "student" && (post.status ?? "active") === "active" && !hasMyBid;
  const isOwner = Boolean(myId) && myId === post.authorId;

  useEffect(() => {
    api.me().then((me) => setMyId(me.id)).catch(() => undefined);
  }, []);

  useEffect(() => {
    setHasMyBid(Boolean(post.hasMyBid) || items.some((bid) => bid.tutorId === myId));
  }, [post.hasMyBid, items, myId]);

  const placeBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBidBusy(true);
    try {
      const bid = await api.createBid(post.id, { price: Number(bidForm.price), note: bidForm.note });
      setItems((current) => current.some((item) => item.id === bid.id) ? current : [bid, ...current]);
      setHasMyBid(true);
      setBidForm({ price: "", note: "" });
    } catch (err) {
      setError(err instanceof ApiError || err instanceof Error ? err.message : "Unable to place bid");
    } finally {
      setBidBusy(false);
    }
  };

  const updateBid = async (id: string, status: "accepted" | "rejected") => {
    const updated = await api.updateBid(id, status);
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...updated } : item));
  };

  return (
    <AppShell back="/feed" title="Requirement">
      <PageContent>
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <Link to="/profiles/$id" params={{ id: post.authorId }} className="shrink-0">
            <img src={post.authorAvatar} alt="" className="h-10 w-10 rounded-full" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link to="/profiles/$id" params={{ id: post.authorId }} className="font-semibold hover:text-primary">{post.authorName}</Link>
            <p className="text-xs text-muted-foreground">Student</p>
          </div>
          <Tag tone={post.status === "completed" ? "success" : post.status === "expired" ? "warning" : "muted"}>{post.status ?? "active"}</Tag>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <p className="text-xs text-muted-foreground">{formatIndiaDateDay(post.createdAt)}</p>
          {role === "tutor" && hasMyBid && (
            <Tag tone={post.myBidStatus === "accepted" ? "success" : post.myBidStatus === "rejected" ? "warning" : "primary"}>Bid placed</Tag>
          )}
        </div>

        {canBid && (
          <form onSubmit={placeBid} className="mt-3 grid gap-2">
            <input required className="h-12 rounded-xl border border-input bg-card px-4 text-sm outline-none" inputMode="numeric" placeholder="Your price per hour" value={bidForm.price} onChange={(e) => setBidForm({ ...bidForm, price: e.target.value })} />
            <input required className="h-12 rounded-xl border border-input bg-card px-4 text-sm outline-none" placeholder="Short note" value={bidForm.note} onChange={(e) => setBidForm({ ...bidForm, note: e.target.value })} />
            <PillButton fullWidth size="lg" loading={bidBusy} disabled={bidBusy}>Place Bid</PillButton>
            {error && <p className="text-sm text-[color:var(--error)]">{error}</p>}
          </form>
        )}
        {role === "tutor" && hasMyBid && !canBid && (
          <div className="mt-3 rounded-2xl border border-border bg-surface p-4 text-sm text-muted-foreground">
            Your bid is already recorded for this requirement.
          </div>
        )}

        <h1 className="mt-3 text-lg font-bold">{post.title}</h1>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{post.body}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((t: string) => <Tag key={t} tone="muted">#{t}</Tag>)}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
          {post.city && <Meta icon={<MapPin className="h-3 w-3" />} label={post.city} />}
          {post.budget && <Meta icon={<Wallet className="h-3 w-3" />} label={post.budget} />}
          {post.mode && <Meta icon={<Clock className="h-3 w-3" />} label={post.mode} />}
        </div>
      </Card>

      {(analytics?.bidCount ?? items.length) > 0 && (
        <Card className="mt-4 p-4">
          <h2 className="text-sm font-semibold">Bid analytics</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <Stat icon={<TrendingUp className="h-4 w-4 text-primary" />} label="Highest" value={analytics?.highestBid != null ? `Rs ${analytics.highestBid}/hr` : "-"} />
            <Stat icon={<TrendingDown className="h-4 w-4 text-primary" />} label="Lowest" value={analytics?.lowestBid != null ? `Rs ${analytics.lowestBid}/hr` : "-"} />
            <Stat icon={<Send className="h-4 w-4 text-primary" />} label="Total bids" value={String(analytics?.bidCount ?? items.length)} />
            <Stat icon={<Clock className="h-4 w-4 text-primary" />} label="Latest" value={analytics?.latestBid ? `Rs ${analytics.latestBid.price}/hr` : "-"} />
          </div>
          {analytics?.latestBid?.tutorName && (
            <p className="mt-2 text-xs text-muted-foreground">Latest from {analytics.latestBid.tutorName} · {formatIndiaDateDay(analytics.latestBid.createdAt)}</p>
          )}
        </Card>
      )}

      <h2 className="mt-6 mb-3 text-sm font-semibold">Bids ({items.length})</h2>
      <div className="grid gap-3">
        {items.map((b) => (
          isOwner ? (
            <BidListCard key={b.id} bid={b} role="student" onAccept={(id) => updateBid(id, "accepted")} onReject={(id) => updateBid(id, "rejected")} />
          ) : (
            <Card key={b.id} className="flex items-center gap-3 p-4">
              <Link to="/profiles/$id" params={{ id: b.tutorId }} className="shrink-0">
                <img src={b.tutorAvatar} alt="" className="h-10 w-10 rounded-full" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to="/tutors/$id" params={{ id: b.tutorId }} className="text-sm font-semibold hover:text-primary">{b.tutorName}</Link>
                <p className="text-xs text-muted-foreground">Rs {b.price}/hr · {b.note}</p>
              </div>
              <Tag tone={b.status === "accepted" ? "success" : "muted"}>{b.status}</Tag>
            </Card>
          )
        ))}
        {!items.length && <p className="py-6 text-center text-sm text-muted-foreground">No bids yet.</p>}
      </div>
      </PageContent>
    </AppShell>
  );
}

function Meta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex min-w-0 items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 text-muted-foreground">
      {icon}<span className="truncate capitalize">{label}</span>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon}{label}</div>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
