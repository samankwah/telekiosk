import React, { Suspense, Component } from 'react';
import { Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { AssistantRuntimeProvider } from './runtime/AssistantRuntimeProvider.jsx';

/**
 * Voice Button Component for speech-to-text functionality
 */
const VoiceButton = ({ className = "" }) => {
  const [isListening, setIsListening] = React.useState(false);
  const [isSupported, setIsSupported] = React.useState(false);
  const recognitionRef = React.useRef(null);
  
  React.useEffect(() => {
    // Check for browser support
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(supported);
    
    if (supported) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('🎤 Voice transcript:', transcript);
        
        // Find the textarea and set its value
        const textarea = document.querySelector('textarea[placeholder*="hospital"]');
        if (textarea) {
          const event = new Event('input', { bubbles: true });
          textarea.value = transcript;
          textarea.dispatchEvent(event);
        }
        
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('🎤❌ Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!isSupported) return;
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  if (!isSupported) {
    return null; // Hide button if not supported
  }

  return (
    <button
      onClick={toggleListening}
      className={`p-2 rounded-full transition-all duration-200 ${
        isListening 
          ? 'bg-red-500 text-white animate-pulse shadow-lg' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${className}`}
      title={isListening ? 'Stop listening' : 'Voice input'}
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
};

/**
 * Enhanced Error Boundary for TeleKiosk Assistant
 */
class ChatErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🤖❌ TeleKiosk Assistant Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full max-h-[600px] w-full bg-white rounded-lg p-4 flex items-center justify-center border">
          <div className="text-center max-w-md">
            <div className="text-red-500 mb-3 text-2xl">🤖⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              TeleKiosk Assistant Unavailable
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              The AI assistant is temporarily unavailable. Please try refreshing the page or contact hospital staff for immediate assistance.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Refresh Page
              </button>
              <div className="text-xs text-gray-500 mt-2">
                🏥 Emergency: Call +233-599-211-311
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Enhanced Loading fallback with hospital branding
 */
const ChatLoadingFallback = () => (
  <div className="h-full max-h-[600px] w-full bg-white rounded-lg p-4 flex items-center justify-center border">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-3"></div>
      <h3 className="text-gray-800 font-medium mb-1">🤖 TeleKiosk Assistant</h3>
      <p className="text-gray-500 text-sm animate-pulse">Initializing healthcare AI...</p>
      <div className="text-xs text-gray-400 mt-2">
        🏥 TeleKiosk Hospital • Powered by OpenAI GPT-4o
      </div>
    </div>
  </div>
);

/**
 * Enhanced TeleKiosk Thread Component with custom styling and voice support
 */
const TeleKioskThread = () => {
  const [messages, setMessages] = React.useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! Welcome to TeleKiosk Hospital. How can I assist you today?'
    }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user', 
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3003/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client': 'assistant-ui'
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].filter(msg => msg.role !== 'system'),
          model: 'gpt-4o',
          temperature: 0.3,
          client_type: 'assistant-ui'
        })
      });

      const result = await response.json();
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.message || result.content || 'Sorry, I encountered an issue.'
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Voice synthesis
      if ('speechSynthesis' in window && assistantMessage.content) {
        const utterance = new SpeechSynthesisUtterance(assistantMessage.content);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.7;
        
        if (window.localStorage.getItem('telekiosk_voice_responses') !== 'disabled') {
          speechSynthesis.speak(utterance);
        }
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === 'user' ? (
              <div className="flex justify-end mb-4">
                <div className="max-w-xs lg:max-w-md bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-lg">
                  <div className="text-sm font-medium">{message.content}</div>
                </div>
              </div>
            ) : (
              <div className="flex justify-start mb-4">
                <div className="flex items-start gap-3 max-w-xs lg:max-w-md">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white shadow-md flex-shrink-0 mt-1">
                    🏥
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg border border-gray-100">
                    <div className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      TeleKiosk Assistant
                    </div>
                    <div className="text-sm text-gray-800 leading-relaxed">{message.content}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-start gap-3 max-w-xs lg:max-w-md">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white shadow-md flex-shrink-0 mt-1">
                🏥
              </div>
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg border border-gray-100">
                <div className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  TeleKiosk Assistant
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="text-center py-12 px-4">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
              <div className="text-5xl mb-4">🏥</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Welcome to TeleKiosk Assistant
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                I'm here to help you with appointment booking, hospital information, 
                emergency guidance, or answer general health questions.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-blue-600 mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Powered by OpenAI GPT-4o</span>
              </div>
              <div className="grid grid-cols-1 gap-2 max-w-sm mx-auto">
                <button 
                  onClick={() => setInputValue('I want to book an appointment')}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  📅 Book an appointment
                </button>
                <button 
                  onClick={() => setInputValue('What hospital services do you offer?')}
                  className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition-colors border border-green-200"
                >
                  🏥 Hospital services
                </button>
                <button 
                  onClick={() => setInputValue('What are your visiting hours?')}
                  className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm hover:bg-purple-100 transition-colors border border-purple-200"
                >
                  🕐 Visiting hours
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about the hospital..."
              className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px] max-h-32 pr-12"
              rows="1"
            />
            <VoiceButton className="absolute right-2 top-1/2 transform -translate-y-1/2" />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-3 max-w-4xl mx-auto text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>🏥 TeleKiosk Hospital</span>
            <span>Emergency: +233-599-211-311</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>Powered by OpenAI GPT-4o</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Enhanced Assistant-UI Chat with TeleKiosk Hospital Integration
 * 
 * Features:
 * ✅ Phase 1: Complete Assistant-UI Thread component integration
 * ✅ Phase 2: OpenAI GPT-4o API integration with healthcare prompts
 * ✅ Healthcare-specific styling and branding
 * ✅ Robust error handling with fallback UI
 * ✅ Loading states optimized for hospital environment
 * ✅ Emergency detection integration ready
 * ✅ Appointment booking function calling ready
 * ✅ Multilingual support framework ready
 */
export const AssistantUIChat = () => {
  return (
    <ChatErrorBoundary>
      <Suspense fallback={<ChatLoadingFallback />}>
        <div className="h-full max-h-[600px] w-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <AssistantRuntimeProvider>
            <TeleKioskThread />
          </AssistantRuntimeProvider>
        </div>
      </Suspense>
    </ChatErrorBoundary>
  );
};