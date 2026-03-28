import { useAppStore } from '../../store/appStore';
import type { OnboardingData } from '../../store/appStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

class APIError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = useAppStore.getState().token;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = { ...options, headers };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new APIError(response.status, data.message || 'Request failed.');
    }

    return data;
  } catch (err) {
    if (!navigator.onLine) {
      useAppStore.getState().setOffline(true);
    }
    throw err;
  }
}

export const apiClient = {
  // ── Public ────────────────────────────────────────────────────────────────
  login: (phone: string, otp: string) =>
    fetchWithAuth('/login', { method: 'POST', body: JSON.stringify({ phone, otp }) }),

  getLanguages: () =>
    fetchWithAuth('/languages', { method: 'GET' }),

  // ── Context-setting (fire-and-forget silently) ────────────────────────────
  setLanguage: (lang: string) =>
    fetchWithAuth('/language', { method: 'POST', body: JSON.stringify({ lang }) }).catch(() => {}),

  setCategory: (category: string) =>
    fetchWithAuth('/category', { method: 'POST', body: JSON.stringify({ category }) }).catch(() => {}),

  onboardingPhase: (phase: 1 | 2 | 3, data: any) =>
    fetchWithAuth(`/onboarding/phase-${phase}`, { method: 'POST', body: JSON.stringify(data) }).catch(() => {}),

  // ── ML_ENDPOINT: POST /api/v1/query  →  proxied internally to ML_BASE_URL/ml/query
  // Sends farmer's query with full onboarding context and language for personalised advisory.
  askQuery: (
    query: string,
    modelId: string,
    lang: string,
    category: string,
    farmContext?: OnboardingData,
    userId?: string,
  ) =>
    fetchWithAuth('/query', {
      method: 'POST',
      body: JSON.stringify({ query, modelId, lang, category, farmContext, userId }),
    }),

  // ── ML_ENDPOINT: POST /api/v1/feedback  →  proxied to ML_BASE_URL/ml/feedback
  // Forwards farmer's follow-up message as implicit feedback to ML backend.
  sendFeedback: (payload: {
    userId: string;
    originalQuery: string;
    mlResponse: string;
    farmerFollowup: string;
    lang: string;
    timestamp: number;
  }) =>
    fetchWithAuth('/feedback', { method: 'POST', body: JSON.stringify(payload) }).catch(() => {}),
};
