import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import InfoBar from '../components/sections/InfoBar';
import { VISITING_TIMES_HERO_IMAGE } from '../constants/carouselImages';

function VisitingTimesPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const visitingSchedule = [
    {
      title: t('vvipUnit'),
      times: [
        { period: t('morning'), hours: t('vvipMorning') },
        { period: t('afternoon'), hours: t('vvipAfternoon') },
        { period: t('evening'), hours: t('vvipEvening') }
      ],
      note: t('specialArrangementsNote')
    },
    {
      title: t('paediatricUnit'),
      times: [
        { period: t('morning'), hours: t('paediatricMorning') },
        { period: t('evening'), hours: t('paediatricEvening') }
      ]
    },
    {
      title: t('intensiveCareUnit'),
      times: [
        { period: t('morning'), hours: t('icuMorning') },
        { period: t('evening'), hours: t('icuEvening') }
      ],
      note: t('ageRestrictionNote')
    },
    {
      title: t('maternity'),
      times: [
        { period: t('morning'), hours: t('maternityMorning') },
        { period: t('afternoon'), hours: t('maternityAfternoon') },
        { period: t('evening'), hours: t('maternityEvening') }
      ],
      notes: [
        t('fatherVisitNote'),
        t('partnerSleepNote')
      ]
    },
    {
      title: t('nicuFathers'),
      times: [
        { period: t('morning'), hours: t('nicuFathersMorning') },
        { period: t('evening'), hours: t('nicuFathersEvening') }
      ]
    },
    {
      title: t('nicuMothers'),
      times: [
        { period: t('morning'), hours: t('nicuMothersMorning') },
        { period: t('afternoon'), hours: t('nicuMothersAfternoon') },
        { period: "", hours: t('nicuMothersAfternoon2') },
        { period: t('evening'), hours: t('nicuMothersEvening') }
      ]
    },
    {
      title: t('medicalSurgicalWard'),
      times: [
        { period: t('morning'), hours: t('medicalMorning') },
        { period: t('afternoon'), hours: t('medicalAfternoon') },
        { period: t('evening'), hours: t('medicalEvening') }
      ]
    }
  ];

  const mealTimes = [
    { meal: t('breakfast'), hours: t('breakfastTime') },
    { meal: t('lunch'), hours: t('lunchTime') },
    { meal: t('dinner'), hours: t('dinnerTime') },
    { meal: t('bedtimeSnacks'), hours: t('bedtimeSnacksTime') }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <div className="relative w-full h-full">
            <img
              src={VISITING_TIMES_HERO_IMAGE.src}
              alt={VISITING_TIMES_HERO_IMAGE.alt}
              className="w-full h-full object-cover opacity-30"
            />

            {/* Edge Fade Effect - Vignette Style */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold mb-6">
              {t('visitingTimesTitle')}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {t('visitingTimesDesc')}
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/contact")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {t('contactUs')}
              </button>
              <button
                onClick={() => navigate("/")}
                className="border border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {t('backToHome')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Visiting Times Cards */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Visiting Schedule Grid - 2x3 layout exactly like screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {visitingSchedule.map((unit, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                {/* Header with underlined title */}
                <div className="px-4 py-3 border-b border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-900 underline">{unit.title}</h3>
                </div>
                
                {/* Times Table */}
                <div className="p-0">
                  <table className="w-full">
                    <tbody>
                      {unit.times.map((time, timeIndex) => (
                        <tr key={timeIndex} className="border-b border-gray-300 last:border-b-0">
                          <td className="px-4 py-2 text-gray-700 font-medium bg-gray-50 border-r border-gray-300 w-1/3">
                            {time.period}
                          </td>
                          <td className="px-4 py-2 text-gray-900">
                            {time.hours}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Notes with orange bullets */}
                  {unit.note && (
                    <div className="px-4 py-3 border-t border-gray-200">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-orange-600 italic">
                          {unit.note}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {unit.notes && (
                    <div className="px-4 py-3 border-t border-gray-200 space-y-2">
                      {unit.notes.map((note, noteIndex) => (
                        <div key={noteIndex} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-orange-600 italic">
                            {note}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Meal Service Times - Single table at bottom */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('mealServiceTimes')}
            </h2>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
              <table className="w-full">
                <tbody>
                  {mealTimes.map((meal, index) => (
                    <tr key={index} className="border-b border-gray-300 last:border-b-0">
                      <td className="px-4 py-3 text-gray-700 font-medium bg-gray-50 border-r border-gray-300 w-1/3">
                        {meal.meal}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {meal.hours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <InfoBar />
      <Footer />
    </div>
  );
}

export default VisitingTimesPage;