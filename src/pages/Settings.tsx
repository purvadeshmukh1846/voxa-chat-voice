import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Settings() {
  const { user } = useAuth();

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
            <Input defaultValue={user?.fullName} className="mt-1.5" />
          </div>
          <div>
            <Label>Business name</Label>
            <Input defaultValue={user?.businessName} className="mt-1.5" />
          </div>
          <div className="sm:col-span-2">
            <Label>Email</Label>
            <Input defaultValue={user?.email} className="mt-1.5" />
          </div>
          <div>
            <Label>WhatsApp number</Label>
            <Input defaultValue={user?.whatsappNumber ?? ""} placeholder="+62 …" className="mt-1.5" />
          </div>
          <div>
            <Label>Timezone</Label>
            <Input defaultValue={user?.timezone ?? "Asia/Jakarta"} className="mt-1.5" />
          </div>
        </div>
        <Button onClick={() => toast.success("Profile updated")} className="bg-gradient-hero shadow-glow hover:opacity-90">
          Save changes
        </Button>
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="font-semibold">Plan</h2>
        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-accent/40 bg-accent/5 p-4">
          <div>
            <p className="text-sm text-muted-foreground">Current plan</p>
            <p className="text-lg font-semibold">{user?.plan ?? "Free"}</p>
          </div>
          <Button variant="outline">Upgrade</Button>
        </div>
      </section>
    </div>
  );
}