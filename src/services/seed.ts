import { supabase } from "@/integrations/supabase/client";
import { createVoiceNote } from "./voiceNotes";

const SAMPLES: Parameters<typeof createVoiceNote>[0][] = [
  {
    customer_number: "+62 812-3456-7890",
    language: "Bahasa Indonesia",
    full_text: "Halo, saya mau pesan meja untuk 4 orang besok malam jam 7. Tolong yang dekat jendela ya.",
    summary: "Reservation for 4 people tomorrow 7pm, prefers window seat.",
    intent: "Reservation", urgency: "medium", status: "Open", duration_sec: 18,
    entities: [
      { type: "Party size", value: "4" },
      { type: "Time", value: "19:00" },
      { type: "Preference", value: "Window seat" },
    ],
  },
  {
    customer_number: "+66 89-123-4567",
    language: "Thai",
    full_text: "สวัสดีค่ะ อยากทราบราคาทำสีผมแบบไฮไลท์ค่ะ",
    summary: "Asking price for hair highlights.",
    intent: "Price Inquiry", urgency: "low", status: "In Progress", duration_sec: 12,
    entities: [{ type: "Service", value: "Hair highlights" }],
  },
  {
    customer_number: "+84 90-555-2211",
    language: "Vietnamese",
    full_text: "Đơn hàng của tôi đến trễ 3 ngày rồi, mã đơn VN20458.",
    summary: "Order #VN20458 delayed 3 days.",
    intent: "Complaint", urgency: "high", status: "Open", duration_sec: 22,
    entities: [{ type: "Order ID", value: "VN20458" }, { type: "Delay", value: "3 days" }],
  },
  {
    customer_number: "+62 877-2244-9911",
    language: "Bahasa Indonesia",
    full_text: "Mas tolong banget, kunci rumah saya patah di dalam, lokasi Kemang.",
    summary: "Urgent: broken house key stuck in lock, Kemang.",
    intent: "Urgent", urgency: "high", status: "Open", duration_sec: 14,
    entities: [{ type: "Location", value: "Kemang" }],
  },
];

export async function seedSampleVoiceNotes() {
  const { count } = await supabase.from("voice_notes").select("id", { count: "exact", head: true });
  if ((count ?? 0) > 0) return 0;
  for (const s of SAMPLES) await createVoiceNote(s);
  return SAMPLES.length;
}