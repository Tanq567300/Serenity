const express = require('express');
const router = express.Router();
const dailyMemoryController = require('../controllers/dailyMemoryController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.post('/journal', dailyMemoryController.createJournalEntry);
router.get('/daily/:date', dailyMemoryController.getDailyMemory);
router.get('/daily', dailyMemoryController.getMemories);

module.exports = router;
