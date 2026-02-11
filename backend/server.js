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

startServer();
