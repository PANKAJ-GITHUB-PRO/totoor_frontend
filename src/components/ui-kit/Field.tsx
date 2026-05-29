import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  children: ReactNode;
}

export function Field({ label, hint, error, children }: FieldProps) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>}
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-[color:var(--error)]">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({ leftIcon, rightIcon, className = "", ...rest }: InputProps) {
  return (
    <div className="relative">
      {leftIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {leftIcon}
        </span>
      )}
      <input
        className={`h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15 ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${className}`}
        {...rest}
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{rightIcon}</span>
      )}
    </div>
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      rows={4}
      className={`w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15 ${className}`}
      {...rest}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", children, ...rest } = props;
  return (
    <select
      className={`h-12 w-full appearance-none rounded-xl border border-input bg-card px-4 pr-10 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
      }}
      {...rest}
    >
      {children}
    </select>
  );
}
