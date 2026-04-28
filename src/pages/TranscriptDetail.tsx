import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranscripts } from "@/contexts/TranscriptContext";
import { intentStyle, statusStyle, relativeTime } from "@/lib/transcriptUi";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, MessageCircle, Phone, Sparkles, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function TranscriptDetail() {
  const { id } = useParams<{ id: string }>();
  const { getById, updateStatus } = useTranscripts();
  const navigate = useNavigate();
  const t = id ? getById(id) : undefined;

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

  const setStatus = (s: typeof t.status) => {
    updateStatus(t.id, s);
    toast.success(`Marked as ${s}`);
    if (s === "Resolved") setTimeout(() => navigate("/dashboard"), 400);
  };

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
              <span className="font-mono">{t.customerNumber}</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold leading-tight">{t.summary}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className={cn("rounded-full px-2.5 py-1 font-medium", intent.cls)}>{t.intent}</span>
              <span className={cn("rounded-full px-2.5 py-1 font-medium", status.cls)}>{t.status}</span>
              <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {relativeTime(t.createdAt)}</span>
              <span className="text-muted-foreground">· {t.language} · {t.durationSec}s</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-5">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wide">AI Summary</p>
          </div>
          <p className="mt-2 text-sm text-foreground">{t.summary}</p>
          {t.entities.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {t.entities.map((e) => (
                <div key={e.label} className="rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-xs">
                  <p className="text-muted-foreground">{e.label}</p>
                  <p className="font-medium text-foreground">{e.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full transcript</p>
          <p className="mt-2 whitespace-pre-wrap rounded-2xl border border-border/60 bg-card/40 p-4 text-sm leading-relaxed">
            {t.fullText}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={() => setStatus("Replied")} disabled={t.status === "Replied"} className="bg-gradient-hero shadow-glow hover:opacity-90">
            <MessageCircle className="mr-2 h-4 w-4" /> Mark as Replied
          </Button>
          <Button onClick={() => setStatus("Resolved")} variant="outline" disabled={t.status === "Resolved"}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Resolved
          </Button>
        </div>
      </div>
    </div>
  );
}