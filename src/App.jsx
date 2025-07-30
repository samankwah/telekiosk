import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ScrollToTop from './components/ui/ScrollToTop';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import { LanguageProvider } from './contexts/LanguageContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import { EnhancedChatbotProvider } from './contexts/EnhancedChatbotContext';
import { LoadingSpinner } from './components/ui/AnimationComponents.jsx';
import { getEnvVar } from './utils/envUtils.js';
import './App.css';

// Lazy load page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const BookNowPage = lazy(() => import('./pages/BookNowPage'));
const ReferralsPage = lazy(() => import('./pages/ReferralsPage'));
const DoctorsPage = lazy(() => import('./pages/DoctorsPage'));
const DoctorProfilePage = lazy(() => import('./pages/DoctorProfilePage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const AboutUsPageTest = lazy(() => import('./pages/AboutUsPageTest'));
const MissionVisionPage = lazy(() => import('./pages/MissionVisionPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));
const VisitingTimesPage = lazy(() => import('./pages/VisitingTimesPage'));
const HealthWellnessPage = lazy(() => import('./pages/HealthWellnessPage'));
const HealthArticleDetailPage = lazy(() => import('./pages/HealthArticleDetailPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const AllServicesPage = lazy(() => import('./pages/AllServicesPage'));
const AllFacilitiesPage = lazy(() => import('./pages/AllFacilitiesPage'));
const AllNewsEventsPage = lazy(() => import('./pages/AllNewsEventsPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ChatBot = lazy(() => import('./components/chatbot/ChatBot'));
const EnhancedChatBot = lazy(() => import('./components/chatbot/EnhancedChatBot'));
const Phase3EnhancedChatBot = lazy(() => import('./components/chatbot/Phase3EnhancedChatBot'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="xl" color="orange" />
      <p className="mt-4 text-gray-600 animate-pulse">Loading TeleKiosk...</p>
    </div>
  </div>
);

function App() {
  // Check if Phase 3 features are enabled
  const enablePhase3 = getEnvVar('ENABLE_PHASE3') !== 'false';
  
  return (
    <LanguageProvider>
      <ChatbotProvider>
        <EnhancedChatbotProvider>
          <Router>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/book-now" element={<BookNowPage />} />
                <Route path="/referrals" element={<ReferralsPage />} />
                <Route path="/doctors" element={<DoctorsPage />} />
                <Route path="/doctor-profile/:doctorId" element={<DoctorProfilePage />} />
                
                {/* Corporate Info Routes */}
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/mission-vision" element={<MissionVisionPage />} />
                <Route path="/team" element={<AboutUsPage />} /> {/* Placeholder - create TeamPage */}
                
                {/* Other Menu Routes */}
                <Route path="/all-services" element={<AllServicesPage />} />
                <Route path="/all-facilities" element={<AllFacilitiesPage />} />
                <Route path="/all-news-events" element={<AllNewsEventsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:serviceId" element={<ServicesPage />} />
                <Route path="/health-tips" element={<HealthWellnessPage />} />
                <Route path="/health-wellness" element={<HealthWellnessPage />} />
                <Route path="/health-article/:articleId" element={<HealthArticleDetailPage />} />
                <Route path="/visiting-times" element={<VisitingTimesPage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                
                {/* Legacy route */}
                <Route path="/about" element={<AboutUsPage />} />
                
                {/* Admin Dashboard */}
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </Suspense>
            
            <ScrollToTopButton />
            <Suspense fallback={<div className="fixed bottom-4 right-4 z-50"><LoadingSpinner size="md" color="orange" /></div>}>
              {enablePhase3 ? <Phase3EnhancedChatBot /> : <EnhancedChatBot />}
            </Suspense>
          </Router>
        </EnhancedChatbotProvider>
      </ChatbotProvider>
    </LanguageProvider>
  );
}

export default App;