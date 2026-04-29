import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { intentStyle, statusStyle, relativeTime } from "@/lib/transcriptUi";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, CheckCircle2, MessageCircle, Phone, Sparkles, Clock, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getVoiceNote, updateVoiceNoteStatus, deleteVoiceNote, type VoiceNoteStatus } from "@/services/voiceNotes";

export default function TranscriptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: t, isLoading } = useQuery({
    queryKey: ["voice_note", id],
    queryFn: () => getVoiceNote(id!),
    enabled: !!id,
  });

  const statusMut = useMutation({
    mutationFn: (s: VoiceNoteStatus) => updateVoiceNoteStatus(id!, s),
    onSuccess: (_, s) => {
      toast.success(`Marked as ${s}`);
      qc.invalidateQueries({ queryKey: ["voice_note", id] });
      qc.invalidateQueries({ queryKey: ["voice_notes"] });
      if (s === "Resolved") setTimeout(() => navigate("/dashboard"), 400);
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteVoiceNote(id!),
    onSuccess: () => {
      toast.success("Voice note deleted");
      qc.invalidateQueries({ queryKey: ["voice_notes"] });
      navigate("/dashboard");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  if (isLoading) {
    return <div className="mx-auto max-w-3xl py-20 text-center text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>;
  }
  if (!t) {
    return (
      <div className="mx-auto max-w-3xl text-center py-20">
        <p className="text-muted-foreground">Transcript not found.</p>
        <Button asChild variant="outline" className="mt-4"><Link to="/dashboard">Back to Inbox</Link></Button>
      </div>
    );
  }

  const intent = intentStyle(t.intent);
  const status = statusStyle(t.status);

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Inbox
      </Link>

      <div className="glass rounded-3xl p-6 sm:p-8 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span className="font-mono">{t.customer_number}</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold leading-tight">{t.summary}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className={cn("rounded-full px-2.5 py-1 font-medium", intent.cls)}>{t.intent}</span>
              <span className={cn("rounded-full px-2.5 py-1 font-medium", status.cls)}>{t.status}</span>
              <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {relativeTime(t.created_at)}</span>
              <span className="text-muted-foreground">· {t.language} · {t.duration_sec}s</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-5">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wide">AI Summary</p>
          </div>
          <p className="mt-2 text-sm text-foreground">{t.summary}</p>
          {t.entities?.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {t.entities.map((e) => (
                <div key={e.id} className="rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-xs">
                  <p className="text-muted-foreground">{e.type}</p>
                  <p className="font-medium text-foreground">{e.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full transcript</p>
          <p className="mt-2 whitespace-pre-wrap rounded-2xl border border-border/60 bg-card/40 p-4 text-sm leading-relaxed">
            {t.full_text}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={() => statusMut.mutate("In Progress")} disabled={t.status === "In Progress" || statusMut.isPending}
            className="bg-gradient-hero shadow-glow hover:opacity-90">
            <MessageCircle className="mr-2 h-4 w-4" /> Mark as In Progress
          </Button>
          <Button onClick={() => statusMut.mutate("Resolved")} variant="outline" disabled={t.status === "Resolved" || statusMut.isPending}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Resolved
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="ml-auto text-destructive hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this voice note?</AlertDialogTitle>
                <AlertDialogDescription>This permanently removes the transcript and its extracted entities.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteMut.mutate()} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
