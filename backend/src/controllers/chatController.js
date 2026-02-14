const chatService = require('../services/chatService');

exports.startSession = async (req, res) => {
    try {
        const session = await chatService.createSession(req.user.userId);
        res.status(201).json({
            success: true,
            sessionId: session._id,
            message: 'New chat session started'
        });
    } catch (error) {
        console.error('Start Session Error:', error);
        res.status(500).json({ success: false, message: 'Failed to start session' });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { sessionId, message } = req.body;

        if (!sessionId || !message) {
            return res.status(400).json({ success: false, message: 'Session ID and message are required' });
        }

        const result = await chatService.processUserMessage(req.user.userId, sessionId, message);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ success: false, message: 'Failed to process message' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const history = await chatService.getSessionHistory(req.user.userId, sessionId);

        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Get History Error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve history' });
    }
};
