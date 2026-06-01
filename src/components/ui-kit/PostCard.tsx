import { Heart, MessageCircle, MapPin, Send, Wallet, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { FeedPost } from "@/lib/types";
import { api } from "@/lib/api";
import { formatIndiaDateDay } from "@/lib/datetime";
import { useSession } from "@/lib/session";
import { Card, Tag } from "./Card";
import { Spinner } from "./Spinner";

const BODY_CLAMP = 160;

function requestStatusLabel(
  status: "pending" | "accepted" | "rejected",
  direction: "sent" | "incoming" | null | undefined
) {
  if (status === "accepted") return "Connected";
  if (status === "rejected") return "Rejected";
  return direction === "incoming" ? "Pending request" : "Request Sent";
}

export function PostCard({ post, onChange }: { post: FeedPost; onChange?: (post: FeedPost) => void }) {
  const [commenting, setCommenting] = useState(false);
  const [localPost, setLocalPost] = useState(post);
  const [comment, setComment] = useState("");
  const [likeBusy, setLikeBusy] = useState(false);
  const [connectBusy, setConnectBusy] = useState(false);
  const [commentBusy, setCommentBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { role } = useSession();
  const activePost = localPost.id === post.id ? localPost : post;
  const isReq = activePost.kind === "requirement";
  const isAnnouncement = activePost.kind === "announcement";
  const requestStatus = activePost.authorRequestStatus ?? null;
  const requestDirection = activePost.requestDirection ?? null;
  const hasRequest = Boolean(requestStatus);
  const hasMyBid = Boolean(activePost.hasMyBid);
  const canBid = role === "tutor" && isReq && activePost.authorRole === "student" && (activePost.status ?? "active") === "active" && !hasMyBid;
  const canConnect = role === "student" && isAnnouncement && activePost.authorRole === "tutor" && !hasRequest;
  const showIncomingRequests = role === "tutor" && (activePost.incomingRequestCount ?? 0) > 0;
  const bodyLong = activePost.body.length > BODY_CLAMP;

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  const like = async () => {
    setLikeBusy(true);
    try {
      const updated = await api.likePost(activePost.id);
      setLocalPost(updated);
      onChange?.(updated);
    } finally {
      setLikeBusy(false);
    }
  };

  const connect = async () => {
    if (hasRequest || connectBusy) return;
    setConnectBusy(true);
    try {
      const request = await api.createRequest(activePost.authorId);
      const next = {
        ...activePost,
        authorRequestStatus: (request.status ?? "pending") as FeedPost["authorRequestStatus"],
        requestDirection: "sent" as const,
      };
      setLocalPost(next);
      onChange?.(next);
    } finally {
      setConnectBusy(false);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setCommentBusy(true);
    try {
      const updated = await api.commentPost(activePost.id, comment.trim());
      setLocalPost(updated);
      onChange?.(updated);
      setComment("");
    } finally {
      setCommentBusy(false);
    }
  };

  const titleClass = "mt-3 break-words text-base font-semibold leading-snug";
  const showFooterAction = canBid || canConnect || hasRequest || hasMyBid || showIncomingRequests;

  return (
    <Card className="overflow-hidden p-4">
      <div className="flex items-start gap-3">
        <Link to="/profiles/$id" params={{ id: activePost.authorId }} className="shrink-0">
          <img src={activePost.authorAvatar} alt={activePost.authorName} className="h-10 w-10 rounded-full object-cover" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link to="/profiles/$id" params={{ id: activePost.authorId }} className="block truncate text-sm font-semibold hover:text-primary">{activePost.authorName}</Link>
          <p className="truncate text-xs text-muted-foreground">
            {activePost.authorRole === "tutor" ? "Tutor" : "Student"}
          </p>
        </div>
        {isReq ? (
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Tag tone="warning">Requirement</Tag>
            <Tag tone={activePost.status === "completed" ? "success" : activePost.status === "expired" ? "warning" : "muted"}>{activePost.status ?? "active"}</Tag>
          </div>
        ) : (
          <Tag tone={isAnnouncement ? "primary" : "accent"}>{isAnnouncement ? "Announcement" : "General"}</Tag>
        )}
      </div>

      <div className="mt-2 border-b border-border pb-3">
        <p className="text-xs text-muted-foreground">{formatIndiaDateDay(activePost.createdAt)}</p>
      </div>

      {isReq ? (
        <Link to="/requirements/$id" params={{ id: activePost.id }} className={`${titleClass} block hover:text-primary`}>
          {activePost.title}
        </Link>
      ) : (
        <h3 className={titleClass}>{activePost.title}</h3>
      )}

      <div className="mt-1">
        <p className={`whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground ${!expanded && bodyLong ? "line-clamp-3" : ""}`}>
          {activePost.body}
        </p>
        {bodyLong && (
          <button type="button" onClick={() => setExpanded((v) => !v)} className="mt-1 text-xs font-medium text-primary">
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {activePost.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {activePost.tags.map((t) => <Tag key={t} tone="muted"><span className="max-w-36 truncate">#{t}</span></Tag>)}
        </div>
      )}

      {isReq ? (
        <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          {activePost.city && (
            <span className="inline-flex min-w-0 items-center gap-1"><MapPin className="h-3 w-3 shrink-0" /><span className="truncate">{activePost.city}</span></span>
          )}
          {activePost.budget && (
            <span className="inline-flex min-w-0 items-center gap-1"><Wallet className="h-3 w-3 shrink-0" /><span className="truncate">{activePost.budget}</span></span>
          )}
          {typeof activePost.highestBid === "number" && (
            <span className="truncate">Top bid: Rs {activePost.highestBid}/hr</span>
          )}
          <span className="inline-flex items-center gap-1"><Send className="h-3 w-3 shrink-0" />{activePost.bidCount ?? 0} bids</span>
        </div>
      ) : activePost.city ? (
        <div className="mt-3 text-xs text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1"><MapPin className="h-3 w-3 shrink-0" /><span className="truncate">{activePost.city}</span></span>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <button disabled={likeBusy} onClick={like} className="inline-flex h-9 min-w-16 items-center justify-center gap-1.5 rounded-full bg-surface px-3 hover:text-foreground disabled:opacity-60">
            {likeBusy ? <Spinner className="h-3.5 w-3.5" /> : <Heart className="h-4 w-4 shrink-0" />}{activePost.likes}
          </button>
          <button onClick={() => setCommenting(true)} className="inline-flex h-9 min-w-16 items-center justify-center gap-1.5 rounded-full bg-surface px-3 hover:text-foreground">
            <MessageCircle className="h-4 w-4 shrink-0" />{activePost.comments}
          </button>
        </div>
        {showFooterAction && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {canBid && (
              <Link to="/requirements/$id" params={{ id: activePost.id }} className="inline-flex h-9 items-center rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground">
                Place Bid
              </Link>
            )}
            {canConnect && (
              <button type="button" disabled={connectBusy} onClick={connect} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground disabled:opacity-60">
                {connectBusy && <Spinner className="h-3 w-3" />}
                Connect
              </button>
            )}
            {hasRequest && requestStatus && (
              <Tag tone={requestStatus === "accepted" ? "success" : requestStatus === "rejected" ? "warning" : "muted"}>
                {requestStatusLabel(requestStatus, requestDirection)}
              </Tag>
            )}
            {hasMyBid && (
              <Link to="/requirements/$id" params={{ id: activePost.id }}>
                <Tag tone={activePost.myBidStatus === "accepted" ? "success" : activePost.myBidStatus === "rejected" ? "warning" : "primary"}>
                  Bid placed
                </Tag>
              </Link>
            )}
            {showIncomingRequests && (
              <Link to="/requests">
                <Tag tone="accent">{activePost.incomingRequestCount} pending</Tag>
              </Link>
            )}
          </div>
        )}
      </div>

      {commenting && <CommentSheet post={activePost} comment={comment} setComment={setComment} busy={commentBusy} onClose={() => setCommenting(false)} onSubmit={submitComment} />}
    </Card>
  );
}

function CommentSheet({
  post,
  comment,
  setComment,
  busy,
  onClose,
  onSubmit,
}: {
  post: FeedPost;
  comment: string;
  setComment: (v: string) => void;
  busy: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-foreground/30" onClick={onClose}>
      <div className="flex max-h-[88vh] w-full flex-col rounded-t-3xl bg-background p-5 shadow-floating sm:mx-auto sm:max-w-screen-sm sm:rounded-3xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold">Comments</h3>
            <p className="truncate text-xs text-muted-foreground">{post.title}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-card"><X className="h-5 w-5" /></button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {(post.commentItems ?? []).map((item) => (
            <div key={item.id} className="flex gap-3">
              <Link to="/profiles/$id" params={{ id: item.authorId }} className="shrink-0">
                <img src={item.authorAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              </Link>
              <div className="min-w-0 flex-1 rounded-2xl bg-surface px-3 py-2">
                <Link to="/profiles/$id" params={{ id: item.authorId }} className="block truncate text-sm font-semibold hover:text-primary">{item.authorName}</Link>
                <p className="break-words text-sm text-muted-foreground">{item.body}</p>
              </div>
            </div>
          ))}
          {!post.commentItems?.length && <p className="py-8 text-center text-sm text-muted-foreground">No comments yet.</p>}
        </div>
        <form onSubmit={onSubmit} className="mt-4 flex gap-2 border-t border-border pt-4">
          <input value={comment} onChange={(e) => setComment(e.target.value)} className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-card px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15" placeholder="Add a comment" />
          <button disabled={busy} className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground disabled:opacity-60">
            {busy && <Spinner className="h-3 w-3" />}
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
