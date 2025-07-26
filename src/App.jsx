import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import BookNowPage from './pages/BookNowPage';
import ReferralsPage from './pages/ReferralsPage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import AboutUsPage from './pages/AboutUsPage';
import AboutUsPageTest from './pages/AboutUsPageTest';
import MissionVisionPage from './pages/MissionVisionPage';
import ContactUsPage from './pages/ContactUsPage';
import VisitingTimesPage from './pages/VisitingTimesPage';
import HealthWellnessPage from './pages/HealthWellnessPage';
import HealthArticleDetailPage from './pages/HealthArticleDetailPage';
import ServicesPage from './pages/ServicesPage';
import AllServicesPage from './pages/AllServicesPage';
import AllFacilitiesPage from './pages/AllFacilitiesPage';
import AllNewsEventsPage from './pages/AllNewsEventsPage';
import ScrollToTop from './components/ui/ScrollToTop';
import { LanguageProvider } from './contexts/LanguageContext';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
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
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;