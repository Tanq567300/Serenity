/**
 * Crisis Detection Service
 * Detects keywords and phrases indicating potential self-harm or crisis situations.
 */

const CRISIS_KEYWORDS = [
    'kill myself',
    'suicide',
    'end my life',
    'self harm',
    'hurt myself',
    'want to die',
    'better off dead'
];

/**
 * detectCrisis
 * Analyzes the user's message for crisis keywords.
 * @param {string} message - The user's input text
 * @returns {object} - { isCrisis: boolean, severity: number, detectionMethod: string }
 */
const detectCrisis = (message) => {
    if (!message || typeof message !== 'string') {
        return { isCrisis: false, severity: 0 };
    }

    const normalizedMessage = message.toLowerCase();

    // Check for direct keyword matches
    // We can expand this to Regex for more robust matching if needed
    const foundKeyword = CRISIS_KEYWORDS.find(keyword => normalizedMessage.includes(keyword));

    if (foundKeyword) {
        return {
            isCrisis: true,
            severity: 100,
            detectionMethod: 'keyword_match',
            trigger: foundKeyword
        };
    }

    return {
        isCrisis: false,
        severity: 0
    };
};

/**
 * getCrisisResponse
 * Returns a supportive, non-clinical response when crisis is detected.
 * @returns {string}
 */
const getCrisisResponse = () => {
    return "I'm hearing that you're in a lot of pain right now. I'm an AI, so I can't provide the help you need, but you're not alone. Please reach out to a crisis counselor who can support you. You can call or text 988 in the US and Canada, or visit 988lifeline.org. Would you like me to help you find resources in your area?";
};

module.exports = {
    detectCrisis,
    getCrisisResponse
};
