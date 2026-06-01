import type { ReactNode } from "react";
import { Phone } from "lucide-react";
import { Field } from "@/components/ui-kit/Field";
import { mobileDigits, validateIndianMobile } from "@/lib/contact";

interface Props {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  onChange: (value: string) => void;
}

export function PhoneInput({ label, value, hint, icon = <Phone className="h-4 w-4" />, onChange }: Props) {
  const digits = mobileDigits(value);
  const error = digits.length > 0 && !validateIndianMobile(value) ? "Enter a valid 10-digit Indian mobile number." : "";

  return (
    <Field label={label} hint={hint ?? "Only enter the 10-digit mobile number."} error={error}>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm font-medium text-foreground">+91</span>
        <input
          value={digits}
          inputMode="numeric"
          maxLength={10}
          placeholder="9876543210"
          onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 10))}
          className="h-12 w-full rounded-xl border border-input bg-card px-4 pl-[4.6rem] text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
      </div>
    </Field>
  );
}
