const app = require('./src/app');
const config = require('./src/config');
const connectDB = require('./src/config/db');

const startServer = async () => {
    try {
        // Connect to Database
        await connectDB();

        const PORT = config.port;

        app.listen(PORT, () => {
            console.log(`Server running in ${config.env} mode on port ${PORT}`);
        });

    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});

startServer();
