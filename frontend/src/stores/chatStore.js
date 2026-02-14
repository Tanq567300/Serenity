import { create } from 'zustand';
import client from '../api/client';

const useChatStore = create((set, get) => ({
    messages: [],
    sessionId: null,
    isLoading: false,
    isTyping: false,
    crisisMode: false,
    error: null,

    setSessionId: (id) => set({ sessionId: id }),
    setLoading: (loading) => set({ isLoading: loading }),
    setTyping: (typing) => set({ isTyping: typing }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

    reset: () => set({ messages: [], sessionId: null, isLoading: false, isTyping: false, crisisMode: false, error: null }),

    startSession: async () => {
        set({ isLoading: true, error: null });
        try {
            // POST /chat/new-session
            const res = await client.post('/chat/new-session');
            set({ sessionId: res.data.sessionId, messages: [] });
            console.log('Session started:', res.data.sessionId);
        } catch (err) {
            console.error('Start session error:', err);
            set({ error: 'Failed to start chat session' });
        } finally {
            set({ isLoading: false });
        }
    },

    sendMessage: async (text) => {
        const { sessionId, addMessage, setTyping } = get();
        if (!sessionId) return;

        // 1. Optimistic User Bubble
        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date().toISOString()
        };
        addMessage(userMsg);
        setTyping(true);

        try {
            // 2. API Call
            const res = await client.post('/chat/message', {
                sessionId,
                message: text
            });

            const data = res.data.data; // { reply, emotion, isCrisis, resources? }

            // 3. Handle Crisis
            if (data.isCrisis) {
                set({ crisisMode: true });
                // Add crisis message from AI
                addMessage({
                    id: Date.now().toString() + '_ai',
                    role: 'model',
                    content: data.reply,
                    isCrisis: true,
                    resources: data.resources,
                    timestamp: new Date().toISOString()
                });
            } else {
                // 4. Normal AI Reply
                addMessage({
                    id: Date.now().toString() + '_ai',
                    role: 'model',
                    content: data.reply,
                    emotion: data.emotion,
                    timestamp: new Date().toISOString()
                });
            }

        } catch (err) {
            console.error('Send message error:', err);
            set({ error: 'Failed to send message' });
            // Optionally add an error system message
        } finally {
            setTyping(false);
        }
    }
}));

export default useChatStore;
