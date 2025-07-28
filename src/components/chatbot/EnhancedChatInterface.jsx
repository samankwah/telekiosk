import { useState, useRef, useEffect } from 'react';
import { useEnhancedChatbot } from '../../contexts/EnhancedChatbotContext';
import EnhancedChatMessage from './EnhancedChatMessage';
import { QUICK_ACTIONS } from './ChatKnowledgeBase';

function EnhancedChatInterface() {
  const { 
    state, 
    sendMessage, 
    startListening, 
    handleQuickAction,
    resetChat,
    searchWebsiteContent,
    switchLanguage
  } = useEnhancedChatbot();
  
  const [inputText, setInputText] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (state.isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !state.isTyping) {
      sendMessage(inputText.trim());
      setInputText('');
      setShowQuickActions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickActionClick = (action) => {
    handleQuickAction(action.text.toLowerCase().replace(' ', '_'));
    setShowQuickActions(false);
  };

  const handleVoiceInput = () => {
    startListening();
  };

  const handleSearchContent = async () => {
    if (inputText.trim()) {
      const results = await searchWebsiteContent(inputText.trim());
      setShowSearchResults(results.length > 0);
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  // Enhanced quick actions for Ghana
  const ghanaQuickActions = [
    { text: "Book Appointment", intent: "booking", icon: "📅" },
    { text: "Our Services", intent: "services", icon: "🏥" },
    { text: "Hospital Info", intent: "hospital_info", icon: "ℹ️" },
    { text: "Emergency Help", intent: "emergency", icon: "🚨" },
    { text: "Speak Twi", intent: "language", icon: "🇬🇭", action: () => switchLanguage('tw-GH') },
    { text: "Speak Ewe", intent: "language", icon: "🇬🇭", action: () => switchLanguage('ee-GH') }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {state.messages.map((message) => (
          <EnhancedChatMessage 
            key={message.id} 
            message={message} 
            onQuickAction={handleQuickAction}
            currentLanguage={state.currentLanguage}
          />
        ))}
        
        {/* Enhanced Typing Indicator */}
        {state.isTyping && (
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
              <span className="text-sm">🇬🇭</span>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500">
                  {state.contentIndexed ? 'Searching website...' : 'Thinking...'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Quick Actions */}
        {showQuickActions && state.messages.length <= 1 && (
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">🇬🇭 Welcome to TeleKiosk Ghana!</p>
              <p className="text-xs text-gray-500 mb-3">
                I can help you in English, Twi, Ewe, Ga, and more Ghanaian languages
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ghanaQuickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => action.action ? action.action() : handleQuickActionClick(action)}
                  className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <span className="text-lg">{action.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{action.text}</span>
                </button>
              ))}
            </div>
            
            {/* Feature highlights */}
            <div className="bg-blue-50 rounded-lg p-3 mt-3">
              <div className="text-xs text-blue-800 space-y-1">
                <div className="font-semibold mb-2">✨ Enhanced Features:</div>
                <div>🎤 Voice recognition in multiple Ghana languages</div>
                <div>🤖 Auto-response for natural conversation</div>
                <div>🔍 Real-time website content search</div>
                <div>🌍 Language auto-detection</div>
              </div>
            </div>
          </div>
        )}

        {/* Voice Listening Indicator */}
        {state.isListening && (
          <div className="flex justify-center">
            <div className="bg-red-100 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="text-center">
                <span className="text-red-700 font-medium">🎤 Listening...</span>
                <div className="text-xs text-red-600 mt-1">
                  Speak in {state.currentLanguage === 'en-GH' ? 'English' : 
                            state.currentLanguage === 'tw-GH' ? 'Twi' : 
                            state.currentLanguage === 'ee-GH' ? 'Ewe' : 
                            state.currentLanguage === 'ga-GH' ? 'Ga' : 'any language'}
                </div>
              </div>
              <svg className="w-5 h-5 text-red-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 10V12C19 15.9 15.9 19 12 19S5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17S17 14.8 17 12V10H19Z"/>
              </svg>
            </div>
          </div>
        )}

        {/* Search Results Preview */}
        {showSearchResults && state.searchResults.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm font-medium text-blue-800 mb-2">
              🔍 Found {state.searchResults.length} relevant results:
            </div>
            <div className="space-y-1">
              {state.searchResults.slice(0, 3).map((result, index) => (
                <div key={index} className="text-xs text-blue-700">
                  • {result.title} ({Math.round(result.relevanceScore * 100)}% match)
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                state.isListening ? "Listening..." : 
                state.currentLanguage === 'tw-GH' ? "Twerɛ wo nkrasɛm anaa klik microphone..." :
                state.currentLanguage === 'ee-GH' ? "Ŋlɔ wò gbedeasi alo zi microphone..." :
                state.currentLanguage === 'ga-GH' ? "Ŋlɔ wo kwei alo klik microphone..." :
                "Type your message or click the microphone..."
              }
              className="w-full p-3 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={state.isListening || state.isTyping}
            />
            
            {/* Enhanced Controls */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {/* Search Button */}
              {inputText.trim() && !state.isListening && (
                <button
                  type="button"
                  onClick={handleSearchContent}
                  className="p-1.5 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                  aria-label="Search website content"
                  title="Search our website"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}

              {/* Voice Input Button */}
              {state.voiceSupported.speechRecognition && state.voiceEnabled && (
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  disabled={state.isListening || state.isTyping}
                  className={`p-1.5 rounded-full transition-colors ${
                    state.isListening 
                      ? 'bg-red-100 text-red-600' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Voice input"
                  title={state.autoResponseEnabled ? "Voice input with auto-response" : "Voice input"}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 10V12C19 15.9 15.9 19 12 19S5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17S17 14.8 17 12V10H19Z"/>
                  </svg>
                  {state.autoResponseEnabled && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!inputText.trim() || state.isTyping || state.isListening}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Send message"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>

        {/* Enhanced Help Text */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          {state.voiceSupported.speechRecognition && state.voiceEnabled ? (
            <div className="flex items-center justify-center space-x-4">
              <span>🇬🇭 Type or speak in Ghana languages</span>
              {state.autoResponseEnabled && (
                <span className="text-blue-600">• Auto-response enabled</span>
              )}
              {state.languageDetectionEnabled && (
                <span className="text-green-600">• Auto-detect language</span>
              )}
            </div>
          ) : (
            "Type your message and press Enter to send."
          )}
        </div>

        {/* Reset Chat Button */}
        {state.messages.length > 2 && (
          <div className="mt-2 text-center">
            <button
              onClick={resetChat}
              className="text-xs text-gray-400 hover:text-gray-600 underline flex items-center justify-center space-x-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Start new conversation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnhancedChatInterface;