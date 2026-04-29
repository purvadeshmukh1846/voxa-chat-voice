import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Sparkles, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TranscriptCard } from "@/components/dashboard/TranscriptCard";
import { NewVoiceNoteDialog } from "@/components/dashboard/NewVoiceNoteDialog";
import { listVoiceNotes, type VoiceNoteStatus } from "@/services/voiceNotes";
import { seedSampleVoiceNotes } from "@/services/seed";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusFilters: ("All" | VoiceNoteStatus)[] = ["All", "Open", "In Progress", "Resolved", "Archived"];
const languages = ["All", "English", "Bahasa Indonesia", "Thai", "Vietnamese", "Tagalog"] as const;
const PAGE_SIZE = 20;

export default function Inbox() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<typeof statusFilters[number]>("All");
  const [language, setLanguage] = useState<typeof languages[number]>("All");
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["voice_notes", { status, language, query, page }],
    queryFn: () => listVoiceNotes({ status, language, search: query, page, pageSize: PAGE_SIZE }),
  });

  const rows = data?.rows ?? [];
  const total = data?.count ?? 0;
  const showing = rows.length;

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const n = await seedSampleVoiceNotes();
      if (n > 0) {
        toast.success(`Added ${n} sample voice notes`);
        qc.invalidateQueries({ queryKey: ["voice_notes"] });
      } else {
        toast.info("You already have voice notes");
      }
    } catch (e) {
      toast.error("Could not seed samples", { description: (e as Error).message });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
          <p className="text-sm text-muted-foreground">{showing} of {total} transcripts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeed} disabled={seeding}>
            {seeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Load samples
          </Button>
          <Button onClick={() => setDialogOpen(true)} className="bg-gradient-hero shadow-glow hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" /> New voice note
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder="Search transcripts, customers, summaries…"
            className="pl-9 h-11 bg-background/50"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(0); }}
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
            <Select value={language} onValueChange={(v) => { setLanguage(v as typeof languages[number]); setPage(0); }}>
              <SelectTrigger className="h-9 w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {languages.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-border/60 bg-card/40" />
          ))
        ) : isError ? (
          <div className="glass rounded-2xl p-12 text-center text-destructive">
            Failed to load: {(error as Error).message}
          </div>
        ) : rows.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
            No transcripts yet. Click <span className="text-foreground font-medium">Load samples</span> or <span className="text-foreground font-medium">New voice note</span> to get started.
          </div>
        ) : (
          rows.map((t) => (
            <TranscriptCard key={t.id} transcript={t} onClick={() => navigate(`/dashboard/transcript/${t.id}`)} />
          ))
        )}
      </div>

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-xs text-muted-foreground">Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}</span>
          <Button variant="outline" size="sm" disabled={(page + 1) * PAGE_SIZE >= total} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}

      <NewVoiceNoteDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
