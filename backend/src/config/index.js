require('dotenv').config();

const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/mental_wellness',
    jwtSecret: process.env.JWT_SECRET,
    encryptionSecret: process.env.ENCRYPTION_SECRET,
    openaiApiKey: process.env.OPENAI_API_KEY,
    env: process.env.NODE_ENV || 'development',
};

// Check for critical variables
const requiredVars = ['JWT_SECRET', 'ENCRYPTION_SECRET'];
// In a real scenario we would enforce these, but for now we'll just log a warning if missing in dev
// or throw in production. For this phase, just ensuring structure.

if (process.env.NODE_ENV === 'production') {
    const missing = requiredVars.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing critical environment variables: ${missing.join(', ')}`);
    }
}

module.exports = config;
