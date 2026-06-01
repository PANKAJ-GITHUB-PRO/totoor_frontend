import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StickySubheader } from "@/components/layout/StickySubheader";
import { Chip } from "@/components/ui-kit/Card";
import { ConnectionRequestCard } from "@/components/ui-kit/ConnectionRequestCard";
import { SkeletonList } from "@/components/ui-kit/Skeletons";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/requests")({ component: Requests });

type StudentTab = "sent" | "accepted" | "rejected";
type TutorTab = "pending" | "accepted" | "rejected";

function Requests() {
  const { role } = useSession();
  const isTutor = role === "tutor";
  const [studentTab, setStudentTab] = useState<StudentTab>("sent");
  const [tutorTab, setTutorTab] = useState<TutorTab>("pending");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tab = isTutor ? tutorTab : studentTab;

  const load = () => {
    setLoading(true);
    const scope = tab === "accepted"
      ? "connections"
      : tab === "sent"
        ? "sent"
        : tab === "pending"
          ? "incoming"
          : "requests";
    const status = tab === "accepted" ? "accepted" : tab === "rejected" ? "rejected" : tab === "pending" || tab === "sent" ? "pending" : undefined;
    api.requestsPage(1, 20, scope, status)
      .then((result) => setItems(result.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [tab, role]);

  const updateRequest = async (id: string, status: "accepted" | "rejected") => {
    await api.updateRequest(id, status);
    load();
  };

  return (
    <AppShell title="Connection requests" back="/dashboard">
      <StickySubheader className="mb-4 py-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {isTutor ? (
            <>
              <Chip active={tutorTab === "pending"} onClick={() => setTutorTab("pending")}>Pending requests</Chip>
              <Chip active={tutorTab === "accepted"} onClick={() => setTutorTab("accepted")}>Accepted connections</Chip>
              <Chip active={tutorTab === "rejected"} onClick={() => setTutorTab("rejected")}>Rejected</Chip>
            </>
          ) : (
            <>
              <Chip active={studentTab === "sent"} onClick={() => setStudentTab("sent")}>Sent requests</Chip>
              <Chip active={studentTab === "accepted"} onClick={() => setStudentTab("accepted")}>Accepted connections</Chip>
              <Chip active={studentTab === "rejected"} onClick={() => setStudentTab("rejected")}>Rejected</Chip>
            </>
          )}
        </div>
      </StickySubheader>

      {loading ? (
        <SkeletonList count={4} variant="compact" />
      ) : (
        <div className="grid gap-3">
          {items.map((request) => (
            <ConnectionRequestCard
              key={request.id}
              request={request}
              role={role}
              onAccept={(id) => updateRequest(id, "accepted")}
              onReject={(id) => updateRequest(id, "rejected")}
            />
          ))}
          {!items.length && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {tab === "sent" ? "No sent requests yet." : tab === "accepted" ? "No accepted connections here yet." : tab === "rejected" ? "No rejected requests." : "No pending requests."}
            </p>
          )}
        </div>
      )}
    </AppShell>
  );
}
