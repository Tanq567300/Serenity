const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const protect = require('../middleware/authMiddleware');

// All article routes require a valid JWT
router.use(protect);

router.get('/personalized', articleController.getPersonalizedArticles);

module.exports = router;
