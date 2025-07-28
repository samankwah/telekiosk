import { useState } from 'react';
import { useEnhancedChatbot } from '../../contexts/EnhancedChatbotContext';

function EnhancedChatMessage({ message, onQuickAction, currentLanguage }) {
  const { speakMessage, state } = useEnhancedChatbot();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const handleSpeakMessage = () => {
    if (message.sender === 'bot') {
      speakMessage(message.text);
    }
  };

  const handleActionClick = (action) => {
    if (onQuickAction) {
      onQuickAction(action.action, action.data);
    }
  };

  const getLanguageFlag = (language) => {
    if (language?.includes('GH') || language?.includes('gh')) {
      return '🇬🇭';
    }
    return '';
  };

  const renderEnhancedContent = () => {
    // Handle enhanced content with search results
    if (message.type === 'enhanced_content' && message.data?.additionalInfo) {
      return (
        <div className="space-y-3">
          <p className="text-gray-700 whitespace-pre-wrap">{message.text}</p>
          
          {/* Search Results */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-sm font-semibold text-blue-800 mb-2 flex items-center space-x-1">
              <span>🔍</span>
              <span>Information from our website:</span>
            </div>
            
            <div className="space-y-2">
              {message.data.additionalInfo.slice(0, 3).map((info, index) => (
                <div key={index} className="bg-white rounded p-2 border border-blue-100">
                  <div className="text-sm font-medium text-gray-800">{info.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{info.content}</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Relevance: {info.relevance}% • Source: {info.source}
                  </div>
                </div>
              ))}
            </div>
            
            {message.data.additionalInfo.length > 3 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-blue-600 hover:text-blue-800 mt-2"
              >
                {isExpanded ? 'Show less' : `Show ${message.data.additionalInfo.length - 3} more results`}
              </button>
            )}
          </div>
        </div>
      );
    }

    // Handle service selection with Ghana context
    if (message.type === 'service_selection') {
      return (
        <div className="space-y-3">
          <p className="text-gray-700">{message.text}</p>
          <div className="grid gap-2">
            {message.data?.options?.map((service) => (
              <button
                key={service.id}
                onClick={() => handleActionClick({ action: 'select_service', data: service.id })}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{service.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{service.title}</div>
                    <div className="text-sm text-gray-600">{service.description}</div>
                  </div>
                  <span className="text-xs text-green-600">🇬🇭</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Handle services list with Ghana branding
    if (message.type === 'services_list') {
      return (
        <div className="space-y-3">
          <p className="text-gray-700">{message.text}</p>
          <div className="grid gap-2">
            {message.data?.services?.map((service) => (
              <div
                key={service.id}
                className="p-3 border border-gray-200 rounded-lg bg-blue-50"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{service.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{service.title}</div>
                    <div className="text-sm text-gray-600">{service.description}</div>
                  </div>
                  <span className="text-xs">🇬🇭</span>
                </div>
              </div>
            ))}
          </div>
          {message.data?.actions?.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-colors"
            >
              {action.text}
            </button>
          ))}
        </div>
      );
    }

    // Handle service detail
    if (message.type === 'service_detail') {
      return (
        <div className="space-y-3">
          <p className="text-gray-700">{message.text}</p>
          {message.data?.service && (
            <div className="p-3 border border-gray-200 rounded-lg bg-blue-50">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{message.data.service.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{message.data.service.title}</div>
                  <div className="text-sm text-gray-600">{message.data.service.description}</div>
                </div>
                <span className="text-xs">🇬🇭</span>
              </div>
            </div>
          )}
          <div className="flex space-x-2">
            {message.data?.actions?.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-colors"
              >
                {action.text}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Handle greeting with language info
    if (message.type === 'greeting') {
      return (
        <div className="space-y-2">
          <p className="text-gray-700 whitespace-pre-wrap">{message.text}</p>
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="text-sm text-green-800">
              <div className="font-semibold mb-1">🇬🇭 Ghana Language Support:</div>
              <div className="text-xs space-y-1">
                <div>• English (Ghana) - Default</div>
                <div>• Twi (Akan) - "Akwaaba"</div>
                <div>• Ewe - "Woezɔ"</div>
                <div>• Ga - "Bawo"</div>
                <div>• And more local languages</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle system messages (language switches, etc.)
    if (message.type === 'system') {
      return (
        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">ℹ️</span>
            <span className="text-sm text-yellow-800">{message.text}</span>
            {getLanguageFlag(message.language) && (
              <span className="text-lg">{getLanguageFlag(message.language)}</span>
            )}
          </div>
        </div>
      );
    }

    // Default text message
    return (
      <div className="space-y-2">
        <p className="text-gray-700 whitespace-pre-wrap">{message.text}</p>
        {message.data?.actions?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.data.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                {action.text}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
      }`}>
        {/* Enhanced Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.sender === 'user' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gradient-to-r from-blue-100 to-green-100 text-gray-600'
        }`}>
          {message.sender === 'user' ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
            </svg>
          ) : (
            <span className="text-sm">🇬🇭</span>
          )}
        </div>

        {/* Enhanced Message Content */}
        <div className={`rounded-lg p-3 shadow-sm ${
          message.sender === 'user' 
            ? 'bg-blue-600 text-white' 
            : 'bg-white border border-gray-200'
        }`}>
          {renderEnhancedContent()}
          
          {/* Enhanced Message Actions for Bot Messages */}
          {message.sender === 'bot' && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {formatTime(message.timestamp)}
                </span>
                
                {/* Language indicator */}
                {message.language && getLanguageFlag(message.language) && (
                  <span className="text-xs" title={`Message in ${message.language}`}>
                    {getLanguageFlag(message.language)}
                  </span>
                )}
                
                {/* Auto-response indicator */}
                {message.data?.autoGenerated && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded" title="Auto-generated response">
                    Auto
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                {/* Speak button */}
                {state.voiceSupported.speechSynthesis && state.voiceEnabled && (
                  <button
                    onClick={handleSpeakMessage}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                    aria-label="Speak message"
                    title="Click to hear this message"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                    </svg>
                  </button>
                )}

                {/* Search results indicator */}
                {message.data?.searchResults?.length > 0 && (
                  <div className="text-xs bg-blue-100 text-blue-600 px-1 rounded" title={`${message.data.searchResults.length} search results found`}>
                    🔍{message.data.searchResults.length}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Message Timestamp */}
          {message.sender === 'user' && (
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-blue-100">
                {formatTime(message.timestamp)}
              </span>
              {message.language && getLanguageFlag(message.language) && (
                <span className="text-xs" title={`Message in ${message.language}`}>
                  {getLanguageFlag(message.language)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnhancedChatMessage;