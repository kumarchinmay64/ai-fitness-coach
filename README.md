# PulseAI — Cybernetic AI Fitness & Form Coach 🏋️‍♂️⚡

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.114+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Vision-0078D7?logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

An advanced, real-time AI-powered Fitness and Nutrition platform featuring computer-vision pose tracking, live biomechanical feedback, conversational RAG coaching, and automated workout telemetry.

---

## ✨ Features

- 🎯 **Real-Time Pose Tracking & Rep Counting**: Powered by MediaPipe Vision running directly in-browser with sub-millisecond biomechanical angle calculations (squats, bicep curls, pushups).
- 🎙️ **Live Audio & Visual Form Correction**: Immediate corrective audio cues and visual HUD overlays when posture slips or ROM (Range of Motion) is incomplete.
- 🧠 **RAG-Powered AI Coach**: FastAPI backend integrated with Google Gemini Flash and vector similarity retrieval for accurate, medically grounded fitness and nutrition guidance.
- 📊 **Telemetry & Progress Analytics**: Real-time rep progression, caloric burn estimates, workout duration, and weekly velocity charts using Chart.js.
- 🥗 **Personalized Nutrition Engine**: Macro-nutrient breakdowns, meal planning, and metabolic targets tailored to user biometric inputs.
- 🔐 **Secure Authentication & Admin Hub**: JWT-based session security, bcrypt password hashing, and administrative dashboard.
- ⚡ **Cybernetic Dark Theme**: Hyper-Volt aesthetics, glassmorphism cards, and fluid responsive layouts.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Cybernetic Design System
- **Vision AI**: `@mediapipe/tasks-vision`
- **Charts & Motion**: Chart.js, `react-chartjs-2`, `canvas-confetti`, Lucide React
- **Routing**: React Router DOM v6

### Backend
- **Server**: FastAPI + Uvicorn + WebSockets
- **LLM & Embeddings**: Google Gemini Flash API (`google-genai`), Sentence Transformers
- **Vector Search**: FAISS (`faiss-cpu`)
- **Database & Auth**: SQLAlchemy, SQLite, PyJWT, Passlib / Bcrypt

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and `npm`
- **Python** 3.10+
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))

---

### 1. Clone & Setup Repository

```bash
git clone https://github.com/<your-username>/ai-fitness-coach.git
cd ai-fitness-coach
```

### 2. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt
# (or install fastapi uvicorn google-genai faiss-cpu sentence-transformers sqlalchemy pyjwt python-dotenv)

# Configure Environment Variables
cp .env.example .env
# Open .env and insert your GEMINI_API_KEY
```

```bash
# Start FastAPI backend
python main.py
# Or: uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.

---

## 🔒 Security Note
- Secrets (`.env`) and local SQLite databases are excluded by `.gitignore`.
- Never commit actual API keys to version control. Always copy `.env.example` to `.env` locally.

---

## 📄 License
MIT License. Built for fitness enthusiasts and developers.

