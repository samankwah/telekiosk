import { useChatbot } from '../../contexts/ChatbotContext';

function VoiceButton() {
  const { 
    state, 
    startListening, 
    stopListening, 
    toggleVoice,
    stopSpeaking 
  } = useChatbot();

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

  const isVoiceSupported = state.voiceSupported.speechRecognition && state.voiceSupported.speechSynthesis;

  if (!isVoiceSupported) {
    return (
      <div className="text-blue-100 text-xs opacity-75">
        Voice not supported
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      {/* Voice toggle button */}
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

      {/* Microphone button */}
      {state.voiceEnabled && (
        <button
          onClick={handleVoiceToggle}
          className={`p-1 rounded transition-all duration-200 ${
            state.isListening 
              ? 'text-red-300 bg-red-500/20 animate-pulse' 
              : state.isSpeaking
              ? 'text-green-300 bg-green-500/20 animate-pulse'
              : 'text-blue-100 hover:text-white hover:bg-blue-500/20'
          }`}
          aria-label={
            state.isListening ? 'Stop listening' :
            state.isSpeaking ? 'Stop speaking' :
            'Start voice input'
          }
          title={
            state.isListening ? 'Click to stop listening' :
            state.isSpeaking ? 'Click to stop speaking' :
            'Click to speak or hold to talk'
          }
        >
          {state.isListening ? (
            <div className="relative">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 10V12C19 15.9 15.9 19 12 19S5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17S17 14.8 17 12V10H19Z"/>
              </svg>
              <div className="absolute -inset-1 border-2 border-red-300 rounded-full animate-ping"></div>
            </div>
          ) : state.isSpeaking ? (
            <div className="relative">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
              </svg>
              <div className="absolute -inset-1 border-2 border-green-300 rounded-full animate-ping"></div>
            </div>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 10V12C19 15.9 15.9 19 12 19S5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17S17 14.8 17 12V10H19Z"/>
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

export default VoiceButton;