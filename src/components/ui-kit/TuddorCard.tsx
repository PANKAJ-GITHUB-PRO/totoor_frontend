import { Link } from "@tanstack/react-router";
import { Star, MapPin, Wifi, Home } from "lucide-react";
import type { Tuddor } from "@/lib/types";
import { Card, Tag } from "./Card";

export function TuddorCard({ t }: { t: Tuddor }) {
  return (
    <Link to="/tuddors/$id" params={{ id: t.id }} className="block">
      <Card className="p-4 hover:shadow-card transition">
        <div className="flex gap-3">
          <img src={t.avatar} alt={t.name} className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-soft" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate font-semibold leading-tight">{t.name}</h3>
                <p className="truncate text-xs text-muted-foreground">{t.headline}</p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                <Star className="h-3 w-3 fill-[oklch(0.78_0.16_75)] text-[oklch(0.78_0.16_75)]" />
                {t.rating}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {t.subjects.slice(0, 2).map((s) => <Tag key={s} tone="primary">{s}</Tag>)}
              {t.online ? <Tag tone="accent"><Wifi className="mr-1 h-3 w-3" />Online</Tag> : <Tag tone="muted"><Home className="mr-1 h-3 w-3" />In-person</Tag>}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{t.city}</span>
              <span className="font-semibold text-foreground">₹{t.pricePerHour}<span className="text-muted-foreground font-normal">/hr</span></span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
