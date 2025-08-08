import React, { useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { VoiceIntegration } from './VoiceIntegration';
import { enhancedEmergencyService } from '../../services/enhancedEmergencyService';
import { EMERGENCY_KEYWORDS } from './HealthcarePrompts';

export const ChatInterface = ({ 
  messages, 
  input, 
  handleInputChange, 
  handleSubmit, 
  isLoading,
  error,
  onEmergencyDetected,
  currentLanguage = 'en',
  isRealtimeVoiceEnabled = false
}) => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Enhanced emergency detection using ML-based analysis
  const checkForEmergency = (text) => {
    try {
      // Update context with message history
      enhancedEmergencyService.updateContext(
        { content: text },
        messages.slice(-5) // Last 5 messages for context
      );

      // Perform enhanced analysis
      const analysis = enhancedEmergencyService.analyzeEmergency(text, {
        currentLanguage,
        previousMessages: messages.slice(-3),
        timestamp: Date.now()
      });

      // Return compatible format
      if (analysis.detected) {
        return {
          detected: true,
          severity: analysis.severity,
          keyword: analysis.detectedSymptoms[0]?.symptom || 'unknown',
          confidence: analysis.confidence,
          score: analysis.score,
          recommendations: analysis.recommendations,
          emergencyMessage: analysis.emergencyMessage,
          analysisTime: analysis.analysisTime,
          language: analysis.language,
          enhanced: true // Mark as enhanced detection
        };
      }

      return { detected: false };

    } catch (error) {
      console.error('❌ Enhanced emergency detection failed:', error);
      
      // Fallback to basic detection
      const lowerText = text.toLowerCase();
      for (const [severity, keywords] of Object.entries(EMERGENCY_KEYWORDS)) {
        for (const keyword of keywords) {
          if (lowerText.includes(keyword)) {
            return { severity, keyword, detected: true, enhanced: false };
          }
        }
      }
      return { detected: false };
    }
  };

  // Enhanced submit handler with emergency detection
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Check for emergency before submitting
    const emergency = checkForEmergency(input);
    if (emergency.detected && emergency.severity === 'high') {
      onEmergencyDetected?.(emergency);
    }
    
    handleSubmit(e);
  };

  // Handle voice transcription
  const handleVoiceTranscription = (transcript) => {
    handleInputChange({ target: { value: transcript } });
    
    // Check for emergency in voice input
    const emergency = checkForEmergency(transcript);
    if (emergency.detected && emergency.severity === 'high') {
      onEmergencyDetected?.(emergency);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {messages
          .filter(message => message.role !== 'system')
          .map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="animate-spin" size={16} />
            <span className="text-sm">TeleKiosk Assistant is thinking...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            <strong>Connection Error:</strong> Unable to reach the assistant. Please try again.
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-gray-50 p-4">
        <form onSubmit={handleFormSubmit} className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything about the hospital..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleFormSubmit(e);
                }
              }}
              disabled={isLoading}
            />
          </div>
          
          {/* Voice Integration - only show if realtime voice is not enabled */}
          {!isRealtimeVoiceEnabled && (
            <VoiceIntegration onTranscription={handleVoiceTranscription} />
          )}
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => handleInputChange({ target: { value: 'I want to book an appointment' } })}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
            disabled={isLoading}
          >
            Book Appointment
          </button>
          <button
            onClick={() => handleInputChange({ target: { value: 'What services do you offer?' } })}
            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors duration-200"
            disabled={isLoading}
          >
            Services
          </button>
          <button
            onClick={() => handleInputChange({ target: { value: 'Hospital contact information' } })}
            className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors duration-200"
            disabled={isLoading}
          >
            Contact Info
          </button>
        </div>
      </div>
    </div>
  );
};