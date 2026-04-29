import type { VoiceNoteIntent, VoiceNoteStatus } from "@/services/voiceNotes";

export type Intent = VoiceNoteIntent;
export type Status = VoiceNoteStatus;

export function intentStyle(intent: Intent) {
  const map: Record<Intent, string> = {
    Reservation: "bg-accent/15 text-accent border border-accent/30",
    "Price Inquiry": "bg-primary/15 text-primary border border-primary/30",
    Complaint: "bg-destructive/15 text-destructive border border-destructive/30",
    Urgent: "bg-gold/20 text-gold border border-gold/40",
    General: "bg-muted text-muted-foreground border border-border",
    Order: "bg-primary/15 text-primary border border-primary/30",
    Cancellation: "bg-destructive/15 text-destructive border border-destructive/30",
  };
  return { cls: map[intent] };
}

export function statusStyle(status: Status) {
  const map: Record<Status, string> = {
    Open: "bg-gold/15 text-gold border border-gold/30",
    "In Progress": "bg-primary/15 text-primary border border-primary/30",
    Resolved: "bg-muted text-muted-foreground border border-border",
    Archived: "bg-muted text-muted-foreground border border-border",
  };
  return { cls: map[status] };
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}