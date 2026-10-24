import { describe, it, expect } from "vitest";
import { VOXA_LANGUAGES } from "@/lib/languages";

describe("Voxa supported languages", () => {
  it("supports exactly English, Hindi and Marathi", () => {
    expect(VOXA_LANGUAGES).toEqual(["English", "Hindi", "Marathi"]);
  });

  it("contains no SEA languages", () => {
    const banned = ["Bahasa Indonesia", "Thai", "Vietnamese", "Tagalog"];
    for (const lang of VOXA_LANGUAGES) expect(banned).not.toContain(lang);
  });
});
