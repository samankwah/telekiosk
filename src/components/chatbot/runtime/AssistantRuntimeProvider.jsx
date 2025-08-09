import React, { useMemo } from 'react';
import { AssistantRuntimeProvider as BaseAssistantRuntimeProvider, useLocalRuntime } from '@assistant-ui/react';
import { useChat } from 'ai/react';
import { HEALTHCARE_SYSTEM_PROMPT, CONVERSATION_STARTERS } from '../HealthcarePrompts.js';
import { analyticsService } from '../../../services/analyticsService.js';

/**
 * Assistant Runtime Provider for TeleKiosk AI Chatbot
 * Integrates with OpenAI API following the implementation plan
 */
export const AssistantRuntimeProvider = ({ children }) => {
  console.log('🤖 AssistantRuntimeProvider: Initializing...');
  
  // Create local runtime configuration
  const runtime = useLocalRuntime({
    initialMessages: [
      {
        role: 'system',
        content: HEALTHCARE_SYSTEM_PROMPT
      },
      {
        role: 'assistant',
        content: CONVERSATION_STARTERS[0]
      }
    ],
    adapters: {
      chat: async ({ messages }) => {
        const startTime = Date.now();
        
        try {
          console.log('🤖 Sending chat request with', messages.length, 'messages');
          
          const response = await fetch('http://localhost:3003/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Client': 'assistant-ui'
            },
            body: JSON.stringify({
              messages: messages.filter(msg => msg.role !== 'system'),
              model: 'gpt-4o',
              temperature: 0.3,
              max_tokens: 2000,
              client_type: 'assistant-ui'
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const result = await response.json();
          const responseTime = Date.now() - startTime;
          
          let content = result.message || result.content || result.response || 'Sorry, I encountered an issue. Please try again.';
          
          // Add speech synthesis for assistant responses
          if ('speechSynthesis' in window && content) {
            const utterance = new SpeechSynthesisUtterance(content);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 0.7;
            
            // Speak the response (optional - user can disable)
            if (window.localStorage.getItem('telekiosk_voice_responses') !== 'disabled') {
              speechSynthesis.speak(utterance);
            }
          }

          analyticsService.trackEvent('assistant_ui_interaction', {
            messageCount: messages.length,
            responseTime,
            contentLength: content.length,
            success: true
          });

          console.log('✅ Assistant response processed:', { 
            length: content.length, 
            responseTime: `${responseTime}ms`
          });
          
          return {
            role: 'assistant',
            content: content
          };
          
        } catch (error) {
          const responseTime = Date.now() - startTime;
          
          console.error('❌ Assistant-UI Chat API error:', error);
          
          analyticsService.trackEvent('assistant_ui_error', {
            errorMessage: error.message,
            messageCount: messages.length,
            responseTime,
            success: false
          });

          return {
            role: 'assistant',
            content: `I apologize, but I'm having trouble connecting right now. Please try again in a moment.\n\n🏥 For immediate assistance, please call +233-599-211-311 or speak with any hospital staff member.`
          };
        }
      }
    }
  });
  
  console.log('🤖 AssistantRuntimeProvider: Runtime created:', runtime);

  return (
    <BaseAssistantRuntimeProvider runtime={runtime}>
      {children}
    </BaseAssistantRuntimeProvider>
  );
};