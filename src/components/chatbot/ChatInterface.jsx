import { useState, useRef, useEffect } from "react";
import { useChatbot } from "../../contexts/ChatbotContext";
import ChatMessage from "./ChatMessage";
import { QUICK_ACTIONS } from "./ChatKnowledgeBase";

function ChatInterface({ navigate }) {
  const { state, sendMessage, startListening, handleQuickAction, resetChat } =
    useChatbot();

  const [inputText, setInputText] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      setInputText("");
      setShowQuickActions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickActionClick = (action) => {
    // Pass the action text and navigate function to handleQuickAction
    handleQuickAction(action.text, null, navigate);
    setShowQuickActions(false);
  };

  const handleVoiceInput = () => {
    startListening();
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
        {state.messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onQuickAction={(action, data) => handleQuickAction(action, data, navigate)}
          />
        ))}

        {/* Typing Indicator */}
        {state.isTyping && (
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2Z" />
              </svg>
            </div>
            <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {showQuickActions && state.messages.length <= 1 && (
          <div className="space-y-2 sm:space-y-3">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                Quick actions to get started:
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {QUICK_ACTIONS.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickActionClick(action)}
                  className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 transition-colors text-left touch-manipulation min-h-[44px]"
                >
                  <span className="text-sm sm:text-base lg:text-lg flex-shrink-0">
                    {action.icon}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 truncate leading-tight">
                    {action.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Voice Listening Indicator */}
        {state.isListening && (
          <div className="flex justify-center px-2">
            <div className="bg-red-100 border border-red-200 rounded-lg p-2 sm:p-4 flex items-center space-x-2 sm:space-x-3 max-w-full">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-red-700 font-medium text-xs sm:text-sm truncate">
                Listening... Speak now
              </span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 animate-pulse flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 10V12C19 15.9 15.9 19 12 19S5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17S17 14.8 17 12V10H19Z" />
              </svg>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-2 sm:p-4">
        <form onSubmit={handleSubmit} className="flex space-x-1 sm:space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                state.isListening
                  ? "Listening..."
                  : window.innerWidth < 640 
                    ? "Type message..." 
                    : "Type your message or click the microphone..."
              }
              className="w-full p-2.5 sm:p-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base touch-manipulation"
              rows="1"
              style={{ minHeight: "44px", maxHeight: "100px" }}
              disabled={state.isListening || state.isTyping}
            />

            {/* Voice Input Button */}
            {state.voiceSupported.speechRecognition && state.voiceEnabled && (
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={state.isListening || state.isTyping}
                className={`absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 rounded-full transition-colors touch-manipulation ${
                  state.isListening
                    ? "bg-red-100 text-red-600"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="Voice input"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 10V12C19 15.9 15.9 19 12 19S5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17S17 14.8 17 12V10H19Z" />
                </svg>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || state.isTyping || state.isListening}
            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
            aria-label="Send message"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-1 sm:mt-2 text-xs text-gray-500 text-center px-1">
          <span className="hidden sm:inline">
            {state.voiceSupported.speechRecognition && state.voiceEnabled
              ? "Type or speak your message. Press Enter to send."
              : "Type your message and press Enter to send."}
          </span>
          <span className="sm:hidden">
            {state.voiceSupported.speechRecognition && state.voiceEnabled
              ? "Type or speak"
              : "Type message"}
          </span>
        </div>

        {/* Reset Chat Button */}
        {state.messages.length > 2 && (
          <div className="mt-1 sm:mt-2 text-center">
            <button
              onClick={resetChat}
              className="text-xs text-gray-400 hover:text-gray-600 underline touch-manipulation py-1"
            >
              <span className="hidden sm:inline">Start new conversation</span>
              <span className="sm:hidden">New chat</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatInterface;
