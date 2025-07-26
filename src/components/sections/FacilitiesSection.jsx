import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

function FacilitiesSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const facilities = [
    // Column 1
    {
      titleKey: "catheterisationLab",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      ),
    },
    {
      titleKey: "coffeeShop",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M2,21H20V19H2M20,8H18V5H20M20,3H4V13A4,4 0 0,0 8,17H14A4,4 0 0,0 18,13V10H20A2,2 0 0,0 22,8V5C22,3.89 21.1,3 20,3Z" />
        </svg>
      ),
    },
    {
      titleKey: "dentalDepartment",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,2A7,7 0 0,0 5,9V16A3,3 0 0,0 8,19A3,3 0 0,0 11,16V12A1,1 0 0,1 12,11A1,1 0 0,1 13,12V16A3,3 0 0,0 16,19A3,3 0 0,0 19,16V9A7,7 0 0,0 12,2M8,17A1,1 0 0,1 7,16V13.5A1.5,1.5 0 0,1 8.5,12A1.5,1.5 0 0,1 10,13.5V16A1,1 0 0,1 9,17M17,16A1,1 0 0,1 16,17A1,1 0 0,1 15,16V13.5A1.5,1.5 0 0,1 16.5,12A1.5,1.5 0 0,1 18,13.5" />
        </svg>
      ),
    },
    {
      titleKey: "emergencyUnit",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M17,13H13V17H11V13H7V11H11V7H13V11H17V13Z" />
        </svg>
      ),
    },
    {
      titleKey: "entDepartment",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
        </svg>
      ),
    },
    {
      titleKey: "executiveSuites",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M5,3V9H15V3H5M12,8H6V4H12V8M19,3H17V9H19V3M7,11V13H5V11H7M19,11V13H17V11H19M5,19V21H7V19H5M5,15V17H7V15H5M9,21V19H15V21H9M17,21V19H19V21H17M17,15V17H19V15H17Z" />
        </svg>
      ),
    },
    // Column 2
    {
      titleKey: "generalWards",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,3L2,12H5V20H19V12H22L12,3M12,8.75A2.25,2.25 0 0,1 14.25,11A2.25,2.25 0 0,1 12,13.25A2.25,2.25 0 0,1 9.75,11A2.25,2.25 0 0,1 12,8.75M12,15C13.5,15 16.5,15.75 16.5,17.25V18H7.5V17.25C7.5,15.75 10.5,15 12,15Z" />
        </svg>
      ),
    },
    {
      titleKey: "icuHighCare",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V15H11V17M11,13H13V7H11V13Z" />
        </svg>
      ),
    },
    {
      titleKey: "lithotripsyUnit",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19,6H22V8H19V6M19,10H22V12H19V10M19,14H22V16H19V14M17,8H20V10H17V8M17,12H20V14H17V12M15,6V18H17V6H15M9,6V8H13V18H15V6H9M7,8V10H11V18H13V8H7M5,10V12H9V18H11V10H5M3,12V14H7V18H9V12H3M1,14V16H5V18H7V14H1Z" />
        </svg>
      ),
    },
    {
      titleKey: "maternityWard",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M12,9C14.67,9 20,10.34 20,13V16H4V13C4,10.34 9.33,9 12,9M12,17.5A1.5,1.5 0 0,1 13.5,19A1.5,1.5 0 0,1 12,20.5A1.5,1.5 0 0,1 10.5,19A1.5,1.5 0 0,1 12,17.5Z" />
        </svg>
      ),
    },
    {
      titleKey: "neonatalICU",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M21,9V7L15,7C14.65,7 14.32,7.09 14.04,7.28L12,9.5L9.96,7.28C9.68,7.09 9.35,7 9,7L3,7V9L8.5,9L12,12.5L15.5,9L21,9Z" />
        </svg>
      ),
    },
    {
      titleKey: "obstetricsGynecology",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M12,9C14.67,9 20,10.34 20,13V16H4V13C4,10.34 9.33,9 12,9M12,18A1.5,1.5 0 0,1 13.5,19.5A1.5,1.5 0 0,1 12,21A1.5,1.5 0 0,1 10.5,19.5A1.5,1.5 0 0,1 12,18Z" />
        </svg>
      ),
    },
    // Column 3
    {
      titleKey: "opticalCentre",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
        </svg>
      ),
    },
    {
      titleKey: "outpatientsDepartment",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V5H19V19M17,8.5L13.5,12L17,15.5V13H21V11H17V8.5M11,15.5V13H7V11H11V8.5L7.5,12L11,15.5Z" />
        </svg>
      ),
    },
    {
      titleKey: "paediatricWard",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7L15,7C14.65,7 14.32,7.09 14.04,7.28L12,9.5L9.96,7.28C9.68,7.09 9.35,7 9,7L3,7V9L8.5,9L12,12.5L15.5,9L21,9ZM12,13.5L8.5,10L3,10V20C3,21.1 3.9,22 5,22L19,22C20.1,22 21,21.1 21,20V10L15.5,10L12,13.5Z" />
        </svg>
      ),
    },
    {
      titleKey: "renalDepartment",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
        </svg>
      ),
    },
    {
      titleKey: "theatres",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
        </svg>
      ),
    },
    {
      titleKey: "urologyDepartment",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V15H11V17M11,13H13V7H11V13Z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10 text-center lg:text-left">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-3">
            {t("ourFacilities")}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {t("facilitiesTitle")}
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto lg:mx-0">
            {t("facilitiesSubtitle")}
          </p>
        </div>

        {/* Facilities Container */}
        <div className="relative rounded-tr-[30px] rounded-bl-[30px] sm:rounded-tr-[45px] sm:rounded-bl-[45px] lg:rounded-tr-[60px] lg:rounded-bl-[60px] p-4 sm:p-6 lg:p-8 overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/src/assets/images/facilities-bg.jpg')",
            }}
          ></div>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-slate-900/85"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Facilities Grid - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-8 lg:gap-x-12 gap-y-4 sm:gap-y-6">
              {facilities.map((facility, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 sm:space-x-4 group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-slate-500 transition-colors">
                    <div className="scale-90 sm:scale-100">{facility.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg leading-tight">
                      {t(facility.titleKey)}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="flex justify-center sm:justify-end mt-4 sm:mt-6">
              <button 
                onClick={() => navigate('/all-facilities')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center transition-colors text-sm sm:text-base min-h-10 touch-manipulation"
              >
                {t("viewAll")}
                <svg
                  className="w-4 h-4 ml-2"
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
  );
}

export default FacilitiesSection;
