import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, Tag } from "@/components/ui-kit/Card";
import { PillButton } from "@/components/ui-kit/PillButton";
import { FEED, BIDS } from "@/lib/mock-data";
import { MapPin, Wallet, Clock } from "lucide-react";

export const Route = createFileRoute("/requirements/$id")({
  component: RequirementDetails,
  loader: ({ params }) => {
    const p = FEED.find((x) => x.id === params.id && x.kind === "requirement");
    if (!p) throw notFound();
    return { post: p, bids: BIDS.filter((b) => b.requirementId === p.id) };
  },
  notFoundComponent: () => <div className="p-8 text-center">Requirement not found</div>,
  errorComponent: ({ error }) => <div className="p-8 text-center text-sm">{error.message}</div>,
});

function RequirementDetails() {
  const { post, bids } = Route.useLoaderData();
  return (
    <AppShell back="/feed" title="Requirement">
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <img src={post.authorAvatar} alt="" className="h-10 w-10 rounded-full" />
          <div>
            <p className="font-semibold">{post.authorName}</p>
            <p className="text-xs text-muted-foreground">{post.createdAt}</p>
          </div>
        </div>
        <h1 className="mt-3 text-lg font-bold">{post.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{post.body}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((t) => <Tag key={t} tone="muted">#{t}</Tag>)}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          {post.city && <Meta icon={<MapPin className="h-3 w-3" />} label={post.city} />}
          {post.budget && <Meta icon={<Wallet className="h-3 w-3" />} label={post.budget} />}
          {post.mode && <Meta icon={<Clock className="h-3 w-3" />} label={post.mode} />}
        </div>
        <PillButton fullWidth size="lg" className="mt-5">Place a bid</PillButton>
      </Card>

      <h2 className="mt-6 mb-3 text-sm font-semibold">Bids ({bids.length})</h2>
      <div className="grid gap-2">
        {bids.map((b) => (
          <Card key={b.id} className="p-4 flex items-center gap-3">
            <img src={b.tuddorAvatar} alt="" className="h-10 w-10 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{b.tuddorName}</p>
              <p className="text-xs text-muted-foreground">₹{b.price}/hr · {b.note}</p>
            </div>
            <Tag tone={b.status === "accepted" ? "success" : "muted"}>{b.status}</Tag>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

function Meta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl bg-secondary px-3 py-2 inline-flex items-center gap-1.5 text-muted-foreground">
      {icon}<span className="capitalize truncate">{label}</span>
    </div>
  );
}
