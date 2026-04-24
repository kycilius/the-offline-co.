const FALLBACK_API_BASE = "https://your-render-url.onrender.com";

export const API_BASE =
  import.meta.env.VITE_API_BASE?.trim() || FALLBACK_API_BASE;

export const API_ENDPOINTS = {
  submit: `${API_BASE}/api/submit`,
  match: `${API_BASE}/api/match`,
  result: (sessionId: string) => `${API_BASE}/api/result/${sessionId}`,
};
