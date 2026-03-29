# 🌱 Kisan Connect

<p align="center">
  <img src="https://img.shields.io/badge/Kisan%20Connect-AI%20Powered%20Smart%20Farming-2E8B57?style=for-the-badge&logo=leaflet&logoColor=white" />
</p>

<p align="center">
  <b>AI-powered smart farming for better decisions, better yields, and better profits.</b><br/>
  <sub>Multilingual • Mobile-first • Context-aware • Future-ready</sub>
</p>

<p align="center">
  <a href="#overview">
    <img src="https://img.shields.io/badge/Overview-Read%20More-0F766E?style=for-the-badge" />
  </a>
  <a href="#key-features">
    <img src="https://img.shields.io/badge/Features-Explore%20Now-2563EB?style=for-the-badge" />
  </a>
  <a href="#setup">
    <img src="https://img.shields.io/badge/Setup-Run%20Locally-7C3AED?style=for-the-badge" />
  </a>
  <a href="#future-vision">
    <img src="https://img.shields.io/badge/Future%20Vision-Roadmap-F59E0B?style=for-the-badge" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2019-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-Gemini%20%2B%20ML-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PWA-Enabled-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Focus-Profit%20Optimization-success?style=for-the-badge" />
</p>

---

## ✨ Overview

Kisan Connect is a mobile-first **Progressive Web App (PWA)** designed to help farmers make smarter agricultural decisions using **Machine Learning**, **Generative AI**, and **multilingual interaction**.

The platform transforms complex agricultural data into clear, practical, and localized guidance. Instead of giving generic suggestions, it acts like a digital farming assistant that understands crop conditions, weather, seasonality, and profitability.

The goal is simple: make advanced farming intelligence easy to access, easy to understand, and useful in real-world conditions.

---

## 🎯 What Makes It Different

Kisan Connect is built around one core idea: **farm advice should be understandable, timely, and profitable**.

It focuses on:

* Personalized agricultural guidance
* Multilingual communication
* Image-based crop context
* Mobile-first accessibility
* Profit-aware crop planning
* Weather and sensor-driven intelligence
* Simple interaction for real farm environments

---

## 🌟 Key Features

### 🧠 Hybrid Intelligence: ML + GenAI

Kisan Connect combines predictive ML models with Gemini-powered generative AI.

* ML predicts:

  * irrigation needs
  * disease risk
  * crop stress
* GenAI converts those predictions into natural, easy-to-understand advice
* The result is both **accurate** and **farmer-friendly**

### 🌍 Multilingual Support

Supports **10 Indian languages**:

**Hindi, Bengali, Telugu, Marathi, Tamil, Kannada, Gujarati, Punjabi, Malayalam, and English**

This makes the system accessible to farmers who are more comfortable in their native language.

### 📸 Multimodal Input

The app supports more than just text.

* image upload for crops and leaves
* voice-ready support scaffolding
* simple and intuitive interaction flow
* designed for lower-literacy accessibility

This makes the platform practical in real farming environments where typing long inputs is not always ideal.

### 📱 Mobile-First PWA

Kisan Connect is built as a **Progressive Web App**, so it feels lightweight, installable, and easy to use on phones.

* works like a native app
* optimized for low bandwidth
* suitable for rural and field usage
* fast and responsive across devices

### 🎨 Modern UI/UX

The interface is designed to feel clean, smooth, and premium.

* glassmorphism-inspired design
* fluid micro-interactions
* responsive layout
* guided onboarding for better personalization

### 🔁 Continuous Learning Loop

The system can evolve over time through feedback and usage patterns.

* captures user feedback
* improves recommendations over time
* supports a more adaptive advisory system

---

## 🧠 In Progress and Future Features

### 🌾 Profit-Based Crop Recommendation

One of the most important upcoming features is **crop prediction based on profit margin**.

Instead of recommending crops only by suitability, Kisan Connect will also consider:

* season and time of year
* market demand trends
* production cost
* expected yield
* price trends
* regional profitability

This helps farmers answer a better question:

**Not just “What can I grow?” but “What will be most profitable to grow right now?”**

### 🌦️ Weather API Integration

The ML model is being enhanced with live weather data so predictions become more dynamic and realistic.

Planned weather-aware factors include:

* rainfall
* temperature
* humidity
* wind
* extreme weather alerts

This will allow the system to update recommendations based on changing environmental conditions, improving irrigation advice, disease prediction, and crop stress estimation.

### 📡 IoT Sensor Integration

Kisan Connect is also being designed to work with IoT-based farm sensors.

Possible sensor inputs include:

* soil moisture
* soil temperature
* air humidity
* environmental conditions
* field-level live readings

This will allow the platform to move from general prediction to **field-specific decision making**.

### 🧬 Self-Improving Advisory System

By combining:

* user feedback
* weather data
* IoT sensor values

the system can continuously refine its recommendations and become more accurate over time.

---

## 🚀 Future Vision

Kisan Connect is being shaped into a complete smart farming platform that can help farmers with:

* crop selection
* disease risk detection
* irrigation planning
* seasonal profitability analysis
* weather-aware advisory
* sensor-based monitoring
* region-specific decision support

The long-term goal is to make farming guidance more intelligent, more accessible, and more profitable.

---

## 🏗️ Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Zustand

### Backend

* FastAPI
* Scikit-Learn
* Pandas
* NumPy
* Gemini API

### Architecture

* REST API
* JWT Authentication
* CORS-enabled communication
* PWA support via `vite-plugin-pwa`

---

## 🎮 Setup

### Backend

```bash
cd agrTech/backend
python -m venv venv
```

**Windows**

```bash
venv\Scripts\activate
```

**Mac/Linux**

```bash
source venv/bin/activate
```

```bash
pip install -r requirements.txt
```

Create a `.env` file if needed:

```env
GEMINI_API_KEY=your_api_key
```

Run the backend:

```bash
uvicorn app:app --reload --port 3000
```

> The backend must run on port **3000**.

---

### Frontend

```bash
cd agrTech/frontend
npm install
npm run dev
```

Open:

```bash
http://localhost:5173
```

---

## 🧭 How It Works

1. The user enters farm details such as location, soil type, and crop context.
2. ML models analyze the input and generate predictions.
3. Gemini converts the output into practical advice.
4. The farmer receives guidance in the selected language.
5. Future weather and sensor data refine the model further.

---

## 📱 Application Walkthrough

Once both servers are running, here is how you can evaluate the platform:

1. Launch the app in a mobile view or emulator.
2. Select your preferred language from the supported list.
3. Complete the onboarding flow with your farm details.
4. Ask a question such as:
   **“How do I protect my wheat crop from rust disease?”**
5. Upload an image of a crop or leaf for visual context.
6. See how the system blends **ML predictions** with **Gemini-powered reasoning**.
7. Try the feedback flow and observe how the advisory loop improves over time.
8. Use the **Install App** prompt to test the PWA experience.

---

## 🏆 Why This Project Stands Out

* Solves a real agricultural problem
* Combines ML and GenAI in one workflow
* Supports multilingual communication
* Designed as a mobile-first PWA
* Built for future expansion with weather and IoT intelligence
* Focused on both **farm productivity** and **profit optimization**

---

## 💡 Impact Goal

Kisan Connect is not just about automation.

It is about helping farmers make decisions that are:

* smarter
* faster
* clearer
* more profitable
* better adapted to real-world conditions

By combining AI, weather intelligence, and sensor-based insights, the platform aims to bring practical technology into farming in a way that is simple and useful.

---

## ❤️ Built With Purpose

**Kisan Connect** is designed to bring practical AI into agriculture in a way that is modern, accessible, and genuinely helpful.

> Empowering farmers with technology that speaks their language and grows with their needs.

---

*Built with ❤️ for the hackathon.*
