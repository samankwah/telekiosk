// Voice utility functions for voice interactions

export const VOICE_COMMANDS = {
  // Greeting commands
  WAKE_WORDS: ['hey hospital', 'telekiosk', 'hello hospital', 'hi telekiosk'],
  
  // Booking commands
  BOOKING: [
    'book appointment',
    'schedule appointment', 
    'make appointment',
    'see doctor',
    'book consultation',
    'reserve appointment'
  ],
  
  // Information commands
  INFO: [
    'hospital information',
    'contact details',
    'phone number',
    'address',
    'location'
  ],
  
  // Services commands
  SERVICES: [
    'what services',
    'medical services',
    'available services',
    'show services',
    'list services'
  ],
  
  // Emergency commands
  EMERGENCY: [
    'emergency',
    'urgent help',
    'critical situation',
    'ambulance',
    'immediate help'
  ],
  
  // Navigation commands
  NAVIGATION: [
    'go back',
    'previous',
    'home',
    'start over',
    'reset',
    'clear conversation'
  ]
};

export const VOICE_RESPONSES = {
  PERMISSION_DENIED: "I need microphone permission to hear you. Please allow microphone access and try again.",
  NOT_SUPPORTED: "Sorry, voice recognition is not supported on this browser. Please try using Chrome, Edge, or Safari.",
  NETWORK_ERROR: "I'm having trouble connecting. Please check your internet connection and try again.",
  NO_SPEECH: "I didn't hear anything. Please speak clearly and try again.",
  SPEECH_ERROR: "I had trouble understanding you. Could you please repeat that?",
  LISTENING_TIMEOUT: "I didn't hear anything for a while. Click the microphone to try again.",
  
  WELCOME_VOICE: "Hello! I'm your TeleKiosk Hospital voice assistant. You can speak to me or type your questions.",
  VOICE_ACTIVATED: "Voice mode activated. I'm listening...",
  VOICE_DEACTIVATED: "Voice mode turned off. You can still type your messages.",
  PROCESSING: "Let me process that for you...",
  
  BOOKING_START: "I'll help you book an appointment. What type of service do you need?",
  BOOKING_SUCCESS: "Great! Your appointment has been booked successfully. You'll receive a confirmation email shortly."
};

// Voice command processor
export class VoiceCommandProcessor {
  constructor() {
    this.commandHistory = [];
    this.confidenceThreshold = 0.7;
  }

  // Process voice input and extract intent
  processVoiceCommand(transcript, confidence = 1.0) {
    const cleanedTranscript = this.cleanTranscript(transcript);
    
    // Store command history
    this.commandHistory.push({
      transcript: cleanedTranscript,
      confidence,
      timestamp: new Date()
    });

    // Extract intent from voice command
    const intent = this.extractIntent(cleanedTranscript);
    
    return {
      transcript: cleanedTranscript,
      intent,
      confidence,
      isHighConfidence: confidence >= this.confidenceThreshold
    };
  }

  // Clean and normalize transcript
  cleanTranscript(transcript) {
    if (!transcript) return '';
    
    let cleaned = transcript.toLowerCase().trim();
    
    // Remove common filler words
    const fillers = ['um', 'uh', 'like', 'you know', 'well', 'so', 'actually'];
    fillers.forEach(filler => {
      cleaned = cleaned.replace(new RegExp(`\\b${filler}\\b`, 'g'), '');
    });
    
    // Remove extra spaces
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Fix common speech recognition errors
    const corrections = {
      'tele kiosk': 'telekiosk',
      'tell kiosk': 'telekiosk', 
      'tell key ask': 'telekiosk',
      'book and appointment': 'book an appointment',
      'what are your services': 'what services do you offer',
      'show me doctors': 'show me the doctors'
    };
    
    Object.entries(corrections).forEach(([error, correction]) => {
      cleaned = cleaned.replace(new RegExp(error, 'g'), correction);
    });
    
    return cleaned;
  }

  // Extract intent from cleaned transcript
  extractIntent(transcript) {
    const lowerTranscript = transcript.toLowerCase();
    
    // Check for wake words
    if (VOICE_COMMANDS.WAKE_WORDS.some(wake => lowerTranscript.includes(wake))) {
      return 'greeting';
    }
    
    // Check for booking commands
    if (VOICE_COMMANDS.BOOKING.some(cmd => lowerTranscript.includes(cmd))) {
      return 'booking';
    }
    
    // Check for information commands
    if (VOICE_COMMANDS.INFO.some(cmd => lowerTranscript.includes(cmd))) {
      return 'hospital_info';
    }
    
    // Check for services commands
    if (VOICE_COMMANDS.SERVICES.some(cmd => lowerTranscript.includes(cmd))) {
      return 'services';
    }
    
    // Check for emergency commands
    if (VOICE_COMMANDS.EMERGENCY.some(cmd => lowerTranscript.includes(cmd))) {
      return 'emergency';
    }
    
    // Check for navigation commands
    if (VOICE_COMMANDS.NAVIGATION.some(cmd => lowerTranscript.includes(cmd))) {
      return 'navigation';
    }
    
    return 'unknown';
  }

  // Get command suggestions based on current context
  getVoiceCommandSuggestions(context = 'general') {
    const suggestions = {
      general: [
        "Say 'Book an appointment' to schedule a visit",
        "Ask 'What services do you offer?' to learn about our medical services", 
        "Say 'Hospital information' for contact details",
        "Try 'Emergency help' for urgent situations"
      ],
      booking: [
        "Say the service you need, like 'Cardiology' or 'Pediatrics'",
        "Mention when you'd like to visit, like 'Tomorrow morning'",
        "Provide your name and contact information when asked"
      ],
      services: [
        "Ask about specific services like 'Tell me about cardiology'",
        "Say 'Book appointment for [service]' to schedule directly"
      ]
    };
    
    return suggestions[context] || suggestions.general;
  }

  // Get command history
  getCommandHistory(limit = 10) {
    return this.commandHistory.slice(-limit);
  }

  // Clear command history
  clearHistory() {
    this.commandHistory = [];
  }
}

// Voice error handler
export class VoiceErrorHandler {
  static getErrorMessage(error) {
    switch (error) {
      case 'not-allowed':
      case 'permission-denied':
        return VOICE_RESPONSES.PERMISSION_DENIED;
      
      case 'not-supported':
        return VOICE_RESPONSES.NOT_SUPPORTED;
      
      case 'network':
        return VOICE_RESPONSES.NETWORK_ERROR;
      
      case 'no-speech':
        return VOICE_RESPONSES.NO_SPEECH;
      
      case 'audio-capture':
        return "There's an issue with your microphone. Please check your audio settings.";
      
      case 'bad-grammar':
        return VOICE_RESPONSES.SPEECH_ERROR;
      
      default:
        return "I encountered an issue with voice recognition. Please try again.";
    }
  }

  static shouldRetry(error) {
    const retryableErrors = ['network', 'no-speech', 'audio-capture'];
    return retryableErrors.includes(error);
  }
}

// Voice accessibility helpers
export const VoiceAccessibility = {
  // Announce to screen readers
  announce(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Get voice command shortcuts
  getKeyboardShortcuts() {
    return {
      'Alt + V': 'Toggle voice input',
      'Alt + M': 'Mute/unmute voice output',
      'Escape': 'Stop listening',
      'Alt + R': 'Reset conversation'
    };
  }
};

// Export singleton instances
export const voiceCommandProcessor = new VoiceCommandProcessor();
export default {
  VOICE_COMMANDS,
  VOICE_RESPONSES,
  VoiceCommandProcessor,
  VoiceErrorHandler,
  VoiceAccessibility,
  voiceCommandProcessor
};