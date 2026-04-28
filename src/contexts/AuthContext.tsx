import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface VoxaUser {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  whatsappNumber?: string;
  timezone?: string;
  plan: "Free" | "Pro" | "Premium";
}

interface AuthContextValue {
  user: VoxaUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: Omit<VoxaUser, "id" | "plan"> & { password: string }) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "voxa.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<VoxaUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const persist = (u: VoxaUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  // TODO: Replace with Supabase auth.signInWithPassword
  const signIn = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    persist({
      id: "u_demo",
      fullName: "Demo User",
      businessName: "Voxa Café",
      email,
      plan: "Pro",
    });
  };

  // TODO: Replace with Supabase auth.signUp
  const signUp: AuthContextValue["signUp"] = async (data) => {
    await new Promise((r) => setTimeout(r, 700));
    persist({
      id: `u_${Date.now()}`,
      fullName: data.fullName,
      businessName: data.businessName,
      email: data.email,
      whatsappNumber: data.whatsappNumber,
      timezone: data.timezone,
      plan: "Free",
    });
  };

  const signOut = () => persist(null);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}