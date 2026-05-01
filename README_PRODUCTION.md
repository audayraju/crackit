# CrackAI Production Guide 🚀

Welcome to the production-ready CrackAI ecosystem. This document provides an overview of the architecture and instructions for maintaining the application.

## 🏗️ Architecture Overview

CrackAI is composed of two main parts:
1.  **Next.js SaaS Web App:** Handles authentication, dashboard, user profiles, and the AI interview engine.
2.  **Electron Desktop Wrapper:** Provides the "Stealth Mode" functionality with native OS window management (transparency, click-through, and screen capture).

### Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, Framer Motion.
- **Backend:** Next.js API Routes (hosted as Firebase Cloud Functions).
- **Database & Auth:** Supabase.
- **AI Engine:** OpenRouter (using `google/gemini-1.5-flash` for vision and text).
- **Desktop:** Electron.

## 🚀 Deployment

### Web App (Firebase Hosting)
The web app is deployed to Firebase Hosting with Next.js SSR support enabled.
- **Command:** `npx firebase-tools deploy --only hosting`
- **Configuration:** `firebase.json` and `.firebaserc`.

### Desktop App (Windows Installer)
The desktop app is packaged using `electron-builder`.
- **Command:** `npm run build:desktop`
- **Output:** A standalone `.exe` installer in the `dist/` directory.

## 🔑 Environment Variables

Ensure the following variables are set in your `.env.local` (for development) and in your Firebase/Supabase consoles (for production):
- `OPENROUTER_API_KEY`: Your API key from OpenRouter.
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key.

## 🥷 Stealth Mode Features
- **Transparency Slider:** Adjust opacity to make the widget virtually invisible to others.
- **Auto-Mode:** Automatically captures and analyzes your screen every 30 seconds for hands-free guidance.
- **Click-Through:** Enable click-through mode to interact with windows behind the widget.
- **Content Protection:** Native Electron protection to prevent the widget from appearing in standard screen recordings.

## 🛠️ Maintenance & Scaling
- **Model Switching:** You can easily swap AI models in the `app/api/interview/vision/route.js` file by changing the model ID.
- **UI Customization:** All styling is handled via Tailwind CSS in the `components/` directory.
- **New Features:** Add new dashboard tools by creating components and registering them in `app/dashboard/page.js`.

---
**CrackAI - Land your dream job with AI by your side.**
