/**
 * Crisis Detection Service
 * Detects self-harm, suicide, or severe distress keywords.
 */

const CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'want to die', 'end it all',
    'hurt myself', 'cutting myself', 'better off dead',
    'no reason to live', 'take my own life', 'overdose'
];

const CRISIS_REGEX = new RegExp(CRISIS_KEYWORDS.join('|'), 'i');

const CRISIS_RESOURCES = {
    text: "I'm detecting that you might be going through a crisis. I'm an AI and cannot provide the human support you need right now. Please reach out to these resources immediately:",
    resources: [
        { name: "National Suicide Prevention Lifeline", contact: "988" },
        { name: "Crisis Text Line", contact: "Text HOME to 741741" },
        { name: "Emergency Services", contact: "911" }
    ]
};

function detectCrisis(message) {
    if (!message) return { isCrisis: false, severity: 0 };

    const lowerMsg = message.toLowerCase();
    const isCrisis = CRISIS_REGEX.test(lowerMsg);

    if (isCrisis) {
        return {
            isCrisis: true,
            severity: 10, // High severity
            response: CRISIS_RESOURCES
        };
    }

    return {
        isCrisis: false,
        severity: 0
    };
}

module.exports = {
    detectCrisis
};
