export const API_BASE =
  import.meta.env.VITE_API_BASE?.trim() || "https://the-offline-co.onrender.com";

export type AppMode = "application" | "questionnaire";

export const APP_MODE: AppMode =
  (import.meta.env.VITE_APP_MODE?.trim() as AppMode) || "application";
