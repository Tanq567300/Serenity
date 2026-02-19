const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserPatternMemorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    baselineMood: {
        type: Number,
        default: null // Null if insufficient data
    },
    moodTrendDirection: {
        type: String,
        enum: ['upward', 'downward', 'stable', null],
        default: null
    },
    dominantEmotionTrend: {
        type: String, // e.g., "Anxious"
        default: null
    },
    recurringTags: [{
        tag: { type: String, required: true },
        frequency: { type: Number, default: 1 }
    }],
    moodVariance: {
        type: Number, // Standard deviation
        default: null
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Explicitly create the index (removing unique: true from field definition is safer if keeping this, or vice versa)
// But to fix the warning "Duplicate schema index", we should remove one. 
// The schema definition `unique: true` creates an index. The explicit .index() creates another.
// I will remove the explicit .index call and rely on the Schema definition.

module.exports = mongoose.model('UserPatternMemory', UserPatternMemorySchema);
