const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    summary: {
        type: String, // Optional summary of the session
        default: ''
    }
}, {
    timestamps: true
});

// Index for finding active sessions for a user
chatSessionSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
