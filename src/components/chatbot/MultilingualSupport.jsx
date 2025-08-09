import React, { useState, useEffect, useContext } from 'react';
import { Globe, Check, Loader } from 'lucide-react';
import { MULTILINGUAL_SUPPORT, LANGUAGE_DETECTION_KEYWORDS } from './HealthcarePrompts.js';
import { analyticsService } from '../../services/analyticsService.js';

/**
 * Advanced Multilingual Support Component for Ghana
 * Supports English, Twi, Ga, and Ewe with smart language detection
 */
export const MultilingualSupport = ({ onLanguageChange, currentMessage = '' }) => {
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const [userSelectedLanguage, setUserSelectedLanguage] = useState('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // Intelligent language detection
  useEffect(() => {
    if (currentMessage && currentMessage.trim().length > 3) {
      detectLanguage(currentMessage);
    }
  }, [currentMessage]);

  const detectLanguage = (text) => {
    setIsDetecting(true);
    const lowerText = text.toLowerCase();
    let maxMatches = 0;
    let detectedLang = 'en';

    // Check each language for keyword matches
    Object.entries(LANGUAGE_DETECTION_KEYWORDS).forEach(([lang, keywords]) => {
      const matches = keywords.filter(keyword => 
        lowerText.includes(keyword.toLowerCase())
      ).length;

      if (matches > maxMatches) {
        maxMatches = matches;
        detectedLang = lang;
      }
    });

    // Only switch if we have high confidence (2+ keyword matches)
    if (maxMatches >= 2 && detectedLang !== detectedLanguage) {
      setDetectedLanguage(detectedLang);
      
      // Track language detection
      analyticsService.trackEvent('language_detected', {
        detectedLanguage: detectedLang,
        confidence: maxMatches,
        textLength: text.length,
        timestamp: Date.now()
      });

      // Auto-switch if not manually overridden
      if (userSelectedLanguage === detectedLanguage) {
        handleLanguageChange(detectedLang);
      }
    }

    setTimeout(() => setIsDetecting(false), 500);
  };

  const handleLanguageChange = (languageCode) => {
    setUserSelectedLanguage(languageCode);
    setDetectedLanguage(languageCode);
    
    // Track language switch
    analyticsService.trackEvent('language_switched', {
      fromLanguage: userSelectedLanguage,
      toLanguage: languageCode,
      manual: true,
      timestamp: Date.now()
    });

    // Notify parent component
    if (onLanguageChange) {
      onLanguageChange(languageCode);
    }

    // Store preference
    localStorage.setItem('telekiosk_preferred_language', languageCode);
    
    setShowLanguageSelector(false);
  };

  const getResponseInLanguage = (key, language = userSelectedLanguage) => {
    return MULTILINGUAL_SUPPORT[language]?.[key] || MULTILINGUAL_SUPPORT.en[key];
  };

  const translateEmergencyMessage = (language = userSelectedLanguage) => {
    const messages = {
      en: '🚨 MEDICAL EMERGENCY DETECTED\nCall 999 or 193 immediately!',
      tw: '🚨 AYARESA EMERGENCY!\nFrɛ 999 anaa 193 ntɛm ara!',
      ga: '🚨 HOSPITAL EMERGENCY!\nFrɛ 999 kɛ 193 ntɛm!',
      ew: '🚨 KƆDƆDƆ EMERGENCY!\nYɔ 999 alo 193 enumake!'
    };
    return messages[language] || messages.en;
  };

  const getWelcomeMessage = () => {
    return getResponseInLanguage('greeting');
  };

  const getBookingMessage = () => {
    return getResponseInLanguage('booking');
  };

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('telekiosk_preferred_language');
    if (savedLanguage && MULTILINGUAL_SUPPORT[savedLanguage]) {
      setUserSelectedLanguage(savedLanguage);
      setDetectedLanguage(savedLanguage);
      onLanguageChange?.(savedLanguage);
    }
  }, [onLanguageChange]);

  return (
    <div className="relative">
      {/* Language Selector Button */}
      <button
        onClick={() => setShowLanguageSelector(!showLanguageSelector)}
        className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200 text-sm border border-blue-200"
        title="Select Language / Paw kasa"
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">
          {MULTILINGUAL_SUPPORT[userSelectedLanguage]?.name || 'English'}
        </span>
        {isDetecting && <Loader className="w-3 h-3 animate-spin" />}
        {detectedLanguage !== userSelectedLanguage && detectedLanguage !== 'en' && (
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" 
               title={`${MULTILINGUAL_SUPPORT[detectedLanguage]?.name} detected`} />
        )}
      </button>

      {/* Language Options Dropdown */}
      {showLanguageSelector && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 min-w-64 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-semibold text-gray-800 mb-1">Choose Your Language</h3>
            <p className="text-xs text-gray-600">Paw wo kasa / Tiaɖo wò gbe / Tia wo kasa</p>
          </div>
          
          <div className="p-2">
            {Object.entries(MULTILINGUAL_SUPPORT).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 flex items-center justify-between hover:bg-blue-50 ${
                  userSelectedLanguage === code ? 'bg-blue-100 text-blue-800' : 'text-gray-700'
                }`}
              >
                <div>
                  <div className="font-medium">{lang.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {lang.greeting}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {detectedLanguage === code && detectedLanguage !== userSelectedLanguage && (
                    <div className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      Detected
                    </div>
                  )}
                  {userSelectedLanguage === code && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 bg-gray-50 border-t border-gray-100">
            <div className="text-xs text-gray-600 text-center">
              🏥 TeleKiosk Hospital supports all major Ghanaian languages
            </div>
          </div>
        </div>
      )}

      {/* Language Detection Notification */}
      {detectedLanguage !== userSelectedLanguage && detectedLanguage !== 'en' && (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800">
              <Globe className="w-4 h-4" />
              <span className="text-sm">
                {MULTILINGUAL_SUPPORT[detectedLanguage]?.name} detected
              </span>
            </div>
            <button
              onClick={() => handleLanguageChange(detectedLanguage)}
              className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-xs hover:bg-amber-300 transition-colors"
            >
              Switch
            </button>
          </div>
          <div className="text-xs text-amber-700 mt-1">
            {getResponseInLanguage('greeting', detectedLanguage)}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Language Context for app-wide language state
 */
export const LanguageContext = React.createContext({
  currentLanguage: 'en',
  setLanguage: () => {},
  translate: (key) => key,
  getEmergencyMessage: () => '',
  getWelcomeMessage: () => '',
  getBookingMessage: () => ''
});

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const translate = (key) => {
    return MULTILINGUAL_SUPPORT[currentLanguage]?.[key] || 
           MULTILINGUAL_SUPPORT.en[key] || 
           key;
  };

  const getEmergencyMessage = () => {
    return translate('emergency');
  };

  const getWelcomeMessage = () => {
    return translate('greeting');
  };

  const getBookingMessage = () => {
    return translate('booking');
  };

  const setLanguage = (languageCode) => {
    if (MULTILINGUAL_SUPPORT[languageCode]) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('telekiosk_preferred_language', languageCode);
    }
  };

  const value = {
    currentLanguage,
    setLanguage,
    translate,
    getEmergencyMessage,
    getWelcomeMessage,
    getBookingMessage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default MultilingualSupport;