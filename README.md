# 🌱 Kisan Connect

<p align="center">
  <b>AI-Powered Smart Farming Platform</b><br/>
  <i>Bringing intelligent, multilingual agricultural insights to every farmer</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2019-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Backend-FastAPI-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/AI-Gemini%20%2B%20ML-orange?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/PWA-Enabled-purple?style=for-the-badge"/>
</p>

---

## 🚀 Overview

**Kisan Connect** is a **mobile-first Progressive Web App (PWA)** that combines **Machine Learning** and **Generative AI** to deliver real-time, actionable farming insights.

It transforms complex agricultural data into **simple, conversational advice** — accessible in multiple Indian languages — helping farmers make better decisions with confidence.

---

## 🎯 Problem It Solves

Farmers often struggle with:

* Lack of **localized agricultural guidance**
* Difficulty understanding **technical data**
* Limited access to **language-friendly tools**

👉 Kisan Connect bridges this gap using AI-driven, easy-to-use solutions.

---

## ✨ Key Features

### 🧠 Hybrid AI Intelligence

* ML models predict:

  * Irrigation needs
  * Crop stress
  * Disease risks
* Gemini AI converts predictions into **clear, human-like advice**

---

### 🌍 Multilingual Accessibility

Supports **10 Indian languages**:

> Hindi • Bengali • Telugu • Marathi • Tamil • Kannada • Gujarati • Punjabi • Malayalam • English

---

### 📸 Multimodal Interaction

* Upload crop images for analysis
* Voice-ready system (STT/TTS support)
* Designed for low-literacy usability

---

### 📱 Progressive Web App (PWA)

* Installable like a native app
* Works on low-end devices
* Lightweight and fast

---

### 🎨 Modern UI/UX

* Glassmorphism design
* Smooth animations
* Mobile-first layout
* Smart onboarding for personalization

---

### 🔁 Continuous Learning

* Feedback-driven improvement loop
* Enhances recommendations over time

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

* REST APIs
* JWT Authentication
* PWA via vite-plugin-pwa

---

## 🛠️ Installation & Setup

### 1️⃣ Backend Setup

```bash
cd agrTech/backend
python -m venv venv

# Activate environment
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create `.env` file:

```env
GEMINI_API_KEY=your_api_key
```

Run backend:

```bash
uvicorn app:app --reload --port 3000
```

---

### 2️⃣ Frontend Setup

```bash
cd agrTech/frontend
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 🧪 How to Use

1. Open the app in mobile view
2. Select your preferred language
3. Complete onboarding (farm details)
4. Ask queries like:

   > “How to prevent wheat rust disease?”
5. Upload crop images
6. Get AI-powered recommendations

---

## 🏆 Why This Project Stands Out

* Real-world impact in agriculture 🌾
* Combines **ML + Generative AI effectively**
* Designed for **inclusivity and accessibility**
* Fully functional **PWA deployment model**
* Clean and scalable architecture

---

## 📌 Future Enhancements

* Real-time weather API integration
* Offline advisory mode
* Satellite-based crop monitoring
* Marketplace integration for farmers

---

## 🤝 Contribution

Contributions are welcome!
Feel free to fork, improve, and submit a PR.

---

## 📄 License

This project is built for educational and hackathon purposes.

---

## ❤️ Built With Purpose

> Empowering farmers with technology that speaks their language.

