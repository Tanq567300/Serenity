const jwt = require('jsonwebtoken');
const config = require('../config');

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, config.jwtSecret, {
        expiresIn: '15m',
    });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, config.jwtSecret, {
        expiresIn: '7d',
    });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
};
