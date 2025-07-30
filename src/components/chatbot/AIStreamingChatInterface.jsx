// AI Streaming Chat Interface
// Provides real-time streaming responses from AI models

import { useState, useRef, useEffect } from 'react';
import { useEnhancedChatbot } from '../../contexts/EnhancedChatbotContext';
import { advancedAIRouter } from '../../services/advancedAIRouter';
import EnhancedChatMessage from './EnhancedChatMessage';

function AIStreamingChatInterface() {
  const { state, addMessage, clearMessages } = useEnhancedChatbot();
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, streamingMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim() || isStreaming) return;
    
    // Add user message
    addMessage(inputText, 'user', 'streaming');
    const userInput = inputText;
    setInputText('');
    setIsStreaming(true);
    setStreamingMessage('');
    
    // Create abort controller for streaming
    abortControllerRef.current = new AbortController();
    const streamingId = Date.now().toString();
    setStreamingMessageId(streamingId);
    
    try {
      // Start streaming response
      await streamAIResponse(userInput, streamingId);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('❌ Streaming error:', error);
        addMessage(
          'Sorry, I encountered an error. Please try again.',
          'bot',
          'error'
        );
      }
    } finally {
      setIsStreaming(false);
      setStreamingMessage('');
      setStreamingMessageId(null);
      abortControllerRef.current = null;
    }
  };

  const streamAIResponse = async (input, streamingId) => {
    try {
      // Route request to appropriate AI model with streaming
      const streamResponse = await advancedAIRouter.routeStreamingRequest(input, {
        intent: 'general_chat',
        language: state.selectedLanguage || 'en-GH',
        priority: 'speed', // Prioritize speed for streaming
        abortSignal: abortControllerRef.current?.signal
      });

      if (!streamResponse.success) {
        throw new Error(streamResponse.error || 'Streaming failed');
      }

      let fullResponse = '';
      
      // Handle streaming response
      if (streamResponse.stream) {
        const reader = streamResponse.stream.getReader();
        const decoder = new TextDecoder();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            // Check if streaming was aborted
            if (abortControllerRef.current?.signal.aborted) {
              break;
            }
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                  break;
                }
                
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || 
                                parsed.delta?.text || 
                                parsed.text || '';
                  
                  if (content) {
                    fullResponse += content;
                    setStreamingMessage(fullResponse);
                  }
                } catch (parseError) {
                  // Skip invalid JSON chunks
                  console.warn('Invalid JSON chunk:', data);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      }
      
      // Add final message to chat history
      if (fullResponse && !abortControllerRef.current?.signal.aborted) {
        addMessage(fullResponse, 'bot', 'streaming', {
          aiModel: streamResponse.model,
          streamingComplete: true
        });
      }
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error;
      }
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome message */}
        {state.messages.length === 0 && !isStreaming && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              AI Streaming Chat
            </h3>
            <p className="text-gray-600 text-sm">
              Get real-time responses from advanced AI models
            </p>
            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
              <span>🚀 Fast Responses</span>
              <span>🤖 Multiple AI Models</span>
              <span>⏹️ Stoppable Streaming</span>
            </div>
          </div>
        )}

        {/* Messages */}
        {state.messages.map((message, index) => (
          <EnhancedChatMessage
            key={index}
            message={message}
            index={index}
          />
        ))}

        {/* Streaming message */}
        {isStreaming && streamingMessage && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
              </svg>
            </div>
            <div className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">TeleKiosk AI</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Streaming...</span>
                  </div>
                </div>
                <button
                  onClick={stopStreaming}
                  className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors duration-200"
                  title="Stop streaming"
                >
                  ⏹️ Stop
                </button>
              </div>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap">{streamingMessage}</div>
                <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1"></span>
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator for initial streaming */}
        {isStreaming && !streamingMessage && (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-sm">Starting AI stream...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Text Input */}
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything for a streaming AI response..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                disabled={isStreaming}
              />
            </div>
            
            <button
              type="submit"
              disabled={isStreaming || !inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-lg transition-colors duration-200"
            >
              {isStreaming ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                </svg>
              )}
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Clear Messages */}
              {state.messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearMessages}
                  disabled={isStreaming}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  title="Clear conversation"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                  </svg>
                </button>
              )}
            </div>

            <div className="text-xs text-gray-500">
              {isStreaming ? (
                <span className="text-green-600">⚡ Streaming active</span>
              ) : (
                <span>Press Enter to send • Shift+Enter for new line</span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AIStreamingChatInterface;