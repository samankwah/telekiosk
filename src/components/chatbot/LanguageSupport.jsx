import React, { useState, useContext, createContext } from 'react';
import { Globe, Check } from 'lucide-react';
import { MULTILINGUAL_SUPPORT, LANGUAGE_DETECTION_KEYWORDS } from './HealthcarePrompts.js';
import { analyticsService } from '../../services/analyticsService.js';

// Language Context for managing current language state
const LanguageContext = createContext({
  currentLanguage: 'en',
  setLanguage: () => {},
  getLocalizedText: () => '',
  detectLanguage: () => 'en'
});

/**
 * Language Provider Component
 */
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Check localStorage for user's preferred language
    return localStorage.getItem('telekiosk_preferred_language') || 'en';
  });

  const setLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('telekiosk_preferred_language', lang);
    
    // Track language switch
    analyticsService.track('language_switch', {
      fromLanguage: currentLanguage,
      toLanguage: lang,
      timestamp: Date.now(),
      method: 'manual'
    });
  };

  const getLocalizedText = (key, fallback = '') => {
    return MULTILINGUAL_SUPPORT[currentLanguage]?.[key] || 
           MULTILINGUAL_SUPPORT['en']?.[key] || 
           fallback;
  };

  const detectLanguage = (text) => {
    if (!text || typeof text !== 'string') return 'en';
    
    const lowerText = text.toLowerCase();
    const scores = {};
    
    // Initialize scores
    Object.keys(LANGUAGE_DETECTION_KEYWORDS).forEach(lang => {
      scores[lang] = 0;
    });
    
    // Score based on keyword matches
    Object.entries(LANGUAGE_DETECTION_KEYWORDS).forEach(([lang, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          scores[lang] += 1;
        }
      });
    });
    
    // Find language with highest score
    const detectedLanguage = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .find(([lang, score]) => score > 0)?.[0] || 'en';
    
    // Track automatic language detection if different from current
    if (detectedLanguage !== currentLanguage && scores[detectedLanguage] > 0) {
      analyticsService.track('language_detected', {
        detectedLanguage,
        currentLanguage,
        confidence: scores[detectedLanguage],
        text: text.substring(0, 50), // First 50 chars for context
        timestamp: Date.now()
      });
    }
    
    return detectedLanguage;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      getLocalizedText,
      detectLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook for using language context
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

/**
 * Language Selector Component
 */
export const LanguageSelector = ({ className = "" }) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = Object.entries(MULTILINGUAL_SUPPORT).map(([code, info]) => ({
    code,
    name: info.name,
    flag: getLanguageFlag(code)
  }));

  const currentLangInfo = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        title="Change language / Sesa kasa / Trɔ gbe"
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{currentLangInfo?.flag}</span>
        <span className="hidden sm:inline">{currentLangInfo?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[160px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b last:border-b-0 ${
                currentLanguage === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="flex-1">{lang.name}</span>
              {currentLanguage === lang.code && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
          
          <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 rounded-b-lg">
            🤖 Auto-detection enabled
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Auto Language Detection Component
 */
export const AutoLanguageDetector = ({ text, onLanguageDetected }) => {
  const { detectLanguage, currentLanguage, setLanguage } = useLanguage();
  
  React.useEffect(() => {
    if (text && text.length > 10) { // Only detect for meaningful text
      const detectedLanguage = detectLanguage(text);
      
      if (detectedLanguage !== currentLanguage && detectedLanguage !== 'en') {
        // Show language switch suggestion
        onLanguageDetected?.(detectedLanguage);
      }
    }
  }, [text, currentLanguage, detectLanguage, onLanguageDetected]);

  return null; // This is a utility component, doesn't render anything
};

/**
 * Language Switch Notification
 */
export const LanguageSwitchNotification = ({ detectedLanguage, onAccept, onDismiss }) => {
  const languageInfo = MULTILINGUAL_SUPPORT[detectedLanguage];
  
  if (!languageInfo) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getLanguageFlag(detectedLanguage)}</div>
          <div>
            <p className="text-sm font-medium text-blue-800">
              Language detected: {languageInfo.name}
            </p>
            <p className="text-xs text-blue-600">
              Switch to {languageInfo.name} for better assistance?
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onAccept}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          >
            Switch
          </button>
          <button
            onClick={onDismiss}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
          >
            Keep English
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Localized Text Component
 */
export const LocalizedText = ({ textKey, fallback = '', className = "" }) => {
  const { getLocalizedText } = useLanguage();
  
  return (
    <span className={className}>
      {getLocalizedText(textKey, fallback)}
    </span>
  );
};

/**
 * Helper function to get language flag emoji
 */
function getLanguageFlag(languageCode) {
  const flags = {
    'en': '🇺🇸', // English
    'tw': '🇬🇭', // Twi (Ghana)
    'ga': '🇬🇭', // Ga (Ghana)  
    'ew': '🇬🇭', // Ewe (Ghana)
  };
  
  return flags[languageCode] || '🌐';
}

/**
 * Language-aware message formatter
 */
export const formatMessage = (message, language) => {
  // Add language-specific formatting if needed
  const supportedLanguage = MULTILINGUAL_SUPPORT[language];
  if (!supportedLanguage) return message;
  
  // For RTL languages, add direction support (future enhancement)
  return message;
};

/**
 * Emergency message in user's language
 */
export const getEmergencyMessage = (language = 'en') => {
  return MULTILINGUAL_SUPPORT[language]?.emergency || 
         MULTILINGUAL_SUPPORT['en'].emergency;
};

export default {
  LanguageProvider,
  useLanguage,
  LanguageSelector,
  AutoLanguageDetector,
  LanguageSwitchNotification,
  LocalizedText,
  formatMessage,
  getEmergencyMessage
};