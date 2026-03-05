const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
    },
    profilePic: {
        type: String,
        default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4l4ZP8QfEHYeysThHgKnBfRF9d7tgFOwAYcWqzWU-UVr_jfz00nS6Y0NsMoFp5y5sl5zhWUZcgG3eD1sWU1ysepDNXOF3FNyItBcBK_n4RXhEGHnldYhDFM6b09ffoW_KlqDt4JgXbkBpBSkc9hgu4dZPh2Ez5Xc3fl7t4w3xBnT6oiq5Hrof7JdcoanS3Qyb116pVR4GtUcj1F91muWP6Ypr0AL6_FKitWFfBTWuUiSFItqywaI_K3xxc1dVheQz2p82VFLDrx2n', // Default Mansik Green profile pic
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required'],
        select: false, // Never return passwordHash in queries by default
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
});

// Remove passwordHash from JSON output as an extra safety net
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.passwordHash;
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
