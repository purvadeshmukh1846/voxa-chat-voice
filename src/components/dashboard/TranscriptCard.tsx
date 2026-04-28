import { Transcript } from "@/data/mockTranscripts";
import { intentStyle, statusStyle, relativeTime } from "@/lib/transcriptUi";
import { cn } from "@/lib/utils";
import { Clock, Languages } from "lucide-react";

interface Props {
  transcript: Transcript;
  active?: boolean;
  onClick?: () => void;
}

export function TranscriptCard({ transcript, active, onClick }: Props) {
  const intent = intentStyle(transcript.intent);
  const status = statusStyle(transcript.status);
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full text-left rounded-2xl border border-border/60 bg-card/60 p-4 transition-all backdrop-blur-sm",
        "hover:border-accent/50 hover:shadow-card hover:-translate-y-0.5",
        active && "border-accent ring-2 ring-accent/30 shadow-card"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs text-muted-foreground">{transcript.customerNumber}</p>
          <p className="mt-1 font-semibold leading-snug text-foreground line-clamp-2">
            {transcript.summary}
          </p>
        </div>
        <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-medium", status.cls)}>
          {transcript.status}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className={cn("rounded-full px-2.5 py-1 font-medium", intent.cls)}>
          {transcript.intent}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Languages className="h-3 w-3" />
          {transcript.language}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground ml-auto">
          <Clock className="h-3 w-3" />
          {relativeTime(transcript.createdAt)}
        </span>
      </div>
    </button>
  );
}