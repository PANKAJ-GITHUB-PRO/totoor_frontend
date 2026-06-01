import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageContent } from "@/components/layout/StickySubheader";
import { ConnectionListCard } from "@/components/ui-kit/ConnectionRequestCard";
import { ContactUnlock } from "@/components/ui-kit/ContactUnlock";
import { SkeletonList } from "@/components/ui-kit/Skeletons";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/connections")({ component: Connections });

function Connections() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useSession();

  useEffect(() => {
    api.connectionsPage(1, 20)
      .then((result) => setItems(result.items.filter((item) => item.status === "accepted")))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell title="Connections" back="/dashboard">
      <PageContent>
      <p className="mb-4 text-sm text-muted-foreground">
        Active connections with approved contact access.
      </p>
      {loading ? (
        <SkeletonList count={3} variant="compact" />
      ) : (
        <div className="grid gap-3">
          {items.map((request) => (
            <div key={request.id}>
              <ConnectionListCard request={request} role={role} />
              <div className="mt-2 px-1">
                <ContactUnlock
                  unlocked
                  phone={role === "tutor" ? request.studentPhone ?? "" : request.tutorPhone ?? ""}
                  whatsapp={role === "tutor" ? request.studentWhatsapp ?? "" : request.tutorWhatsapp ?? ""}
                  message="Contact is visible because this connection was approved."
                />
              </div>
            </div>
          ))}
          {!items.length && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No connections yet. Send a request and wait for approval to connect here.
            </p>
          )}
        </div>
      )}
      </PageContent>
    </AppShell>
  );
}
