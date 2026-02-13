/**
 * Emotion Inference Service
 * Determines the emotion and mood score of a user's message.
 */

// Basic keyword mapping for Phase 3 (lightweight rule-based)
// In future phases, this can optionally call an AI service for more nuance.
const EMOTION_KEYWORDS = {
    anxiety: ['anxious', 'worried', 'nervous', 'panic', 'scared', 'afraid'],
    sadness: ['sad', 'depressed', 'down', 'unhappy', 'crying', 'lonely', 'hopeless'],
    anger: ['angry', 'mad', 'furious', 'annoyed', 'hate'],
    joy: ['happy', 'excited', 'good', 'great', 'awesome', 'better'],
    neutral: []
};

/**
 * inferEmotion
 * Analyzes the text to determine the dominant emotion and a mood score.
 * @param {string} text 
 * @returns {object} { emotion: string, moodScore: number }
 */
const inferEmotion = async (text) => {
    if (!text) return { emotion: 'neutral', moodScore: 3 };

    const lowerText = text.toLowerCase();

    let detectedEmotion = 'neutral';
    let moodScore = 3; // 1-5 scale, 3 is neutral

    // Check for matches
    for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
        if (keywords.some(k => lowerText.includes(k))) {
            detectedEmotion = emotion;
            break; // Simple first-match priority
        }
    }

    // Map emotion to mood score
    switch (detectedEmotion) {
        case 'joy':
            moodScore = 5;
            break;
        case 'anxiety':
        case 'anger':
            moodScore = 2;
            break;
        case 'sadness':
            moodScore = 1;
            break;
        case 'neutral':
        default:
            moodScore = 3;
    }

    return {
        emotion: detectedEmotion,
        moodScore
    };
};

module.exports = {
    inferEmotion
};
