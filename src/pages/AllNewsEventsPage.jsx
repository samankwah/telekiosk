import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InfoBar from "../components/sections/InfoBar";
import { NewsListSkeleton } from "../components/ui/SkeletonLoader";
import { useLoading } from "../hooks/useLoading";
import { useLanguage } from "../contexts/LanguageContext";
import { NEWS_EVENTS_IMAGES } from "../constants/carouselImages";

function AllNewsEventsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isLoading = useLoading(1200); // Show skeleton for 1.2 seconds

  // Sample news and events data - based on the screenshot
  const newsEvents = [
    {
      id: 1,
      title: t('news1Title'),
      image: NEWS_EVENTS_IMAGES[0].src,
      date: "March 15, 2024",
      category: t('laboratory')
    },
    {
      id: 2,
      title: t('news2Title'),
      image: NEWS_EVENTS_IMAGES[1].src,
      date: "March 10, 2024",
      category: t('technology')
    },
    {
      id: 3,
      title: t('news3Title'),
      image: NEWS_EVENTS_IMAGES[2].src,
      date: "March 5, 2024",
      category: t('events')
    },
    {
      id: 4,
      title: t('news4Title'),
      image: NEWS_EVENTS_IMAGES[3].src,
      date: "February 28, 2024",
      category: t('wellness')
    },
    {
      id: 5,
      title: t('news5Title'),
      image: NEWS_EVENTS_IMAGES[4].src,
      date: "February 20, 2024",
      category: t('community')
    },
    {
      id: 6,
      title: t('news6Title'),
      image: NEWS_EVENTS_IMAGES[5].src,
      date: "February 15, 2024",
      category: t('accreditation')
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Standard Pattern */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background Image - Medical Professional */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <div className="relative w-full h-full">
            <div className="w-full h-full flex items-center justify-start pl-8 opacity-30">
              <div className="text-left text-white/60">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">📰</span>
                </div>
                <p className="font-semibold text-lg">News & Events</p>
                <p className="text-sm">Up to date information related to our services and your health</p>
              </div>
            </div>

            {/* Edge Fade Effect - Vignette Style */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="max-w-xl">
            <h1 className="text-base font-normal mb-8 leading-relaxed">
              {t("newsSubtitle")}
            </h1>

            {/* Search Bar Placeholder */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder={t('searchNews')}
                  className="w-full px-4 py-3 pr-12 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  readOnly
                  onFocus={(e) => e.target.blur()}
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors" onClick={(e) => e.preventDefault()}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
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

      {/* News & Events Header */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-orange-400 font-semibold text-sm mb-2 uppercase tracking-wide">
            {t("newsEvents").toUpperCase()}
          </p>
          <h1 className="text-lg text-gray-800 font-normal">
            {t("newsSubtitle")}
          </h1>
        </div>
      </section>

      {/* News & Events Grid */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <NewsListSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsEvents.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 text-lg mb-3 leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors">
                  {item.title}
                </h3>
                <div className="text-gray-500 text-sm font-medium">
                  {item.date}
                </div>
              </div>
            </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <InfoBar />
      <Footer />
    </div>
  );
}

export default AllNewsEventsPage;