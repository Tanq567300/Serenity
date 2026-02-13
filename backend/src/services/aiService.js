const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini client
// Ensure GEMINI_API_KEY is in .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a chat response using Gemini
 * @param {object} params
 * @param {string} params.userId - User ID
 * @param {string} params.message - Current user message
 * @param {Array} params.sessionContext - Array of previous messages [{role, content}]
 * @returns {Promise<string>} - The assistant's response
 */
const generateChatResponse = async ({ userId, message, sessionContext = [] }) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

        // Construct history for Gemini
        // Gemini uses 'user' and 'model' roles.
        const history = sessionContext.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Prepend system prompt to history (Gemini Pro doesn't have system instruction in same way as GPT yet via standard SDK for all versions, 
        // but we can prepend it to the first message or send it as part of the chat start).
        // Better strategy for consistency:
        // Start chat with history, but we need to ensure the system prompt is effective.
        // We can add the system prompt as the first "user" message, and a dummy "model" acknowledgement if we want strict history.
        // Or just prepend it to the current message if history is empty. 
        // Let's prepend to the very first message in the history if it exists, or the active message.

        // Actually, gemini-1.5-pro supports systemInstruction. Let's assume standard gemini-pro for now which might not.
        // Safest approach: Prepend to the context.

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: `SYSTEM INSTRUCTION: ${systemPrompt}` }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am Serenity, ready to support you." }],
                },
                ...history
            ],
            generationConfig: {
                maxOutputTokens: 300,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return text;

    } catch (error) {
        console.error('AI Service Error:', error);
        throw new Error('Failed to generate AI response');
    }
};

module.exports = {
    generateChatResponse
};
