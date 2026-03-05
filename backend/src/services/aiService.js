const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const config = require('../config');

// ─── Gemini setup ─────────────────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const MODEL_NAME = 'gemini-2.5-flash-lite';

const SYSTEM_INSTRUCTION = `You are a supportive mental wellness assistant.
You do not provide medical diagnosis.
You provide empathetic listening and CBT-style reflection.
If user expresses self-harm intent, encourage professional help.`;

// ─── Local fallback ───────────────────────────────────────────────────────────

const LOCAL_FALLBACK_RESPONSE =
    "I'm having trouble connecting right now, but I'm here with you. " +
    "You might try taking a slow breath or writing down what's on your mind.";

// ─── OpenRouter helper ────────────────────────────────────────────────────────

/**
 * Calls OpenRouter's chat completions API using the Qwen 2.5 7B model.
 * @param {string} systemPrompt
 * @param {{ role: string, content: string }[]} messages
 * @returns {Promise<string>}
 */
async function _generateWithOpenRouter(systemPrompt, messages) {
    const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
            model: 'qwen/qwen2.5-7b-instruct',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages,
            ],
        },
        {
            headers: {
                'Authorization': `Bearer ${config.openRouterApiKey}`,
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        }
    );
    return response.data.choices[0].message.content;
}

// ─── Chat response cascade ────────────────────────────────────────────────────

/**
 * Generates a chat response using a three-level cascade:
 *   1. Gemini Flash Lite (primary)
 *   2. OpenRouter Qwen 2.5 7B (fallback)
 *   3. Local hardcoded response (final safety net)
 */
async function generateChatResponse({ message, sessionContext = [] }) {
    // Level 1 — Gemini
    try {
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: SYSTEM_INSTRUCTION,
        });

        const history = sessionContext.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.warn('[AI Cascade] Gemini failed:', error.message);
    }

    // Level 2 — OpenRouter Qwen
    try {
        console.warn('[AI Cascade] Falling back to OpenRouter Qwen');

        const messages = [
            ...sessionContext.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content,
            })),
            { role: 'user', content: message },
        ];

        return await _generateWithOpenRouter(SYSTEM_INSTRUCTION, messages);
    } catch (fallbackError) {
        console.error('[AI Cascade] OpenRouter also failed:', fallbackError.message);
    }

    // Level 3 — Breathing redirect (both AI services exhausted)
    console.warn('[AI Cascade] Both AI services failed — redirecting user to breathing exercise');
    return {
        type: 'breathing_redirect',
        exerciseId: 'box444',
        message: "It might help to pause and take a few slow breaths.",
    };
}

// ─── Structured summary cascade ───────────────────────────────────────────────

/**
 * Generates a structured JSON summary using a two-level cascade:
 *   1. Gemini Flash Lite with JSON response mode (primary)
 *   2. OpenRouter Qwen with explicit JSON instruction (fallback)
 *
 * Throws if both fail — the caller must handle this since invalid
 * JSON would corrupt journal/pattern data.
 */
async function generateStructuredSummary(promptText) {
    // Level 1 — Gemini (native JSON mode)
    try {
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            generationConfig: {
                responseMimeType: 'application/json',
            },
        });

        const result = await model.generateContent(promptText);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.warn('[AI Cascade] Gemini summary failed:', error.message);
    }

    // Level 2 — OpenRouter Qwen (JSON via prompt instruction)
    try {
        console.warn('[AI Cascade] Falling back to OpenRouter Qwen for summary');

        const jsonPrompt =
            `${promptText}\n\n` +
            'IMPORTANT: Respond with valid JSON only. No explanation, no markdown fences, just the raw JSON object.';

        const text = await _generateWithOpenRouter(
            'You are a JSON data extraction assistant. Always respond with valid JSON only. No markdown, no explanation.',
            [{ role: 'user', content: jsonPrompt }]
        );

        // Validate before returning — reject silently malformed output
        JSON.parse(text);
        return text;
    } catch (fallbackError) {
        console.error('[AI Cascade] OpenRouter summary also failed:', fallbackError.message);
    }

    throw new Error('Failed to generate structured summary: all cascade levels exhausted');
}

module.exports = {
    generateChatResponse,
    generateStructuredSummary,
    genAI,
};
