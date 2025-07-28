import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { ghanaLanguageService } from '../services/ghanaLanguageService';
import { enhancedChatbotService } from '../services/enhancedChatbotService';
import { websiteScraperService } from '../services/websiteScraperService';
import { multiLanguageVoiceService } from '../services/multiLanguageVoiceService';

const EnhancedChatbotContext = createContext();

const ENHANCED_CHATBOT_ACTIONS = {
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
  SET_VOICE_SUPPORTED: 'SET_VOICE_SUPPORTED',
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_AUTO_RESPONSE: 'SET_AUTO_RESPONSE',
  SET_CONTINUOUS_LISTENING: 'SET_CONTINUOUS_LISTENING',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_CONTENT_INDEXED: 'SET_CONTENT_INDEXED',
  SET_LANGUAGE_DETECTION: 'SET_LANGUAGE_DETECTION',
  ADD_AUTO_RESPONSE: 'ADD_AUTO_RESPONSE',
  SET_CONVERSATION_STATE: 'SET_CONVERSATION_STATE'
};

const initialState = {
  isOpen: false,
  messages: [
    {
      id: 1,
      text: "Akwaaba! Welcome to TeleKiosk Hospital Ghana! 🇬🇭 I'm your AI assistant and I can help you in English and various Ghanaian languages including Twi, Ewe, Ga, and more. I can also search all information on our website to answer your questions. You can type or speak to me!",
      sender: 'bot',
      timestamp: new Date(),
      type: 'greeting',
      language: 'en-GH'
    }
  ],
  isTyping: false,
  isListening: false,
  isSpeaking: false,
  voiceEnabled: true,
  voiceSupported: {
    speechRecognition: false,
    speechSynthesis: false,
    ghanaLanguages: false
  },
  error: null,
  bookingFlow: null,
  currentLanguage: 'en-GH',
  detectedLanguage: null,
  autoResponseEnabled: true,
  continuousListening: false,
  languageDetectionEnabled: true,
  searchResults: [],
  contentIndexed: false,
  conversationState: 'idle',
  lastAutoResponse: null,
  availableLanguages: [],
  websiteContent: {
    isIndexed: false,
    itemCount: 0,
    lastUpdated: null
  }
};

function enhancedChatbotReducer(state, action) {
  switch (action.type) {
    case ENHANCED_CHATBOT_ACTIONS.TOGGLE_CHAT:
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case ENHANCED_CHATBOT_ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isTyping: false
      };

    case ENHANCED_CHATBOT_ACTIONS.SET_TYPING:
      return {
        ...state,
        isTyping: action.payload
      };

    case ENHANCED_CHATBOT_ACTIONS.SET_LISTENING:
      return {
        ...state,
        isListening: action.payload
      };

    case ENHANCED_CHATBOT_ACTIONS.SET_SPEAKING:
      return {
        ...state,
        isSpeaking: action.payload
      };

    case ENHANCED_CHATBOT_ACTIONS.SET_VOICE_ENABLED:
      return {
        ...state,
        voiceEnabled: action.payload
      };

    case ENHANCED_CHATBOT_ACTIONS.SET_VOICE_SUPPORTED:
      return {
        ...state,
        voiceSupported: action.payload
      };

    case ENHANCED_CHATBOT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isListening: false,
        isSpeaking: false
      };

    case ENHANCED_CHATBOT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ENHANCED_CHATBOT_ACTIONS.RESET_CHAT:
      return {
        ...initialState,
        isOpen: state.isOpen,
        voiceEnabled: state.voiceEnabled,
        voiceSupported: state.voiceSupported,
        currentLanguage: state.currentLanguage,
        autoResponseEnabled: state.autoResponseEnabled,
        continuousListening: state.continuousListening,
        languageDetectionEnabled: state.languageDetectionEnabled,
        contentIndexed: state.contentIndexed,
        availableLanguages: state.availableLanguages,
        websiteContent: state.websiteContent
      };

    case ENHANCED_CHATBOT_ACTIONS.SET_BOOKING_FLOW:
      return {
        ...state,
        bookingFlow: action.payload
      };

    case ENHANCED_CHATBOT_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        currentLanguage: action.payload.current,
        detectedLanguage: action.payload.detected || state.detectedLanguage
      };

    case ENHANCED_CHATBOT_ACTIONS.SET_AUTO_RESPONSE:
      return {
        ...state,
        autoResponseEnabled: action.payload
      };

    case ENHANCED_CHATBOT_ACTIONS.SET_CONTINUOUS_LISTENING:
      return {
        ...state,
        continuousListening: action.payload
      };

    case ENHANCED_CHATBOT_ACTIONS.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload
      };

    case ENHANCED_CHATBOT_ACTIONS.SET_CONTENT_INDEXED:
      return {
        ...state,
        contentIndexed: action.payload.isIndexed,
        websiteContent: {
          isIndexed: action.payload.isIndexed,
          itemCount: action.payload.itemCount || 0,
          lastUpdated: action.payload.lastUpdated || new Date()
        }
      };

    case ENHANCED_CHATBOT_ACTIONS.SET_LANGUAGE_DETECTION:
      return {
        ...state,
        languageDetectionEnabled: action.payload
      };

    case ENHANCED_CHATBOT_ACTIONS.ADD_AUTO_RESPONSE:
      return {
        ...state,
        lastAutoResponse: {
          timestamp: new Date(),
          trigger: action.payload.trigger,
          response: action.payload.response
        }
      };

    case ENHANCED_CHATBOT_ACTIONS.SET_CONVERSATION_STATE:
      return {
        ...state,
        conversationState: action.payload
      };

    default:
      return state;
  }
}

export function EnhancedChatbotProvider({ children }) {
  const [state, dispatch] = useReducer(enhancedChatbotReducer, initialState);

  // Initialize services on mount
  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = useCallback(async () => {
    try {
      // Initialize voice services
      const voiceSupport = ghanaLanguageService.isVoiceSupported();
      dispatch({
        type: ENHANCED_CHATBOT_ACTIONS.SET_VOICE_SUPPORTED,
        payload: voiceSupport
      });

      // Get available Ghana languages
      const languages = ghanaLanguageService.getAvailableGhanaLanguages();
      dispatch({
        type: ENHANCED_CHATBOT_ACTIONS.SET_LANGUAGE,
        payload: { 
          current: 'en-GH',
          available: languages
        }
      });

      // Initialize website content indexing
      const indexStatus = websiteScraperService.getIndexingStatus();
      if (!indexStatus.isIndexed && !indexStatus.isIndexing) {
        const indexResult = await websiteScraperService.initializeContentIndex();
        dispatch({
          type: ENHANCED_CHATBOT_ACTIONS.SET_CONTENT_INDEXED,
          payload: {
            isIndexed: indexResult.success,
            itemCount: indexResult.itemCount,
            lastUpdated: new Date()
          }
        });
      } else {
        dispatch({
          type: ENHANCED_CHATBOT_ACTIONS.SET_CONTENT_INDEXED,
          payload: {
            isIndexed: indexStatus.isIndexed,
            itemCount: indexStatus.itemCount,
            lastUpdated: indexStatus.lastIndexTime
          }
        });
      }

      console.log('Enhanced chatbot services initialized successfully');
    } catch (error) {
      console.error('Error initializing enhanced chatbot services:', error);
      dispatch({
        type: ENHANCED_CHATBOT_ACTIONS.SET_ERROR,
        payload: 'Failed to initialize chatbot services'
      });
    }
  }, []);

  // Toggle chat window
  const toggleChat = useCallback(() => {
    dispatch({ type: ENHANCED_CHATBOT_ACTIONS.TOGGLE_CHAT });
  }, []);

  // Add a new message
  const addMessage = useCallback((text, sender = 'user', type = 'text', data = null, language = null) => {
    const message = {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date(),
      type,
      data,
      language: language || state.currentLanguage
    };
    
    dispatch({
      type: ENHANCED_CHATBOT_ACTIONS.ADD_MESSAGE,
      payload: message
    });

    return message;
  }, [state.currentLanguage]);

  // Enhanced message sending with auto-response and content search
  const sendMessage = useCallback(async (text, options = {}) => {
    try {
      const { autoDetectLanguage = state.languageDetectionEnabled } = options;

      // Add user message
      addMessage(text, 'user');
      
      // Set typing indicator
      dispatch({ type: ENHANCED_CHATBOT_ACTIONS.SET_TYPING, payload: true });

      // Auto-detect language if enabled
      if (autoDetectLanguage) {
        const detectedLang = ghanaLanguageService.detectGhanaLanguage(text);
        if (detectedLang !== state.currentLanguage) {
          await switchLanguage(detectedLang);
        }
      }

      // Process message with enhanced service
      const response = await enhancedChatbotService.processMessage(text, {
        currentLanguage: state.currentLanguage,
        autoResponse: state.autoResponseEnabled,
        searchWebsite: state.contentIndexed
      });
      
      // Add search results if available
      if (response.searchResults && response.searchResults.length > 0) {
        dispatch({
          type: ENHANCED_CHATBOT_ACTIONS.SET_SEARCH_RESULTS,
          payload: response.searchResults
        });
      }

      // Simulate thinking time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add bot response
      const botMessage = addMessage(
        response.message, 
        'bot', 
        response.type, 
        response, 
        state.currentLanguage
      );
      
      // Speak response if voice is enabled
      if (state.voiceEnabled && response.message) {
        speakMessage(response.message);
      }

      // Update booking flow if applicable
      if (response.intent === 'booking' && enhancedChatbotService.currentBookingFlow) {
        dispatch({
          type: ENHANCED_CHATBOT_ACTIONS.SET_BOOKING_FLOW,
          payload: enhancedChatbotService.currentBookingFlow
        });
      }

      // Update conversation state
      dispatch({
        type: ENHANCED_CHATBOT_ACTIONS.SET_CONVERSATION_STATE,
        payload: response.conversationState || 'active'
      });

      return botMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch({
        type: ENHANCED_CHATBOT_ACTIONS.SET_ERROR,
        payload: 'Sorry, I encountered an error. Please try again.'
      });
    }
  }, [state.currentLanguage, state.languageDetectionEnabled, state.autoResponseEnabled, state.contentIndexed, state.voiceEnabled, addMessage]);

  // Enhanced voice recognition with Ghana language support
  const startListening = useCallback(async (options = {}) => {
    try {
      const { continuous = state.continuousListening } = options;

      // Request microphone permission
      const hasPermission = await navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => true)
        .catch(() => false);
      
      if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      dispatch({ type: ENHANCED_CHATBOT_ACTIONS.SET_LISTENING, payload: true });
      dispatch({ type: ENHANCED_CHATBOT_ACTIONS.CLEAR_ERROR });

      const success = ghanaLanguageService.startListening(
        (transcript, confidence, metadata) => {
          // Handle final transcript
          if (metadata.isFinal && transcript.trim()) {
            // Auto-respond if enabled and confidence is high
            if (state.autoResponseEnabled && confidence > 0.8) {
              handleAutoResponse(transcript, confidence);
            } else {
              sendMessage(transcript);
            }
          }
        },
        (error) => {
          dispatch({
            type: ENHANCED_CHATBOT_ACTIONS.SET_ERROR,
            payload: `Voice recognition error: ${error}`
          });
        },
        () => {
          dispatch({ type: ENHANCED_CHATBOT_ACTIONS.SET_LISTENING, payload: false });
        },
        {
          continuous,
          autoDetectLanguage: state.languageDetectionEnabled
        }
      );

      if (!success) {
        dispatch({
          type: ENHANCED_CHATBOT_ACTIONS.SET_ERROR,
          payload: 'Failed to start voice recognition'
        });
      }
    } catch (error) {
      dispatch({
        type: ENHANCED_CHATBOT_ACTIONS.SET_ERROR,
        payload: error.message
      });
    }
  }, [state.continuousListening, state.languageDetectionEnabled, state.autoResponseEnabled, sendMessage]);

  // Handle auto-response for continuous conversation
  const handleAutoResponse = useCallback(async (transcript, confidence) => {
    try {
      const autoResponse = await enhancedChatbotService.generateAutoResponse(transcript, confidence);
      
      if (autoResponse) {
        // Add user message
        addMessage(transcript, 'user');
        
        // Brief pause for natural conversation flow
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Add auto-generated response
        const botMessage = addMessage(
          autoResponse.message, 
          'bot', 
          autoResponse.type, 
          autoResponse, 
          state.currentLanguage
        );
        
        // Speak auto-response
        if (state.voiceEnabled) {
          speakMessage(autoResponse.message);
        }

        // Track auto-response
        dispatch({
          type: ENHANCED_CHATBOT_ACTIONS.ADD_AUTO_RESPONSE,
          payload: {
            trigger: transcript,
            response: autoResponse.message
          }
        });

        return botMessage;
      }
    } catch (error) {
      console.error('Error generating auto-response:', error);
    }
  }, [state.currentLanguage, state.voiceEnabled, addMessage]);

  // Stop voice recognition
  const stopListening = useCallback(() => {
    ghanaLanguageService.stopListening();
    dispatch({ type: ENHANCED_CHATBOT_ACTIONS.SET_LISTENING, payload: false });
  }, []);

  // Enhanced speak function with Ghana language support
  const speakMessage = useCallback((text, options = {}) => {
    if (!state.voiceEnabled) return;

    dispatch({ type: ENHANCED_CHATBOT_ACTIONS.SET_SPEAKING, payload: true });

    ghanaLanguageService.speak(
      text,
      () => {
        // On start
      },
      () => {
        // On end
        dispatch({ type: ENHANCED_CHATBOT_ACTIONS.SET_SPEAKING, payload: false });
      },
      (error) => {
        // On error
        dispatch({ type: ENHANCED_CHATBOT_ACTIONS.SET_SPEAKING, payload: false });
        console.error('Speech synthesis error:', error);
      },
      {
        language: state.currentLanguage,
        ...options
      }
    );
  }, [state.voiceEnabled, state.currentLanguage]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    ghanaLanguageService.stopSpeaking();
    dispatch({ type: ENHANCED_CHATBOT_ACTIONS.SET_SPEAKING, payload: false });
  }, []);

  // Switch language
  const switchLanguage = useCallback(async (languageCode) => {
    try {
      const success = ghanaLanguageService.switchGhanaLanguage(languageCode);
      
      if (success) {
        // Update enhanced chatbot service language
        await enhancedChatbotService.switchLanguage(languageCode);
        
        dispatch({
          type: ENHANCED_CHATBOT_ACTIONS.SET_LANGUAGE,
          payload: {
            current: languageCode,
            detected: languageCode
          }
        });

        // Add language switch notification
        const response = ghanaLanguageService.getResponseInGhanaLanguage('language_switched', languageCode);
        addMessage(response, 'bot', 'system', null, languageCode);

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error switching language:', error);
      return false;
    }
  }, [addMessage]);

  // Toggle voice enabled
  const toggleVoice = useCallback(() => {
    const newVoiceEnabled = !state.voiceEnabled;
    dispatch({
      type: ENHANCED_CHATBOT_ACTIONS.SET_VOICE_ENABLED,
      payload: newVoiceEnabled
    });

    if (!newVoiceEnabled) {
      stopListening();
      stopSpeaking();
    }
  }, [state.voiceEnabled, stopListening, stopSpeaking]);

  // Toggle auto-response
  const toggleAutoResponse = useCallback(() => {
    const newAutoResponse = !state.autoResponseEnabled;
    dispatch({
      type: ENHANCED_CHATBOT_ACTIONS.SET_AUTO_RESPONSE,
      payload: newAutoResponse
    });
    
    enhancedChatbotService.setAutoResponse(newAutoResponse);
  }, [state.autoResponseEnabled]);

  // Toggle continuous listening
  const toggleContinuousListening = useCallback(() => {
    const newContinuous = !state.continuousListening;
    dispatch({
      type: ENHANCED_CHATBOT_ACTIONS.SET_CONTINUOUS_LISTENING,
      payload: newContinuous
    });
    
    ghanaLanguageService.setContinuousListening(newContinuous);
  }, [state.continuousListening]);

  // Toggle language detection
  const toggleLanguageDetection = useCallback(() => {
    const newDetection = !state.languageDetectionEnabled;
    dispatch({
      type: ENHANCED_CHATBOT_ACTIONS.SET_LANGUAGE_DETECTION,
      payload: newDetection
    });
    
    ghanaLanguageService.setAutoLanguageDetection(newDetection);
  }, [state.languageDetectionEnabled]);

  // Search website content
  const searchWebsiteContent = useCallback(async (query) => {
    try {
      const results = websiteScraperService.searchContent(query, {
        limit: 10,
        fuzzyMatch: true,
        minScore: 0.2
      });

      dispatch({
        type: ENHANCED_CHATBOT_ACTIONS.SET_SEARCH_RESULTS,
        payload: results
      });

      return results;
    } catch (error) {
      console.error('Error searching website content:', error);
      return [];
    }
  }, []);

  // Reset conversation
  const resetChat = useCallback(() => {
    enhancedChatbotService.resetConversation();
    dispatch({ type: ENHANCED_CHATBOT_ACTIONS.RESET_CHAT });
  }, []);

  // Handle quick actions
  const handleQuickAction = useCallback((action, data = null) => {
    switch (action) {
      case 'start_booking':
        sendMessage('I want to book an appointment');
        break;
      case 'show_services':
        sendMessage('What services do you offer?');
        break;
      case 'show_info':
        sendMessage('Tell me about the hospital');
        break;
      case 'emergency_help':
        sendMessage('I need emergency help');
        break;
      case 'switch_language':
        if (data) {
          switchLanguage(data);
        }
        break;
      default:
        console.log('Unknown action:', action);
    }
  }, [sendMessage, switchLanguage]);

  // Get conversation analytics
  const getConversationAnalytics = useCallback(() => {
    return {
      ...enhancedChatbotService.getConversationAnalytics(),
      currentLanguage: state.currentLanguage,
      languagesDetected: state.detectedLanguage ? [state.detectedLanguage] : [],
      autoResponsesGenerated: state.lastAutoResponse ? 1 : 0,
      searchQueriesProcessed: state.searchResults.length,
      websiteContentItems: state.websiteContent.itemCount
    };
  }, [state]);

  const value = {
    state,
    toggleChat,
    sendMessage,
    startListening,
    stopListening,
    speakMessage,
    stopSpeaking,
    switchLanguage,
    toggleVoice,
    toggleAutoResponse,
    toggleContinuousListening,
    toggleLanguageDetection,
    searchWebsiteContent,
    resetChat,
    handleQuickAction,
    addMessage,
    getConversationAnalytics,
    
    // Enhanced features
    ghanaLanguageService,
    enhancedChatbotService,
    websiteScraperService
  };

  return (
    <EnhancedChatbotContext.Provider value={value}>
      {children}
    </EnhancedChatbotContext.Provider>
  );
}

export const useEnhancedChatbot = () => {
  const context = useContext(EnhancedChatbotContext);
  if (!context) {
    throw new Error('useEnhancedChatbot must be used within an EnhancedChatbotProvider');
  }
  return context;
};