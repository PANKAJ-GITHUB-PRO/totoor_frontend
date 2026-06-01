import { Link } from "@tanstack/react-router";
import { GraduationCap, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card, Tag } from "./Card";
import { formatIndiaDateDay } from "@/lib/datetime";
import { PillButton } from "./PillButton";
import { RatingBadge } from "./RatingBreakdown";

export type ConnectionRequestItem = {
  id: string;
  status: string;
  direction?: string;
  createdAt: string;
  studentId: string;
  tutorId: string;
  studentName: string;
  tutorName: string;
  studentAvatar: string;
  tutorAvatar: string;
  studentEducation?: string;
  studentGrade?: string;
  studentBio?: string;
  tutorHeadline?: string;
  tutorBio?: string;
  tutorEducation?: string;
  tutorExperienceYears?: number;
  tutorRating?: number;
  tutorReviews?: number;
  requirementSummary?: { id: string; title: string; budget: string; tags: string[] } | null;
  canRespond?: boolean;
};

export function ConnectionRequestCard({
  request,
  role,
  onAccept,
  onReject,
}: {
  request: ConnectionRequestItem;
  role: "student" | "tutor" | null;
  onAccept?: (id: string) => void | Promise<void>;
  onReject?: (id: string) => void | Promise<void>;
}) {
  const isTutor = role === "tutor";
  const otherId = isTutor ? request.studentId : request.tutorId;
  const otherName = isTutor ? request.studentName : request.tutorName;
  const otherAvatar = isTutor ? request.studentAvatar : request.tutorAvatar;
  const profileTo = isTutor ? "/profiles/$id" : "/tutors/$id";
  const label = request.direction === "sent" ? "Sent" : "Incoming";
  const canRespond = Boolean(request.canRespond);
  const statusLabel = request.status === "pending" ? "Pending Approval" : request.status === "accepted" ? "Accepted" : request.status === "rejected" ? "Rejected" : request.status;
  const [acting, setActing] = useState<"accept" | "reject" | null>(null);

  const handleAccept = async () => {
    if (!onAccept || acting) return;
    setActing("accept");
    try {
      await onAccept(request.id);
    } finally {
      setActing(null);
    }
  };

  const handleReject = async () => {
    if (!onReject || acting) return;
    setActing("reject");
    try {
      await onReject(request.id);
    } finally {
      setActing(null);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <img src={otherAvatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-background" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold leading-tight">{otherName}</p>
            <Tag tone={isTutor ? "accent" : "primary"}>{isTutor ? "Student" : "Tutor"}</Tag>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{label} · {formatIndiaDateDay(request.createdAt)}</p>
          {isTutor && request.studentEducation && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <GraduationCap className="h-3 w-3 shrink-0" />
              <span className="truncate">{request.studentEducation || request.studentGrade}</span>
            </p>
          )}
          {!isTutor && request.tutorHeadline && (
            <p className="mt-1 truncate text-xs text-muted-foreground">{request.tutorHeadline}</p>
          )}
          {!isTutor && typeof request.tutorRating === "number" && request.tutorRating > 0 && (
            <div className="mt-1"><RatingBadge rating={request.tutorRating} reviews={request.tutorReviews ?? 0} /></div>
          )}
          {isTutor && request.requirementSummary && (
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
              Requirement: {request.requirementSummary.title}
              {request.requirementSummary.budget ? ` · ${request.requirementSummary.budget}` : ""}
            </p>
          )}
        </div>
        <Tag tone={request.status === "rejected" ? "warning" : request.status === "accepted" ? "success" : "muted"}>
          {statusLabel}
        </Tag>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link to={profileTo} params={{ id: otherId }} className="inline-flex h-8 items-center gap-1 rounded-full border border-border bg-card px-3 text-xs font-medium">
          View Full Profile <ChevronRight className="h-3.5 w-3.5" />
        </Link>
        {canRespond && onAccept && onReject && (
          <>
            <PillButton variant="outline" size="sm" loading={acting === "reject"} disabled={Boolean(acting)} onClick={handleReject}>Reject</PillButton>
            <PillButton size="sm" loading={acting === "accept"} disabled={Boolean(acting)} onClick={handleAccept}>Accept</PillButton>
          </>
        )}
      </div>

      {request.direction === "sent" && request.status === "pending" && (
        <p className="mt-2 text-[11px] text-muted-foreground">Request Sent — waiting for approval.</p>
      )}
    </Card>
  );
}

export function ConnectionListCard({
  request,
  role,
}: {
  request: ConnectionRequestItem;
  role: "student" | "tutor" | null;
}) {
  const isTutor = role === "tutor";
  const otherId = isTutor ? request.studentId : request.tutorId;
  const otherName = isTutor ? request.studentName : request.tutorName;
  const otherAvatar = isTutor ? request.studentAvatar : request.tutorAvatar;
  const profileTo = isTutor ? "/profiles/$id" : "/tutors/$id";
  const intro = isTutor
    ? request.studentBio || request.studentEducation || request.studentGrade
    : request.tutorHeadline || request.tutorBio;

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <img src={otherAvatar} alt="" className="h-12 w-12 shrink-0 rounded-2xl object-cover ring-2 ring-background" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold">{otherName}</p>
            <Tag tone={isTutor ? "accent" : "primary"}>{isTutor ? "Student" : "Tutor"}</Tag>
            <Tag tone="success">Connected</Tag>
          </div>
          {!isTutor && typeof request.tutorRating === "number" && request.tutorRating > 0 && (
            <div className="mt-1"><RatingBadge rating={request.tutorRating} reviews={request.tutorReviews ?? 0} /></div>
          )}
          {!isTutor && typeof request.tutorExperienceYears === "number" && request.tutorExperienceYears > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">{request.tutorExperienceYears} yrs experience</p>
          )}
          {intro && <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{intro}</p>}
        </div>
      </div>
      <Link to={profileTo} params={{ id: otherId }} className="mt-3 inline-flex h-8 items-center gap-1 rounded-full border border-border bg-card px-3 text-xs font-medium">
        View Full Profile <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </Card>
  );
}
