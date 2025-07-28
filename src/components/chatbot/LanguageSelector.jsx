import { useState } from 'react';
import { useEnhancedChatbot } from '../../contexts/EnhancedChatbotContext';

function LanguageSelector() {
  const { 
    state, 
    switchLanguage, 
    toggleLanguageDetection,
    ghanaLanguageService 
  } = useEnhancedChatbot();
  
  const [showLanguages, setShowLanguages] = useState(false);

  const handleLanguageSwitch = async (languageCode) => {
    const success = await switchLanguage(languageCode);
    if (success) {
      setShowLanguages(false);
    }
  };

  const getLanguageInfo = (code) => {
    const languages = ghanaLanguageService.getAvailableGhanaLanguages();
    return languages.find(lang => lang.code === code) || { name: 'Unknown', native: 'Unknown', flag: '🇬🇭' };
  };

  const currentLangInfo = getLanguageInfo(state.currentLanguage);
  const availableLanguages = ghanaLanguageService.getAvailableGhanaLanguages();

  return (
    <div className="relative">
      {/* Language Selector Button */}
      <button
        onClick={() => setShowLanguages(!showLanguages)}
        className="flex items-center space-x-1 text-blue-100 hover:text-white transition-colors p-1 rounded"
        aria-label="Select language"
        title={`Current: ${currentLangInfo.name} - Click to change`}
      >
        <span className="text-sm">{currentLangInfo.flag}</span>
        <span className="text-xs font-medium hidden sm:block">
          {currentLangInfo.code === 'en-GH' ? 'EN' :
           currentLangInfo.code === 'tw-GH' ? 'TW' :
           currentLangInfo.code === 'ee-GH' ? 'EE' :
           currentLangInfo.code === 'ga-GH' ? 'GA' : 'GH'}
        </span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Language Dropdown */}
      {showLanguages && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-gray-800 flex items-center space-x-1">
                <span>🇬🇭</span>
                <span>Ghana Languages</span>
              </h4>
              <button
                onClick={() => setShowLanguages(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">Select your preferred language</p>
          </div>

          {/* Language Detection Toggle */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Auto-Detect Language</label>
                <p className="text-xs text-gray-500">Automatically detect language from speech</p>
              </div>
              <button
                onClick={toggleLanguageDetection}
                className={`relative inline-flex h-5 w-9 rounded-full transition-colors focus:outline-none ${
                  state.languageDetectionEnabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    state.languageDetectionEnabled ? 'translate-x-4' : 'translate-x-0.5'
                  } mt-0.5`}
                />
              </button>
            </div>
          </div>

          {/* Language List */}
          <div className="max-h-64 overflow-y-auto">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSwitch(language.code)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  language.code === state.currentLanguage ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{language.flag}</span>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 text-sm">
                        {language.name}
                      </span>
                      {language.code === state.currentLanguage && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Current
                        </span>
                      )}
                      {language.code === state.detectedLanguage && language.code !== state.currentLanguage && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                          Detected
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-600">
                        {language.native}
                      </span>
                      
                      {/* Priority indicator */}
                      {language.priority <= 4 && (
                        <span className="text-xs text-blue-600">
                          • Popular
                        </span>
                      )}
                      
                      {/* Voice support indicator */}
                      {language.hasVoiceSupport && (
                        <span className="text-xs text-green-600" title="Voice recognition supported">
                          🎤
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick action icon */}
                  <div className="text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Language Info Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Total Languages:</span>
                <span className="font-medium">{availableLanguages.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Voice Supported:</span>
                <span className="font-medium text-green-600">
                  {availableLanguages.filter(lang => lang.hasVoiceSupport).length}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Current Selection:</span>
                <span className="font-medium text-blue-600">
                  {currentLangInfo.native}
                </span>
              </div>
            </div>

            {/* Sample greetings */}
            <div className="mt-3 pt-2 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-1">Sample greetings:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <div>🇬🇭 <strong>English:</strong> Hello, how can I help you?</div>
                <div>🇬🇭 <strong>Twi:</strong> Akwaaba, sɛn na metumi aboa wo?</div>
                <div>🇬🇭 <strong>Ewe:</strong> Woezɔ, aleke mate ŋu akpe ɖe ŋuwò?</div>
                <div>🇬🇭 <strong>Ga:</strong> Bawo, ke mi shi boa wò?</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showLanguages && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowLanguages(false)}
        />
      )}
    </div>
  );
}

export default LanguageSelector;