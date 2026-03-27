# Kisan Connect

A production-ready monorepo for an Indian agriculture advisory platform designed for low-end Android phones, unstable networks, multilingual users, and low digital literacy.

## 🌟 Features
- **Farmer-First UI**: Touch-friendly, calm interface, high contrast, readable texts.
- **Offline-Aware**: PWA built-in, local state persistence via Zustand.
- **Multilingual Support**: First-class i18N setup covering 10 Indian regional languages.
- **Voice-Friendly**: Interacts gracefully via `Web Speech API` with simple stub logic for actual TTS fallback.
- **Lightweight Monorepo**: React + Vite + Tailwind frontend and a Node + Express secure API Gateway backend.

## 📂 Folder Structure

```text
/kisan-connect
├── package.json (NPM Workspaces definition)
├── frontend/
│   ├── src/
│   │   ├── app/ (Routing, entry Points)
│   │   ├── components/ (Reusables: Button, Card, Input)
│   │   ├── features/ (Auth, Language, FarmState, Onboarding, Chat)
│   │   ├── services/ (API Typed Client, Speech Hook)
│   │   ├── store/ (Zustand Global State)
│   │   └── i18n/ (React-i18next config & Locales)
│   └── vite.config.ts (Vite PWA Config)
└── backend/
    ├── src/
    │   ├── controllers/ (Gateway endpoints logic)
    │   ├── middleware/ (JWT Auth)
    │   ├── routes/ (Express router bindings)
    │   └── validators/ (Zod schema validations)
    └── server.ts (App entry & Websocket server)
```

## 🛠 Setup & Installation

**Prerequisites**: Node.js (v18+)

```bash
cd kisan-connect
npm install
```

## 🚀 Running Locally

Starts both Frontend (Vite) and Backend (Node-ts) in Development mode concurrently.

```bash
npm run dev
```

If you prefer to run them separately:
- **Backend:** `npm run dev:backend` (runs on `http://localhost:3000`)
- **Frontend:** `npm run dev:frontend` (runs on `http://localhost:5173`)

## 🔑 Environment Variables

To run completely connected, create `.env` files.

**Backend (`backend/.env`)**
```env
PORT=3000
JWT_SECRET=super_secret_kisan_token_2026
CORS_ORIGIN=*
# Future endpoints:
BHASHINI_API_KEY=your_key_here
ML_GATEWAY_URL=http://internal-ml-service/v1/query
```

**Frontend (`frontend/.env`)**
```env
VITE_API_URL=http://localhost:3000/api/v1
```

## 📡 API Expectations & Context Binding

The frontend communicates exclusively with the Express Backend (BFF layer).
The Backend Gateway exposes secure standard REST routes (`/api/v1/login`, `/api/v1/query`, etc) with JWT bearer auth.

### How to connect the Real Backend Later
1. Update `backend/src/controllers/apiGateway.ts`.
2. Locate the `handleQuery` method. Right now, it returns a mocked `answer`.
3. Swap out the mock block with a standard authenticated `fetch/axios` POST to your real ML Python backend, passing down the user's `$query` and context state (`lang`, `category`, `onboardingData`).

### Integrating Bhashini (Voice & Text Translation)
1. **Audio Streaming**: `backend/src/server.ts` exposes a WebSocket stub `/ws/audio`.
2. Modify the WebSocket handler to proxy the binary stream chunks to Bhashini’s streaming STT endpoint using `socket.io` or direct binary frames.
3. Once STT is complete, Bhashini translates to English, proxy that English text to your LLM, get the English response, use Bhashini to translate back to the regional `lang`, and synthesize audio (TTS).
4. Send the audio buffer + regional text response back over WebSocket to the frontend client.

## 🤝 Verification & Performance Check list
- ✅ Lazy loaded main components
- ✅ ServiceWorker / `vite-plugin-pwa` setup for network resilience
- ✅ Mobile-first large hit area styling using `TailwindCSS`
- ✅ Rate-limited APIs via `express-rate-limit`
