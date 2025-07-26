import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

function DoctorsSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const doctors = [
    {
      nameKey: "drCharlotte",
      image: "/src/assets/images/doctor1.jpg",
    },
    {
      nameKey: "drSaeed",
      image: "/src/assets/images/doctor2.jpg",
    },
    {
      nameKey: "drEmmanuel",
      image: "/src/assets/images/doctor3.jpg",
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left Side - Background Image */}
        <div className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-[600px]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-r-[30px] sm:rounded-r-[45px] lg:rounded-r-[60px]"
            style={{
              backgroundImage: "url('/src/assets/images/doctors-bg.jpg')",
            }}
          >
            {/* Blue overlay */}
            <div className="absolute inset-0 bg-blue-900/60 rounded-tr-[30px] sm:rounded-tr-[45px] lg:rounded-tr-[60px]"></div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex items-center px-4 sm:px-6 lg:px-16 py-8 sm:py-10 lg:py-12">
          <div className="w-full">
            {/* Header */}
            <div className="mb-6 sm:mb-8 text-center lg:text-left">
              <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-3">
                {t("ourDoctors")}
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {t("doctorsTitle")}
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t("doctorsSubtitle")}
              </p>
            </div>

            {/* Doctors Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {doctors.map((doctor, index) => (
                <div
                  key={index}
                  className="min-w-4xl bg-white rounded-bl-3xl rounded-tr-3xl shadow-lg p-4 sm:p-6 text-center flex flex-col items-center justify-center"
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-2 sm:mb-3">
                    <img
                      src={doctor.image}
                      alt={t(doctor.nameKey)}
                      className="w-full h-full rounded-full object-cover border-2 border-orange-200"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base leading-tight">
                    {t(doctor.nameKey)}
                  </h3>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/doctors")}
                className="bg-white border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-500 px-6 py-3 rounded-lg font-semibold flex items-center transition-all duration-200"
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

export default DoctorsSection;
