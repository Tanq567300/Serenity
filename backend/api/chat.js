import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    return res.status(500).json({ 
      text: "I'm currently undergoing maintenance. Please check back soon. 💙",
      error: "API key not configured"
    });
  }

  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    const systemPrompt = `You are "Hope", a mental health first aid assistant for teenagers and young adults.

CORE PRINCIPLES:
- Validate feelings first ("It makes sense you feel that way")
- Offer practical coping strategies (breathing, grounding)
- Suggest trusted resources (Crisis Text Line, school counselors)
- Maintain appropriate boundaries
- Use age-appropriate language

RESPONSE GUIDELINES:
- Keep responses conversational and empathetic (2-3 sentences)
- Be warm but professional
- Suggest professional help for serious concerns
- Focus on empowerment and next steps
- Use emojis sparingly (💙✨)

You are NOT a licensed therapist. Always encourage professional help for serious issues.`;

   
    const formattedHistory = conversationHistory
      .map((msg) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}

${formattedHistory ? `Conversation History:\n${formattedHistory}\n\n` : ''}
User: ${message}
Assistant:`;

    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    
    return res.status(200).json({ text: response.text().trim() });

  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({ 
      text: "I'm having trouble connecting right now. Please try again in a moment. 💙",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
