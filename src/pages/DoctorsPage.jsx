import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InfoBar from "../components/sections/InfoBar";
import { useLanguage } from "../contexts/LanguageContext";
import { DOCTORS_PAGE_IMAGES, DOCTORS_PAGE_HERO_IMAGE } from "../constants/carouselImages";

function DoctorsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const allDoctors = [
    {
      id: 1,
      name: "Dr Charlotte Osafo",
      specialty: "Nephrologist",
      image: DOCTORS_PAGE_IMAGES[0].src,
      qualifications: "MBBS, MD",
      specialtyDetail: "Kidney and Urinary System Specialist",
    },
    {
      id: 2,
      name: "Dr. Gloria Akosua Ansa",
      specialty: "Deputy Medical Director",
      image: DOCTORS_PAGE_IMAGES[1].src,
      qualifications: "MBChB, MBA, PhD",
      specialtyDetail: "Public Health, Health Services Management",
    },
    {
      id: 3,
      name: "Dr Saeed Jibreal",
      specialty: "Family Physician",
      image: DOCTORS_PAGE_IMAGES[2].src,
      qualifications: "MBBS, MRCGP",
      specialtyDetail: "General Practice and Family Medicine",
    },
    {
      id: 4,
      name: "Dr. Emmanuel Asanso-Mensah",
      specialty: "EMR - Public Health",
      image: DOCTORS_PAGE_IMAGES[3].src,
      qualifications: "MBChB, MPH",
      specialtyDetail: "Public Health and Preventive Medicine",
    },
    {
      id: 5,
      name: "Dr. Mohamed Hafez Sbbawek",
      specialty: "Specialist",
      image: DOCTORS_PAGE_IMAGES[4].src,
      qualifications: "MBBS, MD",
      specialtyDetail: "Internal Medicine",
    },
    {
      id: 6,
      name: "Dr. Vincent Acorlor",
      specialty: "Specialist",
      image: DOCTORS_PAGE_IMAGES[5].src,
      qualifications: "MBBS, FRCS",
      specialtyDetail: "General Surgery",
    },
    {
      id: 7,
      name: "Dr Solomon Brookman",
      specialty: "Specialist",
      image: DOCTORS_PAGE_IMAGES[6].src,
      qualifications: "MBBS, MD",
      specialtyDetail: "Cardiology",
    },
    {
      id: 8,
      name: "Dr. Kofo Adesu-Kubi",
      specialty: "Specialist",
      image: DOCTORS_PAGE_IMAGES[7].src,
      qualifications: "MBBS, FRCOG",
      specialtyDetail: "Obstetrics and Gynecology",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <div className="relative w-full h-full">
            <img
              src={DOCTORS_PAGE_HERO_IMAGE.src}
              alt={DOCTORS_PAGE_HERO_IMAGE.alt}
              className="w-full h-full object-cover opacity-30"
            />

            {/* Edge Fade Effect - Vignette Style */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
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
              <div className="relative group">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = DOCTORS_PAGE_IMAGES[0].src;
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
