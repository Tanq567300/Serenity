const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(config.geminiApiKey);

// Use the user-requested model
const MODEL_NAME = 'gemini-2.5-flash-lite';

const SYSTEM_INSTRUCTION = `You are a supportive mental wellness assistant.
You do not provide medical diagnosis.
You provide empathetic listening and CBT-style reflection.
If user expresses self-harm intent, encourage professional help.`;

async function generateChatResponse({ message, sessionContext = [] }) {
    try {
        // Pass system instruction here for correct API usage
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: SYSTEM_INSTRUCTION
        });

        // Construct history from sessionContext
        // ... (lines 24-27 unchanged) ...
        let history = sessionContext.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
            history: history,
            // systemInstruction removed from here
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Gemini API Error details:', JSON.stringify(error, null, 2));
        throw new Error('Failed to generate AI response: ' + error.message);
    }
}

module.exports = {
    generateChatResponse,
    genAI // Exporting instance if needed by other services
};
