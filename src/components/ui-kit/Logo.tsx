import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  to?: string;
  className?: string;
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-12 w-12",
};

export function Logo({ size = "md", showText = true, to = "/dashboard", className }: LogoProps) {
  const image = (
    <img
      src="/logo.png"
      alt="Tudoor"
      className={cn("shrink-0 rounded-xl object-cover shadow-soft", sizes[size])}
    />
  );

  const content = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {image}
      {showText && <span className="font-semibold tracking-tight">Tudoor</span>}
    </span>
  );

  if (!to) return content;

  return (
    <Link to={to} className="inline-flex items-center gap-2">
      {image}
      {showText && <span className="font-semibold tracking-tight">Tudoor</span>}
    </Link>
  );
}

export function LogoMark({ className, pulse = false }: { className?: string; pulse?: boolean }) {
  return (
    <div className={cn("relative inline-flex", pulse && "animate-pulse", className)}>
      <img src="/logo.png" alt="Tudoor" className="h-14 w-14 rounded-2xl object-cover shadow-soft" />
    </div>
  );
}
