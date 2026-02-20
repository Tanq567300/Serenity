import { create } from 'zustand';
import { startSession, sendMessage } from '../api/chat';

const useChatStore = create((set, get) => ({
    sessionId: null,
    messages: [],
    isTyping: false,
    error: null,
    isCrisis: false,

    // Start a new session or reset
    initializeSession: async () => {
        set({ isTyping: true, error: null });
        try {
            const data = await startSession();
            set({ sessionId: data.sessionId, messages: [] });
            return data.sessionId;
        } catch (error) {
            set({ error: error.message || 'Failed to start session' });
            return null;
        } finally {
            set({ isTyping: false });
        }
    },

    sendMessage: async (messageText) => {
        const { sessionId, messages } = get();
        if (!sessionId) {
            set({ error: 'No active session' });
            return;
        }

        // Optimistic update: Add user message immediately
        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date().toISOString()
        };

        set({
            messages: [...messages, userMsg],
            isTyping: true,
            error: null
        });

        try {
            const data = await sendMessage(sessionId, messageText);
            // data.data { reply, isCrisis, emotion, resources }

            const aiMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.data.reply,
                isCrisis: data.data.isCrisis,
                emotion: data.data.emotion,
                resources: data.data.resources, // If crisis
                timestamp: new Date().toISOString()
            };

            set(state => ({
                messages: [...state.messages, aiMsg],
                isCrisis: data.data.isCrisis,
                isTyping: false
            }));

        } catch (error) {
            set({
                error: error.message || 'Failed to send message',
                isTyping: false,
                // Optionally remove the user message or mark as failed
            });
        }
    },

    // Generic add message (if needed for restoring history)
    setMessages: (history) => {
        set({ messages: history });
    },

    // Clear chat — start a brand new session
    clearChat: async () => {
        set({ messages: [], isCrisis: false, error: null, isTyping: true });
        try {
            const data = await startSession();
            set({ sessionId: data.sessionId, isTyping: false });
        } catch (err) {
            set({ error: err.message || 'Failed to clear chat', isTyping: false });
        }
    },
}));

export default useChatStore;
