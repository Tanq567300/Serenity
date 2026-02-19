const patternMemoryService = require('../services/patternMemoryService');

/**
 * Get the current pattern memory for the authenticated user.
 */
async function getUserPattern(req, res) {
    try {
        const userId = req.user.userId;
        const pattern = await patternMemoryService.getUserPattern(userId);

        if (!pattern) {
            return res.status(404).json({ message: 'No pattern memory found for this user.' });
        }

        res.json(pattern);
    } catch (error) {
        console.error('Error fetching user pattern:', error);
        res.status(500).json({ message: 'Server error fetching pattern memory.' });
    }
}

/**
 * Manually trigger a recalculation of the user's pattern memory.
 */
async function recalculatePattern(req, res) {
    try {
        const userId = req.user.userId;
        const pattern = await patternMemoryService.updateUserPattern(userId);

        if (!pattern) {
            return res.status(400).json({ message: 'Insufficient data to generate pattern.' });
        }

        res.json({ message: 'Pattern updated successfully.', pattern });
    } catch (error) {
        console.error('Error recalculating user pattern:', error);
        res.status(500).json({ message: 'Server error updating pattern memory.' });
    }
}

module.exports = {
    getUserPattern,
    recalculatePattern
};
