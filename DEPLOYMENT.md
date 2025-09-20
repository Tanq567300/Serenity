# Deployment Guide

## Vercel Deployment (Frontend Only)

The frontend is configured to deploy to Vercel automatically.

### Configuration Files:
- `vercel.json` - Vercel deployment configuration
- `.vercelignore` - Files to exclude from deployment
- `package.json` - Contains build commands

### Build Process:
1. Vercel runs `npm run build` from root
2. This executes `cd frontend && npm install && npm run build`
3. Frontend builds to `frontend/dist/`
4. Vercel serves the static files

### Environment Variables:
For production, you may need to set:
- `VITE_API_URL` - Backend API URL (if different from localhost)

## Backend Deployment

The backend needs to be deployed separately to a service like:
- Railway
- Heroku
- DigitalOcean
- AWS

### Backend Environment Variables:
- `GEMINI_API_KEY` - Your Gemini API key
- `PORT` - Server port (usually 3000)
- `NODE_ENV` - Set to "production"

## Full Stack Deployment

For a complete deployment:

1. **Deploy Backend** to your preferred service
2. **Update Frontend** API URL to point to your backend
3. **Deploy Frontend** to Vercel

### Update API URL in Frontend:
```javascript
// In frontend/src/services/aiService.js
this.apiUrl = 'https://your-backend-url.com/api/chat';
```

## Troubleshooting

### Vercel Build Fails:
- Check that `vercel.json` is configured correctly
- Ensure `package.json` has the right build command
- Verify frontend dependencies are installed

### API Connection Issues:
- Update frontend API URL to production backend
- Check CORS settings in backend
- Verify environment variables are set
