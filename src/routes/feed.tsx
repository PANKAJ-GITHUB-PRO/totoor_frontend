import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StickySubheader } from "@/components/layout/StickySubheader";
import { DropdownSelect } from "@/components/forms/DropdownSelect";
import { Chip } from "@/components/ui-kit/Card";
import { PostCard } from "@/components/ui-kit/PostCard";
import { PillButton } from "@/components/ui-kit/PillButton";
import { SkeletonList } from "@/components/ui-kit/Skeletons";
import { Field, Input, Textarea } from "@/components/ui-kit/Field";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/feed")({ component: Feed });

type PostTypeOption = "general_announcement" | "requirement";

function Feed() {
  const { role } = useSession();
  const isTutor = role === "tutor";
  const studentTabs = ["all", "general", "announcement"] as const;
  const tutorTabs = ["all", "general", "announcement", "requirement"] as const;
  type Tab = typeof tutorTabs[number];

  const [tab, setTab] = useState<Tab>("all");
  const [posts, setPosts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [postType, setPostType] = useState<PostTypeOption>("general_announcement");
  const [form, setForm] = useState({ title: "", body: "", tags: "", budget: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const tabs = isTutor ? tutorTabs : studentTabs;

  const postTypeOptions = useMemo(() => {
    const options = [{ value: "general_announcement", label: "General Announcement" }];
    if (!isTutor) {
      options.push({ value: "requirement", label: "Requirement / Bid Request" });
    }
    return options;
  }, [isTutor]);

  const load = (nextPage = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    return api.feedPage(tab, nextPage, 8)
      .then((result) => {
        const items = isTutor ? result.items : result.items.filter((p) => p.kind !== "requirement");
        setPosts((current) => append ? [...current, ...items] : items);
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

  useEffect(() => {
    if (!isTutor && tab === "requirement") setTab("all");
  }, [isTutor, tab]);

  useEffect(() => { load(); }, [tab, isTutor]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const kind = postType === "requirement"
      ? "requirement"
      : isTutor
        ? "announcement"
        : "general";
    try {
      await api.createPost({
        kind,
        title: form.title,
        body: form.body,
        budget: form.budget || undefined,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setOpen(false);
      setPostType("general_announcement");
      setForm({ title: "", body: "", tags: "", budget: "" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to publish post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Feed" right={<PillButton size="sm" onClick={() => setOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>Post</PillButton>}>
      <StickySubheader className="py-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <Chip key={t} active={tab === t} onClick={() => setTab(t)}>
              {t === "all" ? "All" : t === "general" ? "General" : t === "announcement" ? "Announcements" : "Requirements"}
            </Chip>
          ))}
        </div>
      </StickySubheader>
      <div className="mt-4 grid gap-3">
        {loading ? (
          <SkeletonList count={4} variant="post" />
        ) : (
          <>
            {posts.map((p) => <PostCard key={p.id} post={p} onChange={(updated) => setPosts((items) => items.map((item) => item.id === updated.id ? updated : item))} />)}
            {!posts.length && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                {isTutor ? "No posts found." : "No general posts or announcements yet."}
              </p>
            )}
            {hasMore && (
              <PillButton variant="outline" fullWidth loading={loadingMore} onClick={() => load(page + 1, true)} disabled={loadingMore}>
                Load more
              </PillButton>
            )}
          </>
        )}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-foreground/30 sm:items-center sm:justify-center sm:p-4" onClick={() => setOpen(false)}>
          <form onSubmit={submit} className="flex max-h-[min(90dvh,100%)] w-full flex-col rounded-t-3xl bg-background shadow-floating sm:max-w-lg sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="shrink-0 border-b border-border p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold">Create post</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {isTutor ? "Share a general announcement with students." : "Share general content or create a bid request for tutors."}
                  </p>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-card">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="grid gap-3">
                <Field label="Post type">
                  <DropdownSelect
                    value={postType}
                    options={postTypeOptions}
                    placeholder="Select post type"
                    onChange={(value) => setPostType(value as PostTypeOption)}
                  />
                </Field>
                <Field label="Title">
                  <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={postType === "requirement" ? "Need Math tutor for Class 12" : isTutor ? "New weekend batch starting" : "Study tips for board exams"} />
                </Field>
                <Field label="Details">
                  <Textarea required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder={postType === "requirement" ? "Mention subject, class, preferred mode, timing, and location." : "Add useful details, schedule, mode, subjects, or expectations."} className="min-h-28" />
                </Field>
                <Field label="Tags" hint="Separate tags with commas.">
                  <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Mathematics, Online, Class 12" />
                </Field>
                {postType === "requirement" && (
                  <Field label="Budget">
                    <Input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="Rs 600-Rs 900/hr" />
                  </Field>
                )}
                {error && <p className="text-sm text-[color:var(--error)]">{error}</p>}
              </div>
            </div>
            <div className="shrink-0 border-t border-border p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <PillButton fullWidth size="lg" loading={saving} disabled={saving}>Publish</PillButton>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}
