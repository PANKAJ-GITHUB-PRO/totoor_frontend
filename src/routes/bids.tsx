import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StickySubheader } from "@/components/layout/StickySubheader";
import { Chip } from "@/components/ui-kit/Card";
import { BidListCard } from "@/components/ui-kit/BidListCard";
import { PillButton } from "@/components/ui-kit/PillButton";
import { SkeletonList } from "@/components/ui-kit/Skeletons";
import type { Bid } from "@/lib/types";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/bids")({ component: Bids });

type Tab = "requests" | "history";

function Bids() {
  const [tab, setTab] = useState<Tab>("requests");
  const [bids, setBids] = useState<Bid[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { role } = useSession();

  const load = (nextPage = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    return api.bidsPage(nextPage, 8, tab === "requests" ? "requests" : "history")
      .then((result) => {
        setBids((current) => append ? [...current, ...result.items] : result.items);
        setPage(result.page);
        setHasMore(result.hasMore);
      })
      .catch(() => { if (!append) setBids([]); })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  };

  useEffect(() => { load(); }, [tab]);

  const updateBid = async (id: string, status: "accepted" | "rejected") => {
    await api.updateBid(id, status);
    load();
  };

  return (
    <AppShell title={role === "student" ? "Bid requests" : "My bids"} back="/dashboard">
      <StickySubheader className="mb-4 py-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <Chip active={tab === "requests"} onClick={() => setTab("requests")}>
            {role === "student" ? "Received tutor bids" : "Active bids"}
          </Chip>
          <Chip active={tab === "history"} onClick={() => setTab("history")}>Bid history</Chip>
        </div>
      </StickySubheader>

      {loading ? (
        <SkeletonList count={4} variant="compact" />
      ) : (
        <div className="grid gap-3">
          {bids.map((bid) => (
            <BidListCard
              key={bid.id}
              bid={bid}
              role={role}
              onAccept={(id) => updateBid(id, "accepted")}
              onReject={(id) => updateBid(id, "rejected")}
            />
          ))}
          {hasMore && (
            <PillButton variant="outline" fullWidth loading={loadingMore} onClick={() => load(page + 1, true)} disabled={loadingMore}>
              Load more
            </PillButton>
          )}
          {!bids.length && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {tab === "requests" ? "No active bid requests." : "No bid history yet."}
            </p>
          )}
        </div>
      )}
    </AppShell>
  );
}
