import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

function LanguageSwitcher({ className = '', variant = 'default' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, changeLanguage, languages, getCurrentLanguage } = useLanguage();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = getCurrentLanguage();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  // Different styling variants
  const variants = {
    default: {
      button: "flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
      dropdown: "absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 py-1",
      item: "flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
    },
    header: {
      button: "flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors",
      dropdown: "absolute top-full right-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 py-1",
      item: "flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors text-gray-800"
    },
    compact: {
      button: "flex items-center space-x-1 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors text-sm",
      dropdown: "absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-md z-50 py-1",
      item: "flex items-center space-x-1 px-2 py-1 hover:bg-gray-100 cursor-pointer transition-colors text-sm"
    }
  };

  const styles = variants[variant] || variants.default;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Language Button */}
      <button
        onClick={toggleDropdown}
        className={styles.button}
        aria-label="Select Language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="font-medium">{currentLang?.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={styles.dropdown}>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => selectLanguage(language.code)}
              className={`${styles.item} w-full text-left ${
                currentLanguage === language.code 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : ''
              }`}
              role="menuitem"
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
              {currentLanguage === language.code && (
                <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;