import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, Tag } from "@/components/ui-kit/Card";
import { PillButton } from "@/components/ui-kit/PillButton";
import { BIDS } from "@/lib/mock-data";
import type { Bid } from "@/lib/types";

export const Route = createFileRoute("/bids")({ component: Bids });

function Bids() {
  const [bids, setBids] = useState<Bid[]>(BIDS);
  const update = (id: string, status: Bid["status"]) =>
    setBids((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));

  return (
    <AppShell title="Bid management" back="/dashboard">
      <div className="grid gap-3">
        {bids.map((b) => (
          <Card key={b.id} className="p-4">
            <div className="flex items-center gap-3">
              <img src={b.tuddorAvatar} alt="" className="h-10 w-10 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{b.tuddorName}</p>
                <p className="text-xs text-muted-foreground">Bid ₹{b.price}/hr · {b.createdAt} ago</p>
              </div>
              <Tag tone={b.status === "accepted" ? "success" : b.status === "rejected" ? "warning" : "muted"}>{b.status}</Tag>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{b.note}</p>
            {b.status === "pending" && (
              <div className="mt-3 flex gap-2">
                <PillButton variant="outline" size="sm" fullWidth onClick={() => update(b.id, "rejected")}>Reject</PillButton>
                <PillButton size="sm" fullWidth onClick={() => update(b.id, "accepted")}>Accept</PillButton>
              </div>
            )}
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
