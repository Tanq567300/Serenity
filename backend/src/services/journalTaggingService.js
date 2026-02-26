const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Parses mental wellness journal entry to extract inferred tags and emotions.
 * @param {string} journalText 
 * @param {number} retryCount 
 * @returns {object} { inferredEmotion, inferredMoodScore, tags, keyThemes }
 */
async function analyzeJournalEntry(journalText, retryCount = 0) {
    if (!journalText || journalText.trim().length === 0) {
        return {
            inferredEmotion: "neutral",
            inferredMoodScore: 5,
            tags: [],
            keyThemes: []
        };
    }

    const prompt = `You are an expert analyzing a mental wellness journal entry.
Return ONLY valid JSON.

Schema:
{
  "inferredEmotion": "A single word summarizing the primary emotion",
  "inferredMoodScore": an integer from 1 to 10 where 1 is extremely low and 10 is extremely high,
  "tags": ["array", "of", "relevant", "tags", "like", "work", "stress", "family"],
  "keyThemes": ["array of", "key themes"]
}

Journal:
"""
${journalText}
"""
`;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.1,
                topP: 0.8,
                responseMimeType: "application/json",
            }
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse the JSON. The model is instructed to output valid JSON.
        return JSON.parse(responseText);

    } catch (error) {
        console.error("Error analyzing journal entry with Gemini:", error);
        if (retryCount < 1) {
            console.log("Retrying journal analysis...");
            return analyzeJournalEntry(journalText, retryCount + 1);
        }

        // Fallback after retries
        return {
            inferredEmotion: "neutral",
            inferredMoodScore: 5, // fallback to neutral
            tags: [],
            keyThemes: []
        };
    }
}

module.exports = {
    analyzeJournalEntry
};
