import { supabase } from "@/integrations/supabase/client";
import { createVoiceNote } from "./voiceNotes";

const SAMPLES: Parameters<typeof createVoiceNote>[0][] = [
  {
    customer_number: "+91 98200-12345",
    language: "English",
    full_text: "Hi, I'd like to book a table for 4 tomorrow at 7pm. Could we get one near the window?",
    summary: "Reservation for 4 people tomorrow 7pm, prefers window seat.",
    intent: "Reservation", urgency: "medium", status: "Open", duration_sec: 18,
    entities: [
      { type: "Party size", value: "4" },
      { type: "Time", value: "19:00" },
      { type: "Preference", value: "Window seat" },
    ],
  },
  {
    customer_number: "+91 98111-22334",
    language: "Hindi",
    full_text: "नमस्ते, हेयर हाइलाइट्स का रेट क्या है आपके सैलून में?",
    summary: "Asking price for hair highlights.",
    intent: "Price Inquiry", urgency: "low", status: "In Progress", duration_sec: 12,
    entities: [{ type: "Service", value: "Hair highlights" }],
  },
  {
    customer_number: "+91 90210-33445",
    language: "Marathi",
    full_text: "माझा ऑर्डर VX20458 तीन दिवसांपासून उशीर झाला आहे, कृपया तपासा.",
    summary: "Order #VX20458 delayed 3 days.",
    intent: "Complaint", urgency: "high", status: "Open", duration_sec: 22,
    entities: [{ type: "Order ID", value: "VX20458" }, { type: "Delay", value: "3 days" }],
  },
  {
    customer_number: "+91 99887-76655",
    language: "Hindi",
    full_text: "भाई साहब, रसोई में पाइप लीक हो रहा है, कोरमांगल में प्लंबर भेजिए जल्दी।",
    summary: "Urgent: kitchen pipe leak, plumber needed in Koramangala.",
    intent: "Urgent", urgency: "high", status: "Open", duration_sec: 14,
    entities: [{ type: "Location", value: "Koramangala" }],
  },
];

export async function seedSampleVoiceNotes() {
  const { count } = await supabase.from("voice_notes").select("id", { count: "exact", head: true });
  if ((count ?? 0) > 0) return 0;
  for (const s of SAMPLES) await createVoiceNote(s);
  return SAMPLES.length;
}
