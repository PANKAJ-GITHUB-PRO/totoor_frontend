import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Bid } from "@/lib/types";
import { Card, Tag } from "./Card";
import { PillButton } from "./PillButton";
import { RatingBadge } from "./RatingBreakdown";

export function BidListCard({
  bid,
  role,
  onAccept,
  onReject,
}: {
  bid: Bid;
  role: "student" | "tutor" | null;
  onAccept?: (id: string) => void | Promise<void>;
  onReject?: (id: string) => void | Promise<void>;
}) {
  const otherName = role === "tutor" ? bid.studentName : bid.tutorName;
  const otherAvatar = role === "tutor" ? bid.studentAvatar : bid.tutorAvatar;
  const profileTo = role === "student" ? "/tutors/$id" : "/profiles/$id";
  const profileId = role === "student" ? bid.tutorId : bid.studentId!;
  const [acting, setActing] = useState<"accept" | "reject" | null>(null);

  const handleAccept = async () => {
    if (!onAccept || acting) return;
    setActing("accept");
    try {
      await onAccept(bid.id);
    } finally {
      setActing(null);
    }
  };

  const handleReject = async () => {
    if (!onReject || acting) return;
    setActing("reject");
    try {
      await onReject(bid.id);
    } finally {
      setActing(null);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <img src={otherAvatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-background" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">{otherName}</p>
          <p className="truncate text-xs text-muted-foreground">
            Rs {bid.price}/hr · {bid.requirementTitle ?? "Requirement bid"}
          </p>
          {role === "student" && bid.tutorHeadline && (
            <p className="mt-1 truncate text-xs text-muted-foreground">{bid.tutorHeadline}</p>
          )}
          {role === "student" && typeof bid.tutorRating === "number" && bid.tutorRating > 0 && (
            <div className="mt-1"><RatingBadge rating={bid.tutorRating} reviews={bid.tutorReviews ?? 0} /></div>
          )}
        </div>
        <Tag tone={bid.status === "accepted" ? "success" : bid.status === "rejected" ? "warning" : "muted"}>
          {bid.status}
        </Tag>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link to="/bids/$id" params={{ id: bid.id }} className="inline-flex h-8 items-center gap-1 rounded-full border border-border bg-card px-3 text-xs font-medium">
          View Details <ChevronRight className="h-3.5 w-3.5" />
        </Link>
        <Link to={profileTo} params={{ id: profileId }} className="inline-flex h-8 items-center rounded-full border border-border bg-card px-3 text-xs font-medium">
          View Profile
        </Link>
        {role === "student" && bid.status === "pending" && onAccept && onReject && (
          <>
            <PillButton variant="outline" size="sm" loading={acting === "reject"} disabled={Boolean(acting)} onClick={handleReject}>Reject</PillButton>
            <PillButton size="sm" loading={acting === "accept"} disabled={Boolean(acting)} onClick={handleAccept}>Accept</PillButton>
          </>
        )}
      </div>
    </Card>
  );
}
