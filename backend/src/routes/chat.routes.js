const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const protect = require('../middleware/authMiddleware');

// All chat routes are protected
router.use(protect);

router.post('/new-session', chatController.startSession);
router.post('/message', chatController.sendMessage);
router.get('/history/:sessionId', chatController.getHistory);

module.exports = router;
