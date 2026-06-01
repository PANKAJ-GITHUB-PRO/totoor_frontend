import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const stickyShellClass =
  "sticky top-0 z-20 -mx-4 border-b border-border/60 bg-background px-4 shadow-[0_1px_0_0_var(--color-border)]";

/** Sticks flush below TopBar; opaque background hides scrolling content underneath. */
export function StickySubheader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(stickyShellClass, "py-3", className)}>{children}</div>;
}

/** Profile hero + rating block that stays pinned while scrolling details. */
export function StickyProfileBlock({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(stickyShellClass, "space-y-4 py-4", className)}>{children}</div>;
}

/** Default page padding when the first block is not sticky. */
export function PageContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("pt-4", className)}>{children}</div>;
}
