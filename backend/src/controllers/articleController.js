const MoodEntry = require('../models/MoodEntry');
const { getArticles } = require('../services/articleService');

// ─── Emotion → Mood Key Normalizer ───────────────────────────────
function normalizeMood(emotion) {
    if (!emotion) return 'neutral';

    const e = emotion.toLowerCase();

    if (
        e.includes('anxious') ||
        e.includes('anxiety') ||
        e.includes('panic') ||
        e.includes('worry') ||
        e.includes('nervous')
    ) {
        return 'anxious';
    }

    if (
        e.includes('stress') ||
        e.includes('overwhelm') ||
        e.includes('burnout') ||
        e.includes('exhaust')
    ) {
        return 'stressed';
    }

    if (
        e.includes('sad') ||
        e.includes('depress') ||
        e.includes('grief') ||
        e.includes('hopeless') ||
        e.includes('lonely') ||
        e.includes('cry')
    ) {
        return 'sad';
    }

    if (
        e.includes('happy') ||
        e.includes('joy') ||
        e.includes('elat') ||
        e.includes('excit') ||
        e.includes('great') ||
        e.includes('content') ||
        e.includes('gratitude')
    ) {
        return 'happy';
    }

    return 'neutral';
}

// ─── Controller ───────────────────────────────────────────────────
/**
 * GET /api/articles/personalized
 * Returns 5 mood-personalized RSS-based articles.
 */
exports.getPersonalizedArticles = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        const userId = req.user.userId;

        const latestMood = await MoodEntry.findOne({ userId }).sort({ timestamp: -1 });
        const moodUsed = normalizeMood(latestMood?.emotion);

        const { articles, cacheStatus } = await getArticles(moodUsed);

        return res.status(200).json({
            success: true,
            moodUsed,
            cacheStatus,
            articles,
        });

    } catch (error) {
        console.error('[Article Controller Error]:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch articles. Please try again later.',
        });
    }
};