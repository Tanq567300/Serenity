const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatSession',
        required: true,
        index: true
    },
    sender: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
    },
    encryptedContent: {
        type: String,
        required: true
    },
    inferredEmotion: {
        type: String, // e.g., 'neutral', 'anxious', 'sad', 'happy'
        default: 'neutral'
    },
    moodScore: {
        type: Number, // 1-10 or 1-5 scale
        default: null
    },
    isCrisis: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
