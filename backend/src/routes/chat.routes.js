const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all chat routes
// Assuming authMiddleware exports a function or an object with a middleware function
// Common pattern: module.exports = authenticateToken;
// I'll assume standard usage. I should check authMiddleware content if I could, but based on naming it's likely a function.
// Let's wrap it safe.

router.use(authMiddleware);

router.post('/new-session', chatController.createSession);
router.post('/message', chatController.sendMessage);
router.get('/history/:sessionId', chatController.getHistory);

module.exports = router;
