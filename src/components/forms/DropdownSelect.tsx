import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type DropdownOption = { value: string; label: string };

interface Props {
  value: string;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function DropdownSelect({ value, options, placeholder = "Select option", disabled, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-card px-4 text-left text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:opacity-60"
      >
        <span className={`truncate ${selected ? "text-foreground" : "text-muted-foreground"}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 max-h-64 overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-floating">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-primary-soft ${value === option.value ? "bg-primary-soft text-primary" : ""}`}
            >
              <span className="truncate">{option.label}</span>
              {value === option.value && <Check className="h-4 w-4 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
