import { useState } from 'react';
import { useChatbot } from '../../contexts/ChatbotContext';
import { useNavigate } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import VoiceButton from './VoiceButton';

function ChatBot() {
  const { state, toggleChat } = useChatbot();
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleToggle = () => {
    if (state.isOpen && !isMinimized) {
      setIsMinimized(true);
    } else if (state.isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      toggleChat();
      setIsMinimized(false);
    }
  };

  const handleClose = () => {
    toggleChat();
    setIsMinimized(false);
  };

  return (
    <>
      {/* Chat Button - Floating button to open chat */}
      {!state.isOpen && (
        <button
          onClick={handleToggle}
          className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-50 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 active:scale-105 group touch-manipulation"
          aria-label="Open virtual assistant"
        >
          <div className="flex items-center justify-center">
            {state.isListening ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6 relative">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse"></div>
                <svg className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" fill="white" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 10V12C19 15.9 15.9 19 12 19S5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17S17 14.8 17 12V10H19Z"/>
                </svg>
              </div>
            ) : state.isSpeaking ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6 relative">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse"></div>
                <svg className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" fill="white" viewBox="0 0 24 24">
                  <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                </svg>
              </div>
            ) : (
              <div className="relative">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {/* Notification badge for new features */}
                <div className="absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">!</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Tooltip - hidden on mobile */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 sm:px-3 py-1 bg-gray-800 text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
            {state.isListening ? 'Listening...' : state.isSpeaking ? 'Speaking...' : 'Ask me anything!'}
          </div>
        </button>
      )}

      {/* Chat Window */}
      {state.isOpen && (
        <div className={`fixed z-50 transition-all duration-300 ${
          isMinimized 
            ? 'bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-auto w-auto sm:w-80 h-16' 
            : 'bottom-2 left-2 right-2 top-2 sm:bottom-4 sm:left-4 sm:right-auto sm:top-auto sm:w-96 sm:h-[600px] sm:max-h-[80vh]'
        }`}>
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 text-white p-3 sm:p-4 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 10V12C19 15.9 15.9 19 12 19S5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17S17 14.8 17 12V10H19Z"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-xs sm:text-sm truncate">TeleKiosk Assistant</h3>
                  <p className="text-xs text-blue-100 truncate">
                    {state.isListening ? 'Listening...' : 
                     state.isSpeaking ? 'Speaking...' : 
                     state.isTyping ? 'Typing...' : 'Online'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <VoiceButton />
                
                {/* Minimize/Restore button - hidden on mobile in minimized state */}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className={`text-blue-100 hover:text-white transition-colors p-1 rounded touch-manipulation ${isMinimized ? 'hidden sm:block' : ''}`}
                  aria-label={isMinimized ? 'Restore chat' : 'Minimize chat'}
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMinimized ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    )}
                  </svg>
                </button>
                
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="text-blue-100 hover:text-white transition-colors p-1 rounded touch-manipulation"
                  aria-label="Close chat"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat Interface - only show when not minimized */}
            {!isMinimized && (
              <div className="flex-1 flex flex-col min-h-0">
                <ChatInterface navigate={navigate} />
              </div>
            )}

            {/* Error Display */}
            {state.error && (
              <div className="bg-red-50 border-t border-red-200 p-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                  </svg>
                  <span className="text-sm text-red-800">{state.error}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;