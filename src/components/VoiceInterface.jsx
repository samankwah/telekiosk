// Phase 3: Advanced Voice Interface Component for TeleKiosk Hospital
// Provides GPT-4o Realtime API voice interaction with emergency detection

import React, { useState, useEffect, useRef } from 'react';
import { realtimeVoiceService } from '../services/realtimeVoiceService.js';
import { multilingualService } from '../services/multilingualService.js';

const VoiceInterface = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [emergencyDetected, setEmergencyDetected] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [error, setError] = useState('');
  const [sessionMetrics, setSessionMetrics] = useState(null);
  
  // Audio visualization
  const [audioLevels, setAudioLevels] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Component lifecycle
  useEffect(() => {
    initializeVoiceService();
    return () => cleanup();
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!isInitialized) return;

    // Connection events
    realtimeVoiceService.on('connected', handleConnected);
    realtimeVoiceService.on('disconnected', handleDisconnected);
    realtimeVoiceService.on('error', handleError);

    // Voice events
    realtimeVoiceService.on('recording_started', () => setIsRecording(true));
    realtimeVoiceService.on('recording_stopped', () => setIsRecording(false));
    realtimeVoiceService.on('transcription', handleTranscription);
    realtimeVoiceService.on('text_response', handleTextResponse);
    
    // Emergency events
    realtimeVoiceService.on('emergency_detected', handleEmergencyDetected);
    realtimeVoiceService.on('critical_emergency', handleCriticalEmergency);

    // Audio events
    realtimeVoiceService.on('speech_started', () => console.log('🎤 Speech started'));
    realtimeVoiceService.on('speech_stopped', () => console.log('🔇 Speech stopped'));
    realtimeVoiceService.on('audio_delta', handleAudioDelta);

    return () => {
      // Cleanup event listeners
      realtimeVoiceService.off('connected', handleConnected);
      realtimeVoiceService.off('disconnected', handleDisconnected);
      realtimeVoiceService.off('error', handleError);
      realtimeVoiceService.off('recording_started', () => setIsRecording(true));
      realtimeVoiceService.off('recording_stopped', () => setIsRecording(false));
      realtimeVoiceService.off('transcription', handleTranscription);
      realtimeVoiceService.off('text_response', handleTextResponse);
      realtimeVoiceService.off('emergency_detected', handleEmergencyDetected);
      realtimeVoiceService.off('critical_emergency', handleCriticalEmergency);
      realtimeVoiceService.off('speech_started', () => console.log('🎤 Speech started'));
      realtimeVoiceService.off('speech_stopped', () => console.log('🔇 Speech stopped'));
      realtimeVoiceService.off('audio_delta', handleAudioDelta);
    };
  }, [isInitialized]);

  /**
   * Initialize voice service
   */
  const initializeVoiceService = async () => {
    try {
      const result = await realtimeVoiceService.initialize();
      if (result.success) {
        setIsInitialized(true);
        setCurrentLanguage(multilingualService.getCurrentLanguage());
        console.log('✅ Voice interface initialized');
      } else {
        setError(result.error || 'Failed to initialize voice service');
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Voice initialization error:', err);
    }
  };

  /**
   * Start voice conversation
   */
  const startVoiceConversation = async () => {
    try {
      setError('');
      setEmergencyDetected(false);
      
      // Connect to realtime API
      await realtimeVoiceService.connect();
      
      // Start recording
      await realtimeVoiceService.startRecording();
      
    } catch (err) {
      setError(err.message);
      console.error('❌ Failed to start voice conversation:', err);
    }
  };

  /**
   * Stop voice conversation
   */
  const stopVoiceConversation = () => {
    try {
      realtimeVoiceService.stopRecording();
      realtimeVoiceService.disconnect();
      
      // Update session metrics
      const status = realtimeVoiceService.getStatus();
      setSessionMetrics(status.metrics);
      
    } catch (err) {
      console.error('❌ Error stopping voice conversation:', err);
    }
  };

  /**
   * Event handlers
   */
  const handleConnected = () => {
    setIsConnected(true);
    console.log('✅ Connected to voice service');
  };

  const handleDisconnected = () => {
    setIsConnected(false);
    setIsRecording(false);
    console.log('🔌 Disconnected from voice service');
  };

  const handleError = (error) => {
    setError(error.message || 'Voice service error occurred');
    setIsConnected(false);
    setIsRecording(false);
    console.error('❌ Voice service error:', error);
  };

  const handleTranscription = (transcriptText) => {
    setTranscript(prev => prev + ' ' + transcriptText);
  };

  const handleTextResponse = (responseText) => {
    setResponse(responseText);
  };

  const handleEmergencyDetected = (data) => {
    setEmergencyDetected(true);
    console.log('🚨 Emergency detected:', data.analysis.severity);
    
    // Visual alert
    document.body.style.backgroundColor = '#ffebee';
    setTimeout(() => {
      document.body.style.backgroundColor = '';
    }, 5000);
  };

  const handleCriticalEmergency = (data) => {
    setEmergencyDetected(true);
    
    // Critical emergency visual alert
    document.body.style.backgroundColor = '#f44336';
    document.body.style.color = 'white';
    
    // Play emergency sound if available
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D2z2EQC1uU4vbMZ');
      audio.play();
    } catch (e) {
      console.log('Unable to play emergency sound');
    }
    
    setTimeout(() => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }, 10000);
  };

  const handleAudioDelta = (audioData) => {
    // Update audio visualization
    const levels = Array.from(audioData).slice(0, 50);
    setAudioLevels(levels);
  };

  /**
   * Language selection
   */
  const handleLanguageChange = (langCode) => {
    multilingualService.setLanguage(langCode);
    setCurrentLanguage(langCode);
  };

  /**
   * Cleanup
   */
  const cleanup = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    stopVoiceConversation();
  };

  /**
   * Audio visualization effect
   */
  useEffect(() => {
    if (!canvasRef.current || audioLevels.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw audio levels
    const barWidth = width / audioLevels.length;
    audioLevels.forEach((level, index) => {
      const barHeight = (Math.abs(level) * height) / 2;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;

      ctx.fillStyle = emergencyDetected ? '#f44336' : '#2196f3';
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });
  }, [audioLevels, emergencyDetected]);

  if (!isInitialized) {
    return (
      <div className="voice-interface-loading">
        <div className="loading-spinner" />
        <p>Initializing voice service...</p>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`voice-interface ${emergencyDetected ? 'emergency-mode' : ''}`}>
      <div className="voice-header">
        <h2>🎤 TeleKiosk Voice Assistant</h2>
        <div className="language-selector">
          <label>Language:</label>
          <select 
            value={currentLanguage} 
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={isRecording}
          >
            <option value="en">English</option>
            <option value="tw">Twi</option>
            <option value="ga">Ga</option>
            <option value="ee">Ewe</option>
          </select>
        </div>
      </div>

      {emergencyDetected && (
        <div className="emergency-alert">
          <h3>🚨 MEDICAL EMERGENCY DETECTED</h3>
          <p>Emergency services are being notified. Please stay on the line.</p>
          <div className="emergency-contacts">
            <p>Emergency: <a href="tel:999">999</a> or <a href="tel:193">193</a></p>
            <p>Hospital: <a href="tel:+233599211311">+233-599-211-311</a></p>
          </div>
        </div>
      )}

      <div className="voice-controls">
        {!isConnected ? (
          <button 
            className="voice-btn start-btn"
            onClick={startVoiceConversation}
            disabled={!isInitialized}
          >
            🎤 Start Voice Conversation
          </button>
        ) : (
          <button 
            className="voice-btn stop-btn"
            onClick={stopVoiceConversation}
          >
            🛑 Stop Conversation
          </button>
        )}
      </div>

      <div className="voice-status">
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
        <div className={`recording-indicator ${isRecording ? 'recording' : ''}`}>
          {isRecording ? '🎤 Recording...' : '🔇 Not Recording'}
        </div>
      </div>

      <div className="audio-visualization">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={100}
          style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            backgroundColor: emergencyDetected ? '#ffebee' : '#f5f5f5'
          }}
        />
      </div>

      <div className="conversation-display">
        {transcript && (
          <div className="transcript-section">
            <h4>📝 You said:</h4>
            <p className="transcript">{transcript}</p>
          </div>
        )}
        
        {response && (
          <div className="response-section">
            <h4>🤖 Assistant:</h4>
            <p className="response">{response}</p>
          </div>
        )}
      </div>

      {sessionMetrics && (
        <div className="session-metrics">
          <h4>📊 Session Metrics</h4>
          <div className="metrics-grid">
            <div>Total Sessions: {sessionMetrics.totalSessions}</div>
            <div>Emergencies Detected: {sessionMetrics.emergencyDetections}</div>
            <div>Avg Duration: {Math.round(sessionMetrics.averageSessionDuration / 1000)}s</div>
            <div>Languages Used: {Object.keys(sessionMetrics.languageDetections).filter(lang => 
              sessionMetrics.languageDetections[lang] > 0
            ).length}</div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-display">
          <h4>❌ Error</h4>
          <p>{error}</p>
          <button onClick={() => setError('')}>Dismiss</button>
        </div>
      )}

      <div className="voice-help">
        <h4>💡 Voice Commands</h4>
        <ul>
          <li>"Book an appointment" - Schedule a medical consultation</li>
          <li>"Emergency help" - Get immediate emergency assistance</li>
          <li>"Hospital information" - Learn about services and locations</li>
          <li>"Switch to [language]" - Change conversation language</li>
        </ul>
      </div>

      <style jsx>{`
        .voice-interface {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .voice-interface.emergency-mode {
          border: 3px solid #f44336;
          background-color: #ffebee;
        }

        .voice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .language-selector select {
          padding: 5px 10px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .emergency-alert {
          background: linear-gradient(45deg, #f44336, #d32f2f);
          color: white;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        .emergency-contacts {
          margin-top: 10px;
        }

        .emergency-contacts a {
          color: white;
          font-weight: bold;
          text-decoration: none;
          margin: 0 10px;
        }

        .voice-controls {
          text-align: center;
          margin: 20px 0;
        }

        .voice-btn {
          padding: 15px 30px;
          font-size: 18px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .start-btn {
          background: linear-gradient(45deg, #4CAF50, #45a049);
          color: white;
        }

        .start-btn:hover {
          background: linear-gradient(45deg, #45a049, #3d8b3d);
          transform: translateY(-2px);
        }

        .stop-btn {
          background: linear-gradient(45deg, #f44336, #d32f2f);
          color: white;
        }

        .stop-btn:hover {
          background: linear-gradient(45deg, #d32f2f, #c62828);
          transform: translateY(-2px);
        }

        .voice-status {
          display: flex;
          justify-content: space-around;
          margin: 20px 0;
        }

        .status-indicator, .recording-indicator {
          padding: 10px 15px;
          border-radius: 20px;
          font-weight: bold;
        }

        .status-indicator.connected {
          background-color: #e8f5e8;
          color: #4CAF50;
        }

        .status-indicator.disconnected {
          background-color: #ffebee;
          color: #f44336;
        }

        .recording-indicator.recording {
          background-color: #ffebee;
          color: #f44336;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.5; }
        }

        .audio-visualization {
          margin: 20px 0;
          text-align: center;
        }

        .conversation-display {
          margin: 20px 0;
        }

        .transcript-section, .response-section {
          margin: 15px 0;
          padding: 15px;
          border-radius: 8px;
        }

        .transcript-section {
          background-color: #e3f2fd;
          border-left: 4px solid #2196f3;
        }

        .response-section {
          background-color: #f1f8e9;
          border-left: 4px solid #4CAF50;
        }

        .session-metrics {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .error-display {
          background-color: #ffebee;
          border: 1px solid #f44336;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }

        .voice-help {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }

        .voice-help ul {
          list-style-type: none;
          padding: 0;
        }

        .voice-help li {
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }

        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 2s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .voice-interface-loading {
          text-align: center;
          padding: 50px;
        }

        .error {
          color: #f44336;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default VoiceInterface;