import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { EducationSelect } from "@/components/forms/EducationSelect";
import { LocationFields } from "@/components/forms/LocationFields";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { Chip } from "@/components/ui-kit/Card";
import { Field, Input, Textarea } from "@/components/ui-kit/Field";
import { PillButton } from "@/components/ui-kit/PillButton";
import { api } from "@/lib/api";
import { formatIndianMobile, validateIndianMobile } from "@/lib/contact";
import { consumePostAuthRedirect } from "@/lib/authRedirect";
import { useSession } from "@/lib/session";
import type { TeachingMode } from "@/lib/types";

export const Route = createFileRoute("/onboarding/tutor")({ component: TutorOnboarding });

const MODES: { id: TeachingMode; label: string }[] = [
  { id: "online", label: "Online" },
  { id: "one-to-one", label: "One-to-one" },
  { id: "group", label: "Group classes" },
  { id: "home", label: "Home tuition" },
];

function TutorOnboarding() {
  const [step, setStep] = useState(1);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: sessionStorage.getItem("pendingName") ?? "",
    headline: "",
    bio: "",
    education: "",
    skills: "",
    experience: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    phone: "",
    whatsapp: "",
    pricePerHour: "",
    minimumFee: "",
    subjects: [] as string[],
    modes: [] as TeachingMode[],
  });
  const navigate = useNavigate();
  const { completeOnboarding, onboarded } = useSession();

  useEffect(() => {
    if (onboarded) navigate({ to: consumePostAuthRedirect() });
  }, [navigate, onboarded]);
  useEffect(() => { api.subjects().then(setSubjects).catch(() => setSubjects([])); }, []);

  const toggle = <T,>(arr: T[], value: T) => arr.includes(value) ? arr.filter((item) => item !== value) : [...arr, value];

  const next = async () => {
    setError("");
    if (step < 4) return setStep(step + 1);
    if (!validateIndianMobile(form.phone) || !validateIndianMobile(form.whatsapp)) {
      setError("Enter valid 10-digit Indian phone and WhatsApp numbers.");
      return;
    }
    setLoading(true);
    try {
      await completeOnboarding({
        name: form.name || "Tutor",
        headline: form.headline,
        bio: form.bio,
        education: form.education,
        customEducation: form.education,
        experienceYears: Number(form.experience || 0),
        subjects: form.subjects,
        modes: form.modes,
        skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        pricePerHour: Number(form.pricePerHour || 0),
        minimumFee: Number(form.minimumFee || 0),
        phone: formatIndianMobile(form.phone),
        whatsapp: formatIndianMobile(form.whatsapp),
        kycStatus: "pending",
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
            <Field label="Full name"><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your full name" /></Field>
            <Field label="Headline"><Input value={form.headline} onChange={(event) => setForm({ ...form, headline: event.target.value })} placeholder="e.g. Calculus & JEE mentor" /></Field>
            <Field label="About you"><Textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} placeholder="Briefly describe your teaching style" /></Field>
            <EducationSelect label="Education" value={form.education} onChange={(value) => setForm({ ...form, education: value })} />
            <Field label="Skills"><Input value={form.skills} onChange={(event) => setForm({ ...form, skills: event.target.value })} placeholder="JEE Advanced, Algebra, React" /></Field>
            <Field label="Teaching experience (years)"><Input value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })} inputMode="numeric" placeholder="5" /></Field>
            <Field label="Charges per hour"><Input value={form.pricePerHour} onChange={(event) => setForm({ ...form, pricePerHour: event.target.value })} inputMode="numeric" placeholder="800" /></Field>
            <Field label="Minimum fee"><Input value={form.minimumFee} onChange={(event) => setForm({ ...form, minimumFee: event.target.value })} inputMode="numeric" placeholder="500" /></Field>
          </>
        )}
        {step === 2 && (
          <>
            <p className="text-sm text-muted-foreground">Pick the subjects you teach.</p>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <Chip key={subject} active={form.subjects.includes(subject)} onClick={() => setForm({ ...form, subjects: toggle(form.subjects, subject) })}>{subject}</Chip>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <div className="grid gap-2">
            {MODES.map((mode) => {
              const active = form.modes.includes(mode.id);
              return (
                <button key={mode.id} type="button" onClick={() => setForm({ ...form, modes: toggle(form.modes, mode.id) })}
                  className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${active ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
                  <span className="font-medium">{mode.label}</span>
                  {active && <Check className="h-5 w-5 text-primary" />}
                </button>
              );
            })}
          </div>
        )}
        {step === 4 && (
          <>
            <LocationFields value={form} onChange={(location) => setForm({ ...form, ...location })} />
            <PhoneInput label="Contact number" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} hint="Hidden until a student is approved." />
            <PhoneInput label="WhatsApp number" value={form.whatsapp} onChange={(value) => setForm({ ...form, whatsapp: value })} icon={<MessageCircle className="h-4 w-4" />} />
            {error && <p className="text-sm text-[color:var(--error)]">{error}</p>}
          </>
        )}
      </div>

      <div className="mt-8 flex gap-2">
        {step > 1 && <PillButton variant="outline" size="lg" onClick={() => setStep(step - 1)}>Back</PillButton>}
        <PillButton size="lg" fullWidth={step === 1} loading={loading} disabled={loading} onClick={next} rightIcon={<ArrowRight className="h-4 w-4" />}>
          {step === 4 ? "Finish KYC" : "Continue"}
        </PillButton>
      </div>
    </div>
  );
}
