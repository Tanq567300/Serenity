const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: true, updatedAt: false } // Only createdAt, lastActive handles updates
});

// Update lastActive on save
chatSessionSchema.pre('save', function (next) {
    if (this.isModified('lastActive')) {
        // nothing special needed, just letting it save
    }
    next();
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

module.exports = ChatSession;
