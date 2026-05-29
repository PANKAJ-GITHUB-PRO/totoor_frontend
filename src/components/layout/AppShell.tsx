import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  back?: string;
  hideNav?: boolean;
  hideTop?: boolean;
  right?: ReactNode;
  showBell?: boolean;
}

export function AppShell({ children, title, subtitle, back, hideNav, hideTop, right, showBell }: AppShellProps) {
  return (
    <div className="min-h-screen">
      {!hideTop && <TopBar title={title} subtitle={subtitle} back={back} right={right} showBell={showBell} />}
      <main className={`mx-auto max-w-screen-sm px-4 pt-4 ${hideNav ? "pb-8" : "pb-28"}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
