import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, MessageCircle, GraduationCap, ArrowRight } from "lucide-react";
import { PillButton } from "@/components/ui-kit/PillButton";
import { Field, Input, Select } from "@/components/ui-kit/Field";
import { useSession } from "@/lib/session";
import { CITIES } from "@/lib/mock-data";

export const Route = createFileRoute("/onboarding/student")({ component: StudentOnboarding });

function StudentOnboarding() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", grade: "", city: "Bangalore", pincode: "", phone: "", whatsapp: "" });
  const navigate = useNavigate();
  const { completeOnboarding } = useSession();
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const next = () => {
    if (step < 3) return setStep(step + 1);
    completeOnboarding(form.name || "Student");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen mx-auto max-w-screen-sm px-5 pt-8 pb-12">
      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand-gradient" : "bg-secondary"}`} />
        ))}
      </div>
      <h1 className="text-2xl font-bold tracking-tight">
        {step === 1 ? "Tell us about you" : step === 2 ? "Where are you?" : "Stay in touch"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Step {step} of 3</p>

      <div className="mt-6 grid gap-3">
        {step === 1 && (
          <>
            <Field label="Full name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" leftIcon={<GraduationCap className="h-4 w-4" />} /></Field>
            <Field label="Current grade / course"><Input value={form.grade} onChange={(e) => set("grade", e.target.value)} placeholder="e.g. Class 12 — Science" /></Field>
          </>
        )}
        {step === 2 && (
          <>
            <Field label="City"><Select value={form.city} onChange={(e) => set("city", e.target.value)}>{CITIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
            <Field label="Pincode"><Input value={form.pincode} onChange={(e) => set("pincode", e.target.value)} placeholder="560001" inputMode="numeric" leftIcon={<MapPin className="h-4 w-4" />} /></Field>
          </>
        )}
        {step === 3 && (
          <>
            <Field label="Contact number" hint="Visible only after a Tuddor approves your request.">
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" leftIcon={<Phone className="h-4 w-4" />} />
            </Field>
            <Field label="WhatsApp number">
              <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+91 98765 43210" leftIcon={<MessageCircle className="h-4 w-4" />} />
            </Field>
          </>
        )}
      </div>

      <div className="mt-8 flex gap-2">
        {step > 1 && <PillButton variant="outline" size="lg" onClick={() => setStep(step - 1)}>Back</PillButton>}
        <PillButton size="lg" fullWidth={step === 1} onClick={next} rightIcon={<ArrowRight className="h-4 w-4" />}>
          {step === 3 ? "Finish" : "Continue"}
        </PillButton>
      </div>
    </div>
  );
}
