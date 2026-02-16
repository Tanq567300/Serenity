const mongoose = require('mongoose');

const dailyMemorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    summary: {
        type: String, // Encrypted content
        required: true
    },
    dominantEmotion: {
        type: String,
        default: 'neutral'
    },
    averageMoodScore: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String
    }],
    keyStressors: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound unique index to ensure one memory per user per day
dailyMemorySchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyMemory = mongoose.model('DailyMemory', dailyMemorySchema);

module.exports = DailyMemory;
