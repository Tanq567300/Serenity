const DailyMemory = require('../models/DailyMemory');
const { decrypt } = require('../utils/encryption');

/**
 * Get daily memory for a specific date
 * GET /api/memory/daily/:date (ISO string or YYYY-MM-DD)
 */
exports.getDailyMemory = async (req, res) => {
    try {
        const { date } = req.params;
        const queryDate = new Date(date);

        // Validate date
        if (isNaN(queryDate.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid date format' });
        }

        const startOfDay = new Date(queryDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(queryDate);
        endOfDay.setHours(23, 59, 59, 999);

        const memory = await DailyMemory.findOne({
            userId: req.user.userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (!memory) {
            return res.status(404).json({ success: false, message: 'No memory found for this date' });
        }

        // Decrypt summary
        const decryptedSummary = decrypt(memory.summary);

        res.json({
            success: true,
            data: {
                ...memory.toObject(),
                summary: decryptedSummary
            }
        });
    } catch (error) {
        console.error('Get Daily Memory Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * Get all daily memories (paginated or last N)
 * GET /api/memory/daily
 */
exports.getMemories = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 7; // Default last 7 days
        const memories = await DailyMemory.find({ userId: req.user.userId })
            .sort({ date: -1 })
            .limit(limit);

        const decryptedMemories = memories.map(mem => ({
            ...mem.toObject(),
            summary: decrypt(mem.summary)
        }));

        res.json({
            success: true,
            data: decryptedMemories
        });
    } catch (error) {
        console.error('Get Memories Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
