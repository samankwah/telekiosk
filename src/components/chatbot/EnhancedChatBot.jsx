import { useState } from 'react';
import { useEnhancedChatbot } from '../../contexts/EnhancedChatbotContext';
import EnhancedChatInterface from './EnhancedChatInterface';
import EnhancedVoiceButton from './EnhancedVoiceButton';
import LanguageSelector from './LanguageSelector';

function EnhancedChatBot() {
  const { state, toggleChat } = useEnhancedChatbot();
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

  const getStatusIcon = () => {
    if (state.isListening) {
      return (
        <div className="w-6 h-6 relative">
          <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse"></div>
          <svg className="w-6 h-6 relative z-10" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 10V12C19 15.9 15.9 19 12 19S5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17S17 14.8 17 12V10H19Z"/>
          </svg>
        </div>
      );
    } else if (state.isSpeaking) {
      return (
        <div className="w-6 h-6 relative">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse"></div>
          <svg className="w-6 h-6 relative z-10" fill="white" viewBox="0 0 24 24">
            <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
          </svg>
        </div>
      );
    } else if (state.autoResponseEnabled) {
      return (
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {/* Ghana flag indicator */}
          <div className="absolute -top-1 -right-1 text-xs">🇬🇭</div>
          {/* Auto-response indicator */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      );
    } else {
      return (
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {/* Ghana flag indicator */}
          <div className="absolute -top-1 -right-1 text-xs">🇬🇭</div>
        </div>
      );
    }
  };

  const getTooltipText = () => {
    if (state.isListening) {
      return 'Listening... (Speak now)';
    } else if (state.isSpeaking) {
      return 'Speaking...';
    } else if (state.autoResponseEnabled) {
      return 'Ghana AI Assistant - Auto-response enabled';
    } else {
      return 'Ghana AI Assistant - Ask me anything!';
    }
  };

  return (
    <>
      {/* Enhanced Chat Button */}
      {!state.isOpen && (
        <button
          onClick={handleToggle}
          className="fixed bottom-8 left-8 z-50 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 group"
          aria-label="Open Ghana AI assistant"
        >
          <div className="flex items-center justify-center">
            {getStatusIcon()}
          </div>
          
          {/* Enhanced Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap max-w-xs">
            <div className="text-center">
              <div className="font-semibold">{getTooltipText()}</div>
              <div className="text-xs text-gray-300 mt-1">
                🇬🇭 English • Twi • Ewe • Ga • More
              </div>
              {state.contentIndexed && (
                <div className="text-xs text-green-300 mt-1">
                  ✓ Website content indexed ({state.websiteContent.itemCount} items)
                </div>
              )}
            </div>
          </div>
        </button>
      )}

      {/* Enhanced Chat Window */}
      {state.isOpen && (
        <div className={`fixed z-50 transition-all duration-300 ${
          isMinimized 
            ? 'bottom-4 left-4 w-80 h-16' 
            : 'bottom-4 left-4 w-96 h-[600px] max-h-[80vh]'
        }`}>
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-lg">🇬🇭</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">TeleKiosk Ghana AI</h3>
                  <div className="flex items-center space-x-2 text-xs text-blue-100">
                    <span>
                      {state.isListening ? 'Listening...' : 
                       state.isSpeaking ? 'Speaking...' : 
                       state.isTyping ? 'Thinking...' : 
                       state.currentLanguage === 'en-GH' ? 'English (Ghana)' :
                       state.currentLanguage === 'tw-GH' ? 'Twi' :
                       state.currentLanguage === 'ee-GH' ? 'Ewe' :
                       state.currentLanguage === 'ga-GH' ? 'Ga' : 'Online'}
                    </span>
                    {state.autoResponseEnabled && (
                      <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" title="Auto-response enabled"></div>
                    )}
                    {state.continuousListening && (
                      <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" title="Continuous listening"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Language Selector */}
                {!isMinimized && <LanguageSelector />}
                
                {/* Enhanced Voice Button */}
                <EnhancedVoiceButton />
                
                {/* Settings Menu */}
                {!isMinimized && (
                  <div className="relative">
                    <button
                      className="text-blue-100 hover:text-white transition-colors p-1 rounded"
                      aria-label="Settings"
                      title="Chatbot settings"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                )}
                
                {/* Minimize/Restore button */}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-blue-100 hover:text-white transition-colors p-1 rounded"
                  aria-label={isMinimized ? 'Restore chat' : 'Minimize chat'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="text-blue-100 hover:text-white transition-colors p-1 rounded"
                  aria-label="Close chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Enhanced Chat Interface */}
            {!isMinimized && (
              <div className="flex-1 flex flex-col min-h-0">
                <EnhancedChatInterface />
              </div>
            )}

            {/* Enhanced Status Bar */}
            {!isMinimized && (
              <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>AI Online</span>
                    </span>
                    
                    {state.contentIndexed && (
                      <span className="flex items-center space-x-1" title="Website content indexed">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>{state.websiteContent.itemCount} items indexed</span>
                      </span>
                    )}
                    
                    {state.voiceSupported.speechRecognition && (
                      <span className="flex items-center space-x-1" title="Voice recognition available">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Voice ready</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {state.autoResponseEnabled && (
                      <div className="flex items-center space-x-1 text-blue-600" title="Auto-response enabled">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Auto</span>
                      </div>
                    )}
                    
                    {state.languageDetectionEnabled && (
                      <div className="flex items-center space-x-1 text-green-600" title="Language detection enabled">
                        <span>🌐</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Error Display */}
            {state.error && (
              <div className="bg-red-50 border-t border-red-200 p-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                  </svg>
                  <span className="text-sm text-red-800">{state.error}</span>
                  <button
                    onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
                    className="ml-auto text-red-600 hover:text-red-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default EnhancedChatBot;