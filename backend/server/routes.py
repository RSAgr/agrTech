import asyncio
import math
import os
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

ML_BASE_URL = os.getenv("ML_BASE_URL", None)

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
    # ML_ENDPOINT: POST ML_BASE_URL/ml/ingest-profile
    # After phase 3 completes, forward the full profile to the ML backend.
    # TODO: accumulate phases and send combined profile on phase 3.
    if ML_BASE_URL:
        print(
            f"[ML_STUB] Would POST {ML_BASE_URL}/ml/ingest-profile "
            f"for phase {phase_number}"
        )
    return {"ok": True, "phase": phase_number}


@router.post("/query")
async def handle_query(
    data: QueryRequest,
    _user: dict = Depends(get_current_user),
):
    # ══════════════════════════════════════════════════════════════════════
    # ML_ENDPOINT: POST ML_BASE_URL/ml/query
    #
    # Forward the following to ML backend:
    #   query        — farmer's question (string)
    #   lang         — language code (e.g. 'hi', 'te')
    #   category     — farm state ('fallow' | 'cultivating' | 'post-harvest')
    #   farmContext  — full onboarding data (phase1, phase2, phase3)
    #   userId       — farmer identifier
    #
    # Expected ML response: { answer, lang, confidence, source }
    # ══════════════════════════════════════════════════════════════════════
    if ML_BASE_URL:
        print(f"[ML_ENDPOINT] Would POST {ML_BASE_URL}/ml/query")
        # Uncomment when ML server is ready:
        # import httpx
        # async with httpx.AsyncClient() as client:
        #     ml_res = await client.post(
        #         f"{ML_BASE_URL}/ml/query",
        #         json={
        #             "query": data.query,
        #             "lang": data.lang,
        #             "farm_context": data.farmContext,
        #             "user_id": data.userId,
        #         },
        #         headers={"x-api-key": os.getenv("ML_API_KEY", "")},
        #     )
        #     ml_data = ml_res.json()
        #     return {
        #         "answer": ml_data["answer"],
        #         "lang": ml_data["lang"],
        #         "source": ml_data["source"],
        #         "confidence": ml_data["confidence"],
        #     }

    # Mock response (remove when ML_BASE_URL is active)
    await asyncio.sleep(0.8)
    return {
        "answer": (
            f'Advisory for "{data.query}" — crop: {data.category}, '
            f'lang: {data.lang or "en"}. '
            f"[Mock — connect ML backend via ML_BASE_URL in .env]"
        ),
        "lang": data.lang or "en",
        "source": "mock-model",
        "confidence": 0.95,
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
    if ML_BASE_URL:
        print(f"[ML_ENDPOINT] Would POST {ML_BASE_URL}/ml/feedback")
        # Uncomment when ML server is ready:
        # import httpx
        # async with httpx.AsyncClient() as client:
        #     await client.post(
        #         f"{ML_BASE_URL}/ml/feedback",
        #         json=data.model_dump(),
        #         headers={"x-api-key": os.getenv("ML_API_KEY", "")},
        #     )
    else:
        print(
            f'[ML_STUB] Feedback received from {data.userId}: '
            f'"{data.farmerFollowup}"'
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
