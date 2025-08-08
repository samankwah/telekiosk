// Language Selector Component for TeleKiosk AI Assistant
// Allows users to select their preferred language

import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { multilingualService } from '../../services/multilingualService';
import { analyticsService } from '../../services/analyticsService';

export const LanguageSelector = ({ onLanguageChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [autoDetected, setAutoDetected] = useState(null);

  useEffect(() => {
    // Initialize component
    const initializeLanguageSelector = () => {
      const currentLang = multilingualService.getCurrentLanguage();
      const languages = multilingualService.getSupportedLanguages();
      
      setCurrentLanguage(currentLang);
      setSupportedLanguages(languages);
    };

    initializeLanguageSelector();
  }, []);

  /**
   * Handle language selection
   */
  const handleLanguageSelect = (languageCode) => {
    const success = multilingualService.setLanguage(languageCode);
    
    if (success) {
      setCurrentLanguage(languageCode);
      setIsOpen(false);
      
      // Notify parent component
      onLanguageChange?.(languageCode);
      
      // Track language change
      analyticsService.trackEvent('language_selector_change', {
        selectedLanguage: languageCode,
        previousLanguage: currentLanguage,
        method: 'manual_selection'
      });
    }
  };

  /**
   * Auto-detect language from text input
   */
  const handleAutoDetection = (text) => {
    if (!text || text.length < 5) return;

    const detection = multilingualService.detectLanguage(text);
    
    if (detection.confidence > 0.6 && detection.language !== currentLanguage) {
      setAutoDetected({
        language: detection.language,
        confidence: detection.confidence,
        detectedWords: detection.detectedWords
      });
    }
  };

  /**
   * Accept auto-detected language
   */
  const acceptAutoDetection = () => {
    if (autoDetected) {
      handleLanguageSelect(autoDetected.language);
      setAutoDetected(null);
      
      analyticsService.trackEvent('language_auto_detection_accepted', {
        detectedLanguage: autoDetected.language,
        confidence: autoDetected.confidence
      });
    }
  };

  /**
   * Dismiss auto-detection suggestion
   */
  const dismissAutoDetection = () => {
    setAutoDetected(null);
    analyticsService.trackEvent('language_auto_detection_dismissed', {
      detectedLanguage: autoDetected?.language,
      confidence: autoDetected?.confidence
    });
  };

  // Get current language info
  const currentLangInfo = supportedLanguages.find(lang => lang.code === currentLanguage) || 
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' };

  return (
    <div className={`relative ${className}`}>
      {/* Language Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        aria-label="Select language"
      >
        <Globe size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLangInfo.flag} {currentLangInfo.nativeName}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {/* Header */}
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Select Language</h3>
              <p className="text-xs text-gray-500 mt-1">Choose your preferred language</p>
            </div>

            {/* Language Options */}
            <div className="py-1">
              {supportedLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    currentLanguage === language.code ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{language.flag}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {language.nativeName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {language.name}
                      </div>
                    </div>
                  </div>
                  {currentLanguage === language.code && (
                    <Check size={16} className="text-blue-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                💡 The assistant will automatically detect your language
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Detection Suggestion */}
      {autoDetected && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg z-50 p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Globe size={20} className="text-yellow-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                Language Detected
              </h4>
              <p className="text-sm text-yellow-700 mb-3">
                It looks like you're writing in{' '}
                <strong>
                  {supportedLanguages.find(l => l.code === autoDetected.language)?.nativeName}
                </strong>
                . Would you like to switch?
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={acceptAutoDetection}
                  className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors"
                >
                  Yes, Switch
                </button>
                <button
                  onClick={dismissAutoDetection}
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded hover:bg-yellow-200 transition-colors"
                >
                  Keep Current
                </button>
              </div>
              {autoDetected.detectedWords.length > 0 && (
                <p className="text-xs text-yellow-600 mt-2">
                  Detected words: {autoDetected.detectedWords.slice(0, 3).join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;