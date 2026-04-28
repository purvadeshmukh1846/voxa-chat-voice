import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranscripts } from "@/contexts/TranscriptContext";
import { TranscriptCard } from "@/components/dashboard/TranscriptCard";
import { NewVoiceNoteDialog } from "@/components/dashboard/NewVoiceNoteDialog";
import { Status } from "@/data/mockTranscripts";
import { cn } from "@/lib/utils";

const statusFilters: ("All" | Status)[] = ["All", "Open", "Replied", "Resolved"];
const languages = ["All", "English", "Bahasa Indonesia", "Thai", "Vietnamese", "Tagalog"] as const;

export default function Inbox() {
  const { transcripts } = useTranscripts();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<typeof statusFilters[number]>("All");
  const [language, setLanguage] = useState<typeof languages[number]>("All");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transcripts.filter((t) => {
      if (status !== "All" && t.status !== status) return false;
      if (language !== "All" && t.language !== language) return false;
      if (q && !`${t.summary} ${t.fullText} ${t.customerNumber}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [transcripts, query, status, language]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} of {transcripts.length} transcripts</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-gradient-hero shadow-glow hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" /> New voice note
        </Button>
      </div>

      <div className="glass rounded-2xl p-4 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transcripts, customers, summaries…"
            className="pl-9 h-11 bg-background/50"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                status === s
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
          <div className="ml-auto">
            <Select value={language} onValueChange={(v) => setLanguage(v as typeof languages[number])}>
              <SelectTrigger className="h-9 w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {languages.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
            No transcripts match your filters.
          </div>
        ) : (
          filtered.map((t) => (
            <TranscriptCard key={t.id} transcript={t} onClick={() => navigate(`/dashboard/transcript/${t.id}`)} />
          ))
        )}
      </div>

      <NewVoiceNoteDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}