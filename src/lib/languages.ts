export const VOXA_LANGUAGES = ["English", "Hindi", "Marathi"] as const;

export type VoxaLanguage = (typeof VOXA_LANGUAGES)[number];
