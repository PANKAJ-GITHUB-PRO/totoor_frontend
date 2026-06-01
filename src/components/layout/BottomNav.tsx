import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Newspaper, User } from "lucide-react";

const items = [
  { to: "/feed", label: "Feed", icon: Newspaper },
  { to: "/search", label: "Search", icon: Search },
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl">
      <ul className="mx-auto flex max-w-screen-sm items-stretch justify-between px-2 safe-bottom">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full transition ${
                    active ? "bg-brand-gradient text-white shadow-glow" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className={active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
