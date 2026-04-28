import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { mockTranscripts, Transcript, Status, Intent, Language } from "@/data/mockTranscripts";

interface TranscriptContextValue {
  transcripts: Transcript[];
  updateStatus: (id: string, status: Status) => void;
  addTranscript: (t: Omit<Transcript, "id" | "createdAt">) => Transcript;
  getById: (id: string) => Transcript | undefined;
}

const TranscriptContext = createContext<TranscriptContextValue | undefined>(undefined);

const sampleSeeds: Array<{ language: Language; fullText: string; summary: string; intent: Intent }> = [
  {
    language: "Bahasa Indonesia",
    fullText: "Halo, saya mau tanya promo bulan ini ada apa aja ya? Terima kasih.",
    summary: "Asking about this month's promotions.",
    intent: "Price Inquiry",
  },
  {
    language: "Thai",
    fullText: "ขอจองโต๊ะ 2 ที่นั่ง คืนนี้ 2 ทุ่มได้ไหมคะ",
    summary: "Requests a table for 2 tonight at 8pm.",
    intent: "Reservation",
  },
  {
    language: "Vietnamese",
    fullText: "Sản phẩm bị lỗi rồi, mình muốn đổi hàng được không?",
    summary: "Defective product, requesting an exchange.",
    intent: "Complaint",
  },
  {
    language: "English",
    fullText: "Hi! Are you open on Sunday? Wanted to drop by with my family.",
    summary: "Asks about Sunday opening hours, plans family visit.",
    intent: "General",
  },
];

export function TranscriptProvider({ children }: { children: ReactNode }) {
  const [transcripts, setTranscripts] = useState<Transcript[]>(mockTranscripts);

  const updateStatus = useCallback((id: string, status: Status) => {
    // TODO: Replace with Supabase update on voice_notes.status
    setTranscripts((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const addTranscript: TranscriptContextValue["addTranscript"] = useCallback((t) => {
    const newT: Transcript = {
      ...t,
      id: `vn_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTranscripts((prev) => [newT, ...prev]);
    return newT;
  }, []);

  const getById = useCallback(
    (id: string) => transcripts.find((t) => t.id === id),
    [transcripts]
  );

  return (
    <TranscriptContext.Provider value={{ transcripts, updateStatus, addTranscript, getById }}>
      {children}
    </TranscriptContext.Provider>
  );
}

export function useTranscripts() {
  const ctx = useContext(TranscriptContext);
  if (!ctx) throw new Error("useTranscripts must be used within TranscriptProvider");
  return ctx;
}

export function generateMockFromSeed(): Omit<Transcript, "id" | "createdAt"> {
  const seed = sampleSeeds[Math.floor(Math.random() * sampleSeeds.length)];
  const numbers = ["+62 812-9988-1122", "+66 81-444-9090", "+84 90-321-7788", "+63 917-660-2211"];
  return {
    customerNumber: numbers[Math.floor(Math.random() * numbers.length)],
    language: seed.language,
    fullText: seed.fullText,
    summary: seed.summary,
    intent: seed.intent,
    urgency: seed.intent === "Urgent" || seed.intent === "Complaint" ? "high" : "medium",
    status: "Open",
    entities: [],
    durationSec: 10 + Math.floor(Math.random() * 20),
  };
}