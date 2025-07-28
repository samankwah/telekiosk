// Ghana-Focused Multi-Language Voice Service
import { VoiceErrorHandler, voiceCommandProcessor } from '../utils/voiceUtils.js';

// Ghana-specific languages with their speech recognition codes
export const GHANA_LANGUAGES = {
  'en-GH': { name: 'English (Ghana)', native: 'English', flag: '🇬🇭', priority: 1 },
  'tw-GH': { name: 'Twi (Akan)', native: 'Twi', flag: '🇬🇭', priority: 2 },
  'ee-GH': { name: 'Ewe', native: 'Eʋe', flag: '🇬🇭', priority: 3 },
  'ga-GH': { name: 'Ga', native: 'Ga', flag: '🇬🇭', priority: 4 },
  'dag-GH': { name: 'Dagbani', native: 'Dagbani', flag: '🇬🇭', priority: 5 },
  'ff-GH': { name: 'Frafra', native: 'Frafra', flag: '🇬🇭', priority: 6 },
  'kr-GH': { name: 'Krobo', native: 'Krobo', flag: '🇬🇭', priority: 7 },
  'nz-GH': { name: 'Nzema', native: 'Nzema', flag: '🇬🇭', priority: 8 },
  'ha-GH': { name: 'Hausa (Ghana)', native: 'Hausa', flag: '🇬🇭', priority: 9 },
  'mo-GH': { name: 'Mole-Dagbon', native: 'Mole-Dagbon', flag: '🇬🇭', priority: 10 }
};

// Ghana language detection patterns
const GHANA_LANGUAGE_PATTERNS = {
  'en': /\b(hello|hi|help|book|appointment|doctor|hospital|service|emergency|good morning|good afternoon)\b/i,
  'tw': /\b(akwaaba|wo ho te sɛn|me pɛ|ayaresabea|dɔkta|mmoa|adwo|maakye|yɛ frɛ me|me din de)\b/i,
  'ee': /\b(woezɔ|aleke|medi|atikewɔƒe|dɔkta|kpekpe|ŋdi|etsɔ|fifi|ɖe|kple)\b/i,
  'ga': /\b(bawo|wobaafio|miba|yɛmli|dɔkita|kpoikpoi|heloo|akpe|oyiwa|tsooo)\b/i,
  'dag': /\b(desba|ayi kadi|mba dɔɣ|yɛlik li|dɔkta|tuma|dabari|yɛm|kadi)\b/i,
  'ff': /\b(atuu|abeŋa|n ye|dɔkɔta|naŋgban|tɔɔse|ka|yɛlik)\b/i,
  'kr': /\b(akwaaba|ehe|mepɛ|ayarefi|dɔkta|mmoa|nkomo|yɛ frɛ me)\b/i,
  'nz': /\b(akwaaba|awo|me hwɛ|ayarefi|dɔkita|boa|ahemaa|yɛ frɛ me)\b/i,
  'ha': /\b(sannu|ina kwana|ina son|asibiti|likita|taimako|lafiya|yaushe)\b/i,
  'mo': /\b(desba|n taa|n yɛli|dɔkta|dabari|tuma|ka daa)\b/i
};

// Multi-language responses for Ghana
const GHANA_RESPONSES = {
  'en-GH': {
    greeting: "Akwaaba! Welcome to TeleKiosk Hospital Ghana. I'm your AI assistant and I can help you in various Ghanaian languages. How can I assist you today?",
    booking: "I'll help you book an appointment. Let me guide you through the process.",
    services: "We offer comprehensive medical services here in Ghana. Let me find information about our services.",
    info_found: "I found some information that might help you:",
    no_info: "I couldn't find specific information about that, but I can help you with our general services.",
    language_switched: "I've switched to English (Ghana). How can I help you?",
    emergency: "For medical emergencies, call 0599 211 311 immediately. Our emergency department is open 24/7.",
    thank_you: "Medaase! (Thank you!) Is there anything else I can help you with?"
  },
  'tw-GH': {
    greeting: "Akwaaba! Wo ba TeleKiosk Ayaresabea Ghana ho. Me yɛ wo AI boafo na metumi boa wo wɔ Ghana kasa ahodoɔ mu. Sɛn na metumi aboa wo ɛnnɛ?",
    booking: "Mɛboa wo ayɛ appointment. Ma me nkyerɛ wo kwan a wubetumi afa so.",
    services: "Yɛwɔ ayaresa ho dwuma ahodoɔ wɔ Ghana ha. Ma me nhwehwɛ nsɛm a ɛfa yɛn som ho.",
    info_found: "Mahunu nsɛm bi a ɛbɛtumi aboa wo:",
    no_info: "Mantumi anhunu nsɛm pɔtee wɔ ho, nanso metumi aboa wo wɔ yɛn som akɛseɛ no mu.",
    language_switched: "Madan akɔ Twi mu. Sɛn na metumi aboa wo?",
    emergency: "Sɛ ɛyɛ ayaresa ntɛmpɛ a, frɛ 0599 211 311 ntɛm ara. Yɛn emergency department bue daa.",
    thank_you: "Medaase! Biribi foforɔ bi wɔ hɔ a metumi aboa wo ho anaa?"
  },
  'ee-GH': {
    greeting: "Woezɔ! Wò do TeleKiosk Atikewɔƒe Ghana me. Menye wò AI kpeɖeŋutɔ eye mate ŋu akpe ɖe ŋuwò le Ghana gbe vovowo me. Aleke mate ŋu akpe ɖe ŋuwò egbe?",
    booking: "Makpe ɖe ŋuwò nàɖo takpekpe. Na makplɔ wò to mɔa dzi.",
    services: "Atikevɔvɔ ƒomevi vovovowo le mía si le Ghana afii. Na madi nu siwo ku ɖe míaƒe dɔwɔwɔ ŋu.",
    info_found: "Meke ɖe nyatakakawo ŋu siwo ate ŋu akpe ɖe ŋuwò:",
    no_info: "Nyemete ŋu ke ɖe nya tɔxɛwo ŋu le eya ŋu o, gake mate ŋu akpe ɖe ŋuwò le míaƒe dɔwɔwɔ gbãtɔwo me.",
    language_switched: "Metrɔ yi Ewe gbe me. Aleke mate ŋu akpe ɖe ŋuwò?",
    emergency: "Ne atikevɔvɔ do zi enumake la, yɔ 0599 211 311 enumake. Míaƒe emergency department ʋu ɣeawo katã.",
    thank_you: "Akpe na wò! Nu bubu aɖe li si ŋu mate ŋu akpe ɖe ŋuwò oa?"
  },
  'ga-GH': {
    greeting: "Bawo! Woba TeleKiosk Yɛmli Ghana kɛ. Mi naa wò AI boayɛfo kɛ mi shi boa wò lɛ Ghana gbe vovowo kɛ. Ke mi shi boa wò lome?",
    booking: "Mi boa wò ye appointment. Mi kpakpa wò shɛmɔ lɛ.",
    services: "Yɛmli kwei vovowo ni wɔ Ghana kɛɛ. Mi je kwei yɛɛ bo wɔn dwuma lɛ.",
    info_found: "Mi nye kwei bo boa wò:",
    no_info: "Mi ye kwei pɔtee ni, shi mi shi boa wò lɛ wɔn dwuma gbaa kɛ.",
    language_switched: "Mi trɔ Ga gbɛ kɛ. Ke mi shi boa wò?",
    emergency: "Sɛ yɛmli kwei do enumaŋŋ naa, yɔ 0599 211 311 enumaŋŋ. Wɔn emergency kɛɛ bu ŋmɛɛ nu.",
    thank_you: "Oyiwa! Nu foforɔ ni mi shi boa wò yɛɛ?"
  },
  'dag-GH': {
    greeting: "Desba! Fu yaa TeleKiosk Yɛlik Li Ghana kɔ. M ni fu AI boayɛfo ka m tuma boa fu Ghana gur vɔvɔ puuni. Zaa ka m tuma boa fu?",
    booking: "M boa fu ye appointment. M kpakpa fu shɛm lɛ.",
    services: "Yɛlik kwei vɔvɔ ni Ghana kɛɛ. M di kwei ka bo fu.",
    info_found: "M nye kwei ka tuma boa fu:",
    no_info: "M ye kwei pɔtee o, abi m tuma boa fu yɛlik gbaa kɛ.",
    language_switched: "M sagim Dagbani puuni kɔ. Zaa ka m tuma boa fu?",
    emergency: "Sɛ yɛlik kwei bi ntɛmpɛ naa, yɔ 0599 211 311 ntɛmpɛ. Ti emergency kɛɛ bu ŋmɛɛ ka.",
    thank_you: "Baraka! Kwei foforɔ ni ka m tuma boa fu?"
  }
};

// Common medical terms in Ghana languages
const MEDICAL_TERMS_TRANSLATIONS = {
  'en': {
    'doctor': 'doctor',
    'hospital': 'hospital', 
    'appointment': 'appointment',
    'emergency': 'emergency',
    'service': 'service',
    'medicine': 'medicine',
    'treatment': 'treatment'
  },
  'tw': {
    'doctor': 'dɔkta',
    'hospital': 'ayaresabea',
    'appointment': 'berɛ a wɔahyɛ',
    'emergency': 'ntɛmpɛ ayareɛ',
    'service': 'som',
    'medicine': 'aduro',
    'treatment': 'ayareɛ sa'
  },
  'ee': {
    'doctor': 'atikela',
    'hospital': 'atikewɔƒe',
    'appointment': 'takpekpe',
    'emergency': 'enumake ƒe nya',
    'service': 'dɔwɔwɔ',
    'medicine': 'atike',
    'treatment': 'dɔyɔyɔ'
  },
  'ga': {
    'doctor': 'dɔkita',
    'hospital': 'yɛmli kɛɛ',
    'appointment': 'takpekpe',
    'emergency': 'enumaŋŋ kwei',
    'service': 'dwuma',
    'medicine': 'atike',
    'treatment': 'yɛmli'
  },
  'dag': {
    'doctor': 'tɔhira',
    'hospital': 'yɛlik li',
    'appointment': 'takpekpe',
    'emergency': 'ntɛmpɛ kwei',
    'service': 'tuma',
    'medicine': 'tii',
    'treatment': 'yɛlik'
  }
};

class GhanaLanguageService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.isSpeaking = false;
    this.voices = [];
    this.voicesByLanguage = new Map();
    this.currentLanguage = 'en-GH';
    this.detectedLanguage = null;
    this.autoLanguageDetection = true;
    this.continuousListening = false;
    this.retryCount = 0;
    this.maxRetries = 3;
    this.confidenceThreshold = 0.7;
    
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
    this.setupGhanaLanguageDetection();
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
      this.recognition.lang = 'en-GH'; // Default to Ghana English
      this.recognition.maxAlternatives = 3;
    }

    return !!this.recognition;
  }

  initializeSpeechSynthesis() {
    if (this.synthesis) {
      const loadVoices = () => {
        this.voices = this.synthesis.getVoices();
        this.organizeVoicesByLanguage();
        this.selectBestVoiceForGhana();
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
      const lang = voice.lang.toLowerCase();
      
      // Prioritize English voices for Ghana
      if (lang.includes('en') || lang.includes('gb') || lang.includes('us')) {
        if (!this.voicesByLanguage.has('en-GH')) {
          this.voicesByLanguage.set('en-GH', []);
        }
        this.voicesByLanguage.get('en-GH').push(voice);
      }
      
      // Store by exact language code
      if (!this.voicesByLanguage.has(voice.lang)) {
        this.voicesByLanguage.set(voice.lang, []);
      }
      this.voicesByLanguage.get(voice.lang).push(voice);
    });
  }

  selectBestVoiceForGhana() {
    // Prefer English voices for Ghana
    let ghanaVoices = this.voicesByLanguage.get('en-GH') || [];
    
    if (ghanaVoices.length === 0) {
      // Fallback to any English voice
      ghanaVoices = this.voices.filter(voice => 
        voice.lang.toLowerCase().includes('en')
      );
    }

    if (ghanaVoices.length > 0) {
      // Prefer female voices for hospital setting
      let selectedVoice = ghanaVoices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen')
      );

      if (!selectedVoice) {
        selectedVoice = ghanaVoices[0];
      }

      this.selectedVoice = selectedVoice;
      console.log(`Selected voice for Ghana: ${selectedVoice.name}`);
    }
  }

  setupGhanaLanguageDetection() {
    // Auto-detect if user is likely from Ghana based on browser settings
    const browserLang = navigator.language || navigator.languages[0];
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Ghana timezone detection
    if (timezone === 'Africa/Accra' || browserLang.includes('GH')) {
      this.currentLanguage = 'en-GH';
      console.log('Ghana region detected, defaulting to Ghana English');
    }
  }

  // Detect Ghana-specific languages from text
  detectGhanaLanguage(text) {
    if (!text) return this.currentLanguage;

    const scores = {};
    
    // Initialize scores for Ghana languages
    Object.keys(GHANA_LANGUAGE_PATTERNS).forEach(lang => {
      scores[lang] = 0;
    });

    // Test against each pattern
    Object.entries(GHANA_LANGUAGE_PATTERNS).forEach(([lang, pattern]) => {
      const matches = text.match(pattern);
      if (matches) {
        scores[lang] += matches.length * 2; // Higher weight for Ghana languages
        
        // Bonus points for multiple matches
        if (matches.length > 1) {
          scores[lang] += matches.length;
        }
      }
    });

    // Find the language with highest score
    const detectedLang = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );

    // Map to full language code
    const fullLangCode = this.mapToGhanaLanguageCode(detectedLang);
    
    if (scores[detectedLang] > 0) {
      this.detectedLanguage = fullLangCode;
      if (this.autoLanguageDetection) {
        this.switchGhanaLanguage(fullLangCode);
      }
      return fullLangCode;
    }

    return this.currentLanguage;
  }

  mapToGhanaLanguageCode(baseLang) {
    const ghanaMapping = {
      'en': 'en-GH',
      'tw': 'tw-GH',
      'ee': 'ee-GH',
      'ga': 'ga-GH',
      'dag': 'dag-GH',
      'ff': 'ff-GH',
      'kr': 'kr-GH',
      'nz': 'nz-GH',
      'ha': 'ha-GH',
      'mo': 'mo-GH'
    };

    return ghanaMapping[baseLang] || 'en-GH';
  }

  // Switch to Ghana language
  switchGhanaLanguage(languageCode) {
    if (!GHANA_LANGUAGES[languageCode]) {
      console.warn(`Ghana language ${languageCode} not supported`);
      return false;
    }

    this.currentLanguage = languageCode;
    
    // Update speech recognition language (use English for non-English Ghana languages)
    if (this.recognition) {
      const recognitionLang = languageCode.startsWith('en') ? 'en-GH' : 'en-US';
      this.recognition.lang = recognitionLang;
    }

    console.log(`Language switched to: ${GHANA_LANGUAGES[languageCode].name}`);
    return true;
  }

  // Enhanced listening for Ghana languages
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

        // Auto-detect Ghana language if enabled
        if (autoDetectLanguage && result.isFinal) {
          const detectedLang = this.detectGhanaLanguage(transcript);
          if (detectedLang !== this.currentLanguage) {
            console.log(`Ghana language auto-detected: ${detectedLang}`);
          }
        }

        // Process voice command
        const processedCommand = voiceCommandProcessor.processVoiceCommand(transcript, confidence);
        
        if (onResult) {
          onResult(processedCommand.transcript, processedCommand.confidence, {
            isFinal: result.isFinal,
            detectedLanguage: this.detectedLanguage,
            currentLanguage: this.currentLanguage,
            isGhanaLanguage: Object.keys(GHANA_LANGUAGES).includes(this.currentLanguage),
            alternatives: this.getAlternatives(event.results[i])
          });
        }
      }
      
      this.retryCount = 0;
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      
      const errorMessage = VoiceErrorHandler.getErrorMessage(event.error);
      const shouldRetry = VoiceErrorHandler.shouldRetry(event.error) && this.retryCount < this.maxRetries;
      
      if (shouldRetry) {
        this.retryCount++;
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

  // Speak in Ghana languages (primarily English)
  speak(text, onStart, onEnd, onError, options = {}) {
    if (!this.synthesis) {
      console.warn('Speech synthesis not supported');
      return false;
    }

    const {
      language = this.currentLanguage,
      rate = 0.8, // Slightly slower for clarity
      pitch = 1.0,
      volume = 0.8
    } = options;

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use best available voice (primarily English for Ghana)
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = 'en-GH'; // Use Ghana English for synthesis

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

  // Get response in Ghana language
  getResponseInGhanaLanguage(key, language = null) {
    const lang = language || this.currentLanguage;
    const responses = GHANA_RESPONSES[lang] || GHANA_RESPONSES['en-GH'];
    return responses[key] || responses.greeting;
  }

  // Translate medical term to Ghana language
  translateMedicalTerm(term, targetLanguage = null) {
    const lang = targetLanguage || this.currentLanguage;
    const baseLang = lang.split('-')[0];
    const translations = MEDICAL_TERMS_TRANSLATIONS[baseLang] || MEDICAL_TERMS_TRANSLATIONS['en'];
    return translations[term.toLowerCase()] || term;
  }

  // Get available Ghana languages
  getAvailableGhanaLanguages() {
    return Object.entries(GHANA_LANGUAGES)
      .sort((a, b) => a[1].priority - b[1].priority)
      .map(([code, info]) => ({
        code,
        ...info,
        isCurrent: code === this.currentLanguage,
        hasVoiceSupport: code.startsWith('en') || this.voicesByLanguage.has(code)
      }));
  }

  // Get current Ghana language info
  getCurrentGhanaLanguageInfo() {
    return {
      current: this.currentLanguage,
      detected: this.detectedLanguage,
      info: GHANA_LANGUAGES[this.currentLanguage],
      isGhanaLanguage: true,
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

  isGhanaLanguageSupported(languageCode) {
    return !!GHANA_LANGUAGES[languageCode];
  }

  isVoiceSupported() {
    return {
      speechRecognition: !!this.recognition,
      speechSynthesis: !!this.synthesis,
      ghanaLanguages: true,
      availableGhanaLanguages: Object.keys(GHANA_LANGUAGES).length,
      currentLanguage: this.currentLanguage
    };
  }
}

// Create singleton instance
export const ghanaLanguageService = new GhanaLanguageService();
export default ghanaLanguageService;