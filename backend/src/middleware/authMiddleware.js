const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }

    req.user = { userId: decoded.userId };
    next();
};

module.exports = authMiddleware;
