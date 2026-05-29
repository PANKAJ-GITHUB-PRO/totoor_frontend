import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search as SearchIcon, SlidersHorizontal, MapPin, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui-kit/Field";
import { Chip } from "@/components/ui-kit/Card";
import { TuddorCard } from "@/components/ui-kit/TuddorCard";
import { PillButton } from "@/components/ui-kit/PillButton";
import { TUDDORS, SUBJECTS, CITIES } from "@/lib/mock-data";

export const Route = createFileRoute("/search")({ component: SearchPage });

function SearchPage() {
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [mode, setMode] = useState<"all" | "online" | "offline">("all");
  const [open, setOpen] = useState(false);

  const results = TUDDORS.filter((t) => {
    if (q && !`${t.name} ${t.headline} ${t.subjects.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (subject && !t.subjects.includes(subject)) return false;
    if (city && t.city !== city) return false;
    if (mode === "online" && !t.online) return false;
    if (mode === "offline" && t.online) return false;
    return true;
  });

  return (
    <AppShell title="Search" showBell>
      <div className="sticky top-[60px] z-20 -mx-4 bg-background/85 backdrop-blur-xl px-4 pb-3 pt-1">
        <div className="flex gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Tuddors, subjects…" leftIcon={<SearchIcon className="h-4 w-4" />} />
          <button onClick={() => setOpen(true)} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border bg-card shadow-soft">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 no-scrollbar">
          {SUBJECTS.slice(0, 6).map((s) => (
            <Chip key={s} active={subject === s} onClick={() => setSubject(subject === s ? null : s)}>{s}</Chip>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{results.length} Tuddors found</p>
      <div className="mt-3 grid gap-3">
        {results.map((t) => <TuddorCard key={t.id} t={t} />)}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-foreground/30" onClick={() => setOpen(false)}>
          <div className="w-full rounded-t-3xl bg-background p-5 shadow-floating" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Mode</p>
                <div className="flex gap-2">
                  {(["all", "online", "offline"] as const).map((m) => (
                    <Chip key={m} active={mode === m} onClick={() => setMode(m)}>{m === "all" ? "All" : m}</Chip>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Nearby city</p>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map((c) => (
                    <Chip key={c} active={city === c} onClick={() => setCity(city === c ? null : c)}>
                      <MapPin className="h-3 w-3" />{c}
                    </Chip>
                  ))}
                </div>
              </div>
              <PillButton fullWidth size="lg" onClick={() => setOpen(false)}>Show {results.length} results</PillButton>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
