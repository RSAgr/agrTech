import os
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ml.mlEndpoint import MLService
from genAI.llmCalling import generate_study_plan
from server.routes import router as server_router

app = FastAPI(title="Kisan Connect Gateway")

# ── CORS ──────────────────────────────────────────────────────────────────────
cors_origin = os.getenv("CORS_ORIGIN", "")
if cors_origin:
    origins = [o.strip() for o in cors_origin.split(",")]
else:
    # Default: allow common local dev servers
    origins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000",
    ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    allow_credentials=True,
)

# NOTE: Rate limiting (100 req / 15 min per IP) can be added via `slowapi`.

# ── Mount kisan-connect server routes at /api/v1 ─────────────────────────────
app.include_router(server_router, prefix="/api/v1")

# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}

# ── Existing ML endpoints ─────────────────────────────────────────────────────

ml_service = MLService()

@app.post("/predict")
def predict(data: dict):
    result = ml_service.predict(data)
    return result

@app.post("/generate_plan")
def generate_plan(summary: str):
    plan = generate_study_plan(summary)
    return {"plan": plan}