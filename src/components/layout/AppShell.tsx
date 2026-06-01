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
    <div className="fixed inset-0 flex flex-col bg-background">
      {!hideTop && <TopBar title={title} subtitle={subtitle} back={back} right={right} showBell={showBell} />}
      <main
        className={`min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain mx-auto w-full max-w-screen-sm px-4 ${hideNav ? "pb-8" : "pb-28"}`}
      >
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
