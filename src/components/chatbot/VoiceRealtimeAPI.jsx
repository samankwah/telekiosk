import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Phone, Loader, Zap, Settings } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService.js';

/**
 * GPT-4o Realtime API Voice Integration for TeleKiosk
 * Professional healthcare voice assistant with WebSocket streaming
 */
export const VoiceRealtimeAPI = ({ onTranscriptReceived, onResponseReceived, isEnabled = true }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected, error
  const [audioLevel, setAudioLevel] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [totalInteractions, setTotalInteractions] = useState(0);

  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioWorkletRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingQueueRef = useRef(false);

  // Healthcare-optimized voice configuration
  const voiceConfig = {
    model: 'gpt-4o-realtime-preview',
    voice: 'alloy', // Professional, clear voice for healthcare
    instructions: `You are a professional healthcare assistant for TeleKiosk Hospital in Ghana. 
    Speak clearly and calmly. Be empathetic and professional. 
    Always prioritize patient safety. For emergencies, immediately direct to call 999 or 193.
    Keep responses concise but comprehensive. Use simple, clear language that patients can understand.`,
    modalities: ['text', 'audio'],
    temperature: 0.3, // Lower temperature for healthcare accuracy
    max_response_output_tokens: 1000,
    turn_detection: {
      type: 'server_vad',
      threshold: 0.5,
      prefix_padding_ms: 300,
      silence_duration_ms: 1000
    },
    input_audio_format: 'pcm16',
    output_audio_format: 'pcm16',
    input_audio_transcription: { model: 'whisper-1' }
  };

  // Initialize WebSocket connection to GPT-4o Realtime API
  const connectToRealtimeAPI = useCallback(async () => {
    if (!isEnabled) return;

    setConnectionStatus('connecting');
    
    try {
      // Note: In production, this should go through your backend to secure API keys
      const wsUrl = `wss://api.openai.com/v1/realtime?model=${voiceConfig.model}`;
      
      wsRef.current = new WebSocket(wsUrl, [], {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'OpenAI-Beta': 'realtime=v1'
        }
      });

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        console.log('🎙️ Connected to GPT-4o Realtime API');
        
        // Send initial configuration
        wsRef.current.send(JSON.stringify({
          type: 'session.update',
          session: voiceConfig
        }));

        analyticsService.trackEvent('voice_realtime_connected', {
          timestamp: Date.now(),
          model: voiceConfig.model
        });
      };

      wsRef.current.onmessage = handleWebSocketMessage;

      wsRef.current.onclose = () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        console.log('🎙️ Disconnected from GPT-4o Realtime API');
      };

      wsRef.current.onerror = (error) => {
        console.error('🎙️❌ Realtime API error:', error);
        setConnectionStatus('error');
        
        analyticsService.trackEvent('voice_realtime_error', {
          error: error.message,
          timestamp: Date.now()
        });
      };

    } catch (error) {
      console.error('🎙️❌ Failed to connect to Realtime API:', error);
      setConnectionStatus('error');
    }
  }, [isEnabled]);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (event) => {
    const message = JSON.parse(event.data);
    
    switch (message.type) {
      case 'conversation.item.input_audio_transcription.completed':
        if (onTranscriptReceived) {
          onTranscriptReceived(message.transcript);
        }
        break;
        
      case 'response.audio.delta':
        // Queue audio chunks for playback
        audioQueueRef.current.push(message.delta);
        if (!isPlayingQueueRef.current) {
          playAudioQueue();
        }
        break;
        
      case 'response.done':
        const endTime = Date.now();
        const responseTimeMs = endTime - recordingStartTimeRef.current;
        setResponseTime(responseTimeMs);
        setTotalInteractions(prev => prev + 1);
        
        analyticsService.trackEvent('voice_realtime_response', {
          responseTime: responseTimeMs,
          interactionCount: totalInteractions + 1,
          timestamp: Date.now()
        });
        break;
        
      case 'error':
        console.error('🎙️❌ Realtime API error:', message.error);
        break;
    }
  };

  // Initialize audio context and microphone
  const initializeAudio = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 24000
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 24000,
          sampleSize: 16,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      mediaStreamRef.current = stream;
      
      // Set up audio worklet for real-time processing
      await audioContextRef.current.audioWorklet.addModule('/audio-processor.js');
      audioWorkletRef.current = new AudioWorkletNode(audioContextRef.current, 'audio-processor');
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(audioWorkletRef.current);

      audioWorkletRef.current.port.onmessage = (event) => {
        if (event.data.type === 'audio-data' && isRecording && wsRef.current?.readyState === WebSocket.OPEN) {
          // Send audio data to GPT-4o Realtime API
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: event.data.audio
          }));
        }
        
        if (event.data.type === 'audio-level') {
          setAudioLevel(event.data.level);
        }
      };

    } catch (error) {
      console.error('🎙️❌ Failed to initialize audio:', error);
    }
  };

  // Play queued audio responses
  const playAudioQueue = async () => {
    if (isPlayingQueueRef.current || audioQueueRef.current.length === 0) return;
    
    isPlayingQueueRef.current = true;
    setIsPlaying(true);

    try {
      while (audioQueueRef.current.length > 0) {
        const audioData = audioQueueRef.current.shift();
        await playAudioChunk(audioData);
      }
    } catch (error) {
      console.error('🎙️❌ Audio playback error:', error);
    } finally {
      isPlayingQueueRef.current = false;
      setIsPlaying(false);
    }
  };

  // Play individual audio chunk
  const playAudioChunk = (audioData) => {
    return new Promise((resolve) => {
      if (!audioContextRef.current) {
        resolve();
        return;
      }

      const audioBuffer = audioContextRef.current.createBuffer(1, audioData.length, 24000);
      audioBuffer.copyToChannel(new Float32Array(audioData), 0);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = resolve;
      source.start();
    });
  };

  // Start voice recording
  const startRecording = async () => {
    if (!isConnected || !audioContextRef.current) {
      await connectToRealtimeAPI();
      await initializeAudio();
      return;
    }

    setIsRecording(true);
    recordingStartTimeRef.current = Date.now();

    // Start conversation turn
    wsRef.current?.send(JSON.stringify({
      type: 'input_audio_buffer.commit'
    }));

    wsRef.current?.send(JSON.stringify({
      type: 'response.create',
      response: {
        modalities: ['text', 'audio'],
        instructions: voiceConfig.instructions
      }
    }));

    analyticsService.trackEvent('voice_recording_started', {
      timestamp: Date.now()
    });
  };

  // Stop voice recording
  const stopRecording = () => {
    setIsRecording(false);
    setAudioLevel(0);

    analyticsService.trackEvent('voice_recording_stopped', {
      duration: Date.now() - recordingStartTimeRef.current,
      timestamp: Date.now()
    });
  };

  // Toggle recording state
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Disconnect and cleanup
  const disconnect = () => {
    wsRef.current?.close();
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    audioContextRef.current?.close();
    setIsConnected(false);
    setIsRecording(false);
    setIsPlaying(false);
  };

  // Initialize on mount
  useEffect(() => {
    if (isEnabled) {
      connectToRealtimeAPI();
      initializeAudio();
    }

    return () => {
      disconnect();
    };
  }, [isEnabled, connectToRealtimeAPI]);

  // Don't render if voice is not enabled
  if (!isEnabled) {
    return null;
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return isRecording ? 'bg-red-500' : 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return isRecording ? 'Listening...' : 'Ready';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Connection Error';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="voice-realtime-container">
      {/* Main Voice Button */}
      <div className="relative">
        <button
          onClick={toggleRecording}
          disabled={connectionStatus !== 'connected'}
          className={`relative p-4 rounded-full transition-all duration-300 shadow-lg ${
            isRecording
              ? 'bg-red-500 text-white scale-110 animate-pulse'
              : connectionStatus === 'connected'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
          title={isRecording ? 'Stop talking' : 'Start talking to TeleKiosk Assistant'}
        >
          {connectionStatus === 'connecting' ? (
            <Loader className="w-6 h-6 animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
          
          {/* Audio level indicator */}
          {isRecording && audioLevel > 0 && (
            <div className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-60" 
                 style={{ transform: `scale(${1 + audioLevel})` }} />
          )}
        </button>

        {/* Connection status indicator */}
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getStatusColor()} border-2 border-white`}
             title={getStatusText()} />
      </div>

      {/* Status Information Panel */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">GPT-4o Realtime Voice</span>
          </div>
          <div className="flex items-center gap-2">
            {isPlaying && (
              <div className="flex items-center gap-1 text-green-600">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm">Speaking</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Status:</span>
            <div className={`font-medium ${
              connectionStatus === 'connected' ? 'text-green-700' : 
              connectionStatus === 'error' ? 'text-red-700' : 'text-yellow-700'
            }`}>
              {getStatusText()}
            </div>
          </div>
          
          {responseTime > 0 && (
            <div>
              <span className="text-gray-600">Response Time:</span>
              <div className="font-medium text-blue-700">{responseTime}ms</div>
            </div>
          )}
          
          <div>
            <span className="text-gray-600">Conversations:</span>
            <div className="font-medium text-purple-700">{totalInteractions}</div>
          </div>

          <div>
            <span className="text-gray-600">Quality:</span>
            <div className="font-medium text-green-700">HD Audio</div>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-600">
          🏥 Professional healthcare voice assistant powered by OpenAI GPT-4o Realtime API
        </div>
      </div>

      {/* Quick Instructions */}
      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Phone className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <strong>Voice Instructions:</strong> Click the microphone and speak clearly. 
            For emergencies, say "This is an emergency" for immediate assistance.
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceRealtimeAPI;