const DailyMemory = require('../models/DailyMemory');
const { decrypt } = require('../utils/encryption');

/**
 * Get aggregated dashboard data
 * GET /api/dashboard
 */
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userName = req.user.name || 'Friend';

        // 1. Get recent memories for Mood Score calculation (last 7 days)
        const recentMemories = await DailyMemory.find({ userId })
            .sort({ date: -1 })
            .limit(7);

        // Calculate Average Mood Score
        let averageMood = 0;
        if (recentMemories.length > 0) {
            const totalMood = recentMemories.reduce((sum, mem) => sum + (mem.averageMoodScore || 0), 0);
            averageMood = (totalMood / recentMemories.length).toFixed(1);
        }

        // 2. Get recent journal entries for preview (limit 2 for home screen)
        const recentJournals = recentMemories.slice(0, 2).map(mem => ({
            id: mem._id,
            date: mem.date,
            summary: decrypt(mem.summary),
            moodScore: mem.averageMoodScore,
            dominantEmotion: mem.dominantEmotion,
            tags: mem.tags
        }));

        const latestJournal = recentJournals.length > 0 ? recentJournals[0] : null;

        // 3. Generate personalized AI Guide Message
        let aiGuideMessage = `How are you feeling right now, ${userName}?`;
        if (latestJournal) {
            if (latestJournal.moodScore < 4) {
                aiGuideMessage = `I noticed you were feeling ${latestJournal.dominantEmotion} recently. Want to talk about it?`;
            } else if (latestJournal.moodScore > 8) {
                aiGuideMessage = `You've been doing great! What's fueling your positive energy?`;
            }
        }

        // 4. Generate or select a quote
        const quotes = [
            "You are capable of amazing things.",
            "Breathe. It's just a bad day, not a bad life.",
            "Your mental health is a priority.",
            "Small steps every day add up to big results.",
            "Be kind to yourself today."
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        res.json({
            success: true,
            data: {
                userName,
                moodScore: parseFloat(averageMood),
                quote: randomQuote,
                latestJournal, // Keep for backward compatibility if needed
                recentJournals, // New array for list
                aiGuideMessage // New personalized message
            }
        });

    } catch (error) {
        console.error('Get Dashboard Data Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
