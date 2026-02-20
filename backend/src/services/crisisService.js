/**
 * Crisis Detection Service
 * Detects self-harm, suicidal ideation, and severe distress using
 * a broad set of natural-language phrases people actually say.
 */

const CRISIS_PHRASES = [
    // Direct suicidal intent
    'suicide', 'suicidal', 'kill myself', 'killing myself',
    'end my life', 'take my life', 'take my own life',
    'want to die', 'wanna die', 'wish i was dead', 'wish i were dead',
    'better off dead', 'better off without me',

    // "Don't want to live" family — the one that was missed
    "don't want to live", "dont want to live",
    "don't want to be alive", "dont want to be alive",
    "no reason to live", "no point in living", "no point living",
    "nothing to live for", "not worth living",
    "can't go on", "cannot go on", "can't do this anymore",
    "done with life", "tired of living", "tired of life",

    // Self-harm
    'hurt myself', 'hurting myself', 'harm myself',
    'cut myself', 'cutting myself', 'self harm', 'self-harm',
    'overdose', 'pills to end',

    // Farewell / goodbye signals
    'end it all', 'end it', 'disappear forever',
    'everyone would be better without me',
    'no one would miss me', 'nobody would miss me',
    'say goodbye', 'final note', 'last words',

    // Passive ideation
    'wish i could sleep forever', 'not wake up',
    'dont want to wake up', "don't want to wake up",
];

// Build regex — each phrase matched as a substring (case-insensitive)
const CRISIS_REGEX = new RegExp(
    CRISIS_PHRASES.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    'i'
);

const CRISIS_RESPONSE = {
    text: "Hey — I hear you, and I'm really glad you said something. What you're feeling right now is real, and it matters.\n\nPlease reach out to someone who can be with you through this. You don't have to go through this alone 💙",
    resources: [
        { name: "iCall (India)", contact: "9152987821", url: "tel:9152987821" },
        { name: "Vandrevala Foundation 24/7", contact: "1860-2662-345", url: "tel:18602662345" },
        { name: "Crisis Text Line", contact: "Text HOME to 741741", url: "sms:741741" },
        { name: "International Hotlines", contact: "findahelpline.com", url: "https://findahelpline.com" },
    ]
};

function detectCrisis(message) {
    if (!message) return { isCrisis: false, severity: 0 };

    const isCrisis = CRISIS_REGEX.test(message);

    if (isCrisis) {
        return {
            isCrisis: true,
            severity: 10,
            response: CRISIS_RESPONSE
        };
    }

    return { isCrisis: false, severity: 0 };
}

module.exports = { detectCrisis };
