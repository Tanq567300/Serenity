const axios = require('axios');

// Initialize Gemini configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.0-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Generates a chat response using Gemini via Axios (REST API)
 * @param {object} params
 * @param {string} params.userId - User ID
 * @param {string} params.message - Current user message
 * @param {Array} params.sessionContext - Array of previous messages [{role, content}]
 * @returns {Promise<string>} - The assistant's response
 */
const generateChatResponse = async ({ userId, message, sessionContext = [] }) => {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is missing');
    }

    try {
        const systemPrompt = `
You are Serenity, a compassionate and supportive mental wellness AI companion.
Your goal is to provide a safe space for users to express their feelings.
You use principles of Cognitive Behavioral Therapy (CBT) to help users reflect, but you DO NOT diagnose or act as a doctor.
If a user expresses serious distress or crisis, valid safety protocols (handled by another layer) should have caught it, but if you still detect it, urge them to seek professional help immediately.

Guidelines:
- Be empathetic, non-judgmental, and patient.
- Keep responses concise (under 150 words usually) unless a deeper explanation is asked for.
- Ask open-ended questions to encourage reflection.
- Do not use overly clinical language; be warm and human-like.
- Validating the user's feelings is your first priority.
    `.trim();

        // Construct contents for Gemini
        const contents = sessionContext.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Add current user message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const payload = {
            contents: contents,
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.7
            }
        };

        const response = await axios.post(API_URL, payload);

        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            const candidate = response.data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                return candidate.content.parts[0].text;
            }
        }

        throw new Error('No valid response from Gemini');

    } catch (error) {
        console.error('AI Service Error:', error.response?.data || error.message);
        if (error.response?.status === 429) {
            return "I'm currently receiving too many requests. Please try again in a moment."; // Graceful fallback
        }
        throw new Error('Failed to generate AI response');
    }
};

module.exports = {
    generateChatResponse
};
