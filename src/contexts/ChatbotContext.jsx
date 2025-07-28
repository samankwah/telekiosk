import { createContext, useContext, useReducer, useEffect } from 'react';
import { voiceService } from '../services/voiceService';
import { chatbotService } from '../services/chatbotService';

const ChatbotContext = createContext();

const CHATBOT_ACTIONS = {
  TOGGLE_CHAT: 'TOGGLE_CHAT',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_TYPING: 'SET_TYPING',
  SET_LISTENING: 'SET_LISTENING',
  SET_SPEAKING: 'SET_SPEAKING',
  SET_VOICE_ENABLED: 'SET_VOICE_ENABLED',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_CHAT: 'RESET_CHAT',
  SET_BOOKING_FLOW: 'SET_BOOKING_FLOW',
  SET_VOICE_SUPPORTED: 'SET_VOICE_SUPPORTED'
};

const initialState = {
  isOpen: false,
  messages: [
    {
      id: 1,
      text: "Hello! Welcome to TeleKiosk Hospital. I'm your virtual assistant. I can help you with appointments, hospital information, and answer questions. You can type or speak to me!",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ],
  isTyping: false,
  isListening: false,
  isSpeaking: false,
  voiceEnabled: true,
  voiceSupported: {
    speechRecognition: false,
    speechSynthesis: false
  },
  error: null,
  bookingFlow: null
};

function chatbotReducer(state, action) {
  switch (action.type) {
    case CHATBOT_ACTIONS.TOGGLE_CHAT:
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case CHATBOT_ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isTyping: false
      };

    case CHATBOT_ACTIONS.SET_TYPING:
      return {
        ...state,
        isTyping: action.payload
      };

    case CHATBOT_ACTIONS.SET_LISTENING:
      return {
        ...state,
        isListening: action.payload
      };

    case CHATBOT_ACTIONS.SET_SPEAKING:
      return {
        ...state,
        isSpeaking: action.payload
      };

    case CHATBOT_ACTIONS.SET_VOICE_ENABLED:
      return {
        ...state,
        voiceEnabled: action.payload
      };

    case CHATBOT_ACTIONS.SET_VOICE_SUPPORTED:
      return {
        ...state,
        voiceSupported: action.payload
      };

    case CHATBOT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isListening: false,
        isSpeaking: false
      };

    case CHATBOT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case CHATBOT_ACTIONS.RESET_CHAT:
      return {
        ...initialState,
        isOpen: state.isOpen,
        voiceEnabled: state.voiceEnabled,
        voiceSupported: state.voiceSupported
      };

    case CHATBOT_ACTIONS.SET_BOOKING_FLOW:
      return {
        ...state,
        bookingFlow: action.payload
      };

    default:
      return state;
  }
}

export function ChatbotProvider({ children }) {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);

  // Initialize voice services on mount
  useEffect(() => {
    const voiceSupport = voiceService.isSupported();
    dispatch({
      type: CHATBOT_ACTIONS.SET_VOICE_SUPPORTED,
      payload: voiceSupport
    });
  }, []);

  // Toggle chat window
  const toggleChat = () => {
    dispatch({ type: CHATBOT_ACTIONS.TOGGLE_CHAT });
  };

  // Add a new message
  const addMessage = (text, sender = 'user', type = 'text', data = null) => {
    const message = {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date(),
      type,
      data
    };
    
    dispatch({
      type: CHATBOT_ACTIONS.ADD_MESSAGE,
      payload: message
    });

    return message;
  };

  // Send message and get bot response
  const sendMessage = async (text) => {
    try {
      // Add user message
      addMessage(text, 'user');
      
      // Set typing indicator
      dispatch({ type: CHATBOT_ACTIONS.SET_TYPING, payload: true });

      // Get bot response
      const response = chatbotService.processMessage(text);
      
      // Simulate thinking time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add bot response
      const botMessage = addMessage(response.message, 'bot', response.type, response);
      
      // Speak response if voice is enabled
      if (state.voiceEnabled && response.message) {
        speakMessage(response.message);
      }

      // Update booking flow if applicable
      if (response.intent === 'booking' && chatbotService.currentBookingFlow) {
        dispatch({
          type: CHATBOT_ACTIONS.SET_BOOKING_FLOW,
          payload: chatbotService.currentBookingFlow
        });
      }

      return botMessage;
    } catch (error) {
      dispatch({
        type: CHATBOT_ACTIONS.SET_ERROR,
        payload: 'Sorry, I encountered an error. Please try again.'
      });
    }
  };

  // Start voice recognition
  const startListening = async () => {
    try {
      // Request microphone permission
      const hasPermission = await voiceService.requestMicrophonePermission();
      if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      dispatch({ type: CHATBOT_ACTIONS.SET_LISTENING, payload: true });
      dispatch({ type: CHATBOT_ACTIONS.CLEAR_ERROR });

      const success = voiceService.startListening(
        (transcript, confidence) => {
          // Process voice command
          const processedText = voiceService.processVoiceCommand(transcript);
          if (processedText.trim()) {
            sendMessage(processedText);
          }
        },
        (error) => {
          dispatch({
            type: CHATBOT_ACTIONS.SET_ERROR,
            payload: `Voice recognition error: ${error}`
          });
        },
        () => {
          dispatch({ type: CHATBOT_ACTIONS.SET_LISTENING, payload: false });
        }
      );

      if (!success) {
        dispatch({
          type: CHATBOT_ACTIONS.SET_ERROR,
          payload: 'Failed to start voice recognition'
        });
      }
    } catch (error) {
      dispatch({
        type: CHATBOT_ACTIONS.SET_ERROR,
        payload: error.message
      });
    }
  };

  // Stop voice recognition
  const stopListening = () => {
    voiceService.stopListening();
    dispatch({ type: CHATBOT_ACTIONS.SET_LISTENING, payload: false });
  };

  // Speak a message
  const speakMessage = (text) => {
    if (!state.voiceEnabled) return;

    dispatch({ type: CHATBOT_ACTIONS.SET_SPEAKING, payload: true });

    voiceService.speak(
      text,
      () => {
        // On start
      },
      () => {
        // On end
        dispatch({ type: CHATBOT_ACTIONS.SET_SPEAKING, payload: false });
      },
      (error) => {
        // On error
        dispatch({ type: CHATBOT_ACTIONS.SET_SPEAKING, payload: false });
        console.error('Speech synthesis error:', error);
      }
    );
  };

  // Stop speaking
  const stopSpeaking = () => {
    voiceService.stopSpeaking();
    dispatch({ type: CHATBOT_ACTIONS.SET_SPEAKING, payload: false });
  };

  // Toggle voice enabled
  const toggleVoice = () => {
    const newVoiceEnabled = !state.voiceEnabled;
    dispatch({
      type: CHATBOT_ACTIONS.SET_VOICE_ENABLED,
      payload: newVoiceEnabled
    });

    if (!newVoiceEnabled) {
      stopListening();
      stopSpeaking();
    }
  };

  // Reset conversation
  const resetChat = () => {
    chatbotService.resetConversation();
    dispatch({ type: CHATBOT_ACTIONS.RESET_CHAT });
  };

  // Handle quick actions
  const handleQuickAction = (action, data = null, navigate = null) => {
    // Convert text to action if needed (for quick action buttons)
    let actionType = action;
    
    if (typeof action === 'string') {
      actionType = action.toLowerCase().replace(/\s+/g, '_');
    }

    switch (actionType) {
      // Booking actions
      case 'start_booking':
      case 'book_appointment':
      case 'book_now':
        if (navigate) {
          navigate('/booking');
          dispatch({ type: CHATBOT_ACTIONS.TOGGLE_CHAT });
        } else {
          sendMessage('I want to book an appointment');
        }
        break;

      // Services actions  
      case 'our_services':
      case 'show_services':
        if (navigate) {
          navigate('/services');
          dispatch({ type: CHATBOT_ACTIONS.TOGGLE_CHAT });
        } else {
          sendMessage('What services do you offer?');
        }
        break;

      // Hospital info actions
      case 'hospital_info':
      case 'show_info':
        if (navigate) {
          navigate('/about-us');
          dispatch({ type: CHATBOT_ACTIONS.TOGGLE_CHAT });
        } else {
          sendMessage('Tell me about the hospital');
        }
        break;

      // Directions actions
      case 'directions':
        window.open('https://maps.google.com/?q=Block+F6+Shippi+Road+Cantonments+Accra', '_blank');
        break;

      // Emergency actions
      case 'emergency':
        if (navigate) {
          navigate('/contact');
          dispatch({ type: CHATBOT_ACTIONS.TOGGLE_CHAT });
        } else {
          sendMessage('Emergency information');
        }
        break;

      // Doctors actions
      case 'our_doctors':
      case 'show_doctors':
        if (navigate) {
          navigate('/doctors');
          dispatch({ type: CHATBOT_ACTIONS.TOGGLE_CHAT });
        } else {
          sendMessage('Show me the doctors');
        }
        break;

      // Contact actions
      case 'contact':
      case 'contact_us':
        if (navigate) {
          navigate('/contact');
          dispatch({ type: CHATBOT_ACTIONS.TOGGLE_CHAT });
        } else {
          sendMessage('Contact information');
        }
        break;

      // Booking flow actions
      case 'book_service':
        sendMessage(`I want to book an appointment for ${data}`);
        break;
      case 'select_service':
        if (data) {
          const response = chatbotService.handleServiceSelection(data);
          addMessage(response.message, 'bot', response.type, response);
        }
        break;
      case 'select_date':
        if (data) {
          const response = chatbotService.handleDateSelection(data);
          addMessage(response.message, 'bot', response.type, response);
        }
        break;
      case 'select_time':
        if (data) {
          const response = chatbotService.handleTimeSelection(data);
          addMessage(response.message, 'bot', response.type, response);
        }
        break;
      case 'complete_booking':
        if (navigate) {
          navigate('/booking');
          dispatch({ type: CHATBOT_ACTIONS.TOGGLE_CHAT });
          addMessage('Redirecting you to complete your booking...', 'bot');
        } else {
          sendMessage('Ready to complete booking');
        }
        break;
      case 'navigate_to_booking':
        if (navigate) {
          navigate('/booking');
          dispatch({ type: CHATBOT_ACTIONS.TOGGLE_CHAT });
        } else {
          sendMessage('I want to book an appointment');
        }
        break;

      default:
        console.log('Unknown action:', action, 'with data:', data);
        
        // Fallback logic for common navigation patterns
        if (action && typeof action === 'string') {
          const lowerAction = action.toLowerCase();
          
          if (navigate) {
            if (lowerAction.includes('book') || lowerAction.includes('appointment')) {
              navigate('/booking');
              dispatch({ type: CHATBOT_ACTIONS.TOGGLE_CHAT });
            } else if (lowerAction.includes('service')) {
              navigate('/services');
              dispatch({ type: CHATBOT_ACTIONS.TOGGLE_CHAT });
            } else if (lowerAction.includes('doctor')) {
              navigate('/doctors');
              dispatch({ type: CHATBOT_ACTIONS.TOGGLE_CHAT });
            } else if (lowerAction.includes('contact') || lowerAction.includes('emergency')) {
              navigate('/contact');
              dispatch({ type: CHATBOT_ACTIONS.TOGGLE_CHAT });
            } else if (lowerAction.includes('about') || lowerAction.includes('info')) {
              navigate('/about-us');
              dispatch({ type: CHATBOT_ACTIONS.TOGGLE_CHAT });
            } else if (lowerAction.includes('direction')) {
              window.open('https://maps.google.com/?q=Block+F6+Shippi+Road+Cantonments+Accra', '_blank');
            } else {
              // Send as message if no navigation match found
              sendMessage(action);
            }
          } else {
            // Send as message if no navigate function available
            sendMessage(action);
          }
        }
    }
  };

  // Progress booking flow
  const progressBookingFlow = (data) => {
    const updatedFlow = chatbotService.progressBookingFlow(data);
    if (updatedFlow) {
      dispatch({
        type: CHATBOT_ACTIONS.SET_BOOKING_FLOW,
        payload: updatedFlow
      });
      
      // Generate next step response
      const response = chatbotService.generateResponse('booking');
      addMessage(response.message, 'bot', response.type, response);
    }
  };

  const value = {
    state,
    toggleChat,
    sendMessage,
    startListening,
    stopListening,
    speakMessage,
    stopSpeaking,
    toggleVoice,
    resetChat,
    handleQuickAction,
    progressBookingFlow,
    addMessage
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
}

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};