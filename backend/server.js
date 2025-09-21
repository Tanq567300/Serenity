import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting for chat endpoint
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Import the API handler dynamically AFTER dotenv.config() so that
// `process.env` (including GEMINI_API_KEY from a local .env) is available
// when `./api/chat.js` is evaluated. Static `import` statements are
// hoisted and would otherwise run before `dotenv.config()`.
const { default: chatHandler } = await import('./api/chat.js');

// API Routes
app.post('/api/chat', chatLimiter, chatHandler);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start the server in local development (do NOT start a listener on Vercel).
// Vercel sets the `VERCEL` environment variable; if it's present we must
// not call `app.listen` because Vercel will import this app for serverless
// handling. Locally `VERCEL` will be undefined and we should start the
// HTTP listener so the frontend can call `http://localhost:3000`.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
    if (process.env.GEMINI_API_KEY) {
      console.log('Gemini API key detected in environment.');
    } else {
      console.log('Warning: GEMINI_API_KEY not set. AI chat will fall back to offline/default responses.');
    }
  });
}

// Start server locally (not needed for Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🚀 API endpoints available at http://localhost:${PORT}/api/`);
    console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Configured ✅' : 'Missing ❌'}`);
  });
}

// Export the app for Vercel
export default app;
