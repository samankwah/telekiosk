import React, { useMemo } from 'react';
import { AssistantRuntimeProvider as BaseAssistantRuntimeProvider, useLocalRuntime } from '@assistant-ui/react';
import { HEALTHCARE_SYSTEM_PROMPT } from '../HealthcarePrompts';

/**
 * Assistant Runtime Provider for TeleKiosk AI Chatbot
 * Integrates with OpenAI API following the implementation plan
 */
export const AssistantRuntimeProvider = ({ children }) => {
  // Memoize the runtime configuration to prevent unnecessary re-renders
  const runtimeConfig = useMemo(() => ({
    initialMessages: [
      {
        role: 'system',
        content: HEALTHCARE_SYSTEM_PROMPT
      },
      {
        role: 'assistant',
        content: 'Hello! I\'m the TeleKiosk Assistant. How can I help you today? I can assist with appointment booking, hospital information, or answer general health questions.',
      },
    ],
    adapters: {
      chat: async ({ messages }) => {
        try {
          // Call our chat API endpoint
          const response = await fetch(`http://localhost:3003/api/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: messages,
              model: import.meta.env.VITE_AI_MODEL || 'gpt-4o',
              temperature: parseFloat(import.meta.env.VITE_AI_TEMPERATURE) || 0.3,
              max_tokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS) || 2000,
              healthcare_mode: import.meta.env.VITE_HEALTHCARE_MODE === 'true',
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.error) {
            throw new Error(result.error);
          }

          // Extract just the message content from the JSON response
          const content = result.message || result.content || 'I apologize, but I encountered an error processing your request.';
          
          console.log('🔄 Assistant-UI parsed response:', { content: content.slice(0, 100) + '...' });
          
          return {
            role: 'assistant',
            content: String(content),
          };
        } catch (error) {
          console.error('Chat API error:', error);
          return {
            role: 'assistant',
            content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment, or speak with a hospital staff member for immediate assistance.',
          };
        }
      },
    }
  }), []);

  const runtime = useLocalRuntime(runtimeConfig);

  return (
    <BaseAssistantRuntimeProvider runtime={runtime}>
      {children}
    </BaseAssistantRuntimeProvider>
  );
};