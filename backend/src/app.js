const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/health', healthRoutes);

// Placeholder Routes
app.use('/api/auth', (req, res, next) => {
    res.status(501).json({ message: "Not Implemented" });
});
app.use('/api/chat', (req, res, next) => {
    res.status(501).json({ message: "Not Implemented" });
});
app.use('/api/mood', (req, res, next) => {
    res.status(501).json({ message: "Not Implemented" });
});
app.use('/api/analytics', (req, res, next) => {
    res.status(501).json({ message: "Not Implemented" });
});
app.use('/api/export', (req, res, next) => {
    res.status(501).json({ message: "Not Implemented" });
});


// Error Handler
app.use(errorHandler);

module.exports = app;
