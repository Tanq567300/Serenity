const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    sliderScore: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    selectedMoodLabel: {
        type: String,
        required: true
    },
    journalText: {
        type: String, // Encrypted
        required: true
    },
    inferredEmotion: {
        type: String
    },
    inferredMoodScore: {
        type: Number,
        min: 1,
        max: 10
    },
    tags: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add index on userId + date
moodEntrySchema.index({ userId: 1, date: 1 });

const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);

module.exports = MoodEntry;
