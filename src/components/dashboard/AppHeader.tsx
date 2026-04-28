import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AppHeader({ onMenu }: { onMenu?: () => void }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.fullName ?? "U")
    .split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/50 bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-2 min-w-0">
        {onMenu && (
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenu} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Business</p>
          <p className="truncate text-sm font-semibold">{user?.businessName ?? "Voxa"}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-hero text-sm font-semibold text-primary-foreground shadow-glow">
          {initials}
        </div>
        <Button variant="ghost" size="icon" onClick={() => { signOut(); navigate("/"); }} aria-label="Sign out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}