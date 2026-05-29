import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, MessageCircle, ArrowRight, Check } from "lucide-react";
import { PillButton } from "@/components/ui-kit/PillButton";
import { Field, Input, Select, Textarea } from "@/components/ui-kit/Field";
import { Chip } from "@/components/ui-kit/Card";
import { useSession } from "@/lib/session";
import { SUBJECTS, CITIES } from "@/lib/mock-data";
import type { TeachingMode } from "@/lib/types";

export const Route = createFileRoute("/onboarding/tuddor")({ component: TuddorOnboarding });

const MODES: { id: TeachingMode; label: string }[] = [
  { id: "online", label: "Online" },
  { id: "one-to-one", label: "One-to-one" },
  { id: "group", label: "Group classes" },
  { id: "home", label: "Home tuition" },
];

function TuddorOnboarding() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", headline: "", bio: "", education: "", experience: "",
    city: "Bangalore", pincode: "", phone: "", whatsapp: "",
    subjects: [] as string[], modes: [] as TeachingMode[],
  });
  const navigate = useNavigate();
  const { completeOnboarding } = useSession();

  const toggle = <T,>(arr: T[], v: T) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

  const next = () => {
    if (step < 4) return setStep(step + 1);
    completeOnboarding(form.name || "Tuddor");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen mx-auto max-w-screen-sm px-5 pt-8 pb-12">
      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand-gradient" : "bg-secondary"}`} />
        ))}
      </div>
      <h1 className="text-2xl font-bold tracking-tight">
        {step === 1 ? "Your profile" : step === 2 ? "Subjects & skills" : step === 3 ? "Teaching modes" : "KYC & contact"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Step {step} of 4</p>

      <div className="mt-6 grid gap-3">
        {step === 1 && (
          <>
            <Field label="Full name"><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Your full name" /></Field>
            <Field label="Headline"><Input value={form.headline} onChange={(e) => setForm({...form, headline: e.target.value})} placeholder="e.g. Calculus & JEE mentor" /></Field>
            <Field label="About you"><Textarea value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} placeholder="Briefly describe your teaching style…" /></Field>
            <Field label="Education"><Input value={form.education} onChange={(e) => setForm({...form, education: e.target.value})} placeholder="B.Tech, IIT Bombay" /></Field>
            <Field label="Teaching experience (years)"><Input value={form.experience} onChange={(e) => setForm({...form, experience: e.target.value})} inputMode="numeric" placeholder="5" /></Field>
          </>
        )}
        {step === 2 && (
          <>
            <p className="text-sm text-muted-foreground">Pick the subjects you teach.</p>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <Chip key={s} active={form.subjects.includes(s)} onClick={() => setForm({...form, subjects: toggle(form.subjects, s)})}>{s}</Chip>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <div className="grid gap-2">
            {MODES.map((m) => {
              const active = form.modes.includes(m.id);
              return (
                <button key={m.id} type="button" onClick={() => setForm({...form, modes: toggle(form.modes, m.id)})}
                  className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${active ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
                  <span className="font-medium">{m.label}</span>
                  {active && <Check className="h-5 w-5 text-primary" />}
                </button>
              );
            })}
          </div>
        )}
        {step === 4 && (
          <>
            <Field label="City"><Select value={form.city} onChange={(e) => setForm({...form, city: e.target.value})}>{CITIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
            <Field label="Pincode"><Input value={form.pincode} onChange={(e) => setForm({...form, pincode: e.target.value})} inputMode="numeric" placeholder="560001" /></Field>
            <Field label="Contact number" hint="Hidden until a student is approved.">
              <Input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210" leftIcon={<Phone className="h-4 w-4" />} />
            </Field>
            <Field label="WhatsApp number">
              <Input value={form.whatsapp} onChange={(e) => setForm({...form, whatsapp: e.target.value})} placeholder="+91 98765 43210" leftIcon={<MessageCircle className="h-4 w-4" />} />
            </Field>
          </>
        )}
      </div>

      <div className="mt-8 flex gap-2">
        {step > 1 && <PillButton variant="outline" size="lg" onClick={() => setStep(step - 1)}>Back</PillButton>}
        <PillButton size="lg" fullWidth={step === 1} onClick={next} rightIcon={<ArrowRight className="h-4 w-4" />}>
          {step === 4 ? "Finish KYC" : "Continue"}
        </PillButton>
      </div>
    </div>
  );
}
