import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, TrendingUp, Calendar, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageContent } from "@/components/layout/StickySubheader";
import { Card, Chip } from "@/components/ui-kit/Card";
import { PostCard } from "@/components/ui-kit/PostCard";
import { ConnectionRequestCard } from "@/components/ui-kit/ConnectionRequestCard";
import { BidListCard } from "@/components/ui-kit/BidListCard";
import { PillButton } from "@/components/ui-kit/PillButton";
import { SkeletonList, SkeletonStatsRow } from "@/components/ui-kit/Skeletons";
import { useSession } from "@/lib/session";
import { api } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

type StudentSection = "feed" | "sent" | "bids" | "connections";
type TutorSection = "feed" | "requirements" | "requests" | "connections" | "bids";

function Dashboard() {
  const { role, name } = useSession();
  const isTutor = role === "tutor";
  const [studentSection, setStudentSection] = useState<StudentSection>("feed");
  const [tutorSection, setTutorSection] = useState<TutorSection>("feed");
  const [feed, setFeed] = useState<any[]>([]);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [stats, setStats] = useState({ posts: 0, requests: 0, sentRequests: 0, bids: 0, connections: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const section = isTutor ? tutorSection : studentSection;

  useEffect(() => {
    api.meStats().then(setStats).catch(() => undefined).finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    const tasks: Promise<void>[] = [];

    if (section === "feed") {
      tasks.push(api.feedPage("all", 1, 5).then((r) => {
        setFeed(isTutor ? r.items : r.items.filter((p) => p.kind !== "requirement"));
      }).catch(() => setFeed([])));
    }
    if (section === "requirements") {
      tasks.push(api.feedPage("requirement", 1, 5).then((r) => setRequirements(r.items)).catch(() => setRequirements([])));
    }
    if (section === "sent") {
      tasks.push(api.requestsPage(1, 5, "sent", "pending").then((r) => setRequests(r.items)).catch(() => setRequests([])));
    }
    if (section === "requests") {
      tasks.push(api.requestsPage(1, 5, "incoming", "pending").then((r) => setRequests(r.items)).catch(() => setRequests([])));
    }
    if (section === "connections") {
      tasks.push(api.connectionsPage(1, 5).then((r) => setConnections(r.items)).catch(() => setConnections([])));
    }
    if (section === "bids") {
      tasks.push(api.bidsPage(1, 5, "requests").then((r) => setBids(r.items)).catch(() => setBids([])));
    }

    Promise.all(tasks).finally(() => setLoading(false));
  }, [section, isTutor]);

  return (
    <AppShell>
      <PageContent>
      <div className="rounded-3xl bg-brand-gradient p-5 text-white shadow-glow">
        <p className="text-xs opacity-80">{isTutor ? "Tutor dashboard" : "Student dashboard"}</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight">Hi {name ?? (isTutor ? "tutor" : "learner")}</h1>
        <p className="mt-1 text-sm opacity-90">
          {isTutor ? `${stats.requests} pending requests · ${stats.bids} active bids` : `${stats.connections} connections · ${stats.sentRequests} sent requests`}
        </p>
        <Link to="/search" className="mt-4 flex h-12 items-center gap-2 rounded-full bg-white/95 px-4 text-sm text-foreground">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{isTutor ? "Search students & requirements" : "Search tutors…"}</span>
        </Link>
      </div>

      <div className="mt-5">
        {statsLoading ? (
          <SkeletonStatsRow count={3} />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {[
              { i: TrendingUp, l: isTutor ? "Bids" : "Posts", v: isTutor ? String(stats.bids) : String(stats.posts) },
              { i: Calendar, l: isTutor ? "Posts" : "Sent", v: isTutor ? String(stats.posts) : String(stats.sentRequests) },
              { i: Users, l: "Connections", v: String(stats.connections) },
            ].map(({ i: Icon, l, v }) => (
              <Card key={l} className="p-3 text-center">
                <Icon className="mx-auto h-4 w-4 text-primary" />
                <div className="mt-1 text-lg font-bold">{v}</div>
                <div className="text-[11px] text-muted-foreground">{l}</div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 -mx-1 flex gap-2 overflow-x-auto px-1 no-scrollbar">
        {isTutor ? (
          <>
            <Chip active={tutorSection === "feed"} onClick={() => setTutorSection("feed")}>Feed</Chip>
            <Chip active={tutorSection === "requirements"} onClick={() => setTutorSection("requirements")}>Requirement requests</Chip>
            <Chip active={tutorSection === "requests"} onClick={() => setTutorSection("requests")}>Connection requests</Chip>
            <Chip active={tutorSection === "connections"} onClick={() => setTutorSection("connections")}>Active connections</Chip>
            <Chip active={tutorSection === "bids"} onClick={() => setTutorSection("bids")}>My bids</Chip>
          </>
        ) : (
          <>
            <Chip active={studentSection === "feed"} onClick={() => setStudentSection("feed")}>General feed</Chip>
            <Chip active={studentSection === "sent"} onClick={() => setStudentSection("sent")}>Sent requests</Chip>
            <Chip active={studentSection === "bids"} onClick={() => setStudentSection("bids")}>Received tutor responses</Chip>
            <Chip active={studentSection === "connections"} onClick={() => setStudentSection("connections")}>Connections</Chip>
          </>
        )}
      </div>

      <section className="mt-4">
        {loading ? (
          <SkeletonList count={3} variant={section === "feed" || section === "requirements" ? "post" : "compact"} />
        ) : (
          <div className="grid gap-3">
            {section === "feed" && (
              <>
                {feed.map((p) => <PostCard key={p.id} post={p} />)}
                {!feed.length && <Empty text="No feed posts yet." />}
                <Link to="/feed"><PillButton variant="outline" fullWidth>Open full feed</PillButton></Link>
              </>
            )}
            {section === "requirements" && (
              <>
                {requirements.map((p) => <PostCard key={p.id} post={p} />)}
                {!requirements.length && <Empty text="No student requirements right now." />}
                <Link to="/feed"><PillButton variant="outline" fullWidth>Browse requirements</PillButton></Link>
              </>
            )}
            {(section === "sent" || section === "requests") && (
              <>
                {requests.map((r) => (
                  <ConnectionRequestCard key={r.id} request={r} role={role} />
                ))}
                {!requests.length && <Empty text="No pending requests." />}
                <Link to="/requests"><PillButton variant="outline" fullWidth>Manage all requests</PillButton></Link>
              </>
            )}
            {section === "connections" && (
              <>
                {connections.map((r) => (
                  <ConnectionRequestCard key={r.id} request={r} role={role} />
                ))}
                {!connections.length && <Empty text="No connections yet." />}
                <Link to="/connections"><PillButton variant="outline" fullWidth>View all connections</PillButton></Link>
              </>
            )}
            {section === "bids" && (
              <>
                {bids.map((b) => <BidListCard key={b.id} bid={b} role={role} />)}
                {!bids.length && <Empty text={isTutor ? "No active bids." : "No tutor bids received yet."} />}
                <Link to="/bids"><PillButton variant="outline" fullWidth>Manage all bids</PillButton></Link>
              </>
            )}
          </div>
        )}
      </section>
      </PageContent>
    </AppShell>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-8 text-center text-sm text-muted-foreground">{text}</p>;
}
