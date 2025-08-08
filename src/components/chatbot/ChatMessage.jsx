import React from 'react';
import { Bot, User, Clock, AlertTriangle } from 'lucide-react';

export const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isError = message.role === 'error';

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Detect if message contains emergency information
  const isEmergencyMessage = (content) => {
    const emergencyIndicators = ['🚨', 'emergency', 'call 999', 'urgent', 'immediate'];
    return emergencyIndicators.some(indicator => 
      content.toLowerCase().includes(indicator.toLowerCase())
    );
  };

  // Format message content with basic markdown support
  const formatContent = (content) => {
    if (!content) return '';
    
    // Convert **bold** to <strong>
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to <em>
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert phone numbers to clickable links
    formatted = formatted.replace(/(\+?\d{3}[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{3})/g, 
      '<a href="tel:$1" class="text-blue-600 hover:underline">$1</a>');
    
    // Convert email addresses to clickable links
    formatted = formatted.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, 
      '<a href="mailto:$1" class="text-blue-600 hover:underline">$1</a>');
    
    // Convert line breaks to <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };

  if (isError) {
    return (
      <div className="flex items-start space-x-3 max-w-full">
        <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle size={16} className="text-red-600" />
        </div>
        <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="text-red-800 text-sm">
            <strong>Error:</strong> {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 max-w-full ${
      isUser ? 'flex-row-reverse space-x-reverse' : ''
    }`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-600'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block p-3 rounded-lg text-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : isEmergencyMessage(message.content)
              ? 'bg-red-50 border-l-4 border-red-500 text-red-800 rounded-bl-sm'
              : 'bg-gray-100 text-gray-800 rounded-bl-sm'
        }`}>
          <div 
            dangerouslySetInnerHTML={{ 
              __html: formatContent(message.content) 
            }}
            className="whitespace-pre-wrap break-words"
          />
        </div>
        
        {/* Timestamp */}
        {message.createdAt && (
          <div className={`flex items-center mt-1 text-xs text-gray-500 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}>
            <Clock size={12} className="mr-1" />
            {formatTime(message.createdAt)}
          </div>
        )}
      </div>
    </div>
  );
};