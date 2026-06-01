import { Check, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

interface Props {
  value: string;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function SearchableSelect({ value, options, placeholder, disabled, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchText = query || value;
  const visibleOptions = useMemo(() => {
    const needle = searchText.trim().toLowerCase();
    return needle ? options.filter((option) => option.toLowerCase().includes(needle)) : options;
  }, [options, searchText]);

  const choose = (next: string) => {
    onChange(next);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
        <Search className="h-4 w-4" />
      </span>
      <input
        value={open ? searchText : value}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          onChange(event.target.value);
          setOpen(true);
        }}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        className="h-12 w-full rounded-xl border border-input bg-card px-4 pl-10 pr-10 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:opacity-60"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </span>

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 max-h-64 overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-floating">
          {visibleOptions.map((option) => (
            <button
              key={option}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(option)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-primary-soft ${value === option ? "bg-primary-soft text-primary" : ""}`}
            >
              <span className="truncate">{option}</span>
              {value === option && <Check className="h-4 w-4 shrink-0" />}
            </button>
          ))}
          {!visibleOptions.length && (
            <div className="px-3 py-3 text-sm text-muted-foreground">Keep typing to save this custom value.</div>
          )}
        </div>
      )}
    </div>
  );
}
