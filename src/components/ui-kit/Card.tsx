import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "soft" | "floating";
}

export function Card({ children, variant = "default", className = "", ...rest }: CardProps) {
  const styles = {
    default: "bg-card border border-border shadow-soft",
    soft: "bg-surface border border-border",
    floating: "bg-card shadow-floating",
  }[variant];
  return (
    <div className={`rounded-2xl ${styles} ${className}`} {...rest}>
      {children}
    </div>
  );
}

interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  size?: "sm" | "md";
}

export function Chip({ active, onClick, children, size = "md" }: ChipProps) {
  const base = size === "sm" ? "h-7 px-3 text-xs" : "h-9 px-4 text-sm";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap transition ${base} ${
        active
          ? "bg-brand-gradient text-white shadow-glow"
          : "bg-card border border-border text-foreground hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}

export function Tag({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "primary" | "accent" | "success" | "warning" }) {
  const tones = {
    muted: "bg-secondary text-muted-foreground",
    primary: "bg-primary-soft text-primary",
    accent: "bg-accent-soft text-foreground",
    success: "bg-[oklch(0.94_0.06_155)] text-[oklch(0.35_0.12_155)]",
    warning: "bg-[oklch(0.95_0.08_75)] text-[oklch(0.4_0.14_75)]",
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${tones}`}>{children}</span>;
}
