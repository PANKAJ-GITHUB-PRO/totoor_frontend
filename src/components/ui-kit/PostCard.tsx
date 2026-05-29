import { Heart, MessageCircle, MapPin, Wallet } from "lucide-react";
import type { FeedPost } from "@/lib/types";
import { Card, Tag } from "./Card";

export function PostCard({ post }: { post: FeedPost }) {
  const isReq = post.kind === "requirement";
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <img src={post.authorAvatar} alt={post.authorName} className="h-10 w-10 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{post.authorName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {post.authorRole === "tuddor" ? "Tuddor" : "Student"} · {post.createdAt}
          </p>
        </div>
        <Tag tone={isReq ? "warning" : "primary"}>{isReq ? "Requirement" : "Announcement"}</Tag>
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug">{post.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{post.body}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.tags.map((t) => <Tag key={t} tone="muted">#{t}</Tag>)}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
        {post.city && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{post.city}</span>}
        {post.budget && <span className="inline-flex items-center gap-1"><Wallet className="h-3 w-3" />{post.budget}</span>}
      </div>
      <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
        <button className="inline-flex items-center gap-1.5 hover:text-foreground">
          <Heart className="h-4 w-4" />{post.likes}
        </button>
        <button className="inline-flex items-center gap-1.5 hover:text-foreground">
          <MessageCircle className="h-4 w-4" />{post.comments}
        </button>
      </div>
    </Card>
  );
}
