import { supabase } from "@/integrations/supabase/client";
import { createVoiceNote } from "./voiceNotes";

const SAMPLES: Parameters<typeof createVoiceNote>[0][] = [
  {
    customer_number: "+91 98765-43210",
    language: "Marathi",
    full_text: "मस्ती नको, घराची किल्ली लॉकमध्ये अडकली आहे, कोलाडमध्ये लगेच पाठवा.",
    summary: "Urgent: घराची किल्ली लॉकमध्ये अडकली आहे, कोलाड.",
    intent: "Urgent", urgency: "high", status: "Open", duration_sec: 14,
    entities: [{ type: "Location", value: "Kolad" }],
  },
  {
    customer_number: "+91 91234-56789",
    language: "Hindi",
    full_text: "मेरा ऑर्डर IN20458 तीन दिन लेट हो गया है, कृपया जाँच करें।",
    summary: "Order #IN20458 3 दिवस उशिरा आला.",
    intent: "Complaint", urgency: "high", status: "Open", duration_sec: 22,
    entities: [{ type: "Order ID", value: "IN20458" }, { type: "Delay", value: "3 days" }],
  },
  {
    customer_number: "+91 99887-76655",
    language: "English",
    full_text: "Hi, could you tell me the rate for hair highlights at your salon?",
    summary: "Asking price for hair highlights.",
    intent: "Price Inquiry", urgency: "low", status: "In Progress", duration_sec: 12,
    entities: [{ type: "Service", value: "Hair highlights" }],
  },
  {
    customer_number: "+91 88776-65544",
    language: "Marathi",
    full_text: "उद्या संध्याकाळी 7 वाजता 4 जणांसाठी बुकिंग, खिडकीजवळ बसायचं आहे.",
    summary: "Booking for 4 tomorrow 7pm, window seat.",
    intent: "Reservation", urgency: "medium", status: "Resolved", duration_sec: 18,
    entities: [
      { type: "Party size", value: "4" },
      { type: "Time", value: "19:00" },
      { type: "Preference", value: "Window seat" },
    ],
  },
];

export async function seedSampleVoiceNotes() {
  const { count } = await supabase.from("voice_notes").select("id", { count: "exact", head: true });
  if ((count ?? 0) > 0) return 0;
  for (const s of SAMPLES) await createVoiceNote(s);
  return SAMPLES.length;
}
