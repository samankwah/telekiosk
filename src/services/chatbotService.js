import { 
  INTENTS, 
  INTENT_PATTERNS, 
  RESPONSES, 
  BOOKING_FLOW_STEPS,
  AVAILABLE_TIMES 
} from '../components/chatbot/ChatKnowledgeBase.js';
import { SERVICES } from '../constants/hospitalData.js';
import { chatbotAPI } from './chatbotAPI.js';

class ChatbotService {
  constructor() {
    this.conversationHistory = [];
    this.currentBookingFlow = null;
    this.userContext = {};
  }

  // Classify user intent based on message
  classifyIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check each intent pattern
    for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(lowerMessage)) {
          return intent;
        }
      }
    }
    
    return INTENTS.UNKNOWN;
  }

  // Generate response based on intent
  generateResponse(intent, message = '', context = {}) {
    const responses = RESPONSES[intent] || RESPONSES[INTENTS.UNKNOWN];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Handle special cases
    switch (intent) {
      case INTENTS.BOOKING:
        return this.handleBookingIntent(message, context);
      case INTENTS.SERVICES:
        return this.handleServicesIntent(message);
      default:
        return {
          message: randomResponse,
          type: 'text',
          intent: intent,
          actions: this.getQuickActions(intent)
        };
    }
  }

  // Handle booking-related intents
  handleBookingIntent(message, context) {
    if (!this.currentBookingFlow) {
      this.currentBookingFlow = {
        step: BOOKING_FLOW_STEPS.SERVICE_SELECTION,
        data: {}
      };
    }

    switch (this.currentBookingFlow.step) {
      case BOOKING_FLOW_STEPS.SERVICE_SELECTION:
        return {
          message: "I'd be happy to help you book an appointment! Please select the service you need:",
          type: 'service_selection',
          intent: INTENTS.BOOKING,
          options: SERVICES.map(service => ({
            id: service.id,
            title: service.title,
            description: service.description,
            icon: service.icon
          })),
          actions: []
        };

      case BOOKING_FLOW_STEPS.DATE_SELECTION:
        return {
          message: `Great! You've selected ${this.currentBookingFlow.data.service}. When would you like to schedule your appointment?`,
          type: 'date_selection',
          intent: INTENTS.BOOKING,
          actions: []
        };

      case BOOKING_FLOW_STEPS.TIME_SELECTION:
        const availableTimes = chatbotAPI.getAvailableTimeSlots(
          this.currentBookingFlow.data.date,
          this.currentBookingFlow.data.doctorId
        );
        return {
          message: "Please select your preferred time:",
          type: 'time_selection',
          intent: INTENTS.BOOKING,
          options: availableTimes,
          actions: []
        };

      case BOOKING_FLOW_STEPS.PATIENT_INFO:
        return {
          message: "Please provide your contact information to complete the booking:",
          type: 'patient_info',
          intent: INTENTS.BOOKING,
          fields: [
            { name: 'patientName', label: 'Full Name', required: true },
            { name: 'email', label: 'Email Address', required: true },
            { name: 'phone', label: 'Phone Number', required: true },
            { name: 'reason', label: 'Reason for Visit', required: false }
          ],
          actions: []
        };

      default:
        return {
          message: "Let me help you book an appointment. What service do you need?",
          type: 'text',
          intent: INTENTS.BOOKING,
          actions: []
        };
    }
  }

  // Handle services-related intents
  handleServicesIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check if user asked about a specific service
    const specificService = SERVICES.find(service => 
      lowerMessage.includes(service.title.toLowerCase()) ||
      lowerMessage.includes(service.id.toLowerCase())
    );

    if (specificService) {
      return {
        message: `${specificService.title}: ${specificService.description}. Would you like to book an appointment for this service?`,
        type: 'service_detail',
        intent: INTENTS.SERVICES,
        service: specificService,
        actions: [
          { text: 'Book Appointment', action: 'book_service', data: specificService.id },
          { text: 'Learn More', action: 'learn_more', data: specificService.id }
        ]
      };
    }

    return {
      message: "Here are our available medical services:",
      type: 'services_list',
      intent: INTENTS.SERVICES,
      services: SERVICES,
      actions: [
        { text: 'Book Appointment', action: 'start_booking' }
      ]
    };
  }

  // Process user message and get response
  processMessage(message, context = {}) {
    const intent = this.classifyIntent(message);
    const response = this.generateResponse(intent, message, context);
    
    // Add to conversation history
    this.conversationHistory.push({
      timestamp: new Date(),
      userMessage: message,
      intent: intent,
      botResponse: response.message,
      context: context
    });

    return response;
  }

  // Handle booking flow progression
  progressBookingFlow(data) {
    if (!this.currentBookingFlow) return null;

    switch (this.currentBookingFlow.step) {
      case BOOKING_FLOW_STEPS.SERVICE_SELECTION:
        this.currentBookingFlow.data.service = data.service;
        this.currentBookingFlow.data.serviceId = data.serviceId;
        this.currentBookingFlow.step = BOOKING_FLOW_STEPS.DATE_SELECTION;
        break;

      case BOOKING_FLOW_STEPS.DATE_SELECTION:
        this.currentBookingFlow.data.date = data.date;
        this.currentBookingFlow.step = BOOKING_FLOW_STEPS.TIME_SELECTION;
        break;

      case BOOKING_FLOW_STEPS.TIME_SELECTION:
        this.currentBookingFlow.data.time = data.time;
        this.currentBookingFlow.step = BOOKING_FLOW_STEPS.PATIENT_INFO;
        break;

      case BOOKING_FLOW_STEPS.PATIENT_INFO:
        this.currentBookingFlow.data = { ...this.currentBookingFlow.data, ...data };
        this.currentBookingFlow.step = BOOKING_FLOW_STEPS.CONFIRMATION;
        break;
    }

    return this.currentBookingFlow;
  }

  // Complete booking process
  async completeBooking() {
    if (!this.currentBookingFlow || this.currentBookingFlow.step !== BOOKING_FLOW_STEPS.CONFIRMATION) {
      return { success: false, message: 'Booking flow not completed' };
    }

    try {
      // Use the integrated booking API
      const bookingData = this.currentBookingFlow.data;
      const bookingResult = await chatbotAPI.createBooking(bookingData);

      if (bookingResult.success) {
        // Reset booking flow
        this.currentBookingFlow = null;
        return bookingResult;
      } else {
        return bookingResult;
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'There was an error processing your booking. Please try again.',
        error: error.message
      };
    }
  }

  // Get quick action buttons based on intent
  getQuickActions(intent) {
    switch (intent) {
      case INTENTS.GREETING:
        return [
          { text: 'Book Appointment', action: 'start_booking' },
          { text: 'Our Services', action: 'show_services' },
          { text: 'Hospital Info', action: 'show_info' }
        ];
      case INTENTS.SERVICES:
        return [
          { text: 'Book Appointment', action: 'start_booking' },
          { text: 'Learn More', action: 'learn_more' }
        ];
      default:
        return [];
    }
  }

  // Reset conversation
  resetConversation() {
    this.conversationHistory = [];
    this.currentBookingFlow = null;
    this.userContext = {};
  }

  // Get conversation summary
  getConversationSummary() {
    return {
      messageCount: this.conversationHistory.length,
      intents: [...new Set(this.conversationHistory.map(msg => msg.intent))],
      hasBookingFlow: !!this.currentBookingFlow,
      bookingStep: this.currentBookingFlow?.step || null
    };
  }

  // Extract entities from message (simple implementation)
  extractEntities(message) {
    const entities = {};
    const lowerMessage = message.toLowerCase();

    // Extract time mentions
    const timePattern = /\b(\d{1,2}):?(\d{2})?\s*(am|pm)\b/gi;
    const timeMatch = lowerMessage.match(timePattern);
    if (timeMatch) {
      entities.time = timeMatch[0];
    }

    // Extract date mentions
    const datePattern = /\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}\/\d{1,2})\b/gi;
    const dateMatch = lowerMessage.match(datePattern);
    if (dateMatch) {
      entities.date = dateMatch[0];
    }

    // Extract service mentions
    const mentionedService = SERVICES.find(service => 
      lowerMessage.includes(service.title.toLowerCase()) ||
      lowerMessage.includes(service.id.toLowerCase())
    );
    if (mentionedService) {
      entities.service = mentionedService.id;
    }

    return entities;
  }
}

// Create singleton instance
export const chatbotService = new ChatbotService();
export default chatbotService;