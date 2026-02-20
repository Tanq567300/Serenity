const DailyMemory = require('../models/DailyMemory');
const { decrypt, encrypt } = require('../utils/encryption');
const { generateStructuredSummary } = require('../services/aiService');

/**
 * Create/update a journal entry for today (or a given date) by analysing user-written text with Gemini.
 * POST /api/memory/journal
 * Body: { text: string, moodScore: number (1-10), date?: ISO string }
 */
exports.createJournalEntry = async (req, res) => {
    try {
        const { text, moodScore, date } = req.body;

        if (!text || text.trim().length < 5) {
            return res.status(400).json({ success: false, message: 'Journal text is too short.' });
        }

        const score = Math.min(10, Math.max(1, Number(moodScore) || 5));
        const entryDate = date ? new Date(date) : new Date();

        const startOfDay = new Date(entryDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(entryDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Call Gemini to analyse the journal text
        const analysisPrompt = `Analyse this personal journal entry and return a JSON object with these fields:
- "dominantEmotion": one word (e.g. happy, anxious, calm, sad, grateful, frustrated, excited, tired)
- "tags": array of 2-5 short topic strings (e.g. ["work", "sleep", "family"])
- "keyStressors": array of 0-3 strings if any stress is expressed, else empty array
- "summary": 1-2 sentence objective summary of the entry in third-person (e.g. "The writer reflected on...")

Journal entry:
"""
${text}
"""

Respond ONLY with valid JSON, no markdown, no explanation.`;

        let analysisResult = {
            dominantEmotion: 'neutral',
            tags: [],
            keyStressors: [],
            summary: text.substring(0, 200)
        };

        try {
            const rawJson = await generateStructuredSummary(analysisPrompt);
            const parsed = JSON.parse(rawJson);
            analysisResult = {
                dominantEmotion: parsed.dominantEmotion || 'neutral',
                tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
                keyStressors: Array.isArray(parsed.keyStressors) ? parsed.keyStressors.slice(0, 3) : [],
                summary: parsed.summary || text.substring(0, 200)
            };
        } catch (aiErr) {
            console.error('Gemini analysis failed, using fallback:', aiErr.message);
        }

        // Upsert: one entry per day
        const existing = await DailyMemory.findOne({
            userId: req.user.userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        let saved;
        if (existing) {
            existing.summary = encrypt(analysisResult.summary);
            existing.dominantEmotion = analysisResult.dominantEmotion;
            existing.averageMoodScore = score;
            existing.tags = analysisResult.tags;
            existing.keyStressors = analysisResult.keyStressors;
            saved = await existing.save();
        } else {
            saved = await DailyMemory.create({
                userId: req.user.userId,
                date: entryDate,
                summary: encrypt(analysisResult.summary),
                dominantEmotion: analysisResult.dominantEmotion,
                averageMoodScore: score,
                tags: analysisResult.tags,
                keyStressors: analysisResult.keyStressors
            });
        }

        res.status(201).json({
            success: true,
            data: {
                ...saved.toObject(),
                summary: analysisResult.summary, // decrypted for response
                tags: analysisResult.tags,
                dominantEmotion: analysisResult.dominantEmotion
            }
        });
    } catch (error) {
        console.error('Create Journal Entry Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const memories = await DailyMemory.find({ userId: req.user.userId })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await DailyMemory.countDocuments({ userId: req.user.userId });

        const decryptedMemories = memories.map(mem => ({
            ...mem.toObject(),
            summary: decrypt(mem.summary)
        }));

        res.json({
            success: true,
            data: decryptedMemories,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get Memories Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
