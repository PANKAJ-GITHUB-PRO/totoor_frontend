import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, Wallet, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageContent } from "@/components/layout/StickySubheader";
import { Card, Tag } from "@/components/ui-kit/Card";
import { PillButton } from "@/components/ui-kit/PillButton";
import { ContactUnlock } from "@/components/ui-kit/ContactUnlock";
import { RatingBadge } from "@/components/ui-kit/RatingBreakdown";
import { SkeletonBidDetail } from "@/components/ui-kit/Skeletons";
import { api } from "@/lib/api";
import { formatIndiaDateDay } from "@/lib/datetime";
import { useSession } from "@/lib/session";
import type { Bid } from "@/lib/types";
import { useState } from "react";

export const Route = createFileRoute("/bids/$id")({
  component: BidDetails,
  pendingComponent: () => (
    <AppShell title="Bid details" back="/bids">
      <SkeletonBidDetail />
    </AppShell>
  ),
  loader: async ({ params }) => {
    try {
      return await api.bid(params.id);
    } catch {
      throw notFound();
    }
  },
  notFoundComponent: () => <div className="p-8 text-center">Bid not found</div>,
});

function BidDetails() {
  const loaded = Route.useLoaderData() as Bid & {
    requirementBody?: string;
    requirementBudget?: string;
    requirementMode?: string;
    requirementCity?: string;
    requirementTags?: string[];
    tutorHeadline?: string;
    tutorRating?: number;
    tutorReviews?: number;
    tutorSubjects?: string[];
  };
  const [bid, setBid] = useState(loaded);
  const [acting, setActing] = useState<"accept" | "reject" | null>(null);
  const { role } = useSession();

  const update = async (status: "accepted" | "rejected") => {
    setActing(status === "accepted" ? "accept" : "reject");
    try {
      const updated = await api.updateBid(bid.id, status);
      setBid({ ...bid, ...updated });
    } finally {
      setActing(null);
    }
  };

  const isStudent = role === "student";

  return (
    <AppShell title="Bid details" back="/bids">
      <PageContent>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Link to={isStudent ? "/tutors/$id" : "/profiles/$id"} params={{ id: isStudent ? bid.tutorId : bid.studentId! }} className="shrink-0">
            <img src={isStudent ? bid.tutorAvatar : bid.studentAvatar} alt="" className="h-12 w-12 rounded-2xl object-cover ring-2 ring-background" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link to={isStudent ? "/tutors/$id" : "/profiles/$id"} params={{ id: isStudent ? bid.tutorId : bid.studentId! }} className="block font-semibold hover:text-primary">
              {isStudent ? bid.tutorName : bid.studentName}
            </Link>
            {isStudent && bid.tutorHeadline && (
              <p className="truncate text-xs text-muted-foreground">{bid.tutorHeadline}</p>
            )}
            {isStudent && (
              <div className="mt-1">
                <RatingBadge rating={bid.tutorRating ?? 0} reviews={bid.tutorReviews ?? 0} />
              </div>
            )}
          </div>
          <Tag tone={bid.status === "accepted" ? "success" : bid.status === "rejected" ? "warning" : "muted"}>{bid.status}</Tag>
        </div>
        {isStudent && bid.tutorEducation && (
          <p className="mt-2 text-xs text-muted-foreground">Education: {bid.tutorEducation}</p>
        )}
        {isStudent && typeof bid.tutorExperienceYears === "number" && bid.tutorExperienceYears > 0 && (
          <p className="text-xs text-muted-foreground">{bid.tutorExperienceYears} years experience</p>
        )}
        {isStudent && bid.tutorBio && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{bid.tutorBio}</p>
        )}
        {isStudent && (bid.tutorSubjects?.length ?? 0) > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {bid.tutorSubjects!.slice(0, 4).map((s) => <Tag key={s} tone="primary">{s}</Tag>)}
          </div>
        )}
        <Link to={isStudent ? "/tutors/$id" : "/profiles/$id"} params={{ id: isStudent ? bid.tutorId : bid.studentId! }} className="mt-3 inline-block text-xs font-medium text-primary">
          View full profile
        </Link>
      </Card>

      <Card className="mt-4 p-4">
        <p className="text-xs font-medium text-muted-foreground">Requirement</p>
        <h2 className="mt-1 text-base font-semibold">{bid.requirementTitle}</h2>
        {bid.requirementBody && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{bid.requirementBody}</p>}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(bid.requirementTags ?? []).map((t) => <Tag key={t} tone="muted">#{t}</Tag>)}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          {bid.requirementCity && <Meta icon={<MapPin className="h-3 w-3" />} label={bid.requirementCity} />}
          {bid.requirementBudget && <Meta icon={<Wallet className="h-3 w-3" />} label={bid.requirementBudget} />}
          {bid.requirementMode && <Meta icon={<Clock className="h-3 w-3" />} label={bid.requirementMode} />}
        </div>
        <Link to="/requirements/$id" params={{ id: bid.requirementId }} className="mt-3 inline-block text-xs font-medium text-primary">
          Open requirement post
        </Link>
      </Card>

      <Card className="mt-4 p-4">
        <p className="text-xs font-medium text-muted-foreground">Bid offer</p>
        <p className="mt-1 text-2xl font-bold">Rs {bid.price}<span className="text-sm font-normal text-muted-foreground">/hr</span></p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{bid.note}</p>
        <p className="mt-2 text-xs text-muted-foreground">Submitted {formatIndiaDateDay(bid.createdAt)}</p>
      </Card>

      {isStudent && bid.status === "pending" && (
        <div className="mt-4 flex gap-2">
          <PillButton variant="outline" fullWidth loading={acting === "reject"} disabled={Boolean(acting)} onClick={() => update("rejected")}>Reject bid</PillButton>
          <PillButton fullWidth loading={acting === "accept"} disabled={Boolean(acting)} onClick={() => update("accepted")}>Accept bid</PillButton>
        </div>
      )}

      {bid.status === "accepted" && (
        <div className="mt-4">
          <ContactUnlock
            unlocked={Boolean(bid.contactUnlocked)}
            phone={isStudent ? bid.tutorPhone ?? "" : bid.studentPhone ?? ""}
            whatsapp={isStudent ? bid.tutorWhatsapp ?? "" : bid.studentWhatsapp ?? ""}
            message={isStudent ? "Tutor contact unlocked after bid acceptance." : "Student contact unlocked after bid acceptance."}
          />
        </div>
      )}
      </PageContent>
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
