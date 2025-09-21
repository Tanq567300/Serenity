# Backend - Sereni AI

This folder contains the Express backend API used by the Sereni AI frontend.

## Local development quickstart

1. Install dependencies

```bash
cd backend
npm install
```

2. Create a `.env` file (copy the example) and add your Gemini API key

```bash
cp .env.example .env
# then edit .env and set:
# GEMINI_API_KEY=your_gemini_api_key_here
# (optional) PORT=3000
```

3. Start the backend server (watch mode for development)

```bash
npm run dev
```

The server will listen on the `PORT` environment variable (defaults to `3000`). The frontend development server (Vite) expects the backend at `http://localhost:3000/api/*` in development.

4. Start the frontend (from repo root or `frontend` folder)

```bash
cd ../frontend
npm install
npm run dev
```

Open the frontend (Vite) URL (usually `http://localhost:5173`) and use the chat UI. If the backend has `GEMINI_API_KEY` configured, AI chat responses will be provided by Gemini. If the key is missing, the application will fall back to a friendly offline message.
