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

async function _generateWithOpenRouter(systemPrompt, messages, modelId) {

    const allMessages = [
        { role: 'user', content: `[Instructions]\n${systemPrompt}` },
        { role: 'assistant', content: 'Understood. I will follow those instructions.' },
        ...messages,
    ];

    const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
            model: modelId,
            messages: allMessages,
            temperature: 0.7,
            max_tokens: 300,
        },
        {
            headers: {
                Authorization: `Bearer ${config.openRouterApiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:8081',
                'X-Title': 'Mansik',
            },
            timeout: 30000,
        }
    );

    return response.data.choices[0].message.content;
}


// ─── Chat response cascade ────────────────────────────────────────────────────

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


    // Level 2 — OpenRouter free models

    const FREE_MODELS = [

        {
            id: "meta-llama/llama-3.2-3b-instruct:free",
            label: "Llama 3.2 3B"
        },

        {
            id: "google/gemma-3-4b-it:free",
            label: "Gemma 3 4B"
        },

        {
            id: "deepseek/deepseek-chat:free",
            label: "DeepSeek Chat"
        }

    ];

    const openRouterMessages = [

        ...sessionContext.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content,
        })),

        { role: 'user', content: message },

    ];


    for (const model of FREE_MODELS) {

        try {

            console.warn(`[AI Cascade] Trying OpenRouter ${model.label}...`);

            return await _generateWithOpenRouter(
                SYSTEM_INSTRUCTION,
                openRouterMessages,
                model.id
            );

        } catch (err) {

            console.warn(
                `[AI Cascade] ${model.label} failed:`,
                err.response?.data || err.message
            );

        }

    }


    // Level 3 — Breathing redirect

    console.warn(
        '[AI Cascade] Both AI services failed — redirecting user to breathing exercise'
    );

    return {
        type: 'breathing_redirect',
        exerciseId: 'box444',
        message: "It might help to pause and take a few slow breaths.",
    };

}


// ─── Structured summary cascade ───────────────────────────────────────────────

async function generateStructuredSummary(promptText) {

    // Level 1 — Gemini JSON mode

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


    // Level 2 — OpenRouter fallback

    try {

        console.warn('[AI Cascade] Falling back to OpenRouter Llama for summary');

        const jsonPrompt =
            `${promptText}\n\n` +
            'IMPORTANT: Respond with valid JSON only. No explanation, no markdown fences, just the raw JSON object.';

        const text = await _generateWithOpenRouter(
            'You are a JSON data extraction assistant. Always respond with valid JSON only.',
            [{ role: 'user', content: jsonPrompt }],
            'meta-llama/llama-3.2-3b-instruct:free'
        );

        JSON.parse(text);

        return text;

    } catch (fallbackError) {

        console.error(
            '[AI Cascade] OpenRouter summary also failed:',
            fallbackError.message
        );

    }

    throw new Error(
        'Failed to generate structured summary: all cascade levels exhausted'
    );

}

module.exports = {
    generateChatResponse,
    generateStructuredSummary,
    genAI,
};