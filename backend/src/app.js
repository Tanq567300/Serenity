const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');

const config = require('./config');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logging
if (config.env === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const chatRoutes = require('./routes/chat.routes');

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mood', (req, res, next) => {
    res.status(501).json({ message: "Not Implemented" });
});
app.use('/api/analytics', (req, res, next) => {
    res.status(501).json({ message: "Not Implemented" });
});
app.use('/api/export', (req, res, next) => {
    res.status(501).json({ message: "Not Implemented" });
});


// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found'
    });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
