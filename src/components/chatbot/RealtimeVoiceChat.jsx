// Enhanced Voice Chat Component using GPT-4o Realtime API
// Provides real-time voice conversation capabilities

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Wifi, 
  WifiOff, 
  Loader2,
  AlertTriangle,
  Phone
} from 'lucide-react';
import { realtimeVoiceService } from '../../services/realtimeVoiceService';
import { analyticsService } from '../../services/analyticsService';

export const RealtimeVoiceChat = ({ onTranscription, onResponse, onUnavailable, onAvailable, disabled = false }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');

  // Audio playback
  const audioContextRef = useRef(null);
  const audioBufferRef = useRef([]);
  const audioSourceRef = useRef(null);

  useEffect(() => {
    initializeService();
    return () => {
      cleanup();
    };
  }, []);

  /**
   * Initialize the realtime voice service
   */
  const initializeService = async () => {
    try {
      // Check if OpenAI API key is properly configured
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey || apiKey.includes('your-') || apiKey.length < 20) {
        setError('OpenAI API key not properly configured for voice features.');
        setIsSupported(false);
        return;
      }

      // Check if browser supports realtime voice
      const browserSupport = realtimeVoiceService.checkBrowserSupport();
      setIsSupported(browserSupport);

      if (!browserSupport) {
        setError('Your browser does not support real-time voice features. Please use Chrome, Edge, or Safari.');
        return;
      }

      // Initialize the service
      const result = await realtimeVoiceService.initialize();
      if (!result.success) {
        throw new Error(result.error);
      }

      // Set up event listeners
      setupEventListeners();
      
      // Notify parent that realtime voice is available
      onAvailable?.();

    } catch (error) {
      console.error('❌ Failed to initialize realtime voice:', error);
      
      // Handle specific authentication errors
      if (error.message.includes('authentication') || error.message.includes('bearer') || error.message.includes('401')) {
        console.log('🔄 Realtime voice unavailable, falling back to basic voice features');
        setIsSupported(false);
        onUnavailable?.(); // Notify parent to disable realtime voice
      } else {
        setError(error.message);
      }
    }
  };

  /**
   * Set up event listeners for the realtime service
   */
  const setupEventListeners = () => {
    // Connection events
    realtimeVoiceService.on('connected', () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    realtimeVoiceService.on('disconnected', () => {
      setIsConnected(false);
      setIsConnecting(false);
    });

    realtimeVoiceService.on('error', (error) => {
      setIsConnecting(false);
      
      // Handle authentication errors gracefully
      if (error.message.includes('authentication') || error.message.includes('bearer') || error.message.includes('401')) {
        console.log('🔄 Realtime voice authentication failed, disabling feature');
        setIsSupported(false);
        onUnavailable?.(); // Notify parent to disable realtime voice
      } else {
        setError(error.message);
      }
    });

    // Recording events
    realtimeVoiceService.on('recording_started', () => {
      setIsRecording(true);
    });

    realtimeVoiceService.on('recording_stopped', () => {
      setIsRecording(false);
    });

    realtimeVoiceService.on('speech_started', () => {
      console.log('🎤 Speech started');
    });

    realtimeVoiceService.on('speech_stopped', () => {
      console.log('🎤 Speech stopped');
    });

    // Response events
    realtimeVoiceService.on('transcription', (text) => {
      setTranscript(text);
      onTranscription?.(text);
    });

    realtimeVoiceService.on('text_delta', (delta) => {
      setCurrentResponse(prev => prev + delta);
    });

    realtimeVoiceService.on('text_response', (text) => {
      setCurrentResponse(text);
      onResponse?.(text);
    });

    realtimeVoiceService.on('audio_delta', (audioData) => {
      playAudioDelta(audioData);
    });

    realtimeVoiceService.on('audio_response_complete', () => {
      setIsSpeaking(false);
    });

    // Function call events
    realtimeVoiceService.on('function_call_result', (result) => {
      console.log('🔧 Function executed:', result);
      analyticsService.trackEvent('voice_function_call', {
        functionName: result.name,
        success: !!result.result.success
      });
    });
  };

  /**
   * Connect to the realtime API
   */
  const connectToRealtimeAPI = async () => {
    if (isConnecting || isConnected) return;

    try {
      setIsConnecting(true);
      setError(null);

      await realtimeVoiceService.connect();
      
      analyticsService.trackVoiceUsage('realtime_connect', {
        success: true,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('❌ Failed to connect:', error);
      setIsConnecting(false);
      
      // Handle authentication errors gracefully
      if (error.message.includes('authentication') || error.message.includes('bearer') || error.message.includes('401')) {
        console.log('🔄 Connection failed due to authentication, disabling realtime voice');
        setIsSupported(false);
        onUnavailable?.(); // Notify parent to disable realtime voice
      } else {
        setError(error.message);
      }
      
      analyticsService.trackVoiceUsage('realtime_connect', {
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Disconnect from the realtime API
   */
  const disconnectFromRealtimeAPI = () => {
    realtimeVoiceService.disconnect();
    setIsConnected(false);
    setIsRecording(false);
    setIsSpeaking(false);
    setCurrentResponse('');
    setTranscript('');
  };

  /**
   * Toggle voice recording
   */
  const toggleRecording = async () => {
    if (!isConnected) {
      await connectToRealtimeAPI();
      return;
    }

    try {
      if (isRecording) {
        realtimeVoiceService.stopRecording();
      } else {
        setTranscript('');
        setCurrentResponse('');
        await realtimeVoiceService.startRecording();
      }
    } catch (error) {
      console.error('❌ Recording toggle failed:', error);
      setError(error.message);
    }
  };

  /**
   * Play audio delta from the API
   */
  const playAudioDelta = async (audioData) => {
    try {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
      }

      const audioContext = audioContextRef.current;
      
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create audio buffer
      const audioBuffer = audioContext.createBuffer(1, audioData.length, 24000);
      audioBuffer.getChannelData(0).set(audioData);

      // Create and play audio source
      const audioSource = audioContext.createBufferSource();
      audioSource.buffer = audioBuffer;
      audioSource.connect(audioContext.destination);
      audioSource.start();

      setIsSpeaking(true);

      // Clean up when finished
      audioSource.onended = () => {
        setIsSpeaking(false);
      };

      audioSourceRef.current = audioSource;

    } catch (error) {
      console.error('❌ Audio playback error:', error);
      setIsSpeaking(false);
    }
  };

  /**
   * Stop current audio playback
   */
  const stopAudioPlayback = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
    setIsSpeaking(false);
  };

  /**
   * Clean up resources
   */
  const cleanup = () => {
    if (isConnected) {
      realtimeVoiceService.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
    }
  };

  // Emergency call handler
  const handleEmergencyCall = () => {
    window.open('tel:999', '_self');
    analyticsService.trackEvent('emergency_call_initiated', {
      source: 'realtime_voice_chat'
    });
  };

  if (!isSupported) {
    return (
      <div className="flex items-center text-xs text-gray-500 px-2">
        <MicOff size={16} className="mr-1" />
        <span>Voice chat not supported</span>
      </div>
    );
  }

  return (
    <div className="realtime-voice-chat">
      {/* Connection Status */}
      <div className="flex items-center space-x-2 mb-3">
        <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
          isConnected 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {isConnecting ? (
            <Loader2 size={12} className="animate-spin mr-1" />
          ) : isConnected ? (
            <Wifi size={12} className="mr-1" />
          ) : (
            <WifiOff size={12} className="mr-1" />
          )}
          <span>
            {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Voice Controls */}
      <div className="flex items-center space-x-3">
        {/* Main Voice Button */}
        <button
          onClick={toggleRecording}
          disabled={disabled || isConnecting}
          className={`p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
            isRecording 
              ? 'bg-red-500 text-white animate-pulse shadow-lg scale-110' 
              : isConnected
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-400 text-white hover:bg-gray-500'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={
            isRecording 
              ? 'Stop recording' 
              : isConnected 
                ? 'Start voice conversation' 
                : 'Connect and start voice chat'
          }
          aria-label={isRecording ? 'Stop recording' : 'Start voice conversation'}
        >
          {isConnecting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : isRecording ? (
            <MicOff size={20} />
          ) : (
            <Mic size={20} />
          )}
        </button>

        {/* Audio Control Button */}
        {isConnected && (
          <button
            onClick={isSpeaking ? stopAudioPlayback : undefined}
            disabled={disabled || !isSpeaking}
            className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              isSpeaking 
                ? 'bg-orange-500 text-white animate-pulse' 
                : 'bg-gray-100 text-gray-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isSpeaking ? 'Stop playback' : 'Assistant speaking'}
            aria-label={isSpeaking ? 'Stop playback' : 'Assistant speaking'}
          >
            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        )}

        {/* Emergency Call Button */}
        <button
          onClick={handleEmergencyCall}
          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
          title="Emergency Call: 999"
          aria-label="Emergency Call"
        >
          <Phone size={16} />
        </button>

        {/* Disconnect Button */}
        {isConnected && (
          <button
            onClick={disconnectFromRealtimeAPI}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            title="Disconnect voice chat"
            aria-label="Disconnect"
          >
            <WifiOff size={16} />
          </button>
        )}
      </div>

      {/* Status Indicators */}
      <div className="mt-3 space-y-2">
        {isRecording && (
          <div className="flex items-center text-xs text-red-600 animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></div>
            <span>Listening...</span>
          </div>
        )}

        {isSpeaking && (
          <div className="flex items-center text-xs text-blue-600 animate-pulse">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-ping"></div>
            <span>Assistant speaking...</span>
          </div>
        )}

        {transcript && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border-l-2 border-blue-400">
            <strong>You said:</strong> {transcript}
          </div>
        )}

        {currentResponse && (
          <div className="text-xs text-gray-700 bg-blue-50 p-2 rounded border-l-2 border-blue-500">
            <strong>Assistant:</strong> {currentResponse}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          <div className="flex items-start">
            <AlertTriangle size={14} className="mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Voice Chat Error:</div>
              <div>{error}</div>
              {error.includes('API key') && (
                <div className="mt-1 text-red-600">
                  Please configure your OpenAI API key in the .env file to use voice features.
                </div>
              )}
              {error.includes('authentication') && (
                <div className="mt-1 text-red-600">
                  OpenAI Realtime API requires beta access. Voice features will be available once your API key has Realtime API access.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      {isConnected && !isRecording && !error && (
        <div className="mt-3 text-xs text-gray-500">
          💡 Click the microphone to start a voice conversation with the TeleKiosk Assistant
        </div>
      )}
    </div>
  );
};