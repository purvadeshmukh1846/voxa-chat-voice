import { Inbox, Settings as SettingsIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Inbox", icon: Inbox, end: true },
  { to: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border/50 bg-sidebar/80 backdrop-blur-xl">
      <div className="px-5 py-5">
        <Logo />
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gradient-hero text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="m-3 rounded-xl border border-border/60 bg-card/50 p-4 text-xs text-muted-foreground">
        <p className="mb-1 font-semibold text-foreground">Voxa Pro</p>
        Unlimited transcripts, advanced intent tagging and team seats.
      </div>
    </aside>
  );
}