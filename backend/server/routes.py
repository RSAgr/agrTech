import math
import random

from fastapi import APIRouter, Depends, HTTPException, status

from .auth import generate_token, get_current_user
from .validators import (
    CategoryRequest,
    FeedbackRequest,
    LanguageRequest,
    LoginRequest,
    Phase1Request,
    Phase2Request,
    Phase3Request,
    QueryRequest,
)

router = APIRouter()

# ── Languages list ────────────────────────────────────────────────────────────
LANGUAGES = [
    {"code": "en", "label": "English",   "native": "English"},
    {"code": "hi", "label": "Hindi",     "native": "हिंदी"},
    {"code": "bn", "label": "Bengali",   "native": "বাংলা"},
    {"code": "te", "label": "Telugu",    "native": "తెలుగు"},
    {"code": "mr", "label": "Marathi",   "native": "मराठी"},
    {"code": "ta", "label": "Tamil",     "native": "தமிழ்"},
    {"code": "kn", "label": "Kannada",   "native": "ಕನ್ನಡ"},
    {"code": "gu", "label": "Gujarati",  "native": "ગુજરાતી"},
    {"code": "pa", "label": "Punjabi",   "native": "ਪੰਜਾਬੀ"},
    {"code": "ml", "label": "Malayalam", "native": "മലയാളം"},
]


# ── Public endpoints ──────────────────────────────────────────────────────────

@router.post("/login")
async def login(data: LoginRequest):
    # Mock: accepts any OTP. Replace with SMS OTP provider integration.
    user_id = f"farmer_{math.floor(random.random() * 10000)}"
    token = generate_token({"userId": user_id, "phone": data.phone})
    return {"token": token, "userId": user_id, "name": "Farmer"}


@router.get("/languages")
async def get_languages():
    return {"languages": LANGUAGES}


# ── Protected endpoints ───────────────────────────────────────────────────────

@router.post("/language")
async def set_language(
    data: LanguageRequest,
    _user: dict = Depends(get_current_user),
):
    return {"ok": True}


@router.post("/category")
async def set_category(
    data: CategoryRequest,
    _user: dict = Depends(get_current_user),
):
    # ML_ENDPOINT: POST ML_BASE_URL/ml/ingest-profile (partial) — farm state context
    return {"modelId": f"model-{data.category}-v1"}


@router.post("/onboarding/phase-1")
async def submit_phase_1(
    data: Phase1Request,
    _user: dict = Depends(get_current_user),
):
    return await _submit_phase(1, data)


@router.post("/onboarding/phase-2")
async def submit_phase_2(
    data: Phase2Request,
    _user: dict = Depends(get_current_user),
):
    return await _submit_phase(2, data)


@router.post("/onboarding/phase-3")
async def submit_phase_3(
    data: Phase3Request,
    _user: dict = Depends(get_current_user),
):
    return await _submit_phase(3, data)


async def _submit_phase(phase_number: int, _data) -> dict:
    # TODO: accumulate phases and send combined profile on phase 3.
    return {"ok": True, "phase": phase_number}


@router.post("/query")
async def handle_query(
    data: QueryRequest,
    _user: dict = Depends(get_current_user),
):
    from ml.mlEndpoint import MLService
    from genAI.llmCalling import generate_study_plan

    ml_result = None
    farm_ctx = data.farmContext or {}

    # Run ML prediction if sensor data is available in farmContext
    if isinstance(farm_ctx, dict) and "temperature" in farm_ctx:
        ml_service = MLService()
        ml_result = ml_service.predict(farm_ctx)

    # Build a summary string for the LLM
    summary_parts = [f"Farmer query: {data.query}"]
    if data.category:
        summary_parts.append(f"Farm state: {data.category}")
    if data.lang:
        summary_parts.append(f"Language: {data.lang}")
    if ml_result:
        summary_parts.append(
            f"ML predictions — irrigation: {ml_result['irrigation']}, "
            f"disease risk: {ml_result['disease_risk']}, "
            f"crop stress: {ml_result['crop_stress']}"
        )
    if isinstance(farm_ctx, dict):
        ctx_str = ", ".join(f"{k}: {v}" for k, v in farm_ctx.items())
        if ctx_str:
            summary_parts.append(f"Farm context: {ctx_str}")

    summary = "\n".join(summary_parts)

    try:
        answer = generate_study_plan(summary)
    except Exception:
        answer = (
            f'Advisory for "{data.query}" — crop: {data.category}, '
            f'lang: {data.lang or "en"}. '
            f"[GenAI unavailable — showing ML results only]"
        )

    return {
        "answer": answer,
        "lang": data.lang or "en",
        "source": "ml+genai" if ml_result else "genai",
        "confidence": 0.95,
        "mlPredictions": ml_result,
    }


# ══════════════════════════════════════════════════════════════════════════
# ML_ENDPOINT: POST ML_BASE_URL/ml/feedback
# Receives farmer follow-up messages as implicit feedback for RLHF.
# ══════════════════════════════════════════════════════════════════════════

@router.post("/feedback")
async def handle_feedback(
    data: FeedbackRequest,
    _user: dict = Depends(get_current_user),
):
    # TODO: persist feedback to a database for RLHF
    print(
        f'[Feedback] from {data.userId}: "{data.farmerFollowup}" '
        f'(rating: {data.rating})'
    )
    return {"ok": True, "logged": True}


# ══════════════════════════════════════════════════════════════════════════
# ML_ENDPOINT: POST ML_BASE_URL/ml/stt  (Speech-to-Text)
# Stub — accepts audio binary, returns transcript.
# ══════════════════════════════════════════════════════════════════════════

@router.post("/stt")
async def handle_stt(_user: dict = Depends(get_current_user)):
    # TODO: proxy multipart audio to ML_BASE_URL/ml/stt
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="STT endpoint not yet connected to ML backend.",
    )


# ══════════════════════════════════════════════════════════════════════════
# ML_ENDPOINT: POST ML_BASE_URL/ml/tts  (Text-to-Speech)
# Stub — accepts text, returns audio URL or binary.
# ══════════════════════════════════════════════════════════════════════════

@router.post("/tts")
async def handle_tts(_user: dict = Depends(get_current_user)):
    # TODO: proxy to ML_BASE_URL/ml/tts
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="TTS endpoint not yet connected to ML backend.",
    )
