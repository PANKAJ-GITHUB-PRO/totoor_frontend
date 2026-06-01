import { Link } from "@tanstack/react-router";
import { Home, MapPin, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import type { Tutor } from "@/lib/types";
import { RatingBadge } from "./RatingBreakdown";
import { Card, Tag } from "./Card";
import { Spinner } from "./Spinner";

export function TutorCard({ tutor }: { tutor: Tutor }) {
  const { role } = useSession();
  const [status, setStatus] = useState(tutor.requestStatus ?? null);
  const [busy, setBusy] = useState(false);
  const isConnected = Boolean(tutor.contactUnlocked) || status === "accepted";
  const isPending = status === "pending";
  const isRejected = status === "rejected";
  const hasRequest = isPending || isRejected || isConnected;

  useEffect(() => {
    setStatus(tutor.requestStatus ?? null);
  }, [tutor.id, tutor.requestStatus]);

  const sendRequest = async () => {
    if (hasRequest || busy) return;
    setBusy(true);
    try {
      const request = await api.createRequest(tutor.id);
      setStatus(request.status ?? "pending");
    } finally {
      setBusy(false);
    }
  };

  const statusLabel = isConnected
    ? "Connected"
    : isRejected
      ? "Rejected"
      : isPending
        ? "Request Sent"
        : null;

  return (
    <Card className="p-4 transition hover:shadow-card">
      <div className="flex gap-3">
        <Link to="/tutors/$id" params={{ id: tutor.id }} className="shrink-0">
          <img src={tutor.avatar} alt={tutor.name} className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-soft" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link to="/tutors/$id" params={{ id: tutor.id }} className="block hover:text-primary">
            <h3 className="truncate font-semibold leading-tight">{tutor.name}</h3>
          </Link>
          <p className="truncate text-xs text-muted-foreground">{tutor.headline}</p>
          {role === "student" && (
            <div className="mt-2">
              {hasRequest ? (
                <Tag tone={isConnected ? "success" : isRejected ? "warning" : "muted"}>{statusLabel}</Tag>
              ) : (
                <button
                  type="button"
                  onClick={sendRequest}
                  disabled={busy}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground disabled:opacity-60"
                >
                  {busy && <Spinner className="h-3 w-3" />}
                  Connect
                </button>
              )}
            </div>
          )}
          <div className="mt-2">
            <RatingBadge rating={tutor.rating} reviews={tutor.reviews} />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tutor.subjects.slice(0, 2).map((subject) => <Tag key={subject} tone="primary">{subject}</Tag>)}
            {tutor.online
              ? <Tag tone="accent"><Wifi className="mr-1 h-3 w-3" />Online</Tag>
              : <Tag tone="muted"><Home className="mr-1 h-3 w-3" />In-person</Tag>}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{tutor.city}</span>
            <span className="font-semibold text-foreground">Rs {tutor.pricePerHour}<span className="font-normal text-muted-foreground">/hr</span></span>
          </div>
        </div>
      </div>
    </Card>
  );
}
