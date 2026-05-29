import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Chip } from "@/components/ui-kit/Card";
import { PostCard } from "@/components/ui-kit/PostCard";
import { PillButton } from "@/components/ui-kit/PillButton";
import { FEED } from "@/lib/mock-data";

export const Route = createFileRoute("/feed")({ component: Feed });

function Feed() {
  const [tab, setTab] = useState<"all" | "announcement" | "requirement">("all");
  const posts = FEED.filter((p) => tab === "all" || p.kind === tab);
  return (
    <AppShell title="Feed" showBell right={<PillButton size="sm" leftIcon={<Plus className="h-4 w-4" />}>Post</PillButton>}>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
        <Chip active={tab === "all"} onClick={() => setTab("all")}>All</Chip>
        <Chip active={tab === "announcement"} onClick={() => setTab("announcement")}>Announcements</Chip>
        <Chip active={tab === "requirement"} onClick={() => setTab("requirement")}>Requirements</Chip>
      </div>
      <div className="mt-4 grid gap-3">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </AppShell>
  );
}
