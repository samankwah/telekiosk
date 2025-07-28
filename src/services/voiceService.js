import { VoiceErrorHandler, voiceCommandProcessor } from '../utils/voiceUtils.js';

class VoiceService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.isSpeaking = false;
    this.voices = [];
    this.selectedVoice = null;
    this.retryCount = 0;
    this.maxRetries = 3;
    
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
  }

  initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new window.SpeechRecognition();
    } else {
      console.warn('Speech Recognition not supported');
      return false;
    }

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;
    }

    return !!this.recognition;
  }

  initializeSpeechSynthesis() {
    if (this.synthesis) {
      // Wait for voices to load
      const loadVoices = () => {
        this.voices = this.synthesis.getVoices();
        // Prefer female voices for hospital assistant
        this.selectedVoice = this.voices.find(voice => 
          voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
        ) || this.voices.find(voice => voice.lang.startsWith('en')) || this.voices[0];
      };

      if (this.voices.length === 0) {
        this.synthesis.addEventListener('voiceschanged', loadVoices);
      } else {
        loadVoices();
      }
    }
  }

  isSupported() {
    return {
      speechRecognition: !!this.recognition,
      speechSynthesis: !!this.synthesis
    };
  }

  startListening(onResult, onError, onEnd) {
    if (!this.recognition || this.isListening) {
      return false;
    }

    this.isListening = true;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      // Process voice command through utility
      const processedCommand = voiceCommandProcessor.processVoiceCommand(transcript, confidence);
      
      if (onResult) {
        onResult(processedCommand.transcript, processedCommand.confidence);
      }
      
      // Reset retry count on successful recognition
      this.retryCount = 0;
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      
      const errorMessage = VoiceErrorHandler.getErrorMessage(event.error);
      const shouldRetry = VoiceErrorHandler.shouldRetry(event.error) && this.retryCount < this.maxRetries;
      
      if (shouldRetry) {
        this.retryCount++;
        console.log(`Voice recognition retry ${this.retryCount}/${this.maxRetries}`);
        // Auto-retry after a short delay
        setTimeout(() => {
          if (onResult && onError && onEnd) {
            this.startListening(onResult, onError, onEnd);
          }
        }, 1000);
      } else {
        this.retryCount = 0;
        if (onError) {
          onError(errorMessage, event.error);
        }
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) {
        onEnd();
      }
    };

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      this.isListening = false;
      console.error('Error starting speech recognition:', error);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text, onStart, onEnd, onError) {
    if (!this.synthesis) {
      console.warn('Speech synthesis not supported');
      return false;
    }

    // Stop any ongoing speech
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      this.isSpeaking = false;
      if (onError) onError(event.error);
    };

    try {
      this.synthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('Error with speech synthesis:', error);
      return false;
    }
  }

  stopSpeaking() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  getAvailableVoices() {
    return this.voices.filter(voice => voice.lang.startsWith('en'));
  }

  setVoice(voiceName) {
    const voice = this.voices.find(v => v.name === voiceName);
    if (voice) {
      this.selectedVoice = voice;
      return true;
    }
    return false;
  }

  requestMicrophonePermission() {
    return navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => true)
      .catch(() => false);
  }

  // Wake word detection (simplified)
  detectWakeWord(transcript) {
    const wakeWords = ['hey hospital', 'telekiosk', 'hello hospital', 'hi telekiosk'];
    const lowerTranscript = transcript.toLowerCase();
    return wakeWords.some(wake => lowerTranscript.includes(wake));
  }

  // Process voice command for better recognition
  processVoiceCommand(transcript) {
    // Clean up the transcript
    let processed = transcript.toLowerCase().trim();
    
    // Remove common filler words
    const fillers = ['um', 'uh', 'like', 'you know', 'well'];
    fillers.forEach(filler => {
      processed = processed.replace(new RegExp(`\\b${filler}\\b`, 'g'), '');
    });
    
    // Normalize spacing
    processed = processed.replace(/\s+/g, ' ').trim();
    
    return processed;
  }

  // Get voice command suggestions
  getVoiceCommandSuggestions() {
    return [
      "Book an appointment",
      "What services do you offer?",
      "How can I reach the hospital?",
      "What are your visiting hours?",
      "Show me your doctors",
      "I need emergency help",
      "Give me directions to the hospital"
    ];
  }
}

// Create singleton instance
export const voiceService = new VoiceService();
export default voiceService;