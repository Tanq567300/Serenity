const { genAI } = require('./aiService');

const MODEL_NAME = 'gemini-2.5-flash-lite';
// Using the same model for efficiency, or could use a smaller one if available.

const INFERENCE_PROMPT = `Classify the emotional tone of the following text.
Return JSON only:
{
  "emotion": "one_word_emotion",
  "moodScore": 1-5 (1=negative, 5=positive)
}`;

async function inferEmotion(text) {
    if (!text) return { emotion: 'neutral', moodScore: 3 };

    try {
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            generationConfig: { responseMimeType: "application/json" } // Force JSON output if supported
        });

        const result = await model.generateContent([
            INFERENCE_PROMPT,
            `Text: "${text}"`
        ]);

        const response = await result.response;
        const jsonText = response.text();

        // Parse JSON safely
        const data = JSON.parse(jsonText);

        return {
            emotion: data.emotion || 'neutral',
            moodScore: data.moodScore || 3
        };

    } catch (error) {
        console.error('Emotion Inference Error:', error);
        // Fallback
        return { emotion: 'neutral', moodScore: 3 };
    }
}

module.exports = { inferEmotion };
