import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search as SearchIcon, SlidersHorizontal, MapPin, X, GraduationCap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StickySubheader } from "@/components/layout/StickySubheader";
import { Input } from "@/components/ui-kit/Field";
import { Card, Chip, Tag } from "@/components/ui-kit/Card";
import { TutorCard } from "@/components/ui-kit/TutorCard";
import { SkeletonList } from "@/components/ui-kit/Skeletons";
import { PillButton } from "@/components/ui-kit/PillButton";
import { Spinner } from "@/components/ui-kit/Spinner";
import { api } from "@/lib/api";
import { requireAuth } from "@/lib/authRedirect";
import { useSession } from "@/lib/session";
import type { Student } from "@/lib/types";

export const Route = createFileRoute("/search")({
  beforeLoad: () => requireAuth("/search"),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [pincode, setPincode] = useState<string | null>(null);
  const [mode, setMode] = useState<"all" | "online" | "offline" | TeachingMode>("all");
  const [topRated, setTopRated] = useState(false);
  const [skill, setSkill] = useState("");
  const [education, setEducation] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [minRating, setMinRating] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [pincodes, setPincodes] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { role } = useSession();
  const isTutor = role === "tutor";

  useEffect(() => { api.locationStates().then(setStates).catch(() => setStates([])); }, []);
  useEffect(() => { api.subjects().then(setSubjects).catch(() => setSubjects([])); }, []);
  useEffect(() => {
    if (!state) {
      setCities([]);
      return;
    }
    api.locationCities(state).then(setCities).catch(() => setCities([]));
  }, [state]);
  useEffect(() => {
    if (!state || !city) {
      setPincodes([]);
      return;
    }
    api.locationPincodes(state, city).then(setPincodes).catch(() => setPincodes([]));
  }, [state, city]);
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (!isTutor && subject) params.set("subject", subject);
    if (!isTutor && skill) params.set("skill", skill);
    if (!isTutor && education) params.set("education", education);
    if (!isTutor && minExperience) params.set("minExperience", minExperience);
    if (!isTutor && minRating) params.set("minRating", minRating);
    if (!isTutor && minPrice) params.set("minPrice", minPrice);
    if (!isTutor && maxPrice) params.set("maxPrice", maxPrice);
    if (state) params.set("state", state);
    if (city) {
      params.set("city", city);
      params.set("district", city);
    }
    if (pincode) params.set("pincode", pincode);
    params.set("mode", mode);
    if (topRated) {
      params.set("topRated", "1");
      params.set("sort", "rating");
    }
    params.set("page", "1");
    params.set("limit", "8");
    setLoading(true);
    const loader = isTutor ? api.studentsPage(params) : api.tutorsPage(params);
    loader.then((result) => {
      setResults(result.items);
      setPage(result.page);
      setHasMore(result.hasMore);
    }).catch(() => setResults([])).finally(() => setLoading(false));
  }, [q, subject, skill, education, minExperience, minRating, minPrice, maxPrice, state, city, pincode, mode, topRated, isTutor]);

  const loadMore = async () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (!isTutor && subject) params.set("subject", subject);
    if (!isTutor && skill) params.set("skill", skill);
    if (!isTutor && education) params.set("education", education);
    if (!isTutor && minExperience) params.set("minExperience", minExperience);
    if (!isTutor && minRating) params.set("minRating", minRating);
    if (!isTutor && minPrice) params.set("minPrice", minPrice);
    if (!isTutor && maxPrice) params.set("maxPrice", maxPrice);
    if (state) params.set("state", state);
    if (city) {
      params.set("city", city);
      params.set("district", city);
    }
    if (pincode) params.set("pincode", pincode);
    params.set("mode", mode);
    if (topRated) {
      params.set("topRated", "1");
      params.set("sort", "rating");
    }
    params.set("page", String(page + 1));
    params.set("limit", "8");
    setLoadingMore(true);
    const result = isTutor ? await api.studentsPage(params) : await api.tutorsPage(params);
    setResults((items) => [...items, ...result.items]);
    setPage(result.page);
    setHasMore(result.hasMore);
    setLoadingMore(false);
  };

  return (
    <AppShell title="Search">
      <StickySubheader>
        <div className="flex gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={isTutor ? "Search students, city..." : "Search tutors, subjects..."} leftIcon={<SearchIcon className="h-4 w-4" />} />
          <button onClick={() => setOpen(true)} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border bg-card shadow-soft">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
        {!isTutor && (
          <div className="mt-3 flex flex-wrap gap-2">
            {subjects.slice(0, 6).map((s) => (
              <Chip key={s} active={subject === s} onClick={() => setSubject(subject === s ? null : s)}>{s}</Chip>
            ))}
          </div>
        )}
      </StickySubheader>

      <p className="mt-4 text-xs text-muted-foreground">{loading ? "Searching..." : `${results.length} ${isTutor ? "students" : "tutors"} found`}</p>
      <div className="mt-3 grid gap-3">
        {loading ? (
          <SkeletonList count={4} variant="card" />
        ) : (
          <>
            {isTutor
              ? results.map((student) => <StudentResult key={student.id} student={student} />)
              : results.map((tutor) => <TutorCard key={tutor.id} tutor={tutor} />)}
            {hasMore && (
              <PillButton variant="outline" fullWidth loading={loadingMore} onClick={loadMore} disabled={loadingMore}>
                Load more
              </PillButton>
            )}
          </>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-foreground/30" onClick={() => setOpen(false)}>
          <div className="flex max-h-[90vh] w-full flex-col rounded-t-3xl bg-background p-5 shadow-floating sm:mx-auto sm:max-w-screen-sm sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="-mx-5 -mt-5 mb-4 border-b border-border bg-background/95 px-5 py-4 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">Filters</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">Choose mode and location.</p>
                </div>
                <button onClick={() => setOpen(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-card"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
              {!isTutor && (
                <>
                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Mode</p>
                    <div className="flex flex-wrap gap-2">
                      {([
                        ["all", "All modes"],
                        ["online", "Online"],
                        ["offline", "Offline"],
                        ["group", "Group class"],
                        ["one-to-one", "One to one"],
                        ["home", "Home tuition"]
                      ] as const).map(([value, label]) => (
                        <Chip key={value} active={mode === value} onClick={() => setMode(value)}>{label}</Chip>
                      ))}
                      <Chip active={topRated} onClick={() => setTopRated(!topRated)}>Top rated</Chip>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Skill e.g. IIT JEE" />
                    <Input value={education} onChange={(e) => setEducation(e.target.value)} placeholder="Education e.g. M.Tech" />
                    <Input value={minExperience} onChange={(e) => setMinExperience(e.target.value)} inputMode="numeric" placeholder="Min experience (years)" />
                    <Input value={minRating} onChange={(e) => setMinRating(e.target.value)} inputMode="decimal" placeholder="Min rating e.g. 4.5" />
                    <Input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} inputMode="numeric" placeholder="Min price/hr" />
                    <Input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} inputMode="numeric" placeholder="Max price/hr" />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Subject</p>
                    <div className="flex flex-wrap gap-2">
                      <Chip active={!subject} onClick={() => setSubject(null)}>All subjects</Chip>
                      {subjects.map((s) => (
                        <Chip key={s} active={subject === s} onClick={() => setSubject(subject === s ? null : s)}>{s}</Chip>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">State</p>
                <div className="flex flex-wrap gap-2">
                  <Chip active={!state} onClick={() => { setState(null); setCity(null); setPincode(null); }}>
                    <MapPin className="h-3 w-3" />All India
                  </Chip>
                  {states.map((item) => (
                    <Chip key={item} active={state === item} onClick={() => { setState(state === item ? null : item); setCity(null); setPincode(null); }}>
                      <MapPin className="h-3 w-3" />{item}
                    </Chip>
                  ))}
                </div>
              </div>
              {state && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">District / city</p>
                  <div className="flex flex-wrap gap-2">
                    {cities.map((item) => (
                      <Chip key={item} active={city === item} onClick={() => { setCity(city === item ? null : item); setPincode(null); }}>
                        {item}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
              {city && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Pincode</p>
                  <div className="flex flex-wrap gap-2">
                    {pincodes.map((p: string) => (
                      <Chip key={p} active={pincode === p} onClick={() => setPincode(pincode === p ? null : p)}>{p}</Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="-mx-5 -mb-5 mt-4 border-t border-border bg-background/95 px-5 py-4 backdrop-blur-xl">
              <PillButton fullWidth size="lg" onClick={() => setOpen(false)}>Show {results.length} results</PillButton>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function StudentResult({ student }: { student: Student }) {
  const [status, setStatus] = useState(student.requestStatus ?? null);
  const [busy, setBusy] = useState(false);
  const isConnected = status === "accepted";
  const isPending = status === "pending";
  const isRejected = status === "rejected";
  const hasRequest = isPending || isRejected || isConnected;

  const connect = async () => {
    if (hasRequest || busy) return;
    setBusy(true);
    try {
      const request = await api.createStudentRequest(student.id);
      setStatus(request.status ?? "pending");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <Link to="/profiles/$id" params={{ id: student.id }} className="shrink-0">
          <img src={student.avatar} alt={student.name} className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-soft" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link to="/profiles/$id" params={{ id: student.id }} className="block truncate font-semibold leading-tight hover:text-primary">{student.name}</Link>
              <p className="truncate text-xs text-muted-foreground">{student.grade ?? student.education ?? "Student"}</p>
              <div className="mt-2">
                {hasRequest ? (
                  <Tag tone={isConnected ? "success" : isRejected ? "warning" : "muted"}>
                    {isConnected ? "Connected" : isRejected ? "Rejected" : "Request Sent"}
                  </Tag>
                ) : (
                  <button onClick={connect} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60">
                    {busy && <Spinner className="h-3 w-3" />}
                    Connect
                  </button>
                )}
              </div>
            </div>
            <Tag tone="primary"><GraduationCap className="mr-1 h-3 w-3" />Student</Tag>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{student.city}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
