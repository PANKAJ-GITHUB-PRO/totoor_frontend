import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui-kit/Card";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/notifications")({ component: Notifications });

function Notifications() {
  return (
    <AppShell title="Notifications" back="/dashboard">
      <div className="grid gap-2">
        {NOTIFICATIONS.map((n) => (
          <Card key={n.id} className={`p-4 ${n.unread ? "ring-1 ring-primary/20" : ""}`}>
            <div className="flex gap-3">
              <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <Bell className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium leading-tight">{n.title}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
              </div>
              {n.unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
