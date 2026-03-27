import { Request, Response } from 'express';
import { generateToken } from '../middleware/auth';
import {
  loginSchema, languageSchema, categorySchema,
  phase1Schema, phase2Schema, phase3Schema, querySchema, feedbackSchema
} from '../validators';

// ────────────────────────────────────────────────────────────────────────────
// When ML_BASE_URL is set in .env, all ML_ENDPOINT calls below should be
// proxied to the ML backend instead of returning mock responses.
// ────────────────────────────────────────────────────────────────────────────
const ML_BASE_URL = process.env.ML_BASE_URL || null;

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    // Mock: accepts any OTP. Replace with SMS OTP provider integration.
    const userId = `farmer_${Math.floor(Math.random() * 10000)}`;
    const token = generateToken({ userId, phone: data.phone });
    res.json({ token, userId, name: 'Farmer' });
  } catch (err: any) {
    res.status(400).json({ error: err.errors || 'Validation Failed' });
  }
};

export const getLanguages = (_req: Request, res: Response) => {
  res.json({
    languages: [
      { code: 'en', label: 'English',    native: 'English'    },
      { code: 'hi', label: 'Hindi',      native: 'हिंदी'      },
      { code: 'bn', label: 'Bengali',    native: 'বাংলা'      },
      { code: 'te', label: 'Telugu',     native: 'తెలుగు'     },
      { code: 'mr', label: 'Marathi',    native: 'मराठी'      },
      { code: 'ta', label: 'Tamil',      native: 'தமிழ்'      },
      { code: 'kn', label: 'Kannada',    native: 'ಕನ್ನಡ'      },
      { code: 'gu', label: 'Gujarati',   native: 'ગુજરાતી'    },
      { code: 'pa', label: 'Punjabi',    native: 'ਪੰਜਾਬੀ'     },
      { code: 'ml', label: 'Malayalam',  native: 'മലയാളം'     },
    ]
  });
};

export const setLanguage = async (req: Request, res: Response) => {
  try {
    languageSchema.parse(req.body);
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: 'Validation Failed' });
  }
};

export const setCategory = async (req: Request, res: Response) => {
  try {
    const data = categorySchema.parse(req.body);
    // ML_ENDPOINT: POST ML_BASE_URL/ml/ingest-profile (partial) — farm state context
    res.json({ modelId: `model-${data.category}-v1` });
  } catch (err: any) {
    res.status(400).json({ error: 'Validation Failed' });
  }
};

export const submitPhase = (phaseNumber: 1 | 2 | 3) => async (req: Request, res: Response) => {
  try {
    if (phaseNumber === 1) phase1Schema.parse(req.body);
    if (phaseNumber === 2) phase2Schema.parse(req.body);
    if (phaseNumber === 3) phase3Schema.parse(req.body);

    // ML_ENDPOINT: POST ML_BASE_URL/ml/ingest-profile
    // After phase 3 completes, forward the full profile to the ML backend.
    // TODO: accumulate phases and send combined profile on phase 3.
    if (ML_BASE_URL) {
      // Forward to ML (not yet implemented — wire up when ML server is ready)
      console.log(`[ML_STUB] Would POST ${ML_BASE_URL}/ml/ingest-profile for phase ${phaseNumber}`);
    }

    res.json({ ok: true, phase: phaseNumber });
  } catch (err: any) {
    res.status(400).json({ error: 'Validation Failed' });
  }
};

export const handleQuery = async (req: Request, res: Response) => {
  try {
    const data = querySchema.parse(req.body);

    // ════════════════════════════════════════════════════════════════
    // ML_ENDPOINT: POST ML_BASE_URL/ml/query
    //
    // Forward the following to ML backend:
    //   query        — farmer's question (string)
    //   lang         — language code (e.g. 'hi', 'te')
    //   category     — farm state ('fallow' | 'cultivating' | 'post-harvest')
    //   farmContext  — full onboarding data (phase1, phase2, phase3)
    //   userId       — farmer identifier
    //
    // Expected ML response: { answer, lang, confidence, source }
    // ════════════════════════════════════════════════════════════════
    if (ML_BASE_URL) {
      console.log(`[ML_ENDPOINT] Would POST ${ML_BASE_URL}/ml/query`);
      // Uncomment when ML server is ready:
      // const mlRes = await fetch(`${ML_BASE_URL}/ml/query`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ML_API_KEY || '' },
      //   body: JSON.stringify({
      //     query: data.query,
      //     lang: data.lang,
      //     farm_context: data.farmContext,
      //     user_id: data.userId,
      //   }),
      // });
      // const mlData = await mlRes.json();
      // return res.json({ answer: mlData.answer, lang: mlData.lang, source: mlData.source, confidence: mlData.confidence });
    }

    // Mock response (remove when ML_BASE_URL is active)
    await new Promise(r => setTimeout(r, 800));
    res.json({
      answer: `Advisory for "${data.query}" — crop: ${data.category}, lang: ${data.lang || 'en'}. [Mock — connect ML backend via ML_BASE_URL in .env]`,
      lang: data.lang || 'en',
      source: 'mock-model',
      confidence: 0.95
    });
  } catch (err: any) {
    res.status(400).json({ error: 'Validation Failed' });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// ML_ENDPOINT: POST ML_BASE_URL/ml/feedback
// Receives farmer follow-up messages as implicit feedback for RLHF.
// ════════════════════════════════════════════════════════════════════════════
export const handleFeedback = async (req: Request, res: Response) => {
  try {
    const data = feedbackSchema.parse(req.body);

    if (ML_BASE_URL) {
      console.log(`[ML_ENDPOINT] Would POST ${ML_BASE_URL}/ml/feedback`);
      // Uncomment when ML server is ready:
      // await fetch(`${ML_BASE_URL}/ml/feedback`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ML_API_KEY || '' },
      //   body: JSON.stringify(data),
      // });
    } else {
      console.log(`[ML_STUB] Feedback received from ${data.userId}: "${data.farmerFollowup}"`);
    }

    res.json({ ok: true, logged: true });
  } catch (err: any) {
    res.status(400).json({ error: 'Validation Failed' });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// ML_ENDPOINT: POST ML_BASE_URL/ml/stt  (Speech-to-Text)
// Stub — accepts audio binary, returns transcript.
// ════════════════════════════════════════════════════════════════════════════
export const handleSTT = async (_req: Request, res: Response) => {
  // TODO: proxy multipart audio to ML_BASE_URL/ml/stt
  res.status(501).json({ error: 'STT endpoint not yet connected to ML backend.' });
};

// ════════════════════════════════════════════════════════════════════════════
// ML_ENDPOINT: POST ML_BASE_URL/ml/tts  (Text-to-Speech)
// Stub — accepts text, returns audio URL or binary.
// ════════════════════════════════════════════════════════════════════════════
export const handleTTS = async (_req: Request, res: Response) => {
  // TODO: proxy to ML_BASE_URL/ml/tts
  res.status(501).json({ error: 'TTS endpoint not yet connected to ML backend.' });
};
