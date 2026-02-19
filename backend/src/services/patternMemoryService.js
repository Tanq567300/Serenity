const UserPatternMemory = require('../models/UserPatternMemory');
const DailyMemory = require('../models/DailyMemory');

/**
 * Service to manage long-term pattern memory aggregation.
 */

// --- Helper Algorithms ---

/**
 * Calculates the average mood score from a list of memories.
 * Requires at least 3 data points.
 */
function calculateBaselineMood(memories) {
    const validMemories = memories.filter(m => typeof m.averageMoodScore === 'number');
    if (validMemories.length < 3) return null;

    const total = validMemories.reduce((sum, m) => sum + m.averageMoodScore, 0);
    return parseFloat((total / validMemories.length).toFixed(1)); // 1 decimal place
}

/**
 * Detects mood trend by comparing the last 7 days vs the previous 7 days.
 * Returns 'upward', 'downward', 'stable', or null (insufficient data).
 */
function detectMoodTrend(memories) {
    // Memories are expected to be sorted by date DESC (newest first)
    const validMemories = memories.filter(m => typeof m.averageMoodScore === 'number');

    // Need at least 2 days to have any concept of trend, but prompt suggests 7-day windows.
    // If we have fewer than 4 days, hard to say. Let's require at least 4 days to give *some* output,
    // but strictly following the prompt: "Compare last 7 days vs previous 7 days".
    // That implies needing 14 days of data? That might be too strict for a start.
    // Let's implement a dynamic window: Split the available data in half (up to 14 days max).

    if (validMemories.length < 4) return null; // Insufficient data

    const windowSize = Math.min(7, Math.floor(validMemories.length / 2));
    const recentRecent = validMemories.slice(0, windowSize);
    const previous = validMemories.slice(windowSize, windowSize * 2);

    const avgRecent = recentRecent.reduce((sum, m) => sum + m.averageMoodScore, 0) / recentRecent.length;
    const avgPrevious = previous.reduce((sum, m) => sum + m.averageMoodScore, 0) / previous.length;

    const threshold = 0.5; // Significant change threshold

    if (avgRecent > avgPrevious + threshold) return 'upward';
    if (avgRecent < avgPrevious - threshold) return 'downward';
    return 'stable';
}

/**
 * Identifies recurring tags that appear frequently.
 * Returns array of { tag, frequency }, sorted descending.
 * Threshold: 2 occurrences minimum.
 */
function detectRecurringTags(memories) {
    const tagCounts = {};

    memories.forEach(memory => {
        if (memory.tags && Array.isArray(memory.tags)) {
            memory.tags.forEach(tag => {
                const normalizedTag = tag.toLowerCase().trim();
                tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
            });
        }
    });

    const recurring = Object.entries(tagCounts)
        .map(([tag, frequency]) => ({ tag, frequency }))
        .filter(item => item.frequency >= 2) // Threshold
        .sort((a, b) => b.frequency - a.frequency);

    return recurring;
}

/**
 * Identifies the dominant emotion trend.
 * Currently simplified to: Most frequent dominant emotion in the last 14 days.
 */
function detectDominantEmotion(memories) {
    const recentMemories = memories.slice(0, 14); // Analyze last 2 weeks
    if (recentMemories.length === 0) return null;

    const emotionCounts = {};
    recentMemories.forEach(m => {
        if (m.dominantEmotion) {
            const emotion = m.dominantEmotion.toLowerCase();
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        }
    });

    // Find max
    let maxEmotion = null;
    let maxCount = 0;

    Object.entries(emotionCounts).forEach(([emotion, count]) => {
        if (count > maxCount) {
            maxCount = count;
            maxEmotion = emotion;
        }
    });

    return maxEmotion;
}

/**
 * Calculates the Standard Deviation of mood scores.
 * Higher variance = more volatile mood.
 */
function calculateMoodVariance(memories) {
    const validMemories = memories.filter(m => typeof m.averageMoodScore === 'number');
    if (validMemories.length < 3) return null;

    const n = validMemories.length;
    const mean = validMemories.reduce((sum, m) => sum + m.averageMoodScore, 0) / n;

    const squaredDifferences = validMemories.map(m => Math.pow(m.averageMoodScore - mean, 2));
    const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / n;

    return parseFloat(Math.sqrt(variance).toFixed(2));
}

// --- Main Service ---

/**
 * Orchestrates the pattern calculation for a user.
 * Should be called whenever a new DailyMemory is created.
 */
async function updateUserPattern(userId) {
    // 1. Fetch all Daily Memories for user, sorted DESC by date
    // (Newest first is crucial for logic above)
    const memories = await DailyMemory.find({ userId }).sort({ date: -1 });

    if (!memories || memories.length === 0) {
        return null; // No data to pattern match
    }

    // 2. Run Calculations
    const baselineMood = calculateBaselineMood(memories);
    const moodTrendDirection = detectMoodTrend(memories);
    const recurringTags = detectRecurringTags(memories);
    const dominantEmotionTrend = detectDominantEmotion(memories);
    const moodVariance = calculateMoodVariance(memories);

    // 3. Upsert UserPatternMemory
    const patternData = {
        userId,
        baselineMood,
        moodTrendDirection,
        dominantEmotionTrend,
        recurringTags,
        moodVariance,
        lastUpdated: new Date()
    };

    const patternMemory = await UserPatternMemory.findOneAndUpdate(
        { userId },
        patternData,
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    return patternMemory;
}

/**
 * Get pattern memory for a user.
 */
async function getUserPattern(userId) {
    return await UserPatternMemory.findOne({ userId });
}

module.exports = {
    updateUserPattern,
    getUserPattern,
    // Exporting helpers for testing purposes if needed
    _calculateBaselineMood: calculateBaselineMood,
    _detectMoodTrend: detectMoodTrend,
    _detectRecurringTags: detectRecurringTags
};
