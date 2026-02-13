const OpenAI = require('openai');

// Initialize OpenAI client
// Ensure OPENAI_API_KEY is in .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a chat response using OpenAI
 * @param {object} params
 * @param {string} params.userId - User ID
 * @param {string} params.message - Current user message
 * @param {Array} params.sessionContext - Array of previous messages [{role, content}]
 * @returns {Promise<string>} - The assistant's response
 */
const generateChatResponse = async ({ userId, message, sessionContext = [] }) => {
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

        const messages = [
            { role: 'system', content: systemPrompt },
            ...sessionContext, // Injected context (last 10-15 messages)
            { role: 'user', content: message }
        ];

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o', // or gpt-3.5-turbo depending on budget/preference
            messages: messages,
            temperature: 0.7,
            max_tokens: 300,
        });

        return completion.choices[0].message.content;

    } catch (error) {
        console.error('AI Service Error:', error);
        throw new Error('Failed to generate AI response');
    }
};

module.exports = {
    generateChatResponse
};
