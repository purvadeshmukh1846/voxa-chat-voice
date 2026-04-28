export type Intent = "Reservation" | "Complaint" | "Price Inquiry" | "Urgent" | "General";
export type Status = "Open" | "Replied" | "Resolved";
export type Language = "English" | "Bahasa Indonesia" | "Thai" | "Vietnamese" | "Tagalog";

export interface Transcript {
  id: string;
  customerNumber: string;
  language: Language;
  fullText: string;
  summary: string;
  intent: Intent;
  urgency: "low" | "medium" | "high";
  status: Status;
  createdAt: string; // ISO
  entities: { label: string; value: string }[];
  durationSec: number;
}

const now = Date.now();
const m = (mins: number) => new Date(now - mins * 60_000).toISOString();

export const mockTranscripts: Transcript[] = [
  {
    id: "vn_001",
    customerNumber: "+62 812-3456-7890",
    language: "Bahasa Indonesia",
    fullText:
      "Halo, saya mau pesan meja untuk 4 orang besok malam jam 7. Tolong yang dekat jendela ya. Terima kasih.",
    summary: "Reservation for 4 people tomorrow 7pm, prefers window seat.",
    intent: "Reservation",
    urgency: "medium",
    status: "Open",
    createdAt: m(5),
    entities: [
      { label: "Party size", value: "4" },
      { label: "Date", value: "Tomorrow" },
      { label: "Time", value: "19:00" },
      { label: "Preference", value: "Window seat" },
    ],
    durationSec: 18,
  },
  {
    id: "vn_002",
    customerNumber: "+66 89-123-4567",
    language: "Thai",
    fullText:
      "สวัสดีค่ะ อยากทราบราคาทำสีผมแบบไฮไลท์ค่ะ แล้วต้องจองล่วงหน้าไหมคะ",
    summary: "Asking price for hair highlights and whether booking is required.",
    intent: "Price Inquiry",
    urgency: "low",
    status: "Replied",
    createdAt: m(42),
    entities: [
      { label: "Service", value: "Hair highlights" },
      { label: "Question", value: "Booking required?" },
    ],
    durationSec: 12,
  },
  {
    id: "vn_003",
    customerNumber: "+84 90-555-2211",
    language: "Vietnamese",
    fullText:
      "Đơn hàng của tôi đến trễ 3 ngày rồi mà vẫn chưa nhận được. Làm ơn kiểm tra giúp, mã đơn là VN20458.",
    summary: "Order #VN20458 delayed 3 days, customer requesting status update.",
    intent: "Complaint",
    urgency: "high",
    status: "Open",
    createdAt: m(75),
    entities: [
      { label: "Order ID", value: "VN20458" },
      { label: "Delay", value: "3 days" },
    ],
    durationSec: 22,
  },
  {
    id: "vn_004",
    customerNumber: "+63 917-888-1010",
    language: "Tagalog",
    fullText:
      "Hi, gusto ko sana mag-book ng deep cleaning para sa condo unit ko this Saturday morning. Two bedroom po.",
    summary: "Wants to book deep cleaning Saturday morning for a 2-bedroom condo.",
    intent: "Reservation",
    urgency: "medium",
    status: "Replied",
    createdAt: m(180),
    entities: [
      { label: "Service", value: "Deep cleaning" },
      { label: "Day", value: "Saturday AM" },
      { label: "Property", value: "2BR condo" },
    ],
    durationSec: 16,
  },
  {
    id: "vn_005",
    customerNumber: "+62 877-2244-9911",
    language: "Bahasa Indonesia",
    fullText:
      "Mas tolong banget, kunci rumah saya patah di dalam, bisa dateng sekarang? Lokasi di Kemang.",
    summary: "Urgent: broken house key stuck in lock, requesting immediate visit in Kemang.",
    intent: "Urgent",
    urgency: "high",
    status: "Open",
    createdAt: m(8),
    entities: [
      { label: "Issue", value: "Broken key in lock" },
      { label: "Location", value: "Kemang" },
    ],
    durationSec: 14,
  },
  {
    id: "vn_006",
    customerNumber: "+1 415-220-3344",
    language: "English",
    fullText:
      "Hey, do you guys ship to Singapore? And what's the price for the matcha set with two cups?",
    summary: "Asks about shipping to Singapore and price of matcha set with two cups.",
    intent: "Price Inquiry",
    urgency: "low",
    status: "Resolved",
    createdAt: m(540),
    entities: [
      { label: "Destination", value: "Singapore" },
      { label: "Product", value: "Matcha set (2 cups)" },
    ],
    durationSec: 11,
  },
  {
    id: "vn_007",
    customerNumber: "+66 92-777-3322",
    language: "Thai",
    fullText:
      "ขอเลื่อนนัดหมอวันศุกร์เป็นวันจันทร์หน้าได้ไหมคะ ช่วงบ่ายนะคะ",
    summary: "Requests to reschedule Friday appointment to next Monday afternoon.",
    intent: "Reservation",
    urgency: "medium",
    status: "Replied",
    createdAt: m(1200),
    entities: [
      { label: "Action", value: "Reschedule" },
      { label: "From", value: "Friday" },
      { label: "To", value: "Mon PM" },
    ],
    durationSec: 9,
  },
  {
    id: "vn_008",
    customerNumber: "+84 93-101-7788",
    language: "Vietnamese",
    fullText:
      "Cho mình hỏi quán mở cửa đến mấy giờ tối nay? Mình muốn ghé sau 9 giờ.",
    summary: "Asking closing time tonight, plans to visit after 9pm.",
    intent: "General",
    urgency: "low",
    status: "Resolved",
    createdAt: m(2880),
    entities: [
      { label: "Visit time", value: "After 21:00" },
    ],
    durationSec: 8,
  },
];