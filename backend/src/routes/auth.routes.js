const express = require('express');
const router = express.Router();
const { register, login, refresh, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// Protected routes
router.get('/me', authMiddleware, getMe);

module.exports = router;
