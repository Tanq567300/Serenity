// src/services/aiService.js
class AIService {
  constructor() {
    this.isReady = true;
    // Use relative URL for deployed version, localhost for development
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    this.apiUrl = isProduction ? '/api/chat' : 'http://localhost:3000/api/chat';
    console.log('AI Service initialized with URL:', this.apiUrl);
  }

  async init() {
    return true; // No initialization needed for API approach
  }

  isModelReady() {
    return this.isReady;
  }

  async generateResponse(userMessage, conversationHistory = []) {
    try {
      console.log('Calling API:', this.apiUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory.map(msg => ({
            sender: msg.sender,
            text: msg.text
          }))
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.text) {
        throw new Error('Invalid response format from API');
      }
      
      return data.text;
    } catch (error) {
      console.error('Chat API error:', error);
      
      if (error.name === 'AbortError') {
        return "I'm taking too long to respond. Please try again with a shorter message. 💙";
      }
      
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        return "I'm currently in offline mode. To enable AI chat, please:\n\n1. Install dependencies: `npm install`\n2. Set up your Gemini API key in a .env file\n3. Start the development server: `npm run dev`\n\nFor now, I can help you with mood tracking! 😊";
      }
      
      return "I'm having trouble processing that right now. Please try again in a moment. 💙";
    }
  }
}

export default new AIService();