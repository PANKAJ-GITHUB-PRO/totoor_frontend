import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Edit2, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StickySubheader } from "@/components/layout/StickySubheader";
import { Chip } from "@/components/ui-kit/Card";
import { Field, Input, Select, Textarea } from "@/components/ui-kit/Field";
import { PillButton } from "@/components/ui-kit/PillButton";
import { PostCard } from "@/components/ui-kit/PostCard";
import { SkeletonList } from "@/components/ui-kit/Skeletons";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/my-posts")({ component: MyPosts });

function MyPosts() {
  const { role } = useSession();
  const [tab, setTab] = useState<"all" | "general" | "announcement" | "requirement">("all");
  const [posts, setPosts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const load = (nextPage = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    return api.myPostsPage(tab, nextPage, 8)
      .then((result) => {
        setPosts((items) => append ? [...items, ...result.items] : result.items);
        setPage(result.page);
        setHasMore(result.hasMore);
      })
      .catch(() => {
        if (!append) setPosts([]);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  };

  useEffect(() => { load(); }, [tab]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updatePost(editing.id, {
        title: editing.title,
        body: editing.body,
        budget: editing.budget || undefined,
        status: editing.status,
        kind: editing.kind,
        tags: typeof editing.tagsText === "string" ? editing.tagsText.split(",").map((t: string) => t.trim()).filter(Boolean) : editing.tags
      });
      setPosts((items) => items.map((item) => item.id === updated.id ? updated : item));
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="My Posts" back="/profile">
      <StickySubheader className="py-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <Chip active={tab === "all"} onClick={() => setTab("all")}>All</Chip>
          <Chip active={tab === "general"} onClick={() => setTab("general")}>General</Chip>
          {role === "tutor" && <Chip active={tab === "announcement"} onClick={() => setTab("announcement")}>Announcements</Chip>}
          <Chip active={tab === "requirement"} onClick={() => setTab("requirement")}>Requirements</Chip>
        </div>
      </StickySubheader>

      <div className="mt-4 grid gap-3">
        {loading ? (
          <SkeletonList count={3} variant="post" />
        ) : (
          <>
            {posts.map((post) => (
              <div key={post.id} className="relative">
                <PostCard post={post} onChange={(updated) => setPosts((items) => items.map((item) => item.id === updated.id ? updated : item))} />
                <button onClick={() => setEditing({ ...post, tagsText: post.tags.join(", ") })} className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full border border-border bg-card shadow-soft">
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {!posts.length && <p className="py-10 text-center text-sm text-muted-foreground">No posts yet.</p>}
            {hasMore && (
              <PillButton variant="outline" fullWidth loading={loadingMore} onClick={() => load(page + 1, true)} disabled={loadingMore}>
                Load more
              </PillButton>
            )}
          </>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end bg-foreground/30" onClick={() => setEditing(null)}>
          <form onSubmit={save} className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-background p-5 shadow-floating sm:mx-auto sm:max-w-screen-sm sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 -mx-5 -mt-5 mb-4 border-b border-border bg-background/95 px-5 py-4 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold">Edit post</h3>
                  <p className="truncate text-xs text-muted-foreground">{editing.title}</p>
                </div>
                <button type="button" onClick={() => setEditing(null)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-card"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="grid gap-3">
              {role === "tutor" && (
                <Field label="Post type">
                  <Select value={editing.kind} onChange={(e) => setEditing({ ...editing, kind: e.target.value })}>
                    <option value="general">General</option>
                    <option value="announcement">Announcement</option>
                    <option value="requirement">Requirement</option>
                  </Select>
                </Field>
              )}
              <Field label="Status">
                <Select value={editing.status ?? "active"} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </Select>
              </Field>
              <Field label="Title"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
              <Field label="Details"><Textarea value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} className="min-h-32" /></Field>
              <Field label="Tags"><Input value={editing.tagsText} onChange={(e) => setEditing({ ...editing, tagsText: e.target.value })} /></Field>
              {editing.kind === "requirement" && <Field label="Budget"><Input value={editing.budget ?? ""} onChange={(e) => setEditing({ ...editing, budget: e.target.value })} /></Field>}
              <div className="sticky bottom-0 -mx-5 -mb-5 mt-1 border-t border-border bg-background/95 px-5 py-4 backdrop-blur-xl">
                <PillButton fullWidth size="lg" loading={saving} disabled={saving}>Save</PillButton>
              </div>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}
