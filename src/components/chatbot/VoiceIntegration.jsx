import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { voiceCommandProcessor, VOICE_RESPONSES } from '../../utils/voiceUtils';
import { analyticsService } from '../../services/analyticsService';

export const VoiceIntegration = ({ onTranscription, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  const speechStartTime = useRef(null);

  useEffect(() => {
    // Check for browser support
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(supported);
    
    if (supported) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configure speech recognition
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;
      
      // Event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
        speechStartTime.current = Date.now();
        analyticsService.trackVoiceUsage('start_listening', { 
          timestamp: Date.now() 
        });
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        if (event.results[event.results.length - 1].isFinal) {
          const processedCommand = voiceCommandProcessor.processVoiceCommand(
            transcript, 
            event.results[event.results.length - 1][0].confidence
          );
          
          onTranscription?.(processedCommand.transcript);
          
          analyticsService.trackVoiceUsage('transcription_complete', {
            transcript: processedCommand.transcript,
            confidence: processedCommand.confidence,
            intent: processedCommand.intent,
            duration: Date.now() - speechStartTime.current
          });
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error);
        setIsListening(false);
        
        analyticsService.trackVoiceUsage('error', {
          errorType: event.error,
          duration: speechStartTime.current ? Date.now() - speechStartTime.current : 0
        });
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        
        if (speechStartTime.current) {
          analyticsService.trackVoiceUsage('stop_listening', {
            duration: Date.now() - speechStartTime.current
          });
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [onTranscription]);

  const toggleListening = () => {
    if (!isSupported || disabled) return;
    
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setError(null);
      try {
        recognitionRef.current?.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setError('failed-to-start');
      }
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window) || !text) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    utterance.lang = 'en-US';
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      analyticsService.trackVoiceUsage('speech_start', {
        textLength: text.length
      });
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      analyticsService.trackVoiceUsage('speech_complete', {
        textLength: text.length
      });
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
      analyticsService.trackVoiceUsage('speech_error', {
        errorType: event.error
      });
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    
    const errorMessages = {
      'not-allowed': VOICE_RESPONSES.PERMISSION_DENIED,
      'permission-denied': VOICE_RESPONSES.PERMISSION_DENIED,
      'network': VOICE_RESPONSES.NETWORK_ERROR,
      'no-speech': VOICE_RESPONSES.NO_SPEECH,
      'audio-capture': 'Microphone access failed. Please check your audio settings.',
      'aborted': 'Voice recognition was cancelled.',
      'failed-to-start': 'Failed to start voice recognition. Please try again.'
    };
    
    return errorMessages[error] || VOICE_RESPONSES.SPEECH_ERROR;
  };

  if (!isSupported) {
    return (
      <div className="flex items-center text-xs text-gray-500 px-2">
        <MicOff size={16} className="mr-1" />
        <span>Voice not supported</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Voice Input Button */}
      <button
        onClick={toggleListening}
        disabled={disabled}
        className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse shadow-lg' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
      </button>

      {/* Speech Output Button */}
      <button
        onClick={isSpeaking ? stopSpeaking : () => speakText(VOICE_RESPONSES.WELCOME_VOICE)}
        disabled={disabled}
        className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
          isSpeaking 
            ? 'bg-blue-500 text-white animate-pulse' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isSpeaking ? 'Stop speaking' : 'Test voice output'}
        aria-label={isSpeaking ? 'Stop speaking' : 'Test voice output'}
      >
        {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Status Indicators */}
      {isListening && (
        <span className="text-xs text-red-600 animate-pulse">
          Listening...
        </span>
      )}
      
      {isSpeaking && (
        <span className="text-xs text-blue-600 animate-pulse">
          Speaking...
        </span>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-100 border border-red-300 text-red-700 text-xs rounded-lg shadow-lg z-10 max-w-xs">
          {getErrorMessage()}
        </div>
      )}
    </div>
  );
};