import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InfoBar from "../components/sections/InfoBar";
import { useLanguage } from "../contexts/LanguageContext";

function DoctorsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const allDoctors = [
    {
      id: 1,
      name: "Dr Charlotte Osafo",
      specialty: "Nephrologist",
      image: "/src/assets/images/doctor1.jpg",
      qualifications: "MBBS, MD",
      specialtyDetail: "Kidney and Urinary System Specialist",
    },
    {
      id: 2,
      name: "Dr. Gloria Akosua Ansa",
      specialty: "Deputy Medical Director",
      image: "/src/assets/images/doctor2.jpg",
      qualifications: "MBChB, MBA, PhD",
      specialtyDetail: "Public Health, Health Services Management",
    },
    {
      id: 3,
      name: "Dr Saeed Jibreal",
      specialty: "Family Physician",
      image: "/src/assets/images/doctor3.jpg",
      qualifications: "MBBS, MRCGP",
      specialtyDetail: "General Practice and Family Medicine",
    },
    {
      id: 4,
      name: "Dr. Emmanuel Asanso-Mensah",
      specialty: "EMR - Public Health",
      image: "/src/assets/images/doctor4.jpg",
      qualifications: "MBChB, MPH",
      specialtyDetail: "Public Health and Preventive Medicine",
    },
    {
      id: 5,
      name: "Dr. Mohamed Hafez Sbbawek",
      specialty: "Specialist",
      image: "/src/assets/images/doctor5.jpg",
      qualifications: "MBBS, MD",
      specialtyDetail: "Internal Medicine",
    },
    {
      id: 6,
      name: "Dr. Vincent Acorlor",
      specialty: "Specialist",
      image: "/src/assets/images/doctor6.jpg",
      qualifications: "MBBS, FRCS",
      specialtyDetail: "General Surgery",
    },
    {
      id: 7,
      name: "Dr Solomon Brookman",
      specialty: "Specialist",
      image: "/src/assets/images/doctor7.jpg",
      qualifications: "MBBS, MD",
      specialtyDetail: "Cardiology",
    },
    {
      id: 8,
      name: "Dr. Kofo Adesu-Kubi",
      specialty: "Specialist",
      image: "/src/assets/images/doctor8.jpg",
      qualifications: "MBBS, FRCOG",
      specialtyDetail: "Obstetrics and Gynecology",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 py-16">
        <div className="container mx-auto px-4">
          <div className="text-left text-white max-w-2xl">
            <h1 className="text-xl md:text-2xl lg:text-base font-bold mb-4 leading-tight">
              {t('doctorsHeroTitle')}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Section Header */}
        <div className="mb-8">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-2">
            {t('ourDoctors')}
          </p>
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            {t('doctorsQualificationDesc')}
          </h2>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-80 object-cover"
                  onError={(e) => {
                    e.target.src = "/src/assets/images/doctor-placeholder.jpg";
                  }}
                />
                {/* Overlay buttons */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/doctor-profile/${doctor.id}`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      {t('profile')}
                    </button>
                    <span className="text-white text-sm">|</span>
                    <button
                      onClick={() => navigate("/book-now")}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      {t('bookAppointment')}
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  {doctor.name}
                </h3>
                <p className="text-blue-600 text-sm font-medium">
                  {doctor.specialty}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InfoBar />
      <Footer />
    </div>
  );
}

export default DoctorsPage;
