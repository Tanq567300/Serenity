const express = require('express');
const router = express.Router();
const patternMemoryController = require('../controllers/patternMemoryController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.use(authMiddleware);

// GET /api/memory/pattern
router.get('/', patternMemoryController.getUserPattern);

// POST /api/memory/pattern/recalculate
router.post('/recalculate', patternMemoryController.recalculatePattern);

module.exports = router;
