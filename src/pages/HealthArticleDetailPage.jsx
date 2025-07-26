import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import InfoBar from '../components/sections/InfoBar';
import ScrollToTopButton from '../components/ui/ScrollToTopButton';
import { HEALTH_WELLNESS_TIPS, SIDEBAR_CATEGORIES, RECENT_POSTS } from '../constants/healthWellnessData';
import { useLanguage } from '../contexts/LanguageContext';

// Helper function to get the correct image for each article
function getArticleImage(articleId) {
  const imageMap = {
    'omega-3': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300&q=80', // Fish and omega-3 capsules
    'seizures': 'https://images.unsplash.com/photo-1559757175-c94f6b1d3c2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300&q=80',
    'choking': 'https://images.unsplash.com/photo-1576671081837-a4e2f3d6ac11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300&q=80',
    'cervical-cancer': 'https://images.unsplash.com/photo-1559757175-c94f6b1d3c2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300&q=80',
    'honey-benefits': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300&q=80',
    'face-masks': 'https://images.unsplash.com/photo-1584820927896-6a23c1c2a9e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300&q=80',
    'mental-health': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300&q=80',
    'healthy-eating': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300&q=80',
    'exercise-tips': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300&q=80'
  };
  
  return imageMap[articleId] || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300&q=80';
}

function HealthArticleDetailPage() {
  const { t } = useLanguage();
  const { articleId } = useParams();
  const article = HEALTH_WELLNESS_TIPS.find(tip => tip.id === articleId);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('articleNotFound')}</h1>
          <Link to="/health-wellness" className="text-blue-600 hover:text-blue-800">
            {t('backToHealthWellness')}
          </Link>
        </div>
        <InfoBar />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/health-wellness"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            {t('backToHealthWellnessTips')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Image */}
            <div className="mb-6">
              <img
                src={getArticleImage(article.id)}
                alt={article.title}
                className="w-full h-48 md:h-64 object-cover"
              />
            </div>

            {/* Article Header */}
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 uppercase">
                {article.title}
              </h1>
              <hr className="border-gray-400 mb-4" />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              {article.content && (
                <>
                  <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                    {article.content.introduction}
                  </p>

                  {/* Sections */}
                  {article.content.sections.map((section, index) => (
                    <div key={index} className="mb-6">
                      <h2 className="text-lg font-bold text-gray-900 mb-3">
                        {section.title}
                      </h2>
                      
                      {section.content && (
                        <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                          {section.content}
                        </p>
                      )}

                      {section.list && (
                        <ul className="space-y-2 mb-3">
                          {section.list.map((item, listIndex) => (
                            <li key={listIndex} className="flex items-start">
                              <span className="text-blue-600 mr-2 mt-1">
                                <svg className="w-1.5 h-1.5" fill="currentColor" viewBox="0 0 8 8">
                                  <circle cx="4" cy="4" r="3" />
                                </svg>
                              </span>
                              <span className="text-gray-700 leading-relaxed text-sm">
                                {item.includes(':') ? (
                                  <>
                                    <strong className="text-gray-900">
                                      {item.split(':')[0]}:
                                    </strong>
                                    {item.split(':').slice(1).join(':')}
                                  </>
                                ) : (
                                  item
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.additional && (
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {section.additional}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Author Info */}
                  <div className="mt-8 pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <div>
                        <p className="text-gray-900 font-semibold text-sm">
                          By: {article.author}
                        </p>
                        <p className="text-gray-600 text-xs">
                          {article.authorTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories Widget */}
            <div className="bg-gray-100 p-4 mb-6">
              <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-400">
                {t('categories')}
              </h3>
              <ul className="space-y-1">
                {SIDEBAR_CATEGORIES.map((category, index) => (
                  <li key={index}>
                    <Link
                      to="#"
                      className="text-blue-600 hover:text-blue-800 hover:underline text-xs block py-1"
                    >
                      {t(category.nameKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts Widget */}
            <div className="bg-gray-100 p-4">
              <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-400">
                {t('recentPosts')}
              </h3>
              <div className="space-y-3">
                {RECENT_POSTS.map((post, index) => (
                  <div key={index} className="flex space-x-2">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-12 h-9 object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to="#"
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium leading-tight block mb-1 hover:underline"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {post.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <InfoBar />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default HealthArticleDetailPage;