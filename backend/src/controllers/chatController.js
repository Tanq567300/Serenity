const chatService = require('../services/chatService');

// POST /api/chat/new-session
const createSession = async (req, res) => {
    try {
        const userId = req.user.userId; // Assumes auth middleware populates req.user
        const session = await chatService.createSession(userId);
        res.status(201).json({
            sessionId: session._id,
            message: 'New chat session created'
        });
    } catch (error) {
        console.error('Create Session Error:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
};

// POST /api/chat/message
const sendMessage = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { sessionId, message } = req.body;

        if (!sessionId || !message) {
            return res.status(400).json({ error: 'sessionId and message are required' });
        }

        const result = await chatService.processUserMessage(userId, sessionId, message);

        res.json(result);
    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
};

// GET /api/chat/history/:sessionId
const getHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { sessionId } = req.params;

        const history = await chatService.getHistory(userId, sessionId);
        res.json({ history });
    } catch (error) {
        console.error('Get History Error:', error);
        res.status(500).json({ error: 'Failed to retrieve history' });
    }
};

module.exports = {
    createSession,
    sendMessage,
    getHistory
};
