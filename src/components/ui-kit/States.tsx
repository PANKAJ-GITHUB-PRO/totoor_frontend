import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon = <Inbox className="h-6 w-6" />,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      {body && <p className="mt-1 text-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-card p-4">
      <div className="flex gap-3">
        <div className="h-14 w-14 rounded-2xl bg-secondary" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 rounded bg-secondary" />
          <div className="h-3 w-1/2 rounded bg-secondary" />
          <div className="h-3 w-3/4 rounded bg-secondary" />
        </div>
      </div>
    </div>
  );
}
