import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

function NavigationButtons() {
  const { t } = useLanguage();
  const navigate = useNavigate();

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
    <div className="bg-white py-8 sm:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-0 divide-x divide-blue-400">
          {navigationItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center py-4 sm:py-6 lg:py-8 hover:bg-gray-50 cursor-pointer transition-colors touch-manipulation"
              onClick={item.action}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-blue-50 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                  <div className="scale-75 sm:scale-90 lg:scale-100">
                    {item.icon}
                  </div>
                </div>
                <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-semibold text-gray-900 leading-tight px-1">
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
