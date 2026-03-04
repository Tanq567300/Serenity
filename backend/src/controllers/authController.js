const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const { validateRegistration, validateLogin } = require('../utils/validators/authValidator');

// POST /api/auth/register
const register = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;

        // Validate input
        const validation = validateRegistration(email, password);
        if (!validation.isValid || !username || username.trim() === '') {
            return res.status(400).json({
                success: false,
                message: validation.isValid ? 'Username is required' : validation.errors.join(', '),
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        await User.create({ email, passwordHash, username });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        const validation = validateLogin(email, password);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: validation.errors.join(', '),
            });
        }

        // Find user and explicitly select passwordHash
        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Update lastLogin
        await User.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                profilePic: user.profilePic,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/refresh
const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required',
            });
        }

        const decoded = verifyToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token',
            });
        }

        // Issue new access token
        const accessToken = generateAccessToken(decoded.userId);

        res.status(200).json({
            success: true,
            accessToken,
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                profilePic: user.profilePic,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refresh,
    getMe,
};
