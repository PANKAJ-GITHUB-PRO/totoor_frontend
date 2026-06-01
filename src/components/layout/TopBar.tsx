import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui-kit/Logo";

interface Props {
  title?: string;
  subtitle?: string;
  back?: string;
  right?: ReactNode;
  showBell?: boolean;
}

export function TopBar({ title, subtitle, back, right, showBell }: Props) {
  return (
    <header className="relative z-30 shrink-0 border-b border-border/60 bg-background">
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
          <Logo size="md" />
        )}
        <div className="flex-1 min-w-0">
          {title && <h1 className="text-base font-semibold leading-tight truncate">{title}</h1>}
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}
