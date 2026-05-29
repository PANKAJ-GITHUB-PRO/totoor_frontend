import { Lock, Phone, MessageCircle, Check } from "lucide-react";
import { PillButton } from "./PillButton";

interface Props {
  unlocked: boolean;
  phone: string;
  whatsapp: string;
  message?: string;
}

export function ContactUnlock({ unlocked, phone, whatsapp, message }: Props) {
  if (!unlocked) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface p-5 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">
          <Lock className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium">Contact unlocks after approval</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {message ?? "Phone and WhatsApp become visible once your request is accepted."}
        </p>
        <div className="mt-4 flex gap-2 justify-center">
          <PillButton variant="outline" size="sm" leftIcon={<Phone className="h-4 w-4" />} disabled>Call</PillButton>
          <PillButton variant="outline" size="sm" leftIcon={<MessageCircle className="h-4 w-4" />} disabled>WhatsApp</PillButton>
        </div>
      </div>
    );
  }
  const waLink = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;
  const telLink = `tel:${phone.replace(/\s/g, "")}`;
  return (
    <div className="rounded-2xl bg-soft-gradient p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[oklch(0.85_0.16_155)] text-white">
          <Check className="h-4 w-4" />
        </span>
        Contact unlocked
      </div>
      <div className="grid gap-2">
        <a
          href={telLink}
          className="flex items-center justify-between rounded-xl bg-card px-4 py-3 shadow-soft"
        >
          <span className="flex items-center gap-3 text-sm">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-primary">
              <Phone className="h-4 w-4" />
            </span>
            <span className="font-medium">{phone}</span>
          </span>
          <span className="text-xs font-medium text-primary">Call</span>
        </a>
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-xl bg-card px-4 py-3 shadow-soft"
        >
          <span className="flex items-center gap-3 text-sm">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-foreground">
              <MessageCircle className="h-4 w-4" />
            </span>
            <span className="font-medium">{whatsapp}</span>
          </span>
          <span className="text-xs font-medium text-primary">Open</span>
        </a>
      </div>
    </div>
  );
}
