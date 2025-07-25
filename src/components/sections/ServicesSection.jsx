import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

function ServicesSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const services = [
    {
      titleKey: "specialists",
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 2v2m0 16v2m8.485-8.485l-1.414 1.414M4.929 4.929L3.515 6.343M20 12h2M2 12h2"
          />
        </svg>
      ),
    },
    {
      titleKey: "outpatients",
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6"
          />
        </svg>
      ),
    },
    {
      titleKey: "catheterization",
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3"
          />
        </svg>
      ),
    },
    {
      titleKey: "laboratory",
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 9h4"
          />
        </svg>
      ),
    },
    {
      titleKey: "gastroscopy",
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
          <circle
            cx="12"
            cy="10"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 7v6l2 2"
          />
        </svg>
      ),
    },
    {
      titleKey: "allied",
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      titleKey: "radiology",
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 6h4M10 10h4M10 14h4"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left Side - Services Content */}
          <div className="lg:col-span-3">
            <div className="mb-8 sm:mb-10 lg:mb-12 text-center lg:text-left">
              <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-3">
                {t('ourServices')}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {t('servicesTitle')}
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t('servicesSubtitle')}
              </p>
            </div>

            {/* Services Grid - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8">
              {services.map((service, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-blue-100 transition-colors">
                    <div className="scale-75 sm:scale-100">{service.icon}</div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight px-1">
                    {t(service.titleKey)}
                  </h3>
                </div>
              ))}

              {/* View All Button */}
              <div 
                className="text-center group touch-manipulation cursor-pointer"
                onClick={() => navigate('/services')}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600"
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
                </div>
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight">
                  {t('viewAll')}
                </h3>
              </div>
            </div>
          </div>

          {/* Right Side - Medical Professional Image */}
          <div className="lg:col-span-2 mt-8 lg:mt-0">
            <div className="bg-gray-300 h-64 sm:h-80 lg:h-96 xl:h-[500px] min-h-[250px] rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm sm:text-base lg:text-lg text-center px-4">
                {t('medicalProfessionalImage')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
