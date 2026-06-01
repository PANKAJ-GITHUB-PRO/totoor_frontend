import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, GraduationCap, MessageCircle } from "lucide-react";
import { EducationSelect } from "@/components/forms/EducationSelect";
import { LocationFields } from "@/components/forms/LocationFields";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { Field, Input } from "@/components/ui-kit/Field";
import { PillButton } from "@/components/ui-kit/PillButton";
import { formatIndianMobile, validateIndianMobile } from "@/lib/contact";
import { consumePostAuthRedirect } from "@/lib/authRedirect";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/onboarding/student")({ component: StudentOnboarding });

function StudentOnboarding() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: sessionStorage.getItem("pendingName") ?? "",
    grade: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    phone: "",
    whatsapp: ""
  });
  const navigate = useNavigate();
  const { completeOnboarding, onboarded } = useSession();
  const set = (key: string, value: string) => setForm({ ...form, [key]: value });

  useEffect(() => {
    if (onboarded) navigate({ to: consumePostAuthRedirect() });
  }, [navigate, onboarded]);

  const next = async () => {
    setError("");
    if (step < 3) return setStep(step + 1);
    if (!validateIndianMobile(form.phone) || !validateIndianMobile(form.whatsapp)) {
      setError("Enter valid 10-digit Indian phone and WhatsApp numbers.");
      return;
    }
    setLoading(true);
    try {
      await completeOnboarding({
        name: form.name || "Student",
        grade: form.grade,
        education: form.grade,
        customEducation: form.grade,
        phone: formatIndianMobile(form.phone),
        whatsapp: formatIndianMobile(form.whatsapp),
        location: { state: form.state, district: form.district || form.city, city: form.city, pincode: form.pincode }
      });
      sessionStorage.removeItem("pendingName");
      navigate({ to: consumePostAuthRedirect() });
    } finally {
      setLoading(false);
    }
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
            <Field label="Full name">
              <Input value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="Your name" leftIcon={<GraduationCap className="h-4 w-4" />} />
            </Field>
            <EducationSelect value={form.grade} onChange={(value) => set("grade", value)} />
          </>
        )}
        {step === 2 && (
          <LocationFields value={form} onChange={(location) => setForm({ ...form, ...location })} />
        )}
        {step === 3 && (
          <>
            <PhoneInput label="Contact number" value={form.phone} onChange={(value) => set("phone", value)} hint="Visible only after a tutor approves your request." />
            <PhoneInput label="WhatsApp number" value={form.whatsapp} onChange={(value) => set("whatsapp", value)} icon={<MessageCircle className="h-4 w-4" />} />
            {error && <p className="text-sm text-[color:var(--error)]">{error}</p>}
          </>
        )}
      </div>

      <div className="mt-8 flex gap-2">
        {step > 1 && <PillButton variant="outline" size="lg" onClick={() => setStep(step - 1)}>Back</PillButton>}
        <PillButton size="lg" fullWidth={step === 1} loading={loading} disabled={loading} onClick={next} rightIcon={<ArrowRight className="h-4 w-4" />}>
          {step === 3 ? "Finish" : "Continue"}
        </PillButton>
      </div>
    </div>
  );
}
