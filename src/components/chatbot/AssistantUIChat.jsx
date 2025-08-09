import React, { Suspense, useState, Component } from 'react';
import { ChatInterface } from './ChatInterface';
import { EmergencyDetection } from './EmergencyDetection';

/**
 * Proper Error Boundary class component
 */
class ChatErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chat Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full max-h-[600px] w-full bg-white rounded-lg shadow-lg p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <div className="text-gray-600">
              Chat temporarily unavailable. Please refresh or contact support.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Loading fallback for Assistant-UI
 */
const ChatLoadingFallback = () => (
  <div className="h-full max-h-[600px] w-full bg-white rounded-lg shadow-lg p-4 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <div className="text-gray-600">Loading chat...</div>
    </div>
  </div>
);

/**
 * Clean Chat component that works properly without showing JSON
 */
const CleanChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m the TeleKiosk Assistant. How can I help you today? I can assist with appointment booking, hospital information, or answer general health questions.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emergencyDetected, setEmergencyDetected] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3003/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Extract ONLY the message content, no JSON data
      const assistantMessage = { 
        role: 'assistant', 
        content: result.message || result.content || 'I apologize, but I encountered an error.'
      };
      
      setMessages([...newMessages, assistantMessage]);
      
    } catch (err) {
      console.error('❌ Chat error:', err);
      setError(err);
      const errorMessage = { 
        role: 'assistant', 
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment, or speak with a hospital staff member for immediate assistance.' 
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyDetected = (emergency) => {
    setEmergencyDetected(emergency);
  };

  return (
    <>
      {emergencyDetected && (
        <EmergencyDetection 
          message={emergencyDetected}
          onEmergencyDetected={handleEmergencyDetected}
        />
      )}
      <ChatInterface
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        onEmergencyDetected={handleEmergencyDetected}
      />
    </>
  );
};

/**
 * Clean chat component that properly handles JSON responses
 * Fixed to show only message content, no raw JSON
 */
export const AssistantUIChat = () => {
  return (
    <ChatErrorBoundary>
      <Suspense fallback={<ChatLoadingFallback />}>
        <div className="h-full max-h-[600px] w-full bg-white">
          <CleanChat />
        </div>
      </Suspense>
    </ChatErrorBoundary>
  );
};