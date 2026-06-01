import { cn } from "@/lib/utils";
import { LogoMark } from "./Logo";

function Bone({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-secondary", className)} />;
}

export function SkeletonBrandHeader() {
  return (
    <div className="flex flex-col items-center gap-2 py-3">
      <LogoMark pulse />
      <Bone className="h-2 w-16 rounded-full" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex gap-3">
        <Bone className="h-14 w-14 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Bone className="h-3.5 w-2/3" />
          <Bone className="h-3 w-1/2" />
          <Bone className="h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCompactCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-center gap-3">
        <Bone className="h-10 w-10 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Bone className="h-3.5 w-32" />
          <Bone className="h-2.5 w-24" />
        </div>
        <Bone className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonPostCard() {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Bone className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Bone className="h-3 w-28" />
          <Bone className="h-2.5 w-16" />
        </div>
        <Bone className="h-5 w-14 rounded-full" />
      </div>
      <Bone className="h-4 w-full" />
      <Bone className="h-3 w-4/5" />
    </div>
  );
}

export function SkeletonProfileHeader() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Bone className="h-20 w-full rounded-none" />
      <div className="px-5 pb-5">
        <Bone className="-mt-10 h-20 w-20 rounded-2xl" />
        <Bone className="mt-3 h-5 w-40" />
        <Bone className="mt-2 h-3.5 w-56" />
        <div className="mt-3 flex gap-2">
          <Bone className="h-3 w-16" />
          <Bone className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStatsRow({ count = 3 }: { count?: number }) {
  return (
    <div className={cn("grid gap-2", count === 3 ? "grid-cols-3" : "grid-cols-2")}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2 rounded-2xl border border-border bg-card p-3 text-center">
          <Bone className="mx-auto h-4 w-4 rounded" />
          <Bone className="mx-auto h-5 w-8" />
          <Bone className="mx-auto h-2.5 w-12" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonBidDetail() {
  return (
    <div className="space-y-4">
      <SkeletonProfileHeader />
      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <Bone className="h-4 w-32" />
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-5/6" />
        <Bone className="h-10 w-full rounded-xl" />
      </div>
      <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
        <Bone className="h-4 w-24" />
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonList({
  count = 3,
  variant = "card",
  branded = true,
}: {
  count?: number;
  variant?: "card" | "compact" | "post" | "profile" | "stats" | "bid-detail";
  branded?: boolean;
}) {
  const Item =
    variant === "compact" ? SkeletonCompactCard
      : variant === "post" ? SkeletonPostCard
        : variant === "profile" ? SkeletonProfileHeader
          : variant === "stats" ? () => <SkeletonStatsRow />
            : variant === "bid-detail" ? SkeletonBidDetail
              : SkeletonCard;

  if (variant === "stats") {
    return (
      <div className="space-y-4">
        {branded && <SkeletonBrandHeader />}
        <SkeletonStatsRow count={count} />
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {branded && <SkeletonBrandHeader />}
      {Array.from({ length: count }).map((_, i) => (
        <Item key={i} />
      ))}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <LogoMark pulse />
      <div className="space-y-2 text-center">
        <Bone className="mx-auto h-3 w-24" />
        <Bone className="mx-auto h-2.5 w-32" />
      </div>
    </div>
  );
}
