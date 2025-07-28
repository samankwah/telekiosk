import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useStaggeredAnimation } from "../../hooks/useScrollAnimation";

function NavigationButtons() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [setNavRef, visibleNavItems] = useStaggeredAnimation(3, 150);

  const navigationItems = [
    {
      icon: (
        <svg
          className="w-10 h-10 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      titleKey: "bookAppointment",
      action: () => navigate("/book-now"),
    },
    {
      icon: (
        <svg
          className="w-10 h-10 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      ),
      titleKey: "referrals",
      action: () => {
        // Navigate to booking page as referrals functionality
        navigate("/referrals");
      },
    },
    {
      icon: (
        <svg
          className="w-10 h-10 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      titleKey: "directions",
      action: () => {
        // Open Google Maps directly with the hospital location
        window.open('https://www.google.com/maps/place/GHANA+METEOROLOGICAL+AGENCY/@5.650844,-0.1671472,17z/data=!3m1!4b1!4m6!3m5!1s0xfdf9ca15e56390f:0xe32353079eab7d22!8m2!3d5.650844!4d-0.1671472!16s%2Fg%2F11c5p9_qkm?entry=ttu', '_blank');
      },
    },
  ];

  return (
    <div className="bg-white py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-3 gap-0 divide-x divide-blue-400">
          {navigationItems.map((item, index) => (
            <div
              key={index}
              ref={setNavRef(index)}
              className={`flex items-center justify-center py-3 sm:py-4 md:py-6 lg:py-8 hover:bg-gray-50 cursor-pointer transition-all duration-300 touch-manipulation hover:scale-105 active:scale-95 ${
                visibleNavItems.has(index) ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-4'
              }`}
              onClick={item.action}
            >
              <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-blue-50 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-blue-100 hover:shadow-lg group-hover:scale-110">
                  <div className="scale-50 sm:scale-75 md:scale-90 lg:scale-100 transition-transform duration-300">
                    {item.icon}
                  </div>
                </div>
                <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-900 leading-tight px-1 max-w-[90px] sm:max-w-none transition-colors duration-300 hover:text-orange-600">
                  {t(item.titleKey)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavigationButtons;
