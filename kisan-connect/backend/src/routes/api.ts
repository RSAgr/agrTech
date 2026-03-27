import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import * as Gateway from '../controllers/apiGateway';

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────
router.post('/login', Gateway.login);
router.get('/languages', Gateway.getLanguages);

// ── Protected ─────────────────────────────────────────────────────────────
router.use(requireAuth);

router.post('/language', Gateway.setLanguage);
router.post('/category', Gateway.setCategory);

router.post('/onboarding/phase-1', Gateway.submitPhase(1));
router.post('/onboarding/phase-2', Gateway.submitPhase(2));
router.post('/onboarding/phase-3', Gateway.submitPhase(3));

// ML_ENDPOINT: proxied to ML_BASE_URL/ml/query
router.post('/query', Gateway.handleQuery);

// ML_ENDPOINT: proxied to ML_BASE_URL/ml/feedback
router.post('/feedback', Gateway.handleFeedback);

// ML_ENDPOINT: proxied to ML_BASE_URL/ml/stt  (stub — returns 501 until wired)
router.post('/stt', Gateway.handleSTT);

// ML_ENDPOINT: proxied to ML_BASE_URL/ml/tts  (stub — returns 501 until wired)
router.post('/tts', Gateway.handleTTS);

export default router;
