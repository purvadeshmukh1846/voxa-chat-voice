import { supabase } from "@/integrations/supabase/client";
import { DbError } from "./db";

export type VoiceNoteStatus = "Open" | "In Progress" | "Resolved" | "Archived";
export type VoiceNoteIntent =
  | "Reservation" | "Complaint" | "Price Inquiry" | "General" | "Urgent" | "Order" | "Cancellation";
export type VoiceNoteUrgency = "low" | "medium" | "high";

export interface VoiceNote {
  id: string;
  user_id: string;
  customer_id: string | null;
  customer_number: string;
  language: string;
  full_text: string;
  summary: string;
  intent: VoiceNoteIntent;
  urgency: VoiceNoteUrgency;
  status: VoiceNoteStatus;
  duration_sec: number;
  created_at: string;
  updated_at: string;
}

export interface VoiceNoteWithRelations extends VoiceNote {
  entities: { id: string; type: string; value: string }[];
  voice_note_tags: { tag_id: string; tags: { id: string; name: string; color: string | null } | null }[];
}

export interface ListFilters {
  status?: VoiceNoteStatus | "All";
  language?: string | "All";
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function listVoiceNotes(filters: ListFilters = {}) {
  const { status, language, search, page = 0, pageSize = 50 } = filters;
  let q = supabase
    .from("voice_notes")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (status && status !== "All") q = q.eq("status", status);
  if (language && language !== "All") q = q.eq("language", language);
  if (search?.trim()) {
    const s = `%${search.trim()}%`;
    q = q.or(`summary.ilike.${s},full_text.ilike.${s},customer_number.ilike.${s}`);
  }
  q = q.range(page * pageSize, page * pageSize + pageSize - 1);

  const { data, error, count } = await q;
  if (error) throw new DbError(error.message, error);
  return { rows: (data ?? []) as VoiceNote[], count: count ?? 0 };
}

export async function getVoiceNote(id: string): Promise<VoiceNoteWithRelations | null> {
  const { data, error } = await supabase
    .from("voice_notes")
    .select("*, entities(id,type,value), voice_note_tags(tag_id, tags(id,name,color))")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new DbError(error.message, error);
  return (data as unknown as VoiceNoteWithRelations) ?? null;
}

export interface CreateVoiceNoteInput {
  customer_number: string;
  language?: string;
  full_text: string;
  summary: string;
  intent?: VoiceNoteIntent;
  urgency?: VoiceNoteUrgency;
  status?: VoiceNoteStatus;
  duration_sec?: number;
  entities?: { type: string; value: string }[];
}

export async function createVoiceNote(input: CreateVoiceNoteInput) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new DbError("Not authenticated");

  const { entities = [], ...row } = input;
  const { data: vn, error } = await supabase
    .from("voice_notes")
    .insert({ ...row, user_id: user.id })
    .select()
    .single();
  if (error) throw new DbError(error.message, error);

  if (entities.length > 0) {
    const { error: e2 } = await supabase
      .from("entities")
      .insert(entities.map((e) => ({ ...e, voice_note_id: vn.id, user_id: user.id })));
    if (e2) throw new DbError(e2.message, e2);
  }
  return vn as VoiceNote;
}

export async function updateVoiceNoteStatus(id: string, status: VoiceNoteStatus) {
  const { data, error } = await supabase
    .from("voice_notes").update({ status }).eq("id", id).select().single();
  if (error) throw new DbError(error.message, error);
  return data as VoiceNote;
}

export async function deleteVoiceNote(id: string) {
  const { error } = await supabase.from("voice_notes").delete().eq("id", id);
  if (error) throw new DbError(error.message, error);
}