import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InfoBar from "../components/sections/InfoBar";
import { useLanguage } from "../contexts/LanguageContext";

function AllFacilitiesPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Define all facilities with their categories
  const facilities = [
    {
      titleKey: "catheterisationLab",
      title: "CATHETERISATION LABORATORY",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.5M14.25 3.104c.251.023.501.05.75.082M19.8 14.5l-1.306 1.306a3.75 3.75 0 01-2.829 1.194H7.336a3.75 3.75 0 01-2.83-1.194L3.2 14.5m16.6 0a2.25 2.25 0 00.659-1.591V8.286a1.5 1.5 0 00-1.5-1.5h-1.064M19.8 14.5l-3.446-4.91M20.459 6.786h-1.064M3.2 14.5l1.306 1.306a3.75 3.75 0 002.829 1.194h9.128a3.75 3.75 0 002.83-1.194L20.6 14.5m-16.6 0a2.25 2.25 0 01-.659-1.591V8.286a1.5 1.5 0 011.5-1.5h1.064M3.2 14.5l3.446-4.91M3.541 6.786h1.064" />
        </svg>
      ),
    },
    {
      titleKey: "coffeeShop",
      title: "COFFEE SHOP",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      ),
    },
    {
      titleKey: "dentalDepartment",
      title: "DENTAL DEPARTMENT",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      titleKey: "emergencyUnit",
      title: "24/7 EMERGENCY UNIT",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      titleKey: "entDepartment",
      title: "ENT DEPARTMENT",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
        </svg>
      ),
    },
    {
      titleKey: "executiveSuites",
      title: "EXECUTIVE AND VVIP SUITES",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5,3V9H15V3H5M12,8H6V4H12V8M19,3H17V9H19V3M7,11V13H5V11H7M19,11V13H17V11H19M5,19V21H7V19H5M5,15V17H7V15H5M9,21V19H15V21H9M17,21V19H19V21H17M17,15V17H19V15H17Z" />
        </svg>
      ),
    },
    {
      titleKey: "generalWards",
      title: "GENERAL WARDS",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
        </svg>
      ),
    },
    {
      titleKey: "icuHighCare",
      title: "ICU AND HIGH CARE",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V15H11V17M11,13H13V7H11V13Z" />
        </svg>
      ),
    },
    {
      titleKey: "lithotripsyUnit",
      title: "LITHOTRIPSY UNIT",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19,6H22V8H19V6M19,10H22V12H19V10M19,14H22V16H19V14M17,8H20V10H17V8M17,12H20V14H17V12M15,6V18H17V6H15M9,6V8H13V18H15V6H9M7,8V10H11V18H13V8H7M5,10V12H9V18H11V10H5M3,12V14H7V18H9V12H3M1,14V16H5V18H7V14H1Z" />
        </svg>
      ),
    },
    {
      titleKey: "maternityWard",
      title: "MATERNITY WARD",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M12,9C14.67,9 20,10.34 20,13V16H4V13C4,10.34 9.33,9 12,9M12,17.5A1.5,1.5 0 0,1 13.5,19A1.5,1.5 0 0,1 12,20.5A1.5,1.5 0 0,1 10.5,19A1.5,1.5 0 0,1 12,17.5Z" />
        </svg>
      ),
    },
    {
      titleKey: "neonatalICU",
      title: "NEONATAL ICU",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M21,9V7L15,7C14.65,7 14.32,7.09 14.04,7.28L12,9.5L9.96,7.28C9.68,7.09 9.35,7 9,7L3,7V9L8.5,9L12,12.5L15.5,9L21,9Z" />
        </svg>
      ),
    },
    {
      titleKey: "obstetricsGynecology",
      title: "OBSTETRICS & GYNAECOLOGY",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M12,9C14.67,9 20,10.34 20,13V16H4V13C4,10.34 9.33,9 12,9M12,18A1.5,1.5 0 0,1 13.5,19.5A1.5,1.5 0 0,1 12,21A1.5,1.5 0 0,1 10.5,19.5A1.5,1.5 0 0,1 12,18Z" />
        </svg>
      ),
    },
    {
      titleKey: "opticalCentre",
      title: "OPTICAL CENTRE",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
        </svg>
      ),
    },
    {
      titleKey: "outpatientsDepartment",
      title: "OUTPATIENTS DEPARTMENT",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V5H19V19M17,8.5L13.5,12L17,15.5V13H21V11H17V8.5M11,15.5V13H7V11H11V8.5L7.5,12L11,15.5Z" />
        </svg>
      ),
    },
    {
      titleKey: "paediatricWard",
      title: "PAEDIATRIC WARD",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7L15,7C14.65,7 14.32,7.09 14.04,7.28L12,9.5L9.96,7.28C9.68,7.09 9.35,7 9,7L3,7V9L8.5,9L12,12.5L15.5,9L21,9ZM12,13.5L8.5,10L3,10V20C3,21.1 3.9,22 5,22L19,22C20.1,22 21,21.1 21,20V10L15.5,10L12,13.5Z" />
        </svg>
      ),
    },
    {
      titleKey: "pharmacy",
      title: "PHARMACY",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.5,6A4.5,4.5 0 0,1 22,10.5A4.5,4.5 0 0,1 17.5,15A4.5,4.5 0 0,1 13,10.5A4.5,4.5 0 0,1 17.5,6M17.5,8A2.5,2.5 0 0,0 15,10.5A2.5,2.5 0 0,0 17.5,13A2.5,2.5 0 0,0 20,10.5A2.5,2.5 0 0,0 17.5,8M6,8H12V10H6V8M6,12H12V14H6V12M6,16H12V18H6V16Z" />
        </svg>
      ),
    },
    {
      titleKey: "radiology",
      title: "RADIOLOGY",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      titleKey: "renalDepartment",
      title: "RENAL DEPARTMENT",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
        </svg>
      ),
    },
    {
      titleKey: "theatres",
      title: "THEATRES",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      ),
    },
    {
      titleKey: "urologyDepartment",
      title: "UROLOGY DEPARTMENT",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V15H11V17M11,13H13V7H11V13Z" />
        </svg>
      ),
    },
    {
      titleKey: "laboratory",
      title: "LABORATORY",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.5M14.25 3.104c.251.023.501.05.75.082M19.8 14.5l-1.306 1.306a3.75 3.75 0 01-2.829 1.194H7.336a3.75 3.75 0 01-2.83-1.194L3.2 14.5" />
        </svg>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Standard Pattern */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background Image - Medical Professional */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <div className="w-full h-full bg-gradient-to-l from-slate-700 to-transparent">
            <div className="w-full h-full flex items-center justify-center opacity-30">
              <div className="text-center text-white/60">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🏥</span>
                </div>
                <p className="font-semibold text-lg">Hospital Facilities</p>
                <p className="text-sm">Up-to-date and well equipped</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="max-w-xl">
            <h1 className="text-base font-normal mb-8 leading-relaxed">
              {t("facilitiesHeroText")}
            </h1>

            {/* Search Bar */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder={t("findDoctor")}
                className="w-full px-4 py-3 pr-12 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex divide-x divide-white/20">
              <button
                onClick={() => navigate("/booking")}
                className="flex items-center justify-start py-6 px-6 pr-8 hover:bg-white/5 cursor-pointer transition-colors touch-manipulation group flex-1"
              >
                <div className="flex items-center space-x-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="text-white font-medium">{t("bookAppointment")}</span>
                </div>
              </button>

              <button
                onClick={() => navigate("/referrals")}
                className="flex items-center justify-start py-6 px-8 hover:bg-white/5 cursor-pointer transition-colors touch-manipulation group flex-1"
              >
                <div className="flex items-center space-x-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                  <span className="text-white font-medium">{t("referrals")}</span>
                </div>
              </button>

              <button
                onClick={() => window.open("https://maps.google.com/?q=The+Bank+Hospital+Accra", "_blank")}
                className="flex items-center justify-start py-6 px-8 pl-8 hover:bg-white/5 cursor-pointer transition-colors touch-manipulation group flex-1"
              >
                <div className="flex items-center space-x-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span className="text-white font-medium">{t("directions")}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Header */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-orange-400 font-semibold text-sm mb-2 uppercase tracking-wide">
            {t("ourFacilities").toUpperCase()}
          </p>
          <h1 className="text-lg text-gray-800 font-normal">
            {t("facilitiesSubtitle")}
          </h1>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, index) => (
              <div 
                key={index}
                className="bg-gray-100 rounded-lg p-6 hover:bg-gray-200 transition-colors cursor-pointer group relative"
              >
                {/* External Link Icon - Top Right */}
                <div className="absolute top-4 right-4 w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>

                <div className="flex items-start space-x-4">
                  {/* Blue Icon */}
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                    {facility.icon}
                  </div>
                  
                  {/* Title */}
                  <div className="flex-1 pt-1">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                      {t(facility.titleKey)}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InfoBar />
      <Footer />
    </div>
  );
}

export default AllFacilitiesPage;