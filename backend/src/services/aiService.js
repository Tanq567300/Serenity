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
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        // Construct history from sessionContext
        // sessionContext is expected to be an array of { role: 'user'|'model', parts: [{ text: '...' }] }
        // or we convert our internal message format to Gemini format here.
        // Internal: { sender: 'user'|'assistant', encryptedContent: '...' } (decrypted before passing here)

        let history = sessionContext.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }] // Assuming content is already decrypted
        }));

        // Add system instruction as the first piece of context or use the systemInstruction property if supported by the model/SDK version.
        // For current SDK, systemInstruction is supported in getGenerativeModel config.

        const chat = model.startChat({
            history: history,
            systemInstruction: SYSTEM_INSTRUCTION,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Failed to generate AI response');
    }
}

module.exports = {
    generateChatResponse,
    genAI // Exporting instance if needed by other services
};
