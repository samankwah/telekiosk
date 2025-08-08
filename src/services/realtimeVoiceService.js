// GPT-4o Realtime API Service for Advanced Voice Integration
// Provides real-time voice conversation capabilities

import { analyticsService } from './analyticsService';
import { HEALTHCARE_SYSTEM_PROMPT } from '../components/chatbot/HealthcarePrompts';

class RealtimeVoiceService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.isRecording = false;
    this.audioContext = null;
    this.mediaStream = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.eventListeners = {};
    
    this.config = {
      apiUrl: 'wss://api.openai.com/v1/realtime',
      model: 'gpt-4o-realtime-preview',
      voice: 'alloy', // Options: alloy, echo, fable, onyx, nova, shimmer
      temperature: 0.3,
      maxTokens: 2000,
      healthcareMode: true
    };
  }

  /**
   * Initialize the realtime voice service
   */
  async initialize() {
    try {
      console.log('🎤 Initializing GPT-4o Realtime Voice Service...');
      
      // Check browser support
      if (!this.checkBrowserSupport()) {
        throw new Error('Browser does not support required audio APIs');
      }

      // Initialize audio context
      await this.initializeAudioContext();
      
      // Track initialization
      analyticsService.trackVoiceUsage('realtime_init', {
        service: 'gpt4o-realtime',
        timestamp: Date.now()
      });
      
      console.log('✅ Realtime Voice Service initialized');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Realtime Voice Service initialization failed:', error);
      analyticsService.trackError(error, { service: 'realtimeVoice' });
      return { success: false, error: error.message };
    }
  }

  /**
   * Connect to GPT-4o Realtime API
   */
  async connect() {
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey || apiKey.includes('your-')) {
        throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file');
      }

      // Note: OpenAI Realtime API is in beta and may require special access
      // For now, we'll attempt connection but gracefully handle auth failures

      console.log('🔌 Connecting to GPT-4o Realtime API...');
      
      // Create WebSocket connection with proper authentication
      // Browser WebSocket API doesn't support custom headers, so we use subprotocols
      console.log('🔍 Attempting Realtime API connection...');
      
      const wsUrl = `${this.config.apiUrl}?model=${this.config.model}`;
      
      // Try using authorization in subprotocols (common WebSocket auth pattern)
      const authSubprotocol = `Bearer.${apiKey}`;
      this.ws = new WebSocket(wsUrl, [authSubprotocol]);

      // Set up WebSocket event handlers
      this.ws.onopen = () => {
        console.log('✅ Connected to GPT-4o Realtime API');
        this.isConnected = true;
        this.setupSession();
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.handleRealtimeMessage(message);
      };

      this.ws.onclose = (event) => {
        console.log('🔌 Realtime API connection closed:', event.code, event.reason);
        this.isConnected = false;
        this.emit('disconnected', { code: event.code, reason: event.reason });
      };

      this.ws.onerror = (error) => {
        console.error('🔌 Realtime API connection error:', error);
        
        // Handle authentication errors specifically
        if (error.code === 1008 || error.message?.includes('auth')) {
          const authError = new Error('Voice authentication failed. Please check your OpenAI API key configuration.');
          this.emit('error', authError);
        } else {
          this.emit('error', error);
        }
      };

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.once('connected', () => {
          clearTimeout(timeout);
          resolve({ success: true });
        });

        this.once('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

    } catch (error) {
      console.error('❌ Failed to connect to Realtime API:', error);
      analyticsService.trackError(error, { service: 'realtimeVoice', action: 'connect' });
      throw error;
    }
  }

  /**
   * Set up the realtime session
   */
  setupSession() {
    const sessionConfig = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: HEALTHCARE_SYSTEM_PROMPT + `\n\nIMPORTANT: You are now in voice conversation mode. Speak naturally and conversationally. Keep responses concise but helpful. For emergencies, speak clearly and urgently.`,
        voice: this.config.voice,
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        },
        temperature: this.config.temperature,
        max_response_output_tokens: this.config.maxTokens
      }
    };

    this.sendMessage(sessionConfig);
  }

  /**
   * Start voice recording
   */
  async startRecording() {
    try {
      if (this.isRecording) {
        console.log('⚠️ Already recording');
        return;
      }

      console.log('🎤 Starting voice recording...');

      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Create audio processing
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (event) => {
        if (this.isConnected && this.isRecording) {
          const audioData = event.inputBuffer.getChannelData(0);
          this.sendAudioData(audioData);
        }
      };

      source.connect(processor);
      processor.connect(this.audioContext.destination);

      this.isRecording = true;
      this.emit('recording_started');

      analyticsService.trackVoiceUsage('realtime_recording_start', {
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Stop voice recording
   */
  stopRecording() {
    if (!this.isRecording) {
      console.log('⚠️ Not currently recording');
      return;
    }

    console.log('🛑 Stopping voice recording...');

    this.isRecording = false;

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    // Send input audio buffer commit
    this.sendMessage({
      type: 'input_audio_buffer.commit'
    });

    this.emit('recording_stopped');

    analyticsService.trackVoiceUsage('realtime_recording_stop', {
      timestamp: Date.now()
    });
  }

  /**
   * Send audio data to the API
   */
  sendAudioData(audioData) {
    if (!this.isConnected || !this.ws) return;

    // Convert Float32Array to Int16Array (PCM16)
    const pcm16Data = new Int16Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      pcm16Data[i] = Math.max(-32768, Math.min(32767, audioData[i] * 32767));
    }

    // Convert to base64
    const uint8Array = new Uint8Array(pcm16Data.buffer);
    const base64Audio = btoa(String.fromCharCode(...uint8Array));

    this.sendMessage({
      type: 'input_audio_buffer.append',
      audio: base64Audio
    });
  }

  /**
   * Handle realtime API messages
   */
  handleRealtimeMessage(message) {
    console.log('📨 Realtime message:', message.type);

    switch (message.type) {
      case 'session.created':
        console.log('✅ Realtime session created');
        this.emit('session_created', message.session);
        break;

      case 'input_audio_buffer.speech_started':
        this.emit('speech_started');
        break;

      case 'input_audio_buffer.speech_stopped':
        this.emit('speech_stopped');
        break;

      case 'conversation.item.input_audio_transcription.completed':
        const transcript = message.transcript;
        console.log('📝 Transcription:', transcript);
        this.emit('transcription', transcript);
        
        analyticsService.trackVoiceUsage('realtime_transcription', {
          transcript: transcript,
          confidence: message.confidence || 0.9
        });
        break;

      case 'response.audio.delta':
        // Handle streaming audio response
        this.handleAudioResponse(message.delta);
        break;

      case 'response.audio.done':
        console.log('🔊 Audio response complete');
        this.emit('audio_response_complete');
        break;

      case 'response.text.delta':
        // Handle streaming text response
        this.emit('text_delta', message.delta);
        break;

      case 'response.text.done':
        console.log('📝 Text response complete:', message.text);
        this.emit('text_response', message.text);
        break;

      case 'error':
        console.error('❌ Realtime API error:', message.error);
        this.emit('error', new Error(message.error.message));
        break;

      case 'response.function_call_arguments.delta':
        // Handle function calling
        this.emit('function_call_delta', message);
        break;

      case 'response.function_call_arguments.done':
        this.handleFunctionCall(message);
        break;

      default:
        console.log('📨 Unhandled message type:', message.type);
    }
  }

  /**
   * Handle audio response from the API
   */
  handleAudioResponse(audioDelta) {
    if (!audioDelta) return;

    try {
      // Decode base64 audio
      const audioData = atob(audioDelta);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }

      // Convert to Float32Array for audio context
      const pcm16Array = new Int16Array(audioArray.buffer);
      const floatArray = new Float32Array(pcm16Array.length);
      for (let i = 0; i < pcm16Array.length; i++) {
        floatArray[i] = pcm16Array[i] / 32768.0;
      }

      this.emit('audio_delta', floatArray);

    } catch (error) {
      console.error('❌ Error processing audio response:', error);
    }
  }

  /**
   * Handle function calls from the API
   */
  async handleFunctionCall(message) {
    try {
      const { name, arguments: args } = message.function_call;
      console.log('🔧 Function call:', name, args);

      // Import and execute the function
      const { handleFunctionCall } = await import('./openaiService.js');
      const result = await handleFunctionCall({
        function_call: { name, arguments: JSON.stringify(args) }
      });

      // Send function result back to API
      this.sendMessage({
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: message.call_id,
          output: JSON.stringify(result)
        }
      });

      this.emit('function_call_result', { name, args, result });

    } catch (error) {
      console.error('❌ Function call error:', error);
      this.emit('error', error);
    }
  }

  /**
   * Send a message to the realtime API
   */
  sendMessage(message) {
    if (!this.isConnected || !this.ws) {
      console.error('❌ Cannot send message: not connected');
      return;
    }

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Disconnect from the realtime API
   */
  disconnect() {
    console.log('🔌 Disconnecting from Realtime API...');

    if (this.isRecording) {
      this.stopRecording();
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
    this.emit('disconnected');
  }

  /**
   * Check browser support for required APIs
   */
  checkBrowserSupport() {
    const requirements = [
      'WebSocket' in window,
      'AudioContext' in window || 'webkitAudioContext' in window,
      navigator.mediaDevices && navigator.mediaDevices.getUserMedia,
      'MediaRecorder' in window
    ];

    return requirements.every(Boolean);
  }

  /**
   * Initialize audio context
   */
  async initializeAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    // Resume audio context if needed
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Event listener management
   */
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  once(event, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }

  off(event, callback) {
    if (!this.eventListeners[event]) return;
    this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
  }

  emit(event, ...args) {
    if (!this.eventListeners[event]) return;
    this.eventListeners[event].forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error('❌ Event listener error:', error);
      }
    });
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      initialized: !!this.audioContext,
      connected: this.isConnected,
      recording: this.isRecording,
      browserSupported: this.checkBrowserSupport(),
      audioContext: this.audioContext?.state,
      capabilities: {
        realtimeVoice: true,
        streaming: true,
        functionCalling: true,
        emergencyDetection: true
      }
    };
  }
}

// Create and export singleton instance
export const realtimeVoiceService = new RealtimeVoiceService();
export default realtimeVoiceService;