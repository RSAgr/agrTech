from pydantic import BaseModel, Field
from typing import Any, Literal, Optional


SUPPORTED_LANGUAGES = Literal[
    "en", "hi", "bn", "te", "mr", "ta", "kn", "gu", "pa", "ml"
]


class LoginRequest(BaseModel):
    phone: str = Field(..., min_length=10, description="Phone number")
    otp: str = Field(..., min_length=4, description="OTP must be at least 4 digits")


class LanguageRequest(BaseModel):
    lang: SUPPORTED_LANGUAGES


class CategoryRequest(BaseModel):
    category: Literal["fallow", "cultivating", "post-harvest"]


class Phase1Request(BaseModel):
    history: Optional[str] = None
    timeWindow: Optional[str] = None


class Phase2Request(BaseModel):
    crop: Optional[str] = None
    stage: Optional[str] = None
    irrigation: Optional[str] = None
    symptoms: Optional[str] = None


class Phase3Request(BaseModel):
    nextCrop: Optional[str] = None
    targetHarvest: Optional[str] = None


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Query is required")
    modelId: Optional[str] = None
    lang: Optional[str] = None
    category: Optional[str] = None
    farmContext: Optional[Any] = None
    userId: Optional[str] = None


class FeedbackRequest(BaseModel):
    userId: str
    originalQuery: str
    mlResponse: str
    farmerFollowup: str
    lang: str
    timestamp: float
    rating: Optional[float] = None
