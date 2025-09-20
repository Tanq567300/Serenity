# Sereni AI - Mental Wellness App

A modern mental wellness application with AI-powered chat and mood tracking features, built with React and Express.

## 🏗️ Project Structure

```
sereni-ai/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   └── package.json
├── backend/           # Express.js backend
│   ├── api/
│   ├── server.js
│   └── package.json
├── package.json       # Root package.json for managing both projects
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Set up Environment Variables
Create a `.env` file in the `backend` folder:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

### 3. Get a Gemini API Key
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Copy the key and paste it in your `backend/.env` file

### 4. Start Both Servers
```bash
npm run dev
```

This will start both servers concurrently:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

> **Note**: If you get a "concurrently not recognized" error, run `npm install` first to install the root dependencies.

## 📋 Available Scripts

### Root Level (Manages Both Projects)
- `npm run dev` - Start both frontend and backend
- `npm run install:all` - Install dependencies for both projects
- `npm run build` - Build frontend for production

### Frontend Only
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Only
```bash
cd backend
npm run dev      # Start development server
npm start        # Start production server
```

## 🔧 Features

### ✅ AI Chat
- Powered by Google Gemini AI
- Mental health first aid assistant
- Contextual conversation history
- Empathetic responses for teens and young adults

### ✅ Mood Tracking
- Daily mood check-ins (1-5 scale)
- Optional mood notes
- Visual mood history charts
- Trend analysis and insights
- Local storage (works offline)

### ✅ PWA Support
- Install as mobile app
- Service worker for offline functionality
- Responsive design

## 🛠️ Development

### Backend API Endpoints
- `POST /api/chat` - AI chat endpoint
- `GET /api/health` - Health check

### Frontend Services
- `aiService.js` - Handles AI API calls
- `MoodTracker.jsx` - Mood tracking component

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Railway/Heroku/Vercel)
```bash
cd backend
# Deploy the backend folder
# Set environment variables in your hosting platform
```

## 🔍 Troubleshooting

### API Connection Issues
- Ensure backend is running on port 3000
- Check that `GEMINI_API_KEY` is set in `backend/.env`
- Verify CORS settings in backend

### Frontend Issues
- Clear browser cache
- Check console for errors
- Ensure frontend is running on port 5173

### Common Commands
```bash
# Check if servers are running
curl http://localhost:3000/api/health
curl http://localhost:5173

# Test API endpoint
Invoke-WebRequest -Uri "http://localhost:3000/api/chat" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"message": "Hello"}'
```

## 📱 Usage

1. **AI Chat**: Type messages to get supportive responses
2. **Mood Tracking**: Select your daily mood and add notes
3. **View History**: See your mood patterns and insights
4. **Offline Mode**: Mood tracking works without internet

## 🎯 Next Steps

- Add user authentication
- Implement data persistence
- Add more mental health resources
- Create mood-based recommendations