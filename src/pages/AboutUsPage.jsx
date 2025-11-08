import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InfoBar from "../components/sections/InfoBar";
import { ABOUT_VIDEO_ID, VIDEO_CONFIG } from "../constants/videoConfig";
import {
  ABOUT_PAGE_HERO_IMAGE,
  ABOUT_FACILITIES_IMAGE,
  ABOUT_SPECIALISTS_IMAGE,
  ABOUT_ALLIED_HEALTH_IMAGE
} from "../constants/carouselImages";

function AboutUsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [counters, setCounters] = useState({
    years: 0,
    specialists: 0,
    patients: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

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
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);

    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCounters({
        years: Math.round(easeOutQuart * 31),
        specialists: Math.round(easeOutQuart * 70),
        patients: Math.round(easeOutQuart * 100000),
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
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Dark Blue Background */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background Image - Baby with Stethoscope */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <div className="relative w-full h-full">
            <img
              src={ABOUT_PAGE_HERO_IMAGE.src}
              alt={ABOUT_PAGE_HERO_IMAGE.alt}
              className="w-full h-full object-cover opacity-30"
            />

            {/* Edge Fade Effect - Vignette Style */}
            {/* Top edge fade */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>

            {/* Bottom edge fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>

            {/* Left edge fade */}
            <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>

            {/* Right edge fade */}
            <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="max-w-xl">
            {/* Main Headline Text */}
            <h1 className="text-base font-normal mb-8 leading-relaxed">
              {t('qualityHealthcareDesc')}
            </h1>

            {/* Search Bar */}
            <div className="flex mb-8">
              <input
                type="text"
                placeholder={t('findDoctor')}
                className="flex-1 px-4 py-3 text-gray-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-r-md font-semibold transition-colors">
                🔍
              </button>
            </div>

            {/* Action Buttons - Clean Design with Dividers */}
            <div className="flex divide-x divide-white/20">
              {/* Book Appointment Button */}
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
                  <span className="text-white font-medium">{t('bookAppointment')}</span>
                </div>
              </button>

              {/* Referrals Button */}
              <button
                onClick={() => navigate("/referrals")}
                className="flex items-center justify-start py-6 px-8 hover:bg-white/5 cursor-pointer transition-colors touch-manipulation group flex-1"
              >
                <div className="flex items-center space-x-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                  </svg>
                  <span className="text-white font-medium">{t('referrals')}</span>
                </div>
              </button>

              {/* Directions Button */}
              <button 
                onClick={() => window.open('https://maps.google.com/?q=The+Bank+Hospital+Accra', '_blank')}
                className="flex items-center justify-start py-6 px-8 pl-8 hover:bg-white/5 cursor-pointer transition-colors touch-manipulation group flex-1"
              >
                <div className="flex items-center space-x-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                  </svg>
                  <span className="text-white font-medium">{t('directions')}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Video */}
            <div className="space-y-6">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video shadow-lg">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${ABOUT_VIDEO_ID}?${new URLSearchParams({
                    autoplay: VIDEO_CONFIG.autoplay ? '1' : '0',
                    mute: VIDEO_CONFIG.mute ? '1' : '0',
                    loop: VIDEO_CONFIG.loop ? '1' : '0',
                    playlist: ABOUT_VIDEO_ID,
                    controls: VIDEO_CONFIG.controls ? '1' : '0',
                    modestbranding: VIDEO_CONFIG.modestbranding ? '1' : '0',
                    rel: VIDEO_CONFIG.rel.toString(),
                  }).toString()}`}
                  title="Hospital Video Tour"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Take a Tour Button */}
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-orange-400">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-blue-600"
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
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {t('takeTourFacilities')}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Quality Patient Care */}
            <div className="space-y-8" ref={sectionRef}>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {t('qualityPatientFocused')}
                </h1>
                <h2 className="text-4xl font-bold text-blue-600 mb-6">
                  {t('healthcare')}
                </h2>

                <p className="text-gray-600 leading-relaxed mb-8">
                  {t('bankHospitalDesc')}
                  <br />
                  <br />
                  {t('modernFacilitiesDesc')}
                </p>
              </div>

              {/* Stats Grid - Matching the Screenshot */}
              <div className="grid grid-cols-2 gap-6">
                {/* 31+ Years */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {counters.years}+
                    </div>
                    <div className="text-gray-600 text-sm">{t('years')}</div>
                  </div>
                </div>

                {/* 70+ Specialists */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7C14.65 7 14.32 7.09 14.04 7.28L12 9.5L9.96 7.28C9.68 7.09 9.35 7 9 7L3 7V9L8.5 9L12 12.5L15.5 9L21 9ZM12 13.5L8.5 10L3 10V20C3 21.1 3.9 22 5 22L19 22C20.1 22 21 21.1 21 20V10L15.5 10L12 13.5Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {counters.specialists}+
                    </div>
                    <div className="text-gray-600 text-sm">{t('specialists')}</div>
                  </div>
                </div>

                {/* 100,000+ Patient Visits */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16,4C16.88,4 17.67,4.38 18.18,5C18.69,4.38 19.48,4 20.36,4C21.8,4 22.96,5.16 22.96,6.6C22.96,8.88 20.36,10.8 18.18,12C15.96,10.8 13.4,8.88 13.4,6.6C13.4,5.16 14.56,4 16,4M12.5,11H11.5C10.67,11 10,11.67 10,12.5V13.5C10,14.33 10.67,15 11.5,15H12.5C13.33,15 14,14.33 14,13.5V12.5C14,11.67 13.33,11 12.5,11Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {formatNumber(counters.patients)}+
                    </div>
                    <div className="text-gray-600 text-sm">
                      {t('patientVisits')}
                      <br />
                      {t('annually')}
                    </div>
                  </div>
                </div>

                {/* Medical Assistance */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18,15H16V17H14V19H16V21H18V19H20V17H18V15M12,3C7.58,3 4,6.58 4,11C4,14.17 6.2,16.83 9.12,17.71L9.71,17.86L10.23,13.95C9.5,13.82 8.96,13.16 8.96,12.38C8.96,11.5 9.67,10.79 10.55,10.79S12.14,11.5 12.14,12.38C12.14,13.16 11.6,13.82 10.87,13.95L11.39,17.86L12,17.71C14.8,16.83 17,14.17 17,11C17,6.58 13.42,3 12,3Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {t('medical')}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {t('assistanceAvailable')}
                      <br />
                      {t('hours24')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orange Call-to-Action Banner */}
      <section className="bg-gradient-to-r from-orange-400 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold">
                {t('yourHealthPriority')}
              </h3>
            </div>
            <button
              onClick={() => navigate("/booking")}
              className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors mt-4 md:mt-0"
            >
              {t('scheduleAppointment')}
            </button>
          </div>
        </div>
      </section>

      {/* Our Facilities Section */}
      <section className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Hospital Interior Image */}
            <div>
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={ABOUT_FACILITIES_IMAGE.src}
                  alt={ABOUT_FACILITIES_IMAGE.alt}
                  className="w-full h-[450px] object-cover"
                />
              </div>
            </div>

            {/* Right Side - Facilities Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-orange-500 mb-4">
                  {t('ourFacilities')}
                </h2>
                <p className="text-gray-300 mb-6 text-sm">
                  {t('modernFacilitiesSubdesc')}
                </p>
              </div>

              {/* Facilities Grid - 3 columns, 2 rows to match screenshot */}
              <div className="grid grid-cols-3 gap-6">
                {/* Row 1 */}
                {/* Facility 1 - General Wards */}
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
                      />
                    </svg>
                  </div>
                  <div className="text-xs">
                    <h4 className="font-semibold text-white mb-1">
                      {t('generalWards')}
                    </h4>
                  </div>
                </div>

                {/* Facility 2 - Pediatric Ward */}
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <div className="text-xs">
                    <h4 className="font-semibold text-white mb-1">
                      {t('pediatricWard')}
                    </h4>
                  </div>
                </div>

                {/* Facility 3 - Maternity Unit */}
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </div>
                  <div className="text-xs">
                    <h4 className="font-semibold text-white mb-1">
                      {t('maternityUnit')}
                    </h4>
                  </div>
                </div>

                {/* Row 2 */}
                {/* Facility 4 - Diagnostic Centers */}
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.251.023.501.05.75.082m-.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                      />
                    </svg>
                  </div>
                  <div className="text-xs">
                    <h4 className="font-semibold text-white mb-1">
                      {t('diagnosticCenters')}
                    </h4>
                  </div>
                </div>

                {/* Facility 5 - Outpatient Department */}
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                  <div className="text-xs">
                    <h4 className="font-semibold text-white mb-1">
                      {t('outpatientDept')}
                    </h4>
                  </div>
                </div>

                {/* Facility 6 - Emergency Unit */}
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-xs">
                    <h4 className="font-semibold text-white mb-1">
                      {t('emergencyUnit')}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="pt-6">
                <p className="text-gray-300 mb-4 text-sm">
                  {t('exploreFacilities')}
                </p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-sm">
                  {t('viewFacilities')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Specialists and Allied Health Services Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            {/* Left Column - Our Specialists */}
            <div className="space-y-6">
              {/* Image Container with Orange left and Blue bottom borders */}
              <div className="relative">
                {/* Orange left border - positioned at bottom, aligned with blue border */}
                <div className="absolute left-0 bottom-4 w-4 h-32 bg-orange-500"></div>

                {/* Image container */}
                <div className="bg-white shadow-lg ml-4">
                  <img
                    src={ABOUT_SPECIALISTS_IMAGE.src}
                    alt={ABOUT_SPECIALISTS_IMAGE.alt}
                    className="w-full h-80 object-cover"
                  />
                </div>

                {/* Blue bottom border - extended width, thicker */}
                <div className="h-4 bg-blue-600 w-4/5 mt-0"></div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 tracking-wide">
                  {t('ourSpecialists')}
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {t('specialistsDesc')}
                </p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm">
                  {t('viewAllSpecialists')}
                </button>
              </div>
            </div>

            {/* Right Column - Allied Health Services */}
            <div className="space-y-6">
              {/* Image Container with Orange left and Blue bottom borders */}
              <div className="relative">
                {/* Orange left border - positioned at bottom, aligned with blue border */}
                <div className="absolute left-0 bottom-4 w-4 h-32 bg-orange-500"></div>

                {/* Image container */}
                <div className="bg-white shadow-lg ml-4">
                  <img
                    src={ABOUT_ALLIED_HEALTH_IMAGE.src}
                    alt={ABOUT_ALLIED_HEALTH_IMAGE.alt}
                    className="w-full h-80 object-cover"
                  />
                </div>

                {/* Blue bottom border - extended width, thicker */}
                <div className="h-4 bg-blue-600 w-4/5 mt-0"></div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 tracking-wide">
                  {t('alliedHealthServices')}
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {t('alliedHealthDesc')}
                </p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm">
                  {t('viewAllServices')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InfoBar />
      <Footer />
    </div>
  );
}

export default AboutUsPage;
