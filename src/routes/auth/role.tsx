import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GraduationCap, BookOpenCheck, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { PillButton } from "@/components/ui-kit/PillButton";
import { Card } from "@/components/ui-kit/Card";
import { useSession } from "@/lib/session";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/auth/role")({ component: RoleSelect });

function RoleSelect() {
  const [role, setRole] = useState<Role | null>(null);
  const navigate = useNavigate();
  const { setRole: save } = useSession();

  const submit = () => {
    if (!role) return;
    save(role);
    navigate({ to: role === "student" ? "/onboarding/student" : "/onboarding/tuddor" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto w-full max-w-screen-sm px-5 pt-8 pb-12 flex-1 flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">I'm joining as a…</h1>
        <p className="mt-1 text-sm text-muted-foreground">You can switch roles later from settings.</p>

        <div className="mt-8 grid gap-3">
          {[
            { id: "student" as const, icon: GraduationCap, title: "Student", desc: "Find Tuddors, post learning requirements, and book sessions." },
            { id: "tuddor" as const, icon: BookOpenCheck, title: "Tuddor", desc: "Teach online or in-person, build your profile, accept students." },
          ].map(({ id, icon: Icon, title, desc }) => {
            const active = role === id;
            return (
              <button key={id} onClick={() => setRole(id)} className="text-left">
                <Card className={`p-5 transition ${active ? "ring-2 ring-primary shadow-glow" : ""}`}>
                  <div className="flex items-start gap-4">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl ${active ? "bg-brand-gradient text-white" : "bg-primary-soft text-primary"}`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                    </div>
                    {active && <Check className="h-5 w-5 text-primary" />}
                  </div>
                </Card>
              </button>
            );
          })}
        </div>

        <PillButton size="lg" fullWidth className="mt-8" onClick={submit} disabled={!role} rightIcon={<ArrowRight className="h-4 w-4" />}>Continue</PillButton>
      </div>
    </div>
  );
}
