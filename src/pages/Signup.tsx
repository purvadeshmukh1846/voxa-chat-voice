import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const timezones = [
  "Asia/Jakarta", "Asia/Bangkok", "Asia/Ho_Chi_Minh", "Asia/Manila", "Asia/Singapore", "Asia/Kuala_Lumpur",
];

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name").max(80),
  businessName: z.string().trim().min(2, "Business name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(100),
  confirmPassword: z.string(),
  whatsappNumber: z.string().trim().max(30).optional().or(z.literal("")),
  timezone: z.string().min(1, "Pick a timezone"),
}).refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords don't match" });

type FormState = z.input<typeof schema>;

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    fullName: "", businessName: "", email: "", password: "", confirmPassword: "", whatsappNumber: "", timezone: "Asia/Jakarta",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await signUp({
        fullName: form.fullName, businessName: form.businessName, email: form.email,
        password: form.password, whatsappNumber: form.whatsappNumber || undefined, timezone: form.timezone,
      });
      toast.success("Account created!");
      navigate("/dashboard");
    } catch {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/"><Logo /></Link>
        <ThemeToggle />
      </div>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg glass rounded-3xl p-8 shadow-elevated animate-scale-in">
          <h1 className="text-2xl font-bold">Create your Voxa account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start triaging WhatsApp voice notes in minutes.</p>

          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className="mt-1.5" />
              {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>}
            </div>
            <div className="sm:col-span-1">
              <Label htmlFor="businessName">Business name</Label>
              <Input id="businessName" value={form.businessName} onChange={(e) => set("businessName", e.target.value)} className="mt-1.5" />
              {errors.businessName && <p className="mt-1 text-xs text-destructive">{errors.businessName}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1.5" />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} className="mt-1.5" />
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} className="mt-1.5" />
              {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>
            <div>
              <Label htmlFor="whatsappNumber">WhatsApp number <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="whatsappNumber" placeholder="+62 812-3456-7890" value={form.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={form.timezone} onValueChange={(v) => set("timezone", v)}>
                <SelectTrigger id="timezone" className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.timezone && <p className="mt-1 text-xs text-destructive">{errors.timezone}</p>}
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading} className="w-full bg-gradient-hero shadow-glow hover:opacity-90">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-medium text-accent hover:underline">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}