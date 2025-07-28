import { useState } from 'react';
import { useEnhancedChatbot } from '../../contexts/EnhancedChatbotContext';

function EnhancedVoiceButton() {
  const { 
    state, 
    startListening, 
    stopListening, 
    toggleVoice,
    toggleAutoResponse,
    toggleContinuousListening,
    stopSpeaking 
  } = useEnhancedChatbot();
  
  const [showOptions, setShowOptions] = useState(false);

  const handleVoiceToggle = () => {
    if (state.isListening) {
      stopListening();
    } else if (state.isSpeaking) {
      stopSpeaking();
    } else {
      startListening();
    }
  };

  const handleVoiceSettingsToggle = (e) => {
    e.stopPropagation();
    toggleVoice();
  };

  const handleLongPress = (e) => {
    e.preventDefault();
    setShowOptions(!showOptions);
  };

  const isVoiceSupported = state.voiceSupported.speechRecognition && state.voiceSupported.speechSynthesis;

  if (!isVoiceSupported) {
    return (
      <div className="text-blue-100 text-xs opacity-75" title="Voice not supported on this browser">
        Voice unavailable
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Voice Button */}
      <div className="flex items-center space-x-1">
        {/* Voice enable/disable toggle */}
        <button
          onClick={handleVoiceSettingsToggle}
          className={`p-1 rounded transition-colors ${
            state.voiceEnabled 
              ? 'text-blue-100 hover:text-white' 
              : 'text-blue-300 opacity-50'
          }`}
          aria-label={state.voiceEnabled ? 'Disable voice' : 'Enable voice'}
          title={state.voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            {state.voiceEnabled ? (
              <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
            ) : (
              <path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"/>
            )}
          </svg>
        </button>

        {/* Main microphone button */}
        {state.voiceEnabled && (
          <button
            onClick={handleVoiceToggle}
            onContextMenu={handleLongPress}
            className={`relative p-1 rounded transition-all duration-200 ${
              state.isListening 
                ? 'text-red-300 bg-red-500/20 animate-pulse' 
                : state.isSpeaking
                ? 'text-green-300 bg-green-500/20 animate-pulse'
                : 'text-blue-100 hover:text-white hover:bg-blue-500/20'
            }`}
            aria-label={
              state.isListening ? 'Stop listening' :
              state.isSpeaking ? 'Stop speaking' :
              'Start voice input (right-click for options)'
            }
            title={
              state.isListening ? 'Click to stop listening' :
              state.isSpeaking ? 'Click to stop speaking' :
              'Click to speak • Right-click for options'
            }
          >
            {state.isListening ? (
              <div className="relative">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 10V12C19 15.9 15.9 19 12 19S5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17S17 14.8 17 12V10H19Z"/>
                </svg>
                <div className="absolute -inset-1 border-2 border-red-300 rounded-full animate-ping"></div>
                {/* Ghana flag indicator */}
                <div className="absolute -top-2 -right-2 text-xs">🇬🇭</div>
              </div>
            ) : state.isSpeaking ? (
              <div className="relative">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                </svg>
                <div className="absolute -inset-1 border-2 border-green-300 rounded-full animate-ping"></div>
              </div>
            ) : (
              <div className="relative">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 10V12C19 15.9 15.9 19 12 19S5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17S17 14.8 17 12V10H19Z"/>
                </svg>
                {/* Auto-response indicator */}
                {state.autoResponseEnabled && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse" title="Auto-response enabled"></div>
                )}
                {/* Continuous listening indicator */}
                {state.continuousListening && (
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse" title="Continuous listening enabled"></div>
                )}
              </div>
            )}
          </button>
        )}

        {/* Options button */}
        {state.voiceEnabled && (
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-blue-100 hover:text-white transition-colors p-1 rounded text-xs"
            aria-label="Voice options"
            title="Voice settings and options"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Voice Options Menu */}
      {showOptions && state.voiceEnabled && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <h4 className="font-semibold text-sm text-gray-800 flex items-center space-x-1">
              <span>🇬🇭</span>
              <span>Voice Settings</span>
            </h4>
            <p className="text-xs text-gray-600 mt-1">Configure Ghana AI voice features</p>
          </div>
          
          <div className="p-3 space-y-3">
            {/* Auto-response toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Auto-Response</label>
                <p className="text-xs text-gray-500">Respond automatically to voice input</p>
              </div>
              <button
                onClick={toggleAutoResponse}
                className={`relative inline-flex h-5 w-9 rounded-full transition-colors focus:outline-none ${
                  state.autoResponseEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    state.autoResponseEnabled ? 'translate-x-4' : 'translate-x-0.5'
                  } mt-0.5`}
                />
              </button>
            </div>

            {/* Continuous listening toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Continuous Listening</label>
                <p className="text-xs text-gray-500">Keep listening for voice commands</p>
              </div>
              <button
                onClick={toggleContinuousListening}
                className={`relative inline-flex h-5 w-9 rounded-full transition-colors focus:outline-none ${
                  state.continuousListening ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    state.continuousListening ? 'translate-x-4' : 'translate-x-0.5'
                  } mt-0.5`}
                />
              </button>
            </div>

            {/* Voice status */}
            <div className="pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Current Language:</span>
                  <span className="font-medium">
                    {state.currentLanguage === 'en-GH' ? 'English (Ghana)' :
                     state.currentLanguage === 'tw-GH' ? 'Twi' :
                     state.currentLanguage === 'ee-GH' ? 'Ewe' :
                     state.currentLanguage === 'ga-GH' ? 'Ga' : 'Unknown'}
                  </span>
                </div>
                
                {state.detectedLanguage && state.detectedLanguage !== state.currentLanguage && (
                  <div className="flex justify-between">
                    <span>Detected:</span>
                    <span className="font-medium text-green-600">{state.detectedLanguage}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Voice Support:</span>
                  <span className="font-medium text-green-600">
                    ✓ Available
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Website Search:</span>
                  <span className={`font-medium ${state.contentIndexed ? 'text-green-600' : 'text-yellow-600'}`}>
                    {state.contentIndexed ? '✓ Ready' : '⏳ Indexing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Voice commands help */}
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">Try saying:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• "Akwaaba" (Hello in Twi)</div>
                <div>• "Book appointment"</div>
                <div>• "What services do you offer?"</div>
                <div>• "Emergency help"</div>
                <div>• "Switch to Twi/Ewe/Ga"</div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <div className="p-2 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => setShowOptions(false)}
              className="w-full text-xs text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close Settings
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close options */}
      {showOptions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  );
}

export default EnhancedVoiceButton;