import { Star } from "lucide-react";
import { Card } from "./Card";

type Breakdown = Record<1 | 2 | 3 | 4 | 5, number>;

export function RatingBreakdown({
  rating,
  total,
  breakdown,
}: {
  rating: number;
  total: number;
  breakdown: Breakdown;
}) {
  const max = Math.max(...Object.values(breakdown), 1);

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-1 text-3xl font-bold">
            <Star className="h-7 w-7 fill-[oklch(0.78_0.16_75)] text-[oklch(0.78_0.16_75)]" />
            {rating.toFixed(1)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Based on {total} {total === 1 ? "review" : "reviews"}</p>
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          {([5, 4, 3, 2, 1] as const).map((stars) => (
            <div key={stars} className="flex items-center gap-2 text-xs">
              <span className="w-6 shrink-0 text-muted-foreground">{stars}★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-[oklch(0.78_0.16_75)]"
                  style={{ width: `${(breakdown[stars] / max) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-muted-foreground">{breakdown[stars]}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function RatingBadge({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Star className="h-3.5 w-3.5 fill-[oklch(0.78_0.16_75)] text-[oklch(0.78_0.16_75)]" />
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      <span>({reviews} {reviews === 1 ? "Review" : "Reviews"})</span>
    </span>
  );
}
