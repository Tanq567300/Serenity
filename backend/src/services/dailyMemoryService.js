const DailyMemory = require('../models/DailyMemory');
const ChatMessage = require('../models/ChatMessage');
const ChatSession = require('../models/ChatSession'); // Added check
const MoodEntry = require('../models/MoodEntry');
const aiService = require('./aiService');
const { encrypt, decrypt } = require('../utils/encryption');

/**
 * Orchestrate the daily memory creation for a user and date.
 * @param {string} userId 
 * @param {Date} date - The date to summarize
 */
async function createDailyMemory(userId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Check for existing
    const existing = await DailyMemory.findOne({
        userId,
        date: { $gte: startOfDay, $lte: endOfDay }
    });
    if (existing) return existing;

    // 2. Fetch Data
    // Get user sessions first
    const sessions = await ChatSession.find({ user: userId }).select('_id');
    const sessionIds = sessions.map(s => s._id);

    const messages = await ChatMessage.find({
        session: { $in: sessionIds },
        timestamp: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ timestamp: 1 });

    const moodEntries = await MoodEntry.find({
        userId,
        timestamp: { $gte: startOfDay, $lte: endOfDay }
    });

    if (messages.length === 0 && moodEntries.length === 0) {
        return null; // Nothing to summarize
    }

    // Decrypt messages
    const decryptedMessages = messages.map(msg => ({
        role: msg.sender,
        content: decrypt(msg.encryptedContent),
        timestamp: msg.timestamp
    }));

    // 3. Aggregate Prompt
    const aggregationPrompt = `
You are generating a structured daily emotional summary.
Analyze the following user interactions for ${startOfDay.toDateString()}.

Interactions:
${decryptedMessages.map(m => `[${m.timestamp.toTimeString().split(' ')[0]}] ${m.role}: ${m.content}`).join('\n')}

Mood Logs:
${moodEntries.map(m => `[${m.timestamp.toTimeString().split(' ')[0]}] Emotion: ${m.emotion}, Score: ${m.score}, Note: ${m.note || ''}`).join('\n')}

Return ONLY valid JSON with this structure:
{
  "summary": "A concise 3-4 sentence summary.",
  "dominantEmotion": "Single word emotion",
  "averageMoodScore": number,
  "tags": ["tag1", "tag2"],
  "keyStressors": ["stressor1"]
}
`;

    // 4. Gemini Call
    let aiResult;
    try {
        const jsonStr = await aiService.generateStructuredSummary(aggregationPrompt);
        aiResult = JSON.parse(jsonStr);
    } catch (error) {
        console.error('AI Summary Failed:', error);
        aiResult = {
            summary: "Error generating summary.",
            dominantEmotion: "neutral",
            averageMoodScore: 0,
            tags: [],
            keyStressors: []
        };
    }

    // 5. Encrypt & Save
    const dailyMemory = new DailyMemory({
        userId,
        date: startOfDay,
        summary: encrypt(aiResult.summary),
        dominantEmotion: aiResult.dominantEmotion,
        averageMoodScore: aiResult.averageMoodScore,
        tags: aiResult.tags,
        keyStressors: aiResult.keyStressors
    });

    await dailyMemory.save();
    return dailyMemory;
}

module.exports = {
    createDailyMemory
};
