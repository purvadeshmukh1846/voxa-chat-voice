import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Settings() {
  const { profile, user, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    full_name: "", business_name: "", whatsapp_number: "", timezone: "Asia/Jakarta",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        business_name: profile.business_name ?? "",
        whatsapp_number: profile.whatsapp_number ?? "",
        timezone: profile.timezone ?? "Asia/Jakarta",
      });
    }
  }, [profile]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Save failed", { description: error.message });
      return;
    }
    await refreshProfile();
    toast.success("Profile updated");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile and plan.</p>
      </div>

      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Full name</Label>
            <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label>Business name</Label>
            <Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} className="mt-1.5" />
          </div>
          <div className="sm:col-span-2">
            <Label>Email</Label>
            <Input value={profile?.email ?? user?.email ?? ""} disabled className="mt-1.5" />
          </div>
          <div>
            <Label>WhatsApp number</Label>
            <Input value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} placeholder="+62 …" className="mt-1.5" />
          </div>
          <div>
            <Label>Timezone</Label>
            <Input value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} className="mt-1.5" />
          </div>
        </div>
        <Button onClick={save} disabled={saving} className="bg-gradient-hero shadow-glow hover:opacity-90">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save changes
        </Button>
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="font-semibold">Plan</h2>
        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-accent/40 bg-accent/5 p-4">
          <div>
            <p className="text-sm text-muted-foreground">Current plan</p>
            <p className="text-lg font-semibold">{profile?.plan ?? "Free"}</p>
          </div>
          <Button variant="outline">Upgrade</Button>
        </div>
      </section>
    </div>
  );
}
