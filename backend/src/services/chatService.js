const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const { encrypt, decrypt } = require('../utils/encryption');
const crisisService = require('./crisisService');
const emotionService = require('./emotionService');
const aiService = require('./aiService');
const dailyMemoryService = require('./dailyMemoryService');

/**
 * Process a user message in a chat session.
 * @param {string} userId - The ID of the user.
 * @param {string} sessionId - The ID of the session.
 * @param {string} messageText - The user's message.
 * @returns {Promise<Object>} - The AI response or crisis payload.
 */
async function processUserMessage(userId, sessionId, messageText) {
    // 1. Validate Session
    const session = await ChatSession.findOne({
        _id: sessionId,
        user: userId,
        isActive: true
    });

    if (!session) {
        throw new Error('Invalid or inactive session');
    }

    // TRIGGER: Check/Generate Daily Memory for Yesterday (Async/Fire-and-Forget)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    dailyMemoryService.createDailyMemory(userId, yesterday)
        .catch(err => console.error('Daily Memory Trigger Error:', err));

    // 2. Crisis Detection
    const crisisResult = crisisService.detectCrisis(messageText);

    // Save User Message (Encrypted)
    // We save it even if crisis, for audit/history, but maybe flag it?
    // ChatMessage schema has isCrisis field.

    // 3. Emotion Inference (Parallel with crisis check potentially, but sequential here for flow)
    let emotionData = { emotion: 'neutral', moodScore: 3 };
    if (!crisisResult.isCrisis) {
        emotionData = await emotionService.inferEmotion(messageText);
    }

    const userMessage = new ChatMessage({
        session: session._id,
        sender: 'user',
        encryptedContent: encrypt(messageText),
        inferredEmotion: emotionData.emotion,
        moodScore: emotionData.moodScore,
        isCrisis: crisisResult.isCrisis,
        timestamp: new Date()
    });
    await userMessage.save();

    // If Crisis, return immediately
    if (crisisResult.isCrisis) {
        // Return structured response but do NOT call Gemini
        return {
            reply: crisisResult.response.text,
            resources: crisisResult.response.resources,
            isCrisis: true
        };
    }

    // 4. Fetch Context (Last 10 messages)
    // Sort by timestamp descending, limit 10, then reverse to get chronological
    const historyMessages = await ChatMessage.find({ session: session._id })
        .sort({ timestamp: -1 })
        .limit(10)
        .lean();

    // Organize context: chronological order
    const context = historyMessages.reverse().map(msg => ({
        sender: msg.sender,
        content: decrypt(msg.encryptedContent),
        // timestamp? emotion? aiService mainly needs content and role
    }));

    // 5. Generate AI Response
    let aiResponse;
    try {
        aiResponse = await aiService.generateChatResponse({
            message: messageText,
            sessionContext: context
        });
    } catch (error) {
        // generateChatResponse has a three-level cascade and should not throw,
        // but guard here as a last resort.
        console.error('AI Generation Failed:', error);
        aiResponse = {
            type: 'breathing_redirect',
            exerciseId: 'box444',
            message: "It might help to pause and take a few slow breaths.",
        };
    }

    // If the cascade fell through to a breathing redirect, handle it before
    // saving — store the human-readable message in history, not raw JSON.
    const isBreathingRedirect =
        typeof aiResponse === 'object' && aiResponse.type === 'breathing_redirect';

    const contentToStore = isBreathingRedirect ? aiResponse.message : aiResponse;

    // 6. Save AI Response (always save the plain-text content for history readability)
    const aiMessage = new ChatMessage({
        session: session._id,
        sender: 'assistant',
        encryptedContent: encrypt(contentToStore),
        timestamp: new Date()
    });
    await aiMessage.save();

    // Return breathing redirect or normal reply
    if (isBreathingRedirect) {
        return {
            type: 'breathing_redirect',
            exerciseId: aiResponse.exerciseId,
            message: aiResponse.message,
            isCrisis: false,
            emotion: emotionData
        };
    }

    return {
        reply: aiResponse,
        isCrisis: false,
        emotion: emotionData
    };
}

/**
 * Create a new chat session for a user.
 */
async function createSession(userId) {
    // Optionally close previous active sessions?
    // For now, allow multiple or just create new.
    const session = new ChatSession({
        user: userId,
        isActive: true,
        startTime: new Date()
    });
    await session.save();
    return session;
}

/**
 * Get history for a session (Decrypted)
 */
async function getSessionHistory(userId, sessionId) {
    const session = await ChatSession.findOne({ _id: sessionId, user: userId });
    if (!session) throw new Error('Session not found');

    const messages = await ChatMessage.find({ session: sessionId })
        .sort({ timestamp: 1 })
        .lean();

    return messages.map(msg => ({
        id: msg._id,
        sender: msg.sender,
        content: decrypt(msg.encryptedContent),
        timestamp: msg.timestamp,
        isCrisis: msg.isCrisis
    }));
}

module.exports = {
    processUserMessage,
    createSession,
    getSessionHistory
};
