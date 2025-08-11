import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

function Footer() {
  const { t } = useLanguage();
  const usefulLinks1 = [
    { textKey: "aboutUs", href: "#" },
    { textKey: "team", href: "#" },
    { textKey: "ourServices", href: "#" },
    { textKey: "careers", href: "#" },
    { textKey: "newsArticles", href: "#" },
  ];

  const usefulLinks2 = [
    { textKey: "missionVision", href: "#" },
    { textKey: "ourDoctors", href: "#" },
    { textKey: "ourFacilities", href: "#" },
    { textKey: "gallery", href: "#" },
    { textKey: "contactUs", href: "#" },
  ];

  return (
    <footer className="relative bg-slate-900 pt-24">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('/src/assets/images/footer-bg.jpg')",
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Opening Hours */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-6 pb-2 border-b border-gray-600">
                {t('openingHours')}
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>{t('mondayFriday')}</span>
                  <span>7 AM – 7 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('saturday')}</span>
                  <span>7 AM – 7 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('sunday')}</span>
                  <span>7 AM – 7 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('emergency24')}:</span>
                  <span className="text-orange-400">{t('hours24')}</span>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-gray-300 text-sm">
                  {t('opdNote')}
                </p>
              </div>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-6 pb-2 border-b border-gray-600">
                {t('usefulLinks')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  {usefulLinks1.map((link, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-orange-400 mr-2">→</span>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-orange-400 transition-colors"
                      >
                        {t(link.textKey)}
                      </a>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {usefulLinks2.map((link, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-orange-400 mr-2">→</span>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-orange-400 transition-colors"
                      >
                        {t(link.textKey)}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Get Connected */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-6 pb-2 border-b border-gray-600">
                {t('getConnected')}
              </h3>
              <div className="mb-6">
                <p className="text-gray-300 mb-4">{t('followUs')}</p>
                <div className="flex space-x-3">
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-black rounded flex items-center justify-center hover:bg-gray-800 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-700 rounded flex items-center justify-center hover:bg-blue-800 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-red-600 rounded flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative z-10 border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>{t('copyright')}</p>
          <p>{t('siteBy')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
