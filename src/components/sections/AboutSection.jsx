import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

function AboutSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [counters, setCounters] = useState({
    years: 0,
    specialists: 0,
    patients: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    {
      key: "years",
      targetNumber: 31,
      suffix: "+",
      label: t("yearsLabel"),
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 2L12 6L16 10L12 14L8 10L12 6V2ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
            opacity="0.3"
          />
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
          <circle
            cx="12"
            cy="12"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      ),
    },
    {
      key: "specialists",
      targetNumber: 70,
      suffix: "+",
      label: t("specialistsLabel"),
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7C14.65 7 14.32 7.09 14.04 7.28L12 9.5L9.96 7.28C9.68 7.09 9.35 7 9 7L3 7V9L8.5 9L12 12.5L15.5 9L21 9ZM12 13.5L8.5 10L3 10V20C3 21.1 3.9 22 5 22L19 22C20.1 22 21 21.1 21 20V10L15.5 10L12 13.5Z" />
          <circle cx="12" cy="4" r="2" fill="white" />
          <path d="M16 17H8V19H16V17M16 14H8V16H16V14" fill="white" />
        </svg>
      ),
    },
    {
      key: "patients",
      targetNumber: 130000,
      suffix: "+",
      label: t("patientVisitsLabel"),
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16,4C16.88,4 17.67,4.38 18.18,5C18.69,4.38 19.48,4 20.36,4C21.8,4 22.96,5.16 22.96,6.6C22.96,8.88 20.36,10.8 18.18,12C15.96,10.8 13.4,8.88 13.4,6.6C13.4,5.16 14.56,4 16,4M12.5,11H11.5C10.67,11 10,11.67 10,12.5V13.5C10,14.33 10.67,15 11.5,15H12.5C13.33,15 14,14.33 14,13.5V12.5C14,11.67 13.33,11 12.5,11M18,14V20A2,2 0 0,1 16,22H4A2,2 0 0,1 2,20V8A2,2 0 0,1 4,6H10A2,2 0 0,1 12,8V20A2,2 0 0,1 10,22" />
          <circle cx="6" cy="10" r="1.5" fill="white" />
          <circle cx="6" cy="17" r="1.5" fill="white" />
          <circle cx="12" cy="12.5" r="1" fill="white" />
        </svg>
      ),
    },
    {
      key: "medical",
      targetNumber: null,
      displayText: t("Medical"),
      label: t("assistanceLabel"),
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18,15H16V17H14V19H16V21H18V19H20V17H18V15M12,3C7.58,3 4,6.58 4,11C4,14.17 6.2,16.83 9.12,17.71L9.71,17.86L10.23,13.95C9.5,13.82 8.96,13.16 8.96,12.38C8.96,11.5 9.67,10.79 10.55,10.79S12.14,11.5 12.14,12.38C12.14,13.16 11.6,13.82 10.87,13.95L11.39,17.86L12,17.71C14.8,16.83 17,14.17 17,11C17,6.58 13.42,3 12,3ZM12,7A2,2 0 0,1 14,9A2,2 0 0,1 12,11A2,2 0 0,1 10,9A2,2 0 0,1 12,7Z" />
          <path d="M21,12H19V10H17V12H15V14H17V16H19V14H21V12Z" fill="white" />
        </svg>
      ),
    },
  ];

  // Intersection Observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);

    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCounters({
        years: Math.round(easeOutQuart * 31),
        specialists: Math.round(easeOutQuart * 70),
        patients: Math.round(easeOutQuart * 130000),
      });

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + ",000";
    }
    return num.toString();
  };

  return (
    <>
      {/* Opening Hours Section */}
      <section className="py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mr-2 sm:mr-3">
                  {t("openingHours")}
                </h3>
                <div className="w-1 h-5 sm:h-6 lg:h-8 bg-blue-600"></div>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm flex-1">
                <div className="whitespace-nowrap">
                  <span className="font-semibold text-gray-900 mr-1">
                    {t("mondayFriday")}:
                  </span>
                  <span className="text-gray-600">
                    {t("openingHoursTime") || "7 AM – 7 PM"}
                  </span>
                </div>
                <div className="whitespace-nowrap">
                  <span className="font-semibold text-gray-900 mr-1">
                    {t("saturday")}:
                  </span>
                  <span className="text-gray-600">
                    {t("openingHoursTime") || "7 AM – 7 PM"}
                  </span>
                </div>
                <div className="whitespace-nowrap">
                  <span className="font-semibold text-gray-900 mr-1">
                    {t("sunday")}:
                  </span>
                  <span className="text-gray-600">
                    {t("openingHoursTime") || "7 AM – 7 PM"}
                  </span>
                </div>
                <div className="whitespace-nowrap">
                  <span className="font-semibold text-red-600 mr-1">
                    {t("emergency24")}:
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {t("hours24")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left Side - Video Tour */}
            <div className="space-y-4 sm:space-y-6">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-gray-200 text-sm sm:text-base">{t("videoTourSoon")}</p>
                  </div>
                </div>
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white text-xs sm:text-sm">
                  {t("videoTimestamp") || "0:02 / 5:15"}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border-l-4 border-orange-400">
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-9 0H3m2 0h6M9 7h6m-6 4h6m-6 4h6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                      {t("takeTour")}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-700 font-medium">
                      {t("facilities")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - About Content */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <p className="text-orange-500 font-semibold text-xs sm:text-sm uppercase tracking-wide mb-2 sm:mb-3">
                  {t("aboutUs")}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  {t("aboutMainTitle")}
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {t("aboutDescription")}
                </p>
              </div>

              {/* Stats Grid */}
              <div
                ref={sectionRef}
                className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
              >
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 sm:space-x-3"
                  >
                    <div className="flex-shrink-0 scale-75 sm:scale-90 lg:scale-100">
                      {stat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                        {stat.key === "years"
                          ? `${counters.years}${stat.suffix}`
                          : stat.key === "specialists"
                          ? `${counters.specialists}${stat.suffix}`
                          : stat.key === "patients"
                          ? `${formatNumber(counters.patients)}${stat.suffix}`
                          : stat.displayText}
                      </div>
                      <div className="text-gray-600 text-xs sm:text-sm leading-tight">
                        {typeof stat.label === "function"
                          ? stat.label()
                          : stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="pt-2 sm:pt-4">
                <button
                  onClick={() => navigate("/about")}
                  className="border border-gray-300 text-gray-900 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium flex items-center text-sm sm:text-base touch-manipulation"
                >
                  {t("viewAll")}
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutSection;
