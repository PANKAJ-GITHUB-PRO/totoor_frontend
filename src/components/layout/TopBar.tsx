import { Link } from "@tanstack/react-router";
import { ChevronLeft, Bell } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title?: string;
  subtitle?: string;
  back?: string;
  right?: ReactNode;
  showBell?: boolean;
}

export function TopBar({ title, subtitle, back, right, showBell }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="mx-auto flex max-w-screen-sm items-center gap-3 px-4 py-3">
        {back ? (
          <Link
            to={back}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card shadow-soft"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : (
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white font-bold shadow-glow">T</span>
            <span className="font-semibold tracking-tight">Tuddor</span>
          </Link>
        )}
        <div className="flex-1 min-w-0">
          {title && <h1 className="text-base font-semibold leading-tight truncate">{title}</h1>}
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
        {right}
        {showBell && (
          <Link
            to="/notifications"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card shadow-soft"
          >
            <Bell className="h-[18px] w-[18px]" />
          </Link>
        )}
      </div>
    </header>
  );
}
