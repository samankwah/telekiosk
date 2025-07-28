// Enhanced Multi-Language Voice Service with Auto-Detection
import { VoiceErrorHandler, voiceCommandProcessor } from '../utils/voiceUtils.js';

// Supported languages with their speech recognition codes
export const SUPPORTED_LANGUAGES = {
  'en-US': { name: 'English (US)', native: 'English', flag: '🇺🇸' },
  'en-GB': { name: 'English (UK)', native: 'English', flag: '🇬🇧' },
  'es-ES': { name: 'Spanish (Spain)', native: 'Español', flag: '🇪🇸' },
  'es-MX': { name: 'Spanish (Mexico)', native: 'Español', flag: '🇲🇽' },
  'fr-FR': { name: 'French', native: 'Français', flag: '🇫🇷' },
  'de-DE': { name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  'it-IT': { name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  'pt-BR': { name: 'Portuguese (Brazil)', native: 'Português', flag: '🇧🇷' },
  'pt-PT': { name: 'Portuguese (Portugal)', native: 'Português', flag: '🇵🇹' },
  'ru-RU': { name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  'zh-CN': { name: 'Chinese (Simplified)', native: '中文', flag: '🇨🇳' },
  'zh-TW': { name: 'Chinese (Traditional)', native: '中文', flag: '🇹🇼' },
  'ja-JP': { name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  'ko-KR': { name: 'Korean', native: '한국어', flag: '🇰🇷' },
  'ar-SA': { name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  'hi-IN': { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  'th-TH': { name: 'Thai', native: 'ไทย', flag: '🇹🇭' },
  'vi-VN': { name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
  'tr-TR': { name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  'nl-NL': { name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
  'sw-KE': { name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  'yo-NG': { name: 'Yoruba', native: 'Yorùbá', flag: '🇳🇬' },
  'ig-NG': { name: 'Igbo', native: 'Igbo', flag: '🇳🇬' },
  'ha-NG': { name: 'Hausa', native: 'Hausa', flag: '🇳🇬' },
  'tw-GH': { name: 'Twi', native: 'Twi', flag: '🇬🇭' }
};

// Language detection patterns
const LANGUAGE_PATTERNS = {
  'en': /\b(hello|hi|help|book|appointment|doctor|hospital|service|emergency)\b/i,
  'es': /\b(hola|ayuda|cita|doctor|hospital|servicio|emergencia|médico)\b/i,
  'fr': /\b(bonjour|aide|rendez-vous|docteur|hôpital|service|urgence)\b/i,
  'de': /\b(hallo|hilfe|termin|arzt|krankenhaus|service|notfall)\b/i,
  'it': /\b(ciao|aiuto|appuntamento|dottore|ospedale|servizio|emergenza)\b/i,
  'pt': /\b(olá|ajuda|consulta|doutor|hospital|serviço|emergência)\b/i,
  'ru': /\b(привет|помощь|запись|врач|больница|услуга|экстренный)\b/i,
  'zh': /\b(你好|帮助|预约|医生|医院|服务|紧急)\b/i,
  'ja': /\b(こんにちは|ヘルプ|予約|医師|病院|サービス|緊急)\b/i,
  'ko': /\b(안녕|도움|예약|의사|병원|서비스|응급)\b/i,
  'ar': /\b(مرحبا|مساعدة|موعد|طبيب|مستشفى|خدمة|طوارئ)\b/i,
  'hi': /\b(नमस्ते|सहायता|अपॉइंटमेंट|डॉक्टर|अस्पताल|सेवा|आपातकाल)\b/i,
  'th': /\b(สวัสดี|ช่วยเหลือ|นัดหมาย|หมอ|โรงพยาบาล|บริการ|ฉุกเฉิน)\b/i,
  'vi': /\b(xin chào|giúp đỡ|hẹn|bác sĩ|bệnh viện|dịch vụ|khẩn cấp)\b/i,
  'tr': /\b(merhaba|yardım|randevu|doktor|hastane|hizmet|acil)\b/i,
  'nl': /\b(hallo|hulp|afspraak|dokter|ziekenhuis|service|noodgeval)\b/i,
  'sw': /\b(hujambo|msaada|miadi|daktari|hospitali|huduma|dharura)\b/i,
  'yo': /\b(pẹlẹ o|iranlọwọ|adehun|dọkita|ile-iwosan|iṣẹ|pajawiri)\b/i,
  'ig': /\b(ndewo|enyemaka|nzuko|dọkinta|ụlọ ọgwụ|ọrụ|ihe mberede)\b/i,
  'ha': /\b(sannu|taimako|alƙawari|likita|asibiti|sabis|gaggawa)\b/i,
  'tw': /\b(akwaaba|mmoa|nhyiam|oduruyɛfo|ayaresabea|adwuma|ntɛm)\b/i
};

class MultiLanguageVoiceService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.isSpeaking = false;
    this.voices = [];
    this.voicesByLanguage = new Map();
    this.currentLanguage = 'en-US';
    this.detectedLanguage = null;
    this.autoLanguageDetection = true;
    this.continuousListening = false;
    this.retryCount = 0;
    this.maxRetries = 3;
    this.confidenceThreshold = 0.8;
    
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
    this.setupLanguageDetection();
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
      this.recognition.interimResults = true;
      this.recognition.lang = this.currentLanguage;
      this.recognition.maxAlternatives = 3;
    }

    return !!this.recognition;
  }

  initializeSpeechSynthesis() {
    if (this.synthesis) {
      const loadVoices = () => {
        this.voices = this.synthesis.getVoices();
        this.organizeVoicesByLanguage();
        this.selectBestVoiceForLanguage(this.currentLanguage);
      };

      if (this.voices.length === 0) {
        this.synthesis.addEventListener('voiceschanged', loadVoices);
      } else {
        loadVoices();
      }
    }
  }

  organizeVoicesByLanguage() {
    this.voicesByLanguage.clear();
    
    this.voices.forEach(voice => {
      const lang = voice.lang.split('-')[0]; // Get base language code
      const fullLang = voice.lang;
      
      if (!this.voicesByLanguage.has(fullLang)) {
        this.voicesByLanguage.set(fullLang, []);
      }
      if (!this.voicesByLanguage.has(lang)) {
        this.voicesByLanguage.set(lang, []);
      }
      
      this.voicesByLanguage.get(fullLang).push(voice);
      this.voicesByLanguage.get(lang).push(voice);
    });
  }

  setupLanguageDetection() {
    // Auto-detect browser language as fallback
    const browserLang = navigator.language || navigator.languages[0];
    if (SUPPORTED_LANGUAGES[browserLang]) {
      this.currentLanguage = browserLang;
    }
  }

  // Detect language from text input
  detectLanguage(text) {
    if (!text) return this.currentLanguage;

    const scores = {};
    
    // Initialize scores for all languages
    Object.keys(LANGUAGE_PATTERNS).forEach(lang => {
      scores[lang] = 0;
    });

    // Test against each pattern
    Object.entries(LANGUAGE_PATTERNS).forEach(([lang, pattern]) => {
      const matches = text.match(pattern);
      if (matches) {
        scores[lang] += matches.length;
      }
    });

    // Find the language with highest score
    const detectedLang = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );

    // Map to full language code
    const fullLangCode = this.mapToFullLanguageCode(detectedLang, text);
    
    if (scores[detectedLang] > 0) {
      this.detectedLanguage = fullLangCode;
      if (this.autoLanguageDetection) {
        this.switchLanguage(fullLangCode);
      }
      return fullLangCode;
    }

    return this.currentLanguage;
  }

  mapToFullLanguageCode(baseLang, text) {
    const languageMapping = {
      'en': this.detectEnglishVariant(text),
      'es': this.detectSpanishVariant(text),
      'pt': this.detectPortugueseVariant(text),
      'zh': this.detectChineseVariant(text),
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'ru': 'ru-RU',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'ar': 'ar-SA',
      'hi': 'hi-IN',
      'th': 'th-TH',
      'vi': 'vi-VN',
      'tr': 'tr-TR',
      'nl': 'nl-NL',
      'sw': 'sw-KE',
      'yo': 'yo-NG',
      'ig': 'ig-NG',
      'ha': 'ha-NG',
      'tw': 'tw-GH'
    };

    return languageMapping[baseLang] || this.currentLanguage;
  }

  detectEnglishVariant(text) {
    // Simple heuristics for English variants
    if (/\b(colour|favour|centre|realise)\b/i.test(text)) {
      return 'en-GB';
    }
    return 'en-US';
  }

  detectSpanishVariant(text) {
    // Simple heuristics for Spanish variants
    if (/\b(computadora|plática|chamarra)\b/i.test(text)) {
      return 'es-MX';
    }
    return 'es-ES';
  }

  detectPortugueseVariant(text) {
    // Simple heuristics for Portuguese variants
    if (/\b(computador|falar|jaqueta)\b/i.test(text)) {
      return 'pt-BR';
    }
    return 'pt-PT';
  }

  detectChineseVariant(text) {
    // Simple check for traditional vs simplified characters
    if (/[繁體]/i.test(text)) {
      return 'zh-TW';
    }
    return 'zh-CN';
  }

  // Switch language for both recognition and synthesis
  switchLanguage(languageCode) {
    if (!SUPPORTED_LANGUAGES[languageCode]) {
      console.warn(`Language ${languageCode} not supported`);
      return false;
    }

    this.currentLanguage = languageCode;
    
    // Update speech recognition language
    if (this.recognition) {
      this.recognition.lang = languageCode;
    }

    // Select best voice for the language
    this.selectBestVoiceForLanguage(languageCode);

    console.log(`Language switched to: ${SUPPORTED_LANGUAGES[languageCode].name}`);
    return true;
  }

  selectBestVoiceForLanguage(languageCode) {
    const baseLang = languageCode.split('-')[0];
    
    // Try exact match first
    let voices = this.voicesByLanguage.get(languageCode) || [];
    
    // Fallback to base language
    if (voices.length === 0) {
      voices = this.voicesByLanguage.get(baseLang) || [];
    }

    if (voices.length > 0) {
      // Prefer female voices for hospital setting
      let selectedVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('maria') ||
        voice.name.toLowerCase().includes('samantha')
      );

      // Fallback to any available voice
      if (!selectedVoice) {
        selectedVoice = voices[0];
      }

      this.selectedVoice = selectedVoice;
      console.log(`Selected voice: ${selectedVoice.name} for ${languageCode}`);
    }
  }

  // Enhanced listening with language detection
  startListening(onResult, onError, onEnd, options = {}) {
    if (!this.recognition || this.isListening) {
      return false;
    }

    const {
      continuous = this.continuousListening,
      interimResults = true,
      autoDetectLanguage = this.autoLanguageDetection
    } = options;

    this.isListening = true;
    this.recognition.continuous = continuous;
    this.recognition.interimResults = interimResults;

    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;

        // Auto-detect language if enabled
        if (autoDetectLanguage && result.isFinal) {
          const detectedLang = this.detectLanguage(transcript);
          if (detectedLang !== this.currentLanguage) {
            console.log(`Language auto-detected: ${detectedLang}`);
          }
        }

        // Process voice command through utility
        const processedCommand = voiceCommandProcessor.processVoiceCommand(transcript, confidence);
        
        if (onResult) {
          onResult(processedCommand.transcript, processedCommand.confidence, {
            isFinal: result.isFinal,
            detectedLanguage: this.detectedLanguage,
            currentLanguage: this.currentLanguage,
            alternatives: this.getAlternatives(event.results[i])
          });
        }

        // Auto-respond if confidence is high and continuous listening is on
        if (continuous && result.isFinal && confidence > this.confidenceThreshold) {
          this.handleAutoResponse(processedCommand.transcript);
        }
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
        setTimeout(() => {
          if (onResult && onError && onEnd) {
            this.startListening(onResult, onError, onEnd, options);
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

  // Get alternative transcriptions
  getAlternatives(result) {
    const alternatives = [];
    for (let i = 0; i < result.length && i < 3; i++) {
      alternatives.push({
        transcript: result[i].transcript,
        confidence: result[i].confidence
      });
    }
    return alternatives;
  }

  // Handle auto-response for continuous listening
  handleAutoResponse(transcript) {
    // This would integrate with the chatbot service for auto-responses
    console.log(`Auto-response triggered for: ${transcript}`);
    // Implementation would call chatbot service here
  }

  // Enhanced speak function with language support
  speak(text, onStart, onEnd, onError, options = {}) {
    if (!this.synthesis) {
      console.warn('Speech synthesis not supported');
      return false;
    }

    const {
      language = this.currentLanguage,
      rate = 0.9,
      pitch = 1.0,
      volume = 0.8
    } = options;

    // Stop any ongoing speech
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on language
    const voice = this.getVoiceForLanguage(language);
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = language;

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

  getVoiceForLanguage(languageCode) {
    const baseLang = languageCode.split('-')[0];
    
    // Try exact match first
    let voices = this.voicesByLanguage.get(languageCode) || [];
    
    // Fallback to base language
    if (voices.length === 0) {
      voices = this.voicesByLanguage.get(baseLang) || [];
    }

    return voices[0] || this.selectedVoice;
  }

  // Enable/disable continuous listening
  setContinuousListening(enabled) {
    this.continuousListening = enabled;
    console.log(`Continuous listening ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Enable/disable auto language detection
  setAutoLanguageDetection(enabled) {
    this.autoLanguageDetection = enabled;
    console.log(`Auto language detection ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Get available languages
  getAvailableLanguages() {
    return Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
      code,
      ...info,
      hasVoice: this.voicesByLanguage.has(code) || this.voicesByLanguage.has(code.split('-')[0])
    }));
  }

  // Get current language info
  getCurrentLanguageInfo() {
    return {
      current: this.currentLanguage,
      detected: this.detectedLanguage,
      info: SUPPORTED_LANGUAGES[this.currentLanguage],
      hasVoice: !!this.selectedVoice
    };
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  stopSpeaking() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  // Check support for specific language
  isLanguageSupported(languageCode) {
    return !!SUPPORTED_LANGUAGES[languageCode];
  }

  // Get voice support status
  isVoiceSupported() {
    return {
      speechRecognition: !!this.recognition,
      speechSynthesis: !!this.synthesis,
      multiLanguage: true,
      availableLanguages: this.getAvailableLanguages().length
    };
  }
}

// Create singleton instance
export const multiLanguageVoiceService = new MultiLanguageVoiceService();
export default multiLanguageVoiceService;