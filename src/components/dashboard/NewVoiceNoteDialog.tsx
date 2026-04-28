import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Upload } from "lucide-react";
import { useTranscripts, generateMockFromSeed } from "@/contexts/TranscriptContext";
import { toast } from "sonner";

export function NewVoiceNoteDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { addTranscript } = useTranscripts();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);

  const reset = () => { setText(""); setFile(null); setProcessing(false); };

  const handleSubmit = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    const base = generateMockFromSeed();
    const newT = addTranscript({
      ...base,
      fullText: text.trim() ? text.trim() : base.fullText,
      summary: text.trim() ? text.trim().slice(0, 90) + (text.length > 90 ? "…" : "") : base.summary,
    });
    setProcessing(false);
    onOpenChange(false);
    reset();
    toast.success("Voice note transcribed", { description: `New ${newT.intent} from ${newT.customerNumber}` });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-lg glass-strong">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" /> New voice note
          </DialogTitle>
          <DialogDescription>
            Upload an audio file or paste text to simulate transcription.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="audio" className="mb-2 block text-sm">Audio file (.mp3, .ogg)</Label>
            <label htmlFor="audio" className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 p-4 transition-colors hover:border-accent/60">
              <Upload className="h-5 w-5 text-accent" />
              <span className="text-sm text-muted-foreground">
                {file ? file.name : "Click to upload or drag a file here"}
              </span>
              <input
                id="audio"
                type="file"
                accept=".mp3,.ogg,audio/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <div>
            <Label htmlFor="text" className="mb-2 block text-sm">Or paste a sample transcript</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="e.g. Halo, saya mau pesan meja untuk 4 orang…"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={processing}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={processing} className="bg-gradient-hero hover:opacity-90 shadow-glow">
            {processing ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transcribing…</>) : "Transcribe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}