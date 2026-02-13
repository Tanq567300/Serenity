const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatSession',
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    encryptedContent: {
        type: String,
        required: true
    },
    inferredEmotion: {
        type: String,
        default: null
    },
    moodScore: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
