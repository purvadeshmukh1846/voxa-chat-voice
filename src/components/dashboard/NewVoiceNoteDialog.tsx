import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVoiceNote, type VoiceNoteIntent } from "@/services/voiceNotes";
import { toast } from "sonner";

const intents: VoiceNoteIntent[] = ["Reservation", "Complaint", "Price Inquiry", "General", "Urgent", "Order", "Cancellation"];
const languages = ["English", "Bahasa Indonesia", "Thai", "Vietnamese", "Tagalog"];

export function NewVoiceNoteDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [number, setNumber] = useState("");
  const [language, setLanguage] = useState("English");
  const [intent, setIntent] = useState<VoiceNoteIntent>("General");
  const [file, setFile] = useState<File | null>(null);

  const reset = () => { setText(""); setNumber(""); setLanguage("English"); setIntent("General"); setFile(null); };

  const mutation = useMutation({
    mutationFn: async () => {
      // Simulate transcription latency
      await new Promise((r) => setTimeout(r, 1200));
      const summary = text.trim().slice(0, 100) + (text.length > 100 ? "…" : "");
      return createVoiceNote({
        customer_number: number.trim() || "+00 000-000-0000",
        language,
        full_text: text.trim(),
        summary: summary || "(no summary)",
        intent,
        urgency: intent === "Urgent" || intent === "Complaint" ? "high" : "medium",
        status: "Open",
        duration_sec: file ? Math.max(5, Math.round(file.size / 16000)) : 12,
      });
    },
    onSuccess: (vn) => {
      qc.invalidateQueries({ queryKey: ["voice_notes"] });
      toast.success("Voice note transcribed", { description: `New ${vn.intent} from ${vn.customer_number}` });
      onOpenChange(false);
      reset();
    },
    onError: (e) => toast.error("Failed to save", { description: (e as Error).message }),
  });

  const submit = () => {
    if (!text.trim() && !file) {
      toast.error("Add audio or paste a transcript");
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-lg glass-strong">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" /> New voice note
          </DialogTitle>
          <DialogDescription>Upload audio or paste text to simulate transcription.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="number" className="mb-2 block text-sm">Customer number</Label>
            <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="+62 812-3456-7890" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-2 block text-sm">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{languages.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block text-sm">Intent</Label>
              <Select value={intent} onValueChange={(v) => setIntent(v as VoiceNoteIntent)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{intents.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="audio" className="mb-2 block text-sm">Audio file (optional)</Label>
            <label htmlFor="audio" className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 p-4 transition-colors hover:border-accent/60">
              <Upload className="h-5 w-5 text-accent" />
              <span className="text-sm text-muted-foreground">{file ? file.name : "Click to upload (.mp3, .ogg)"}</span>
              <input id="audio" type="file" accept="audio/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <div>
            <Label htmlFor="text" className="mb-2 block text-sm">Transcript</Label>
            <Textarea id="text" value={text} onChange={(e) => setText(e.target.value)} rows={4} maxLength={2000}
              placeholder="e.g. Halo, saya mau pesan meja untuk 4 orang…" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>Cancel</Button>
          <Button onClick={submit} disabled={mutation.isPending} className="bg-gradient-hero hover:opacity-90 shadow-glow">
            {mutation.isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transcribing…</>) : "Transcribe & save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
