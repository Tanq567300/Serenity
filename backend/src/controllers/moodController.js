const MoodEntry = require('../models/MoodEntry');
const { analyzeJournalEntry } = require('../services/journalTaggingService');
const { createDailyMemory } = require('../services/dailyMemoryService');
const { encrypt } = require('../utils/encryption');

/**
 * POST /api/mood/journal
 * Submit a guided mood journal entry
 */
exports.submitJournal = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { sliderScore, selectedMoodLabel, journalText } = req.body;

        if (sliderScore === undefined || !selectedMoodLabel || !journalText) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        if (sliderScore < 1 || sliderScore > 10) {
            return res.status(400).json({ success: false, message: 'sliderScore must be between 1 and 10' });
        }

        // 1. Analyze Journal text with AI
        const analysis = await analyzeJournalEntry(journalText);

        // 2. Encrypt Text
        const encryptedJournal = encrypt(journalText);

        // 3. Store Entry
        const newEntry = new MoodEntry({
            userId,
            sliderScore,
            selectedMoodLabel,
            journalText: encryptedJournal,
            inferredEmotion: analysis.inferredEmotion,
            inferredMoodScore: analysis.inferredMoodScore,
            tags: analysis.tags || [],
        });

        await newEntry.save();

        // 4. Update DailyMemory Pipeline
        // Trigger aggregation so the user's new journal immediately reflects in the dashboard list
        await createDailyMemory(userId, new Date(), true);

        return res.status(201).json({
            success: true,
            message: 'Journal entry saved successfully',
            data: {
                id: newEntry._id,
                inferredEmotion: newEntry.inferredEmotion,
                tags: newEntry.tags
            }
        });

    } catch (error) {
        console.error('[MoodController - submitJournal] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while saving the journal'
        });
    }
};
