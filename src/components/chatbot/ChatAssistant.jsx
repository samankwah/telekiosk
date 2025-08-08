import React, { useState, useCallback, useEffect } from 'react';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { useChat } from 'ai/react';
import { ChatInterface } from './ChatInterface';
import { EmergencyDetection } from './EmergencyDetection';
import { LanguageSelector } from './LanguageSelector';
import { RealtimeVoiceChat } from './RealtimeVoiceChat';
import { analyticsService } from '../../services/analyticsService';
import { multilingualService } from '../../services/multilingualService';
import { chatbotPerformanceService } from '../../services/chatbotPerformanceService';
import { HEALTHCARE_SYSTEM_PROMPT } from './HealthcarePrompts';

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [emergencyDetected, setEmergencyDetected] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isRealtimeVoiceEnabled, setIsRealtimeVoiceEnabled] = useState(false);
  const [realtimeVoiceAvailable, setRealtimeVoiceAvailable] = useState(false); // Start disabled, enable if auth succeeds
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: multilingualService.getGreeting(),
      createdAt: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Detect language from user input
    const detection = multilingualService.detectLanguage(input.trim());
    if (detection.confidence > 0.7 && detection.language !== currentLanguage) {
      // Auto-suggest language change
      console.log('🌍 Language detected:', detection.language, 'confidence:', detection.confidence);
    }

    const userMessage = {
      role: 'user',
      content: input.trim(),
      createdAt: new Date(),
      language: detection.language
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Get current language system prompt
      const systemPrompt = multilingualService.getSystemPrompt(currentLanguage);
      const messagesWithSystem = [
        { role: 'system', content: systemPrompt },
        ...messages.filter(msg => msg.role !== 'system'),
        userMessage
      ];

      // Optimize request for better performance
      const optimization = await chatbotPerformanceService.optimizeChatRequest(
        messagesWithSystem,
        { 
          language: currentLanguage,
          allowFunctions: true,
          urgent: emergencyDetected?.severity === 'critical'
        }
      );

      // Check if we got a cached/templated response
      if (optimization?.cached || optimization?.templated) {
        const assistantMessage = {
          role: 'assistant',
          content: optimization.response,
          createdAt: new Date(),
          language: currentLanguage,
          cached: optimization.cached,
          templated: optimization.templated
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        analyticsService.trackAIModelUsage('gpt-4o', {
          requestType: 'optimized',
          success: true,
          responseLength: optimization.response.length,
          responseTime: optimization.responseTime,
          cached: optimization.cached,
          templated: optimization.templated
        });
        
        setIsLoading(false);
        return;
      }

      // Use optimized messages if available
      const finalMessages = optimization?.messages || messagesWithSystem;
      const finalOptions = optimization?.options || { allowFunctions: true, language: currentLanguage };

      // Call the API endpoint
      const response = await fetch('http://localhost:3004/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: finalMessages,
          ...finalOptions
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.message) {
        const assistantMessage = {
          role: 'assistant',
          content: result.message,
          createdAt: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        analyticsService.trackAIModelUsage('gpt-4o', {
          requestType: 'text',
          success: true,
          responseLength: result.message.length,
          responseTime: result.responseTime
        });
      } else {
        throw new Error(result.error || 'No response received');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message);
      analyticsService.trackError(err, { component: 'ChatAssistant' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle emergency detection
  const handleEmergencyDetected = useCallback((emergency) => {
    setEmergencyDetected(emergency);
    analyticsService.trackEmergencyDetection({
      severity: emergency.severity,
      keyword: emergency.keyword,
      detectionMethod: 'text'
    });
  }, []);

  // Handle language change
  const handleLanguageChange = useCallback((languageCode) => {
    setCurrentLanguage(languageCode);
    
    // Update welcome message in new language
    const greeting = multilingualService.getGreeting(languageCode);
    setMessages(prev => [
      {
        role: 'assistant',
        content: greeting,
        createdAt: new Date(),
        language: languageCode
      },
      ...prev.slice(1) // Keep other messages
    ]);

    analyticsService.trackEvent('chatbot_language_change', {
      newLanguage: languageCode,
      timestamp: Date.now()
    });
  }, []);

  // Handle realtime voice transcription
  const handleVoiceTranscription = useCallback((transcript) => {
    setInput(transcript);
  }, []);

  // Handle realtime voice response
  const handleVoiceResponse = useCallback((response) => {
    const assistantMessage = {
      role: 'assistant',
      content: response,
      createdAt: new Date(),
      language: currentLanguage,
      source: 'voice'
    };
    
    setMessages(prev => [...prev, assistantMessage]);
  }, [currentLanguage]);

  // Handle realtime voice unavailable (authentication issues)
  const handleRealtimeVoiceUnavailable = useCallback(() => {
    setRealtimeVoiceAvailable(false);
    setIsRealtimeVoiceEnabled(false);
  }, []);

  // Handle realtime voice available (authentication succeeds)
  const handleRealtimeVoiceAvailable = useCallback(() => {
    setRealtimeVoiceAvailable(true);
  }, []);

  // Track chat interactions and initialize performance service
  useEffect(() => {
    if (isOpen) {
      analyticsService.trackEvent('chatbot_opened', {
        timestamp: Date.now(),
        previousState: 'closed'
      });
      
      // Pre-warm cache for better performance
      chatbotPerformanceService.preWarmCache();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    analyticsService.trackEvent('chatbot_closed', {
      timestamp: Date.now(),
      sessionLength: Date.now() - (messages[0]?.createdAt || Date.now())
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Open TeleKiosk Assistant"
        >
          <MessageCircle size={24} />
        </button>
        <div className="absolute -top-12 right-0 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat with TeleKiosk Assistant
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-lg shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-12' : 'w-96 h-[600px]'
      }`}>
        {/* Chat Header */}
        <div className="bg-blue-600 text-white rounded-t-lg">
          {/* Main Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <h3 className="font-semibold">TeleKiosk Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={minimizeChat}
                className="p-1 hover:bg-blue-700 rounded"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={closeChat}
                className="p-1 hover:bg-blue-700 rounded"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Language & Voice Controls */}
          {!isMinimized && (
            <div className="px-4 pb-3 border-t border-blue-500">
              <div className="flex items-center justify-between">
                <LanguageSelector 
                  onLanguageChange={handleLanguageChange}
                  className="transform scale-90 origin-left"
                />
                <div className="flex items-center space-x-2">
                  {realtimeVoiceAvailable && (
                    <button
                      onClick={() => setIsRealtimeVoiceEnabled(!isRealtimeVoiceEnabled)}
                      className={`px-2 py-1 text-xs rounded ${
                        isRealtimeVoiceEnabled 
                          ? 'bg-blue-800 text-white' 
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                      title="Toggle realtime voice chat"
                    >
                      {isRealtimeVoiceEnabled ? '🎤 Voice On' : '🎤 Voice Off'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Content */}
        {!isMinimized && (
          <div className="flex flex-col h-[calc(600px-120px)]">
            {/* Emergency Alert */}
            {emergencyDetected && (
              <EmergencyDetection 
                emergency={emergencyDetected} 
                onDismiss={() => setEmergencyDetected(null)}
              />
            )}

            {/* Realtime Voice Chat */}
            {isRealtimeVoiceEnabled && realtimeVoiceAvailable && (
              <div className="p-3 bg-gray-50 border-b">
                <RealtimeVoiceChat
                  onTranscription={handleVoiceTranscription}
                  onResponse={handleVoiceResponse}
                  onUnavailable={handleRealtimeVoiceUnavailable}
                  onAvailable={handleRealtimeVoiceAvailable}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Chat Interface */}
            <div className="flex-1 overflow-hidden">
              <ChatInterface
                messages={messages}
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
                onEmergencyDetected={handleEmergencyDetected}
                currentLanguage={currentLanguage}
                isRealtimeVoiceEnabled={isRealtimeVoiceEnabled}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};