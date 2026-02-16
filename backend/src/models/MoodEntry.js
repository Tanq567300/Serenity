const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    emotion: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    intensity: {
        type: Number,
        min: 1,
        max: 10
    },
    note: {
        type: String, // Encrypted? For now, simple string as per basic req
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
});

const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);

module.exports = MoodEntry;
