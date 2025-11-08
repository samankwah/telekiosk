import React from 'react';
import ImageCarousel from "../ui/ImageCarousel";
import { HERO_CAROUSEL_IMAGES } from "../../constants/carouselImages";
import { useLanguage } from "../../contexts/LanguageContext";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

function HeroSection() {
  const { t } = useLanguage();
  const [heroRef, isHeroVisible] = useScrollAnimation(0.2);

  return (
    <div className="relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:h-[500px] bg-white">
      {/* Mobile: Full Background Carousel */}
      <div className="lg:hidden absolute inset-0">
        <ImageCarousel images={HERO_CAROUSEL_IMAGES} interval={4000} />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>

      {/* Desktop: Split Layout */}
      <div className="hidden lg:flex absolute inset-0">
        <div className="w-1/2 relative">
          <ImageCarousel images={HERO_CAROUSEL_IMAGES} interval={4000} />
        </div>
        <div className="w-1/2 bg-white"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[500px] flex items-center">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0">
            {/* Empty space for image on desktop */}
            <div className="hidden lg:block"></div>

            {/* Content */}
            <div 
              ref={heroRef}
              className={`flex flex-col justify-center lg:pl-16 text-center lg:text-left px-2 sm:px-0 transition-all duration-1000 ${
                isHeroVisible ? 'animate-fadeInRight opacity-100' : 'opacity-0 translate-x-8'
              }`}
            >
              <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-2xl xl:text-3xl font-bold text-white lg:text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight drop-shadow-lg lg:drop-shadow-none transition-all duration-700 ${
                isHeroVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-4'
              }`}>
                {t("heroTitle")}
              </h1>
              <p className={`text-gray-100 lg:text-gray-600 mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-base sm:text-lg md:text-xl lg:text-lg leading-relaxed max-w-md sm:max-w-lg mx-auto lg:mx-0 drop-shadow-md lg:drop-shadow-none transition-all duration-700 delay-300 ${
                isHeroVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-4'
              }`}>
                {t("heroSubtitle")}
              </p>

              {/* Search Bar Placeholder - Hidden on Mobile, Visible on Desktop */}
              <div className={`hidden lg:block max-w-lg mx-auto lg:mx-0 transition-all duration-700 delay-500 ${
                isHeroVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-4'
              }`}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("findDoctor")}
                    className="w-full px-4 py-3 pr-12 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    readOnly
                    onFocus={(e) => e.target.blur()}
                  />
                  <button
                    className="absolute right-0 top-0 h-full px-4 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
