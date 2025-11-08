import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InfoBar from "../components/sections/InfoBar";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";
import { HealthTipsSkeleton } from "../components/ui/SkeletonLoader";
import { useLoading } from "../hooks/useLoading";
import {
  HEALTH_WELLNESS_TIPS,
  HEALTH_CATEGORIES,
} from "../constants/healthWellnessData";
import { useLanguage } from "../contexts/LanguageContext";
import { HEALTH_WELLNESS_HERO_IMAGE, HEALTH_CATEGORY_IMAGES } from "../constants/carouselImages";

function HealthWellnessPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const isLoading = useLoading(1500); // Show skeleton for 1.5 seconds

  // Handle category change
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Filter tips by category
  const displayTips =
    selectedCategory === "all"
      ? HEALTH_WELLNESS_TIPS
      : HEALTH_WELLNESS_TIPS.filter(
          (tip) =>
            tip.category.toLowerCase().replace(/['s]/g, "-") ===
            selectedCategory
        );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <div className="relative w-full h-full">
            <img
              src={HEALTH_WELLNESS_HERO_IMAGE.src}
              alt={HEALTH_WELLNESS_HERO_IMAGE.alt}
              className="w-full h-full object-cover opacity-30"
            />

            {/* Edge Fade Effect - Vignette Style */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-left justify-between">
            {/* Title on the left */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {t("healthWellnessTips")}
              </h1>
            </div>

            {/* Health items image on the right - visible part of background */}
            <div className="hidden md:block flex-shrink-0 w-64 h-32">
              {/* This space allows the background image to show through */}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Subtitle */}
        <div className="text-left mb-8">
          <p className="text-lg text-blue-600 font-medium max-w-2xl">
            {t("healthWellnessSubtitle")}
          </p>
        </div>

        {/* Search Bar Placeholder */}
        {/* <div className="flex justify-center mb-8">
          <div className="max-w-md w-full">
            <input
              type="text"
              placeholder={t('searchArticles')}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
              onFocus={(e) => e.target.blur()}
            />
          </div>
        </div> */}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {HEALTH_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? `${category.color} text-white shadow-lg`
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600"
              }`}
            >
              {t(category.nameKey)}
            </button>
          ))}
        </div>

        {/* Health Tips Grid */}
        {isLoading ? (
          <HealthTipsSkeleton count={9} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTips.map((tip) => (
              <Link
                key={tip.id}
                to={`/health-article/${tip.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer block"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={HEALTH_CATEGORY_IMAGES[tip.category] || HEALTH_CATEGORY_IMAGES.default}
                    alt={tip.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {tip.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {tip.excerpt}
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                    {t("readMore")}
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results for category filtering */}
        {displayTips.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {t("noArticlesFound")}
            </h3>
            <p className="text-gray-500">{t("tryDifferentCategory")}</p>
          </div>
        )}
      </div>

      <InfoBar />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default HealthWellnessPage;
