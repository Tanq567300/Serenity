const mongoose = require('mongoose');
const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const crisisService = require('./crisisService');
const emotionService = require('./emotionService');
const aiService = require('./aiService');
const encryption = require('../utils/encryption');

/**
 * processUserMessage
 * Orchestrates the entire chat flow.
 * @param {string} userId - ID of the user
 * @param {string} sessionId - ID of the chat session
 * @param {string} messageContent - The raw text message from user
 * @returns {object} - The response object { response: string, crisis: boolean, ... }
 */
const processUserMessage = async (userId, sessionId, messageContent) => {
    // 1. Validate Session
    const session = await ChatSession.findOne({ _id: sessionId, userId });
    if (!session) {
        throw new Error('Invalid session or unauthorized');
    }

    // Update session lastActive
    session.lastActive = new Date();
    await session.save();

    // 2. Crisis Detection
    const crisisResult = crisisService.detectCrisis(messageContent);
    if (crisisResult.isCrisis) {
        // Return crisis response immediately, do not store as normal chat flow or call AI?
        // Actually, we should probably store the user message for record, but maybe not the response from AI.
        // Spec says: "Chat pipeline must bypass AI call. Return crisis support payload."
        // Let's store the user message with a flag if possible, or just return. 
        // For now, let's return immediately without storing to DB to keep it simple, 
        // or store it but with a special flag. Let's just return the payload.
        return {
            response: crisisService.getCrisisResponse(),
            isCrisis: true,
            data: crisisResult
        };
    }

    // 3. Emotion Inference
    const emotionResult = await emotionService.inferEmotion(messageContent);

    // 4. Fetch Context (Last 10-15 messages)
    // Retrieve recent messages for this session
    const recentMessages = await ChatMessage.find({ sessionId })
        .sort({ timestamp: -1 })
        .limit(10) // Limit to 10 for context window
        .lean();

    // Reverse to chronological order for AI
    recentMessages.reverse();

    // Decrypt content for AI context
    const sessionContext = recentMessages.map(msg => ({
        role: msg.role,
        content: encryption.decrypt(msg.encryptedContent)
    }));

    // 5. & 6. Call AI Service
    let aiResponseText;
    try {
        aiResponseText = await aiService.generateChatResponse({
            userId,
            message: messageContent,
            sessionContext
        });
    } catch (error) {
        console.error('AI Processing Error:', error);
        // Fallback response?
        aiResponseText = "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
    }

    // 7. Store Messages (Encrypted)

    // User Message
    const userMessage = new ChatMessage({
        sessionId,
        role: 'user',
        encryptedContent: encryption.encrypt(messageContent),
        inferredEmotion: emotionResult.emotion,
        moodScore: emotionResult.moodScore,
        timestamp: new Date()
    });
    await userMessage.save();

    // Assistant Message
    const assistantMessage = new ChatMessage({
        sessionId,
        role: 'assistant',
        encryptedContent: encryption.encrypt(aiResponseText),
        // We could infer emotion from AI response too, but spec says "Store this metadata with user message"
        timestamp: new Date()
    });
    await assistantMessage.save();

    // 8. Return Response
    return {
        response: aiResponseText,
        isCrisis: false,
        emotion: emotionResult
    };
};

/**
 * createSession
 * Creates a new chat session for a user.
 */
const createSession = async (userId) => {
    const session = new ChatSession({ userId });
    await session.save();
    return session;
};

/**
 * getHistory
 * Retrieves decrypted history for a session.
 */
const getHistory = async (userId, sessionId) => {
    const session = await ChatSession.findOne({ _id: sessionId, userId });
    if (!session) throw new Error('Session not found');

    const messages = await ChatMessage.find({ sessionId }).sort({ timestamp: 1 }).lean();

    return messages.map(msg => ({
        role: msg.role,
        content: encryption.decrypt(msg.encryptedContent),
        timestamp: msg.timestamp,
        emotion: msg.inferredEmotion // Include metadata if needed
    }));
};

module.exports = {
    processUserMessage,
    createSession,
    getHistory
};
