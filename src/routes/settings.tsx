import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui-kit/Card";
import { ChevronRight, Moon, Bell, Shield, HelpCircle, Globe } from "lucide-react";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

const groups = [
  { title: "Preferences", items: [
    { icon: Moon, label: "Appearance", value: "System" },
    { icon: Globe, label: "Language", value: "English" },
    { icon: Bell, label: "Notifications", value: "On" },
  ]},
  { title: "Account", items: [
    { icon: Shield, label: "Privacy & security" },
    { icon: HelpCircle, label: "Help & support" },
  ]},
];

function SettingsPage() {
  return (
    <AppShell title="Settings" back="/profile">
      <div className="space-y-6">
        {groups.map((g) => (
          <div key={g.title}>
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{g.title}</h2>
            <Card>
              {g.items.map(({ icon: Icon, label, value }, i) => (
                <div key={label} className={`flex items-center gap-3 px-4 py-3.5 ${i ? "border-t border-border" : ""}`}>
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 font-medium">{label}</span>
                  {value && <span className="text-sm text-muted-foreground">{value}</span>}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
