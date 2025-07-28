import { useState } from 'react';
import { useChatbot } from '../../contexts/ChatbotContext';

function ChatMessage({ message, onQuickAction }) {
  const { speakMessage, state } = useChatbot();
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

  const renderMessageContent = () => {
    switch (message.type) {
      case 'service_selection':
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
                    <div>
                      <div className="font-medium text-gray-900">{service.title}</div>
                      <div className="text-sm text-gray-600">{service.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'services_list':
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
                    <div>
                      <div className="font-medium text-gray-900">{service.title}</div>
                      <div className="text-sm text-gray-600">{service.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {message.data?.actions?.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {action.text}
              </button>
            ))}
          </div>
        );

      case 'service_detail':
        return (
          <div className="space-y-3">
            <p className="text-gray-700">{message.text}</p>
            {message.data?.service && (
              <div className="p-3 border border-gray-200 rounded-lg bg-blue-50">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{message.data.service.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{message.data.service.title}</div>
                    <div className="text-sm text-gray-600">{message.data.service.description}</div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex space-x-2">
              {message.data?.actions?.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleActionClick(action)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {action.text}
                </button>
              ))}
            </div>
          </div>
        );

      case 'date_selection':
        return (
          <div className="space-y-3">
            <p className="text-gray-700">{message.text}</p>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleActionClick({ action: 'select_date', data: e.target.value })}
            />
          </div>
        );

      case 'time_selection':
        return (
          <div className="space-y-3">
            <p className="text-gray-700">{message.text}</p>
            <div className="grid grid-cols-2 gap-2">
              {message.data?.options?.map((time) => (
                <button
                  key={time}
                  onClick={() => handleActionClick({ action: 'select_time', data: time })}
                  className="p-2 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        );

      case 'patient_info':
        return (
          <div className="space-y-3">
            <p className="text-gray-700">{message.text}</p>
            <form className="space-y-3">
              {message.data?.fields?.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.name === 'reason' ? (
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type={field.name === 'email' ? 'email' : field.name === 'phone' ? 'tel' : 'text'}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleActionClick({ action: 'complete_booking', data: {} });
                }}
              >
                Complete Booking
              </button>
            </form>
          </div>
        );

      default:
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
    }
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-xs sm:max-w-sm lg:max-w-md ${
        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
      }`}>
        {/* Avatar */}
        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.sender === 'user' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {message.sender === 'user' ? (
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
            </svg>
          ) : (
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2Z"/>
            </svg>
          )}
        </div>

        {/* Message Content */}
        <div className={`rounded-lg p-2 sm:p-3 shadow-sm text-sm sm:text-base ${
          message.sender === 'user' 
            ? 'bg-blue-600 text-white' 
            : 'bg-white border border-gray-200'
        }`}>
          {renderMessageContent()}
          
          {/* Message Actions for Bot Messages */}
          {message.sender === 'bot' && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                {formatTime(message.timestamp)}
              </span>
              
              {state.voiceSupported.speechSynthesis && state.voiceEnabled && (
                <button
                  onClick={handleSpeakMessage}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Speak message"
                  title="Click to hear this message"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* User Message Timestamp */}
          {message.sender === 'user' && (
            <div className="mt-1">
              <span className="text-xs text-blue-100">
                {formatTime(message.timestamp)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;