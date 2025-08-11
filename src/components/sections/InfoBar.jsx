import React from 'react';
import { useLanguage } from "../../contexts/LanguageContext";

function InfoBar() {
  const { t } = useLanguage();
  return (
    <div className="relative py-6 sm:py-8 -mb-16 sm:-mb-20 lg:-mb-24 z-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/assets/images/footer-top-bg.jpg')",
        }}
      ></div>

      {/* Blue Overlay */}
      <div className="max-w-7xl mx-auto absolute inset-0 bg-blue-600/90 rounded-bl-[30px] sm:rounded-bl-[45px] lg:rounded-bl-[60px]"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Directions */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-2 sm:mb-3">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
              </svg>
            </div>
            <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
              {t("directions")}
            </h4>
            <p className="text-white text-xs sm:text-sm leading-tight">
              {t("location")}
            </p>
          </div>

          {/* For all enquiries */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-2 sm:mb-3">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
              </svg>
            </div>
            <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
              {t("allEnquiries")}
            </h4>
            <p className="text-white text-base sm:text-lg font-bold">
              {t("phone")}
            </p>
          </div>

          {/* For Referrals */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-2 sm:mb-3">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
              </svg>
            </div>
            <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
              {t("forReferrals")}
            </h4>
            <p className="text-white text-base sm:text-lg font-bold">
              {t("referralPhone")}
            </p>
          </div>

          {/* Feel Free to Contact Us */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-2 sm:mb-3">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
              </svg>
            </div>
            <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
              {t("feelFreeContact")}
            </h4>
            <p className="text-white text-xs sm:text-sm leading-tight break-all">
              {t("email")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoBar;
