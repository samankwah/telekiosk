// Enhanced Chatbot Service with Multi-language and Website Content Integration
import { 
  INTENTS, 
  INTENT_PATTERNS, 
  RESPONSES, 
  BOOKING_FLOW_STEPS,
  AVAILABLE_TIMES 
} from '../components/chatbot/ChatKnowledgeBase.js';
import { SERVICES } from '../constants/hospitalData.js';
import { chatbotAPI } from './chatbotAPI.js';
import { websiteScraperService } from './websiteScraperService.js';
import { multiLanguageVoiceService, SUPPORTED_LANGUAGES } from './multiLanguageVoiceService.js';

// Multi-language responses
const MULTI_LANGUAGE_RESPONSES = {
  'en-US': {
    greeting: "Hello! Welcome to TeleKiosk Hospital. I'm your AI assistant and I can help you in multiple languages. How can I assist you today?",
    booking: "I'd be happy to help you book an appointment! Let me guide you through the process.",
    services: "We offer comprehensive medical services. Let me find information about our services for you.",
    info_found: "I found some information that might help you:",
    no_info: "I couldn't find specific information about that, but I can help you with our general services.",
    language_switched: "I've switched to English. How can I help you?",
    auto_response: "I understand you want to know about {topic}. Let me help you with that."
  },
  'es-ES': {
    greeting: "¡Hola! Bienvenido al Hospital TeleKiosk. Soy su asistente de IA y puedo ayudarlo en varios idiomas. ¿Cómo puedo asistirle hoy?",
    booking: "¡Me encantaría ayudarlo a reservar una cita! Permíteme guiarte a través del proceso.",
    services: "Ofrecemos servicios médicos integrales. Déjame encontrar información sobre nuestros servicios para ti.",
    info_found: "Encontré información que podría ayudarte:",
    no_info: "No pude encontrar información específica sobre eso, pero puedo ayudarte con nuestros servicios generales.",
    language_switched: "He cambiado al español. ¿Cómo puedo ayudarte?",
    auto_response: "Entiendo que quieres saber sobre {topic}. Déjame ayudarte con eso."
  },
  'fr-FR': {
    greeting: "Bonjour! Bienvenue à l'Hôpital TeleKiosk. Je suis votre assistant IA et je peux vous aider dans plusieurs langues. Comment puis-je vous aider aujourd'hui?",
    booking: "Je serais ravi de vous aider à prendre un rendez-vous! Laissez-moi vous guider à travers le processus.",
    services: "Nous offrons des services médicaux complets. Laissez-moi trouver des informations sur nos services pour vous.",
    info_found: "J'ai trouvé des informations qui pourraient vous aider:",
    no_info: "Je n'ai pas pu trouver d'informations spécifiques à ce sujet, mais je peux vous aider avec nos services généraux.",
    language_switched: "Je suis passé au français. Comment puis-je vous aider?",
    auto_response: "Je comprends que vous voulez savoir sur {topic}. Laissez-moi vous aider avec cela."
  },
  'de-DE': {
    greeting: "Hallo! Willkommen im TeleKiosk Krankenhaus. Ich bin Ihr KI-Assistent und kann Ihnen in mehreren Sprachen helfen. Wie kann ich Ihnen heute helfen?",
    booking: "Ich helfe Ihnen gerne bei der Terminbuchung! Lassen Sie mich Sie durch den Prozess führen.",
    services: "Wir bieten umfassende medizinische Dienstleistungen an. Lassen Sie mich Informationen über unsere Dienste für Sie finden.",
    info_found: "Ich habe Informationen gefunden, die Ihnen helfen könnten:",
    no_info: "Ich konnte keine spezifischen Informationen dazu finden, aber ich kann Ihnen mit unseren allgemeinen Diensten helfen.",
    language_switched: "Ich bin zu Deutsch gewechselt. Wie kann ich Ihnen helfen?",
    auto_response: "Ich verstehe, dass Sie über {topic} wissen möchten. Lassen Sie mich Ihnen dabei helfen."
  },
  'zh-CN': {
    greeting: "您好！欢迎来到TeleKiosk医院。我是您的AI助手，可以用多种语言为您提供帮助。今天我可以为您做些什么？",
    booking: "我很乐意帮助您预约！让我指导您完成整个过程。",
    services: "我们提供全面的医疗服务。让我为您找到有关我们服务的信息。",
    info_found: "我找到了一些可能对您有帮助的信息：",
    no_info: "我找不到关于此的具体信息，但我可以帮助您了解我们的一般服务。",
    language_switched: "我已切换到中文。我可以如何帮助您？",
    auto_response: "我理解您想了解{topic}。让我帮助您。"
  },
  'ar-SA': {
    greeting: "مرحباً! أهلاً بكم في مستشفى TeleKiosk. أنا مساعدكم الذكي ويمكنني مساعدتكم بعدة لغات. كيف يمكنني مساعدتكم اليوم؟",
    booking: "سأكون سعيداً لمساعدتكم في حجز موعد! دعوني أرشدكم خلال العملية.",
    services: "نحن نقدم خدمات طبية شاملة. دعوني أجد معلومات حول خدماتنا لكم.",
    info_found: "وجدت بعض المعلومات التي قد تساعدكم:",
    no_info: "لم أستطع العثور على معلومات محددة حول ذلك، ولكن يمكنني مساعدتكم بخدماتنا العامة.",
    language_switched: "لقد تبديلت إلى العربية. كيف يمكنني مساعدتكم؟",
    auto_response: "أفهم أنكم تريدون معرفة المزيد عن {topic}. دعوني أساعدكم في ذلك."
  },
  'hi-IN': {
    greeting: "नमस्ते! TeleKiosk अस्पताल में आपका स्वागत है। मैं आपका AI सहायक हूं और मैं कई भाषाओं में आपकी सहायता कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
    booking: "मुझे आपकी अपॉइंटमेंट बुक करने में मदद करने में खुशी होगी! मैं आपको पूरी प्रक्रिया के माध्यम से मार्गदर्शन करूंगा।",
    services: "हम व्यापक चिकित्सा सेवाएं प्रदान करते हैं। मैं आपके लिए हमारी सेवाओं के बारे में जानकारी खोजता हूं।",
    info_found: "मुझे कुछ जानकारी मिली है जो आपकी मदद कर सकती है:",
    no_info: "मुझे इसके बारे में विशिष्ट जानकारी नहीं मिली, लेकिन मैं आपकी हमारी सामान्य सेवाओं के साथ मदद कर सकता हूं।",
    language_switched: "मैंने हिंदी में स्विच कर दिया है। मैं आपकी कैसे मदद कर सकता हूं?",
    auto_response: "मैं समझता हूं कि आप {topic} के बारे में जानना चाहते हैं। मैं आपकी इसमें मदद करता हूं।"
  }
};

class EnhancedChatbotService {
  constructor() {
    this.conversationHistory = [];
    this.currentBookingFlow = null;
    this.userContext = {};
    this.currentLanguage = 'en-US';
    this.autoResponseEnabled = true;
    this.contextMemory = new Map();
    this.lastQuery = null;
    this.conversationState = 'idle';
    this.userPreferences = {
      language: 'en-US',
      autoLanguageDetection: true,
      autoResponse: true,
      continuousListening: false
    };
  }

  // Enhanced message processing with multi-language and content search
  async processMessage(message, context = {}) {
    try {
      // Detect language if auto-detection is enabled
      if (this.userPreferences.autoLanguageDetection) {
        const detectedLang = multiLanguageVoiceService.detectLanguage(message);
        if (detectedLang !== this.currentLanguage) {
          await this.switchLanguage(detectedLang);
        }
      }

      // Store context and update conversation state
      this.updateConversationContext(message, context);

      // Search website content for relevant information
      const searchResults = await this.searchWebsiteContent(message);

      // Classify intent
      const intent = this.classifyIntent(message);

      // Generate response with enhanced context
      const response = await this.generateEnhancedResponse(intent, message, context, searchResults);

      // Add to conversation history
      this.addToConversationHistory(message, intent, response, searchResults);

      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      return this.getErrorResponse(error);
    }
  }

  // Enhanced content search using website scraper
  async searchWebsiteContent(query) {
    try {
      const results = websiteScraperService.searchContent(query, {
        limit: 5,
        fuzzyMatch: true,
        minScore: 0.2
      });

      return results.map(result => ({
        title: result.title,
        content: result.content,
        type: result.type,
        relevanceScore: result.relevanceScore,
        source: result.id
      }));
    } catch (error) {
      console.error('Error searching website content:', error);
      return [];
    }
  }

  // Enhanced response generation with content integration
  async generateEnhancedResponse(intent, message, context, searchResults) {
    const baseResponse = this.generateResponse(intent, message, context);
    
    // Enhance response with search results if available
    if (searchResults && searchResults.length > 0) {
      return this.enhanceResponseWithContent(baseResponse, searchResults, intent);
    }

    // Translate response to current language
    const translatedResponse = this.translateResponse(baseResponse, this.currentLanguage);
    
    return translatedResponse;
  }

  // Enhance response with relevant content
  enhanceResponseWithContent(baseResponse, searchResults, intent) {
    const lang = this.currentLanguage;
    const responses = MULTI_LANGUAGE_RESPONSES[lang] || MULTI_LANGUAGE_RESPONSES['en-US'];
    
    // Create enhanced response with found content
    const enhancedResponse = {
      ...baseResponse,
      message: baseResponse.message,
      type: 'enhanced_content',
      searchResults: searchResults,
      additionalInfo: searchResults.slice(0, 3).map(result => ({
        title: result.title,
        content: this.summarizeContent(result.content),
        source: result.source,
        relevance: Math.round(result.relevanceScore * 100)
      }))
    };

    // Add contextual introduction
    if (searchResults.length > 0) {
      enhancedResponse.message = responses.info_found + "\n\n" + enhancedResponse.message;
    }

    return enhancedResponse;
  }

  // Summarize content for better presentation
  summarizeContent(content) {
    if (!content) return '';
    
    // Simple summarization - take first 150 characters and ensure word boundary
    if (content.length <= 150) return content;
    
    const truncated = content.substring(0, 150);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 100 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  }

  // Translate response to target language
  translateResponse(response, targetLanguage) {
    const responses = MULTI_LANGUAGE_RESPONSES[targetLanguage] || MULTI_LANGUAGE_RESPONSES['en-US'];
    
    // If response has a translation key, use it
    if (response.translationKey && responses[response.translationKey]) {
      return {
        ...response,
        message: responses[response.translationKey]
      };
    }

    // For basic responses, try to map to translated versions
    if (response.intent && responses[response.intent]) {
      return {
        ...response,
        message: responses[response.intent]
      };
    }

    return response;
  }

  // Switch language and notify user
  async switchLanguage(languageCode) {
    if (!SUPPORTED_LANGUAGES[languageCode]) {
      return false;
    }

    const previousLanguage = this.currentLanguage;
    this.currentLanguage = languageCode;
    this.userPreferences.language = languageCode;

    // Update voice service language
    multiLanguageVoiceService.switchLanguage(languageCode);

    // Add language switch notification to conversation
    const responses = MULTI_LANGUAGE_RESPONSES[languageCode] || MULTI_LANGUAGE_RESPONSES['en-US'];
    
    this.addToConversationHistory(
      `[Language switched from ${SUPPORTED_LANGUAGES[previousLanguage]?.name} to ${SUPPORTED_LANGUAGES[languageCode]?.name}]`,
      'language_switch',
      { message: responses.language_switched, type: 'system', intent: 'language_switch' },
      []
    );

    console.log(`Language switched to: ${SUPPORTED_LANGUAGES[languageCode].name}`);
    return true;
  }

  // Update conversation context and memory
  updateConversationContext(message, context) {
    this.lastQuery = message;
    this.userContext = { ...this.userContext, ...context };
    
    // Extract and store key entities
    const entities = this.extractAdvancedEntities(message);
    entities.forEach(entity => {
      this.contextMemory.set(entity.type, entity.value);
    });

    // Update conversation state
    this.updateConversationState(message);
  }

  // Advanced entity extraction
  extractAdvancedEntities(message) {
    const entities = [];
    const lowerMessage = message.toLowerCase();

    // Extract dates (enhanced patterns)
    const datePatterns = [
      /\b(today|tomorrow|yesterday)\b/gi,
      /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
      /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/gi,
      /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)\b/gi
    ];

    datePatterns.forEach(pattern => {
      const matches = lowerMessage.match(pattern);
      if (matches) {
        matches.forEach(match => {
          entities.push({ type: 'date', value: match, confidence: 0.9 });
        });
      }
    });

    // Extract times (enhanced patterns)
    const timePatterns = [
      /\b(\d{1,2}):(\d{2})\s*(am|pm)\b/gi,
      /\b(\d{1,2})\s*(am|pm)\b/gi,
      /\b(morning|afternoon|evening|night)\b/gi
    ];

    timePatterns.forEach(pattern => {
      const matches = lowerMessage.match(pattern);
      if (matches) {
        matches.forEach(match => {
          entities.push({ type: 'time', value: match, confidence: 0.8 });
        });
      }
    });

    // Extract medical specialties
    const specialties = ['cardiology', 'neurology', 'orthopedics', 'pediatrics', 'emergency', 'general'];
    specialties.forEach(specialty => {
      if (lowerMessage.includes(specialty)) {
        entities.push({ type: 'specialty', value: specialty, confidence: 0.9 });
      }
    });

    // Extract names (basic pattern)
    const namePattern = /my name is (\w+)/gi;
    const nameMatch = lowerMessage.match(namePattern);
    if (nameMatch) {
      entities.push({ type: 'name', value: nameMatch[1], confidence: 0.7 });
    }

    return entities;
  }

  // Update conversation state machine
  updateConversationState(message) {
    const lowerMessage = message.toLowerCase();

    if (this.currentBookingFlow) {
      this.conversationState = 'booking';
    } else if (/\b(hello|hi|hey)\b/.test(lowerMessage)) {
      this.conversationState = 'greeting';
    } else if (/\b(book|appointment|schedule)\b/.test(lowerMessage)) {
      this.conversationState = 'booking_intent';
    } else if (/\b(services|treatment|medical)\b/.test(lowerMessage)) {
      this.conversationState = 'services_inquiry';
    } else if (/\b(emergency|urgent|help)\b/.test(lowerMessage)) {
      this.conversationState = 'emergency';
    } else {
      this.conversationState = 'general_inquiry';
    }
  }

  // Auto-response system for continuous conversation
  async generateAutoResponse(transcript, confidence) {
    if (!this.autoResponseEnabled || confidence < 0.7) {
      return null;
    }

    // Quick responses for common queries
    const quickResponses = {
      'hello': () => this.getGreetingResponse(),
      'help': () => this.getHelpResponse(),
      'emergency': () => this.getEmergencyResponse(),
      'thank you': () => this.getThankYouResponse(),
      'services': () => this.getServicesOverview()
    };

    const lowerTranscript = transcript.toLowerCase();
    
    for (const [trigger, responseGenerator] of Object.entries(quickResponses)) {
      if (lowerTranscript.includes(trigger)) {
        return await responseGenerator();
      }
    }

    // For other queries, use the enhanced processing
    return await this.processMessage(transcript);
  }

  // Get greeting response in current language
  getGreetingResponse() {
    const responses = MULTI_LANGUAGE_RESPONSES[this.currentLanguage] || MULTI_LANGUAGE_RESPONSES['en-US'];
    return {
      message: responses.greeting,
      type: 'greeting',
      intent: 'greeting',
      autoGenerated: true
    };
  }

  // Get emergency response
  getEmergencyResponse() {
    const responses = MULTI_LANGUAGE_RESPONSES[this.currentLanguage] || MULTI_LANGUAGE_RESPONSES['en-US'];
    return {
      message: "🚨 For immediate medical emergencies, please call our emergency line: 0599 211 311. Our emergency department is open 24/7.",
      type: 'emergency',
      intent: 'emergency',
      urgent: true,
      autoGenerated: true
    };
  }

  // Get help response
  getHelpResponse() {
    return {
      message: "I can help you with: booking appointments, finding information about our services, getting hospital details, emergency assistance, and answering questions in multiple languages. What would you like to know?",
      type: 'help',
      intent: 'help',
      autoGenerated: true
    };
  }

  // Get thank you response
  getThankYouResponse() {
    return {
      message: "You're welcome! I'm here to help whenever you need assistance. Is there anything else I can help you with?",
      type: 'acknowledgment',
      intent: 'goodbye',
      autoGenerated: true
    };
  }

  // Get services overview
  async getServicesOverview() {
    const searchResults = await this.searchWebsiteContent('medical services');
    return {
      message: "We offer comprehensive medical services including cardiology, neurology, orthopedics, pediatrics, emergency care, and general medicine. Would you like specific information about any service?",
      type: 'services_overview',
      intent: 'services',
      searchResults: searchResults,
      autoGenerated: true
    };
  }

  // Enhanced conversation history with metadata
  addToConversationHistory(userMessage, intent, botResponse, searchResults) {
    this.conversationHistory.push({
      timestamp: new Date(),
      userMessage,
      intent,
      botResponse: botResponse.message,
      responseType: botResponse.type,
      language: this.currentLanguage,
      searchResults: searchResults || [],
      context: { ...this.userContext },
      conversationState: this.conversationState,
      entities: this.extractAdvancedEntities(userMessage)
    });

    // Keep history manageable (last 50 messages)
    if (this.conversationHistory.length > 50) {
      this.conversationHistory.shift();
    }
  }

  // Get error response in current language
  getErrorResponse(error) {
    const responses = MULTI_LANGUAGE_RESPONSES[this.currentLanguage] || MULTI_LANGUAGE_RESPONSES['en-US'];
    return {
      message: "I apologize, but I encountered an error processing your request. Please try again or contact our support team.",
      type: 'error',
      intent: 'error',
      error: error.message
    };
  }

  // Enable/disable auto-response
  setAutoResponse(enabled) {
    this.autoResponseEnabled = enabled;
    this.userPreferences.autoResponse = enabled;
  }

  // Get conversation analytics
  getConversationAnalytics() {
    const analytics = {
      totalMessages: this.conversationHistory.length,
      languagesUsed: [...new Set(this.conversationHistory.map(msg => msg.language))],
      commonIntents: this.getCommonIntents(),
      averageResponseTime: this.calculateAverageResponseTime(),
      searchResultsProvided: this.conversationHistory.filter(msg => msg.searchResults?.length > 0).length,
      conversationDuration: this.getConversationDuration()
    };

    return analytics;
  }

  getCommonIntents() {
    const intentCounts = {};
    this.conversationHistory.forEach(msg => {
      intentCounts[msg.intent] = (intentCounts[msg.intent] || 0) + 1;
    });

    return Object.entries(intentCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([intent, count]) => ({ intent, count }));
  }

  calculateAverageResponseTime() {
    // Simulated response time calculation
    return Math.round(Math.random() * 2000 + 500); // 500-2500ms
  }

  getConversationDuration() {
    if (this.conversationHistory.length < 2) return 0;
    
    const first = this.conversationHistory[0].timestamp;
    const last = this.conversationHistory[this.conversationHistory.length - 1].timestamp;
    
    return Math.round((last - first) / 1000); // Duration in seconds
  }

  // Reset conversation with language preservation
  resetConversation() {
    const preservedLanguage = this.currentLanguage;
    const preservedPreferences = { ...this.userPreferences };
    
    this.conversationHistory = [];
    this.currentBookingFlow = null;
    this.userContext = {};
    this.contextMemory.clear();
    this.conversationState = 'idle';
    
    // Restore preserved settings
    this.currentLanguage = preservedLanguage;
    this.userPreferences = preservedPreferences;
  }

  // Get available languages
  getSupportedLanguages() {
    return Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
      code,
      ...info,
      isCurrent: code === this.currentLanguage,
      hasVoiceSupport: multiLanguageVoiceService.isLanguageSupported(code)
    }));
  }

  // Legacy method compatibility
  classifyIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(lowerMessage)) {
          return intent;
        }
      }
    }
    
    return INTENTS.UNKNOWN;
  }

  generateResponse(intent, message = '', context = {}) {
    // Fallback to original response generation for compatibility
    const responses = RESPONSES[intent] || RESPONSES[INTENTS.UNKNOWN];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      message: randomResponse,
      type: 'text',
      intent: intent,
      translationKey: intent
    };
  }
}

// Create singleton instance
export const enhancedChatbotService = new EnhancedChatbotService();
export default enhancedChatbotService;