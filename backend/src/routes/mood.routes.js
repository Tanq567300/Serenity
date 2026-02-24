const express = require('express');
const router = express.Router();
const { submitJournal } = require('../controllers/moodController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes prefixed with /api/mood
router.post('/journal', authMiddleware, submitJournal);

module.exports = router;
