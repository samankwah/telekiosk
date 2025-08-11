import React from 'react';
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InfoBar from "../components/sections/InfoBar";

function MissionVisionPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Dark Blue Background */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background Image - Baby with Stethoscope */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <div className="w-full h-full bg-gradient-to-l from-slate-700 to-transparent">
            {/* Image placeholder */}
            <div className="w-full h-full flex items-center justify-center opacity-30">
              <div className="text-center text-white/60">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👶🩺</span>
                </div>
                <p className="font-semibold text-lg">Baby with Stethoscope</p>
                <p className="text-sm">Add baby-stethoscope.jpg to assets/images/</p>
              </div>
            </div>
            {/* Uncomment and add your image path below */}
            {/* <img src="/src/assets/images/baby-stethoscope.jpg" alt="Baby with Stethoscope" className="w-full h-full object-cover opacity-30" /> */}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="max-w-xl">
            {/* Main Headline Text */}
            <h1 className="text-base font-normal mb-8 leading-relaxed">
              Our mission and vision guide everything we do at The Bank Hospital, 
              driving our commitment to excellence in healthcare.
            </h1>

            {/* Search Bar */}
            <div className="flex mb-8">
              <input
                type="text"
                placeholder="Find a Doctor"
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
                  <span className="text-white font-medium">Book Appointment</span>
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
                  <span className="text-white font-medium">Referrals</span>
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
                  <span className="text-white font-medium">Directions</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Side - Mission Image */}
            <div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                {/* Replace with actual mission/technology image */}
                <div className="bg-gradient-to-br from-cyan-100 to-blue-100 h-80 w-full flex items-center justify-center relative">
                  <div className="text-center text-gray-500">
                    <div className="w-20 h-20 bg-cyan-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🏥</span>
                    </div>
                    <p className="font-semibold">Digital Healthcare Technology</p>
                    <p className="text-sm">Add mission-technology.jpg to assets/images/</p>
                  </div>
                  
                  {/* Digital interface overlay elements */}
                  <div className="absolute top-4 left-4 w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                    </svg>
                  </div>
                  
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59z"/>
                    </svg>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 w-14 h-14 bg-white/20 rounded flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7C14.65 7 14.32 7.09 14.04 7.28L12 9.5L9.96 7.28C9.68 7.09 9.35 7 9 7L3 7V9L8.5 9L12 12.5L15.5 9L21 9Z"/>
                    </svg>
                  </div>
                </div>
                {/* Uncomment and add your mission image path below */}
                {/* <img src="/src/assets/images/mission-technology.jpg" alt="Our Mission - Digital Healthcare" className="w-full h-80 object-cover" /> */}
              </div>
            </div>

            {/* Right Side - Mission Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  OUR <span className="text-blue-600">MISSION</span>
                </h2>
                
                <p className="text-gray-600 leading-relaxed text-lg">
                  To deliver quality, client-focused healthcare through the provision of a comprehensive range of 
                  timely services rendered with professionalism.
                </p>
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
                YOUR HEALTH IS OUR TOP PRIORITY. CLICK HERE TO
              </h3>
            </div>
            <button 
              onClick={() => navigate('/booking')}
              className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors mt-4 md:mt-0"
            >
              Schedule an Appointment
            </button>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            
            {/* Left Column - Our Vision */}
            <div className="space-y-6">
              {/* Image Container with Orange left and Blue bottom borders */}
              <div className="relative">
                {/* Orange left border - positioned at bottom, aligned with blue border */}
                <div className="absolute left-0 bottom-4 w-4 h-32 bg-orange-500"></div>
                
                {/* Image container */}
                <div className="bg-white shadow-lg ml-4">
                  {/* Replace with actual vision image */}
                  <div className="h-80 w-full flex items-center justify-center bg-gray-100">
                    <div className="text-center text-gray-500">
                      <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔍</span>
                      </div>
                      <p className="font-semibold">Magnifying Glass over VISION blocks</p>
                      <p className="text-sm">Add vision-magnifying-glass.jpg to assets/images/</p>
                    </div>
                  </div>
                  {/* Uncomment and add your vision image path below */}
                  {/* <img src="/src/assets/images/vision-magnifying-glass.jpg" alt="Our Vision" className="w-full h-80 object-cover" /> */}
                </div>
                
                {/* Blue bottom border - extended width, thicker */}
                <div className="h-4 bg-blue-600 w-4/5 mt-0"></div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 tracking-wide">
                  OUR <span className="text-blue-600">VISION</span>
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  To become the healthcare provider of choice.
                </p>
              </div>
            </div>

            {/* Right Column - Core Values */}
            <div className="space-y-6">
              {/* Image Container with Orange left and Blue bottom borders */}
              <div className="relative">
                {/* Orange left border - positioned at bottom, aligned with blue border */}
                <div className="absolute left-0 bottom-4 w-4 h-32 bg-orange-500"></div>
                
                {/* Image container */}
                <div className="bg-white shadow-lg ml-4">
                  {/* Replace with actual core values image */}
                  <div className="h-80 w-full flex items-center justify-center bg-blue-50">
                    <div className="text-center text-gray-500">
                      <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🤝</span>
                      </div>
                      <p className="font-semibold">Doctors Shaking Hands</p>
                      <p className="text-sm">Add doctors-handshake.jpg to assets/images/</p>
                    </div>
                  </div>
                  {/* Uncomment and add your core values image path below */}
                  {/* <img src="/src/assets/images/doctors-handshake.jpg" alt="Core Values" className="w-full h-80 object-cover" /> */}
                </div>
                
                {/* Blue bottom border - extended width, thicker */}
                <div className="h-4 bg-blue-600 w-4/5 mt-0"></div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 tracking-wide">
                  CORE <span className="text-blue-600">VALUE</span>
                </h2>
                
                {/* Core Values Grid */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {/* Compassion */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Compassion</span>
                  </div>

                  {/* Teamwork */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Teamwork</span>
                  </div>

                  {/* Respect */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Respect</span>
                  </div>

                  {/* Innovation */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Innovation</span>
                  </div>

                  {/* Professionalism */}
                  <div className="flex items-center space-x-3 col-span-2 justify-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Professionalism</span>
                  </div>
                </div>
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

export default MissionVisionPage;