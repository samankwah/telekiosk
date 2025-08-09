import React, { useState } from 'react';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { AssistantUIChat } from './AssistantUIChat';

/**
 * Main Chat Assistant component with Assistant-UI integration
 * Following Phase 1 implementation plan for basic chat interface
 */
export const ChatAssistantUI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

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
        <div className="absolute -top-12 right-0 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
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
        </div>

        {/* Chat Content with Assistant-UI */}
        {!isMinimized && (
          <div className="h-[calc(600px-64px)]">
            <AssistantUIChat />
          </div>
        )}
      </div>
    </div>
  );
};