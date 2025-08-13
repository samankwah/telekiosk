import React, { useEffect } from 'react';
import { useTitleContext } from '../contexts/TitleContext';
import Header from '../components/layout/Header';
import HeroSection from '../components/sections/HeroSection';
import NavigationButtons from '../components/sections/NavigationButtons';
import AboutSection from '../components/sections/AboutSection';
import ServicesSection from '../components/sections/ServicesSection';
import FacilitiesSection from '../components/sections/FacilitiesSection';
import DoctorsSection from '../components/sections/DoctorsSection';
import NewsSection from '../components/sections/NewsSection';
import InfoBar from '../components/sections/InfoBar';
import Footer from '../components/layout/Footer';

function HomePage() {
  const { setPageInfo } = useTitleContext();

  useEffect(() => {
    setPageInfo({
      title: 'Home - AI-Powered Healthcare',
      description: 'Welcome to TeleKiosk Hospital - Your modern healthcare destination with AI-powered services, expert medical care, and state-of-the-art facilities in Ghana.',
      breadcrumbs: []
    });
  }, [setPageInfo]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <NavigationButtons />
      <AboutSection />
      <ServicesSection />
      <FacilitiesSection />
      <DoctorsSection />
      <NewsSection />
      <InfoBar />
      <Footer />
    </div>
  );
}

export default HomePage;