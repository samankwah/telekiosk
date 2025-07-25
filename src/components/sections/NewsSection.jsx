import { useLanguage } from '../../contexts/LanguageContext';

function NewsSection() {
  const { t } = useLanguage();
  const newsItems = [
    {
      dateKey: "news1Date",
      titleKey: "news1Title",
      image: "/src/assets/images/news1.jpg",
    },
    {
      dateKey: "news2Date",
      titleKey: "news2Title",
      image: "/src/assets/images/news2.jpg",
    },
    {
      dateKey: "news3Date",
      titleKey: "news3Title",
      image: "/src/assets/images/news3.jpg",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-3">
            {t('newsEvents')}
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl mx-auto">
            {t('newsTitle')}
          </h2>
        </div>

        {/* News Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {newsItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={t(item.titleKey)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 text-lg mb-3 leading-tight line-clamp-3 transition-colors duration-300">
                  {t(item.titleKey)}
                </h3>
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  {t(item.dateKey)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <button className="bg-white border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-500 px-8 py-3 rounded-lg font-semibold flex items-center transition-all duration-200">
{t('viewAll')}
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
    </section>
  );
}

export default NewsSection;
