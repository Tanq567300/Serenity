# Sereni AI - Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=development
   ```

3. **Get a Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key and paste it in your `.env` file

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   This will start both the frontend (Vite) and backend (Express) servers.

## Available Scripts

- `npm run dev` - Start both frontend and backend servers
- `npm run dev:client` - Start only the frontend (Vite)
- `npm run dev:server` - Start only the backend (Express)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features

- **AI Chat**: Powered by Google Gemini AI
- **Mood Tracking**: Track your daily mood with insights
- **PWA Support**: Install as a mobile app
- **Offline Mode**: Works without internet (mood tracking)

## Troubleshooting

### CSS Issues
- If the app looks broken, make sure you're running the latest version
- Try clearing your browser cache

### API Connection Issues
- Make sure you have a valid `GEMINI_API_KEY` in your `.env` file
- Check that the backend server is running on port 3000
- The app will show helpful error messages if the API is not available

### Development vs Production
- Development: Uses `http://localhost:3000/api/chat`
- Production: Uses `/api/chat` (relative path)

## File Structure

```
├── src/
│   ├── components/
│   │   └── MoodTracker.jsx
│   ├── services/
│   │   ├── aiService.js
│   │   └── firebase.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── api/
│   └── chat.js
├── server.js
├── package.json
└── .env (create this file)
```
