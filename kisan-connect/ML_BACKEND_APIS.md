# Kisan Connect — ML Backend API Specification

> This document lists **every ML backend API endpoint** required by the Kisan Connect platform.
> In the current codebase, these are either **mocked** in `backend/src/controllers/apiGateway.ts` or **stubbed and marked** with `// ML_ENDPOINT` comments.
> Your ML team should implement a FastAPI / Flask server at the base URL configured via `ML_BASE_URL` environment variable.

---

## Base URL

```
ML_BASE_URL=http://localhost:8000   (default, set in backend/.env)
```

All ML endpoints below are relative to `ML_BASE_URL`.

---

## 1. 🧠 Query / Advisory (CORE)

### `POST /ml/query`

The **primary endpoint**. Called every time a farmer asks a question in the chat.
The gateway forwards the farmer's message + full context to this endpoint and returns the advisory response.

**Request:**
```json
{
  "query": "My rice leaves are turning yellow, what should I do?",
  "lang": "hi",
  "farm_context": {
    "farm_state": "cultivating",
    "phase1": {
      "history": "Wheat",
      "timeWindow": "2024-11"
    },
    "phase2": {
      "crop": "Rice",
      "stage": "Vegetative",
      "irrigation": "Rain-fed",
      "symptoms": "Yellow leaves"
    },
    "phase3": {
      "nextCrop": "Mustard",
      "targetHarvest": "2025-04"
    }
  },
  "user_id": "farmer_4821",
  "session_id": "abc123"
}
```

**Response:**
```json
{
  "answer": "आपकी धान की पत्तियों का पीला पड़ना नाइट्रोजन की कमी के कारण हो सकता है...",
  "lang": "hi",
  "confidence": 0.92,
  "source": "agri-llm-v2",
  "sources_cited": ["ICAR 2023", "Krishi Vigyan Kendra"],
  "follow_up_suggestions": [
    "fertilizer dosage for rice",
    "signs of pest damage vs nutrient deficiency"
  ]
}
```

---

## 2. 🔁 Farmer Feedback / Response Logging (IMPORTANT)

### `POST /ml/feedback`

Called **after every ML response is sent to the farmer**. Used to log farmer reactions, corrections, or follow-up behaviour — critical for fine-tuning the model.

> **Note from dev:** The farmer's *next message* after receiving an ML response should also be forwarded here as implicit feedback.

**Request:**
```json
{
  "session_id": "abc123",
  "user_id": "farmer_4821",
  "original_query": "My rice leaves are turning yellow...",
  "ml_response": "आपकी धान की पत्तियों का पीला पड़ना...",
  "farmer_followup": "That helped, what fertilizer amount?",
  "lang": "hi",
  "rating": null,
  "timestamp": 1711528800000
}
```

**Response:**
```json
{
  "ok": true,
  "logged": true
}
```

---

## 3. 🎤 Speech-to-Text (STT)

### `POST /ml/stt`

Converts farmer voice input to text. Used when native Web Speech API is unavailable (Android WebView, older devices) or when Bhashini ASR pipeline is preferred.

**Request:** `multipart/form-data`
```
audio_file: <binary .wav or .webm>
lang: "hi"
user_id: "farmer_4821"
```

**Response:**
```json
{
  "transcript": "मेरी फसल में पीले धब्बे आ गए हैं",
  "lang": "hi",
  "confidence": 0.89,
  "duration_seconds": 3.4
}
```

---

## 4. 🔊 Text-to-Speech (TTS)

### `POST /ml/tts`

Converts ML advisory text response to audio. Crucial for farmers with low literacy or visual impairment.

**Request:**
```json
{
  "text": "आपकी धान की पत्तियों का पीला पड़ना नाइट्रोजन की कमी के कारण...",
  "lang": "hi",
  "voice_style": "female",
  "speed": 1.0
}
```

**Response:** `audio/mpeg` binary stream, or:
```json
{
  "audio_url": "https://ml-cdn.example.com/tts/abc123.mp3",
  "duration_seconds": 8.2
}
```

---

## 5. 🌾 Crop Detection (Image)

### `POST /ml/crop-detect`

Optional but planned: farmer uploads a photo of their field/crop and the model identifies the crop, disease, or pest.

**Request:** `multipart/form-data`
```
image: <binary .jpg or .png>
lang: "te"
user_id: "farmer_4821"
```

**Response:**
```json
{
  "detected_crop": "Rice",
  "detected_disease": "Brown Leaf Spot",
  "confidence": 0.87,
  "severity": "moderate",
  "advisory": "Apply Tricyclazole 75 WP at 0.6 g/litre...",
  "lang": "te"
}
```

---

## 6. 🌦 Weather-Aware Advisory

### `GET /ml/weather-advice`

Fetches weather-contextualised farming advice for the farmer's region.

**Query params:**
```
lat=28.6139&lon=77.2090&lang=pa&crop=wheat&stage=heading
```

**Response:**
```json
{
  "forecast_summary": "Rain expected in 2 days",
  "advisory": "Delay fungicide spray by 3 days due to expected rainfall.",
  "lang": "pa",
  "valid_until": "2025-03-29T00:00:00Z"
}
```

---

## 7. 📋 Onboarding Context Ingestion

### `POST /ml/ingest-profile`

Called after the farmer completes all 3 onboarding phases. Sends the complete farm profile to the ML backend so it can personalise future answers.

**Request:**
```json
{
  "user_id": "farmer_4821",
  "lang": "hi",
  "farm_state": "cultivating",
  "phase1": { "history": "Wheat", "timeWindow": "2024-11" },
  "phase2": {
    "crop": "Rice",
    "stage": "Vegetative",
    "irrigation": "Rain-fed",
    "symptoms": "Yellow leaves"
  },
  "phase3": { "nextCrop": "Mustard", "targetHarvest": "2025-04" }
}
```

**Response:**
```json
{
  "ok": true,
  "profile_id": "mlprofile_4821_v1",
  "message": "Profile indexed for personalised advisory"
}
```

---

## Summary Table

| # | Endpoint | Method | Priority | Status |
|---|----------|--------|----------|--------|
| 1 | `/ml/query` | POST | 🔴 Critical | Mocked in gateway |
| 2 | `/ml/feedback` | POST | 🔴 Critical | Stub only |
| 3 | `/ml/stt` | POST | 🟠 High | Stub only |
| 4 | `/ml/tts` | POST | 🟠 High | Stub only |
| 5 | `/ml/crop-detect` | POST | 🟡 Medium | Not yet added |
| 6 | `/ml/weather-advice` | GET | 🟡 Medium | Not yet added |
| 7 | `/ml/ingest-profile` | POST | 🟡 Medium | Stub only |

---

## Environment Variables (backend/.env)

```env
ML_BASE_URL=http://localhost:8000
ML_API_KEY=your_ml_api_key_here
JWT_SECRET=your_jwt_secret
PORT=3000
```

---

## Notes

- **Bhashini Integration**: Endpoints 3 (STT) and 4 (TTS) can be backed by [Bhashini API](https://bhashini.gov.in/) for Indic language support.
- **All ML calls from the gateway** are wrapped in try/catch — if the ML backend is down, the gateway returns a graceful fallback message.
- **Session IDs** are generated per chat session to allow ML to track conversation context across multiple turns.
- **Farmer responses** (their follow-up messages) are always forwarded to `/ml/feedback` — this is required for reinforcement learning from human feedback (RLHF).
