import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import robotIcon from '../../assets/chat2.png';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isCorporateInfoOpen, setIsCorporateInfoOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  
  const { currentLanguage, changeLanguage, t, languages, getCurrentLanguage } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isLanguageDropdownOpen &&
        !event.target.closest(".language-dropdown")
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLanguageDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const selectLanguage = (languageCode) => {
    changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  const toggleCorporateInfo = () => {
    setIsCorporateInfoOpen(!isCorporateInfoOpen);
  };

  const toggleServicesDropdown = () => {
    setIsServicesDropdownOpen(!isServicesDropdownOpen);
  };

  const navigateAndClose = (path) => {
    navigate(path);
    closeMenu();
    setIsCorporateInfoOpen(false);
    setIsServicesDropdownOpen(false);
  };

  // Define available services
  const services = [
    { id: 'cardiology', name: t('cardiology'), icon: '❤️' },
    { id: 'neurology', name: t('neurology'), icon: '🧠' },
    { id: 'pediatrics', name: t('pediatrics'), icon: '👶' },
    { id: 'dermatology', name: t('dermatology'), icon: '✨' },
    { id: 'orthopedics', name: t('orthopedics'), icon: '🦴' },
    { id: 'emergency', name: t('emergencyMedicine'), icon: '🚨' },
    { id: 'general', name: t('generalMedicine'), icon: '🏥' },
    { id: 'surgery', name: t('surgery'), icon: '🔬' }
  ];

  return (
    <>
      {/* Top Info Bar - Hidden when scrolled */}
      <div
        className={`bg-blue-50 text-sm py-1 sm:py-2 transition-all duration-300 relative z-50 ${
          isScrolled
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Mobile Layout */}
          <div className="sm:hidden flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <span className="text-blue-600 font-semibold text-xs">{t('emergency')}:</span>
              <span className="text-xs font-bold text-blue-900">{t('emergencyPhone')}</span>
            </div>
            <div className="relative language-dropdown">
              <button
                onClick={toggleLanguageDropdown}
                className="flex items-center space-x-1 hover:bg-blue-100 px-1 py-1 rounded transition-colors cursor-pointer"
                type="button"
              >
                <span className="flag text-sm">{getCurrentLanguage().flag}</span>
                <span className="text-xs">{getCurrentLanguage().name}</span>
                <svg
                  className={`w-2 h-2 transition-transform ${
                    isLanguageDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7,10L12,15L17,10H7Z" />
                </svg>
              </button>

              {/* Mobile Language Dropdown */}
              <div
                className={`absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] min-w-28 ${isLanguageDropdownOpen ? 'block' : 'hidden'}`}
              >
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => selectLanguage(language.code)}
                    className={`w-full flex items-center space-x-2 px-2 py-2 text-left hover:bg-blue-50 transition-colors ${
                      currentLanguage === language.code
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700"
                    } ${language === languages[0] ? "rounded-t-lg" : ""} ${
                      language === languages[languages.length - 1]
                        ? "rounded-b-lg"
                        : ""
                    }`}
                  >
                    <span>{language.flag}</span>
                    <span className="text-xs font-medium">
                      {language.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden sm:flex justify-between items-center">
            <div className="flex items-center space-x-4 lg:space-x-6 text-gray-600">
              <div className="flex items-center space-x-1 lg:space-x-2">
                <span>📍</span>
                <span className="text-xs lg:text-sm truncate max-w-32 lg:max-w-none">{t('location')}</span>
              </div>
              <div className="flex items-center space-x-1 lg:space-x-2">
                <span>📞</span>
                <span className="text-xs lg:text-sm">{t('phone')}</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <span>✉️</span>
                <span className="text-xs lg:text-sm">{t('email')}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="text-blue-600 font-semibold text-xs lg:text-sm">{t('emergency')}</div>
              <div className="text-sm lg:text-lg font-bold text-blue-900">{t('emergencyPhone')}</div>
              <div className="relative language-dropdown">
                <button
                  onClick={toggleLanguageDropdown}
                  className="flex items-center space-x-1 hover:bg-blue-100 px-2 py-1 rounded transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="flag">{getCurrentLanguage().flag}</span>
                  <span className="text-xs lg:text-sm">{getCurrentLanguage().name}</span>
                  <svg
                    className={`w-3 h-3 transition-transform ${
                      isLanguageDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7,10L12,15L17,10H7Z" />
                  </svg>
                </button>

                {/* Language Dropdown */}
                <div
                  className={`absolute ${
                    isScrolled ? "fixed top-16 right-4" : "top-full right-0"
                  } mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] min-w-28 sm:min-w-32 ${isLanguageDropdownOpen ? 'block' : 'hidden'}`}
                >
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => selectLanguage(language.code)}
                        className={`w-full flex items-center space-x-2 px-2 sm:px-3 py-2 text-left hover:bg-blue-50 transition-colors ${
                          currentLanguage === language.code
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        } ${language === languages[0] ? "rounded-t-lg" : ""} ${
                          language === languages[languages.length - 1]
                            ? "rounded-b-lg"
                            : ""
                        }`}
                      >
                        <span>{language.flag}</span>
                        <span className="text-xs sm:text-sm font-medium">
                          {language.name}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Fixed when scrolled */}
      <header
        className={`bg-white shadow-sm py-4 transition-all duration-300 ${
          isScrolled ? "fixed top-0 left-0 right-0 z-30 shadow-lg" : "relative z-10"
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4 flex justify-between items-center">
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mr-2 sm:mr-3 flex items-center justify-center">
              <img 
                src={robotIcon}
                alt="TeleKiosk AI Assistant"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">{t('hospitalName')}</div>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button 
              onClick={() => navigate('/booking')}
              className="bg-blue-600 text-white p-2 sm:p-2.5 md:p-3 rounded hover:bg-blue-700 transition-colors touch-manipulation"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V7H5V5H19M5,19V9H19V19H5M17,12H15V17H17V12M13,12H11V17H13V12M9,12H7V17H9V12Z" />
              </svg>
            </button>
            <button
              onClick={toggleMenu}
              className="text-gray-600 p-2 sm:p-2.5 md:p-3 hover:bg-gray-100 rounded transition-colors touch-manipulation"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content jump when header becomes fixed */}
      {isScrolled && <div className="h-24"></div>}

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Background overlay */}
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={closeMenu}
          ></div>

          {/* Menu Panel */}
          <div className="w-full sm:w-96 bg-white h-full shadow-xl transform transition-transform duration-300 translate-x-0">
            {/* Menu Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <div 
                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  navigate('/');
                  closeMenu();
                }}
              >
                <div className="w-12 h-12 mr-3 flex items-center justify-center">
                  <img 
                    src={robotIcon}
                    alt="TeleKiosk AI Assistant"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{t('hospitalName')}</div>
                </div>
              </div>
              <button
                onClick={closeMenu}
                className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <nav className="p-4 sm:p-6">
              <div className="space-y-4">
                
                {/* Corporate Info - Dropdown */}
                <div>
                  <div 
                    className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100 touch-manipulation cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={toggleCorporateInfo}
                  >
                    <span className="text-gray-800 font-medium text-sm sm:text-base">
                      {t('corporateInfo')}
                    </span>
                    <svg
                      className={`w-4 h-4 text-blue-600 transition-transform ${
                        isCorporateInfoOpen ? "rotate-180" : ""
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7,10L12,15L17,10H7Z" />
                    </svg>
                  </div>
                  
                  {/* Corporate Info Submenu */}
                  {isCorporateInfoOpen && (
                    <div className="ml-4 mt-2 space-y-2 border-l-2 border-blue-100 pl-4">
                      <div 
                        className="py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded"
                        onClick={() => navigateAndClose('/about-us')}
                      >
                        <span className="text-gray-700 text-sm">{t('aboutUs')}</span>
                      </div>
                      <div 
                        className="py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded"
                        onClick={() => navigateAndClose('/mission-vision')}
                      >
                        <span className="text-gray-700 text-sm">{t('missionVision')}</span>
                      </div>
                      <div 
                        className="py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded"
                        onClick={() => navigateAndClose('/team')}
                      >
                        <span className="text-gray-700 text-sm">{t('team')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Our Services - Dropdown */}
                <div>
                  <div 
                    className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100 touch-manipulation cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={toggleServicesDropdown}
                  >
                    <span className="text-gray-800 font-medium text-sm sm:text-base">
                      {t('ourServices')}
                    </span>
                    <svg
                      className={`w-4 h-4 text-blue-600 transition-transform ${
                        isServicesDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7,10L12,15L17,10H7Z" />
                    </svg>
                  </div>
                  
                  {/* Services Submenu */}
                  {isServicesDropdownOpen && (
                    <div className="ml-4 mt-2 space-y-2 border-l-2 border-blue-100 pl-4">
                      <div 
                        className="py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded"
                        onClick={() => navigateAndClose('/services')}
                      >
                        <span className="text-gray-700 text-sm">All Services</span>
                      </div>
                      {services.map((service) => (
                        <div 
                          key={service.id}
                          className="py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded"
                          onClick={() => navigateAndClose(`/services/${service.id}`)}
                        >
                          <span className="text-gray-700 text-sm flex items-center space-x-2">
                            <span>{service.icon}</span>
                            <span>{service.name}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Our Doctors */}
                <div 
                  className="py-3 sm:py-4 border-b border-gray-100 touch-manipulation cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigateAndClose('/doctors')}
                >
                  <span className="text-gray-800 font-medium text-sm sm:text-base">{t('ourDoctors')}</span>
                </div>

                {/* Health & Wellness Tips */}
                <div 
                  className="py-3 sm:py-4 border-b border-gray-100 touch-manipulation cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigateAndClose('/health-tips')}
                >
                  <span className="text-gray-800 font-medium text-sm sm:text-base">
                    {t('healthWellnessTips')}
                  </span>
                </div>

                {/* Visiting Times */}
                <div 
                  className="py-3 sm:py-4 border-b border-gray-100 touch-manipulation cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigateAndClose('/visiting-times')}
                >
                  <span className="text-gray-800 font-medium text-sm sm:text-base">
                    {t('visitingTimes')}
                  </span>
                </div>

                {/* Contact Us */}
                <div 
                  className="py-3 sm:py-4 touch-manipulation cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigateAndClose('/contact')}
                >
                  <span className="text-gray-800 font-medium text-sm sm:text-base">{t('contactUs')}</span>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
