import OpenAI from 'openai';

/**
 * OpenAI Service for TeleKiosk AI Chatbot
 * Following Phase 2 implementation plan for core AI integration
 */

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || import.meta.env?.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: typeof window !== 'undefined' // Only allow browser usage when actually in browser
});

/**
 * Healthcare-specific system prompt for TeleKiosk Hospital
 */
export const HEALTHCARE_SYSTEM_PROMPT = `
You are TeleKiosk Assistant, a helpful AI assistant for TeleKiosk Hospital in Ghana.

PRIMARY FUNCTIONS:
1. Help patients book appointments with appropriate doctors
2. Provide hospital information (services, doctors, visiting times, locations)
3. Detect medical emergencies and provide immediate guidance
4. Answer general health questions (non-diagnostic only)
5. Assist with hospital navigation and policies
6. Support in English, Twi, and other local languages

CRITICAL GUIDELINES:
- NEVER provide medical diagnoses or treatment advice
- Always maintain patient privacy and confidentiality
- For medical emergencies, immediately direct to emergency services
- Be culturally sensitive to Ghanaian healthcare context
- Always be empathetic, professional, and respectful
- If unsure about medical information, refer to hospital staff

EMERGENCY DETECTION:
If you detect urgent symptoms like:
- Chest pain, heart attack symptoms
- Severe bleeding, unconsciousness
- Difficulty breathing, choking
- Severe allergic reactions
- Signs of stroke

Immediately respond with:
"=� This sounds like a medical emergency. Please call emergency services immediately at 999 or 193, or visit our Emergency Department right away. Do not delay seeking immediate medical attention."

HOSPITAL INFORMATION:
- Location: TeleKiosk Hospital, Ghana
- Emergency: 24/7 available (+233-599-211-311)
- Visiting Hours: 8:00 AM - 8:00 PM daily
- Services: Cardiology, Orthopedics, Pediatrics, General Medicine, Emergency Care
- Languages: English, Twi, Ga, Ewe supported

Remember: You are here to assist and guide, not to replace medical professionals.
`;

/**
 * Conversation starters for the chatbot
 */
export const CONVERSATION_STARTERS = [
  "Hello! How can I help you today?",
  "I can help you book appointments, find hospital information, or answer general questions.",
  "For medical emergencies, please call +233-599-211-311 immediately."
];

/**
 * Emergency keywords for detection
 */
export const EMERGENCY_KEYWORDS = {
  high: [
    'chest pain', 'heart attack', 'unconscious', 'not breathing', 'severe bleeding',
    'stroke', 'choking', 'severe allergic reaction', 'anaphylaxis', 'cardiac arrest'
  ],
  medium: [
    'dizzy', 'shortness of breath', 'severe pain', 'allergic reaction', 'difficulty breathing',
    'severe headache', 'vomiting blood', 'severe abdominal pain'
  ],
  low: [
    'headache', 'nausea', 'fever', 'minor injury', 'cold symptoms', 'fatigue'
  ]
};

/**
 * Detect emergency level from user message
 */
export const detectEmergency = (message) => {
  const lowerMessage = message.toLowerCase();
  
  for (const [level, keywords] of Object.entries(EMERGENCY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        return { 
          detected: true, 
          level, 
          keyword,
          confidence: level === 'high' ? 0.95 : level === 'medium' ? 0.75 : 0.5
        };
      }
    }
  }
  
  return { detected: false };
};

/**
 * Main chat completion function
 */
export const chatCompletion = async (messages, options = {}) => {
  try {
    const {
      model = 'gpt-4o',
      temperature = 0.3,
      maxTokens = 2000,
      language = 'en'
    } = options;

    // Add system prompt if not present
    const messagesWithSystem = messages[0]?.role === 'system' 
      ? messages 
      : [{ role: 'system', content: HEALTHCARE_SYSTEM_PROMPT }, ...messages];

    console.log('> OpenAI API Request:', {
      model,
      messageCount: messagesWithSystem.length,
      language
    });

    const response = await openai.chat.completions.create({
      model,
      messages: messagesWithSystem,
      temperature,
      max_tokens: maxTokens,
      functions: [
        {
          name: 'book_appointment',
          description: 'Book a medical appointment for the patient',
          parameters: {
            type: 'object',
            properties: {
              service: { 
                type: 'string', 
                description: 'Medical service/department (e.g., Cardiology, Orthopedics)'
              },
              preferredDate: { 
                type: 'string', 
                description: 'Preferred appointment date'
              },
              preferredTime: { 
                type: 'string', 
                description: 'Preferred appointment time'
              },
              patientName: { 
                type: 'string', 
                description: 'Patient full name'
              },
              patientPhone: { 
                type: 'string', 
                description: 'Patient contact phone number'
              },
              patientEmail: { 
                type: 'string', 
                description: 'Patient email address'
              },
              urgency: { 
                type: 'string', 
                enum: ['routine', 'urgent', 'emergency'],
                description: 'Appointment urgency level'
              }
            },
            required: ['service', 'patientName', 'patientPhone']
          }
        },
        {
          name: 'detect_emergency',
          description: 'Flag potential medical emergency situations',
          parameters: {
            type: 'object',
            properties: {
              symptoms: { 
                type: 'string', 
                description: 'Described symptoms'
              },
              severity: { 
                type: 'string', 
                enum: ['high', 'medium', 'low'],
                description: 'Emergency severity level'
              },
              recommendation: { 
                type: 'string', 
                description: 'Recommended immediate action'
              }
            },
            required: ['symptoms', 'severity']
          }
        }
      ],
      function_call: 'auto'
    });

    console.log(' OpenAI API Response:', {
      choices: response.choices?.length,
      usage: response.usage
    });

    return response;

  } catch (error) {
    console.error('L OpenAI API Error:', error);
    
    // Handle specific error types
    if (error.code === 'rate_limit_exceeded') {
      throw new Error('RATE_LIMIT');
    } else if (error.code === 'api_key_invalid') {
      throw new Error('API_KEY_INVALID');
    } else if (error.code === 'insufficient_quota') {
      throw new Error('QUOTA_EXCEEDED');
    } else {
      throw new Error('API_UNAVAILABLE');
    }
  }
};

/**
 * Simple chat function for basic interactions
 */
export const simpleChat = async (userMessage, conversationHistory = []) => {
  try {
    const messages = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await chatCompletion(messages);
    const assistantMessage = response.choices[0]?.message;

    if (assistantMessage?.function_call) {
      // Handle function calls (appointment booking, emergency detection)
      return {
        type: 'function_call',
        function: assistantMessage.function_call,
        message: assistantMessage.content || 'Processing your request...'
      };
    }

    return {
      type: 'message',
      content: assistantMessage?.content || 'Sorry, I encountered an issue. Please try again.'
    };

  } catch (error) {
    console.error('Simple chat error:', error);
    
    return {
      type: 'error',
      content: getErrorMessage(error.message)
    };
  }
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (errorType) => {
  switch (errorType) {
    case 'RATE_LIMIT':
      return "I'm receiving too many requests right now. Please try again in a few minutes.";
    case 'API_KEY_INVALID':
      return "There's a configuration issue with the AI service. Please contact hospital IT support.";
    case 'QUOTA_EXCEEDED':
      return "The AI service has reached its limit for today. Please try again tomorrow or speak with hospital staff.";
    case 'API_UNAVAILABLE':
      return "I'm having trouble connecting to my AI services. Please try again later.";
    default:
      return "I apologize, but I'm having technical difficulties. Please speak with a hospital staff member for assistance.";
  }
};

/**
 * Test OpenAI connection
 */
export const testConnection = async () => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 10
    });
    
    return { 
      success: true, 
      message: 'OpenAI connection successful',
      model: response.model
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.message 
    };
  }
};

// Export alias for server compatibility - returns server-expected format
export const generateChatCompletion = async (messages, options = {}) => {
  try {
    const response = await chatCompletion(messages, options);
    
    // Return server-expected format
    return {
      success: true,
      message: response.choices[0]?.message?.content || 'Sorry, I could not process your request.',
      content: response.choices[0]?.message?.content || 'Sorry, I could not process your request.',
      usage: response.usage,
      model: response.model,
      responseTime: Date.now() // Add timestamp
    };
  } catch (error) {
    console.error('generateChatCompletion error:', error);
    return {
      success: false,
      error: getErrorMessage(error.message),
      message: getErrorMessage(error.message)
    };
  }
};

export default {
  chatCompletion,
  generateChatCompletion,
  simpleChat,
  detectEmergency,
  testConnection,
  HEALTHCARE_SYSTEM_PROMPT,
  CONVERSATION_STARTERS,
  EMERGENCY_KEYWORDS
};