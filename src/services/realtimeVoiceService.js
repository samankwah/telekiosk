// Phase 3: GPT-4o Realtime API Service for Advanced Voice Integration
// Provides real-time voice conversation capabilities with enhanced emergency detection
// and multilingual support for TeleKiosk Hospital

import { analyticsService } from './analyticsService.js';
import { multilingualService } from './multilingualService.js';
import { enhancedEmergencyService } from './enhancedEmergencyService.js';
// import { HEALTHCARE_SYSTEM_PROMPT } from '../components/chatbot/HealthcarePrompts.js';

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

    // Phase 3: Enhanced voice interaction state
    this.voiceSession = {
      sessionId: null,
      conversationId: null,
      turnCount: 0,
      currentLanguage: 'en',
      emergencyDetected: false,
      lastTranscript: '',
      voiceActivityDetected: false,
      totalSessionTime: 0,
      startTime: null
    };

    // Phase 3: Advanced voice metrics
    this.voiceMetrics = {
      totalSessions: 0,
      emergencyDetections: 0,
      averageSessionDuration: 0,
      languageDetections: {
        en: 0,
        tw: 0,
        ga: 0,
        ee: 0
      },
      audioQualityMetrics: {
        dropouts: 0,
        latencyIssues: 0,
        transcriptionErrors: 0
      }
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
      
      // Track initialization with Phase 3 metrics
      analyticsService.trackEvent('phase3_voice_service_init', {
        service: 'gpt4o-realtime',
        timestamp: Date.now(),
        supportedLanguages: multilingualService.getSupportedLanguages().map(l => l.code),
        emergencyDetectionEnabled: true,
        advancedFeaturesEnabled: true
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
   * Set up the realtime session with Phase 3 enhancements
   */
  setupSession() {
    // Initialize session tracking
    this.voiceSession.sessionId = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.voiceSession.conversationId = `conv_${Date.now()}`;
    this.voiceSession.startTime = Date.now();
    this.voiceSession.currentLanguage = multilingualService.getCurrentLanguage();
    
    // Get multilingual healthcare instructions
    const multilingualInstructions = multilingualService.getSystemPrompt(this.voiceSession.currentLanguage);
    
    const sessionConfig = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: multilingualInstructions + `\n\nPhase 3 VOICE INTERACTION ENHANCEMENTS:
- You are now in advanced voice conversation mode for TeleKiosk Hospital
- Speak naturally and conversationally in ${multilingualService.getLanguageName(this.voiceSession.currentLanguage)}
- Keep responses concise but helpful, especially for medical consultations
- For emergencies, speak clearly and urgently, immediately escalate to emergency services
- Monitor for language switches and adapt accordingly
- Provide empathetic, professional healthcare guidance
- If you detect distress or emergency keywords, prioritize immediate help
- Support appointment booking, hospital information, and emergency detection through voice
- Always maintain patient confidentiality in voice interactions`,
        voice: this.config.voice,
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.4, // More sensitive for healthcare
          prefix_padding_ms: 300,
          silence_duration_ms: 400 // Shorter for responsive healthcare interaction
        },
        temperature: this.config.temperature,
        max_response_output_tokens: this.config.maxTokens,
        tools: this.getPhase3VoiceTools()
      }
    };

    this.sendMessage(sessionConfig);
    
    // Track session start
    analyticsService.trackEvent('phase3_voice_session_start', {
      sessionId: this.voiceSession.sessionId,
      language: this.voiceSession.currentLanguage,
      timestamp: this.voiceSession.startTime
    });
    
    this.voiceMetrics.totalSessions++;
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

      analyticsService.trackEvent('phase3_voice_recording_start', {
        sessionId: this.voiceSession.sessionId,
        timestamp: Date.now(),
        language: this.voiceSession.currentLanguage
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

    analyticsService.trackEvent('phase3_voice_recording_stop', {
      sessionId: this.voiceSession.sessionId,
      timestamp: Date.now(),
      duration: Date.now() - this.voiceSession.startTime
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
        
        // Phase 3: Enhanced transcription processing
        this.processTranscription(transcript, message.confidence || 0.9);
        this.emit('transcription', transcript);
        
        analyticsService.trackEvent('phase3_voice_transcription', {
          sessionId: this.voiceSession.sessionId,
          transcript: transcript,
          confidence: message.confidence || 0.9,
          language: this.voiceSession.currentLanguage,
          turnCount: this.voiceSession.turnCount++
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
   * Phase 3: Process transcription with emergency detection and language analysis
   */
  processTranscription(transcript, confidence) {
    this.voiceSession.lastTranscript = transcript;
    
    try {
      // Phase 3: Real-time emergency detection on voice transcription
      const emergencyAnalysis = enhancedEmergencyService.analyzeEmergency(transcript, {
        source: 'voice_transcription',
        sessionId: this.voiceSession.sessionId,
        confidence: confidence,
        language: this.voiceSession.currentLanguage
      });

      if (emergencyAnalysis.detected) {
        console.log('🚨 Emergency detected in voice:', emergencyAnalysis.severity);
        
        this.voiceSession.emergencyDetected = true;
        this.voiceMetrics.emergencyDetections++;
        
        // Emit emergency event for immediate handling
        this.emit('emergency_detected', {
          analysis: emergencyAnalysis,
          transcript: transcript,
          timestamp: Date.now()
        });

        // Track emergency detection
        analyticsService.trackEvent('phase3_voice_emergency_detected', {
          sessionId: this.voiceSession.sessionId,
          severity: emergencyAnalysis.severity,
          confidence: emergencyAnalysis.confidence,
          transcript: transcript,
          language: this.voiceSession.currentLanguage
        });

        // For critical emergencies, interrupt and provide immediate guidance
        if (emergencyAnalysis.severity === 'critical') {
          this.handleCriticalVoiceEmergency(emergencyAnalysis, transcript);
        }
      }

      // Phase 3: Language detection and switching
      const languageDetection = multilingualService.detectLanguage(transcript);
      if (languageDetection.language !== this.voiceSession.currentLanguage && languageDetection.confidence > 0.7) {
        console.log(`🌍 Language switch detected: ${this.voiceSession.currentLanguage} → ${languageDetection.language}`);
        
        this.voiceSession.currentLanguage = languageDetection.language;
        this.voiceMetrics.languageDetections[languageDetection.language]++;
        
        // Update session language
        this.updateSessionLanguage(languageDetection.language);
      }

    } catch (error) {
      console.error('❌ Error processing transcription:', error);
      this.voiceMetrics.audioQualityMetrics.transcriptionErrors++;
    }
  }

  /**
   * Phase 3: Handle critical voice emergency
   */
  handleCriticalVoiceEmergency(analysis, transcript) {
    console.log('🚨 CRITICAL VOICE EMERGENCY - Interrupting conversation');
    
    // Send emergency interruption
    this.sendMessage({
      type: 'response.cancel'
    });

    // Send immediate emergency response
    const emergencyMessage = multilingualService.getEmergencyMessage(this.voiceSession.currentLanguage);
    
    this.sendMessage({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'assistant',
        content: [{
          type: 'text',
          text: `🚨 CRITICAL MEDICAL EMERGENCY DETECTED! ${emergencyMessage} I am immediately connecting you to emergency services. Please stay on the line.`
        }]
      }
    });

    // Generate emergency response
    this.sendMessage({ type: 'response.create' });

    // Emit critical emergency event
    this.emit('critical_emergency', {
      analysis,
      transcript,
      sessionId: this.voiceSession.sessionId
    });
  }

  /**
   * Phase 3: Update session language
   */
  updateSessionLanguage(newLanguage) {
    const instructions = multilingualService.getSystemPrompt(newLanguage);
    
    this.sendMessage({
      type: 'session.update',
      session: {
        instructions: instructions + `\n\nYou have switched to ${multilingualService.getLanguageName(newLanguage)}. Please continue the conversation in this language.`
      }
    });

    analyticsService.trackEvent('phase3_voice_language_switch', {
      sessionId: this.voiceSession.sessionId,
      fromLanguage: this.voiceSession.currentLanguage,
      toLanguage: newLanguage,
      timestamp: Date.now()
    });
  }

  /**
   * Phase 3: Get advanced voice tools for function calling
   */
  getPhase3VoiceTools() {
    return [
      {
        type: 'function',
        name: 'book_appointment_voice',
        description: 'Book a medical appointment through voice interaction at TeleKiosk Hospital',
        parameters: {
          type: 'object',
          properties: {
            patientName: { 
              type: 'string', 
              description: 'Full name of the patient' 
            },
            service: { 
              type: 'string', 
              description: 'Type of medical service (cardiology, pediatrics, dermatology, neurology, orthopedics, emergency)',
              enum: ['cardiology', 'pediatrics', 'dermatology', 'neurology', 'orthopedics', 'emergency', 'general']
            },
            preferredDate: { 
              type: 'string', 
              description: 'Preferred appointment date' 
            },
            preferredTime: { 
              type: 'string', 
              description: 'Preferred appointment time' 
            },
            contactPhone: {
              type: 'string',
              description: 'Patient contact phone number'
            },
            urgency: {
              type: 'string',
              enum: ['routine', 'urgent', 'emergency'],
              description: 'Urgency level of the appointment'
            }
          },
          required: ['patientName', 'service']
        }
      },
      {
        type: 'function',
        name: 'emergency_voice_alert',
        description: 'Handle emergency situation detected through voice with immediate response',
        parameters: {
          type: 'object',
          properties: {
            emergencyType: { 
              type: 'string', 
              description: 'Type of emergency detected' 
            },
            severity: { 
              type: 'string', 
              enum: ['critical', 'high', 'medium', 'low'],
              description: 'Severity level of the emergency' 
            },
            symptoms: {
              type: 'string',
              description: 'Symptoms or situation described by the patient'
            },
            immediateAction: {
              type: 'string',
              description: 'Immediate action recommended'
            }
          },
          required: ['emergencyType', 'severity']
        }
      },
      {
        type: 'function', 
        name: 'get_hospital_voice_info',
        description: 'Provide TeleKiosk Hospital information through voice response',
        parameters: {
          type: 'object',
          properties: {
            infoType: {
              type: 'string',
              enum: ['services', 'doctors', 'contact', 'hours', 'location', 'directions', 'emergency_contact'],
              description: 'Type of hospital information requested'
            },
            language: {
              type: 'string',
              enum: ['en', 'tw', 'ga', 'ee'],
              description: 'Preferred language for the response'
            },
            specificService: {
              type: 'string',
              description: 'Specific service to get information about (optional)'
            }
          },
          required: ['infoType']
        }
      }
    ];
  }

  /**
   * Disconnect from the realtime API
   */
  disconnect() {
    console.log('🔌 Disconnecting from Realtime API...');

    // Calculate session metrics before disconnect
    if (this.voiceSession.startTime) {
      const sessionDuration = Date.now() - this.voiceSession.startTime;
      this.voiceSession.totalSessionTime = sessionDuration;
      
      // Update average session duration
      this.voiceMetrics.averageSessionDuration = (
        (this.voiceMetrics.averageSessionDuration * (this.voiceMetrics.totalSessions - 1) + sessionDuration) / 
        this.voiceMetrics.totalSessions
      );

      // Track session end
      analyticsService.trackEvent('phase3_voice_session_end', {
        sessionId: this.voiceSession.sessionId,
        duration: sessionDuration,
        turnCount: this.voiceSession.turnCount,
        emergencyDetected: this.voiceSession.emergencyDetected,
        language: this.voiceSession.currentLanguage,
        completedNormally: true
      });
    }

    if (this.isRecording) {
      this.stopRecording();
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
    
    // Reset session state
    this.resetVoiceSession();
    
    this.emit('disconnected');
  }

  /**
   * Phase 3: Reset voice session state
   */
  resetVoiceSession() {
    this.voiceSession = {
      sessionId: null,
      conversationId: null,
      turnCount: 0,
      currentLanguage: multilingualService.getCurrentLanguage(),
      emergencyDetected: false,
      lastTranscript: '',
      voiceActivityDetected: false,
      totalSessionTime: 0,
      startTime: null
    };
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
   * Phase 3: Get comprehensive service status with advanced metrics
   */
  getStatus() {
    return {
      initialized: !!this.audioContext,
      connected: this.isConnected,
      recording: this.isRecording,
      browserSupported: this.checkBrowserSupport(),
      audioContext: this.audioContext?.state,
      
      // Phase 3: Current session information
      currentSession: {
        sessionId: this.voiceSession.sessionId,
        language: this.voiceSession.currentLanguage,
        emergencyDetected: this.voiceSession.emergencyDetected,
        turnCount: this.voiceSession.turnCount,
        duration: this.voiceSession.startTime ? Date.now() - this.voiceSession.startTime : 0
      },
      
      // Phase 3: Advanced capabilities
      capabilities: {
        realtimeVoice: true,
        streaming: true,
        functionCalling: true,
        emergencyDetection: true,
        multilingualSupport: true,
        languageDetection: true,
        voiceInterruption: true,
        realTimeTranscription: true,
        advancedAnalytics: true
      },
      
      // Phase 3: Voice metrics
      metrics: this.voiceMetrics,
      
      // Phase 3: Supported languages
      supportedLanguages: multilingualService.getSupportedLanguages(),
      
      // Configuration
      config: {
        model: this.config.model,
        voice: this.config.voice,
        temperature: this.config.temperature,
        maxTokens: this.config.maxTokens,
        healthcareMode: this.config.healthcareMode
      }
    };
  }
}

// Create and export singleton instance
export const realtimeVoiceService = new RealtimeVoiceService();
export default realtimeVoiceService;