import { useEffect } from 'react';

/**
 * Custom hook for dynamically updating document title
 * @param {string} title - The title to set for the document
 * @param {string} baseSuffix - Base suffix to append to all titles (default: "TeleKiosk Hospital")
 */
export const useDocumentTitle = (title, baseSuffix = "TeleKiosk Hospital") => {
  useEffect(() => {
    if (title) {
      // Update document title
      document.title = `${title} | ${baseSuffix}`;
      
      // Update Open Graph meta tag
      const ogTitleMeta = document.querySelector('meta[property="og:title"]');
      if (ogTitleMeta) {
        ogTitleMeta.setAttribute('content', `${title} | ${baseSuffix}`);
      }
      
      // Update Twitter Card meta tag
      const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitleMeta) {
        twitterTitleMeta.setAttribute('content', `${title} | ${baseSuffix}`);
      }
    } else {
      // Reset to default title if no title provided
      document.title = `${baseSuffix} | AI-Powered Healthcare Kiosk`;
    }
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = `${baseSuffix} | AI-Powered Healthcare Kiosk`;
    };
  }, [title, baseSuffix]);
};

/**
 * Predefined titles for common pages
 */
export const PAGE_TITLES = {
  HOME: "Home - AI-Powered Healthcare",
  BOOKING: "Book Appointment",
  BOOK_NOW: "Quick Booking",
  DOCTORS: "Our Doctors",
  DOCTOR_PROFILE: "Doctor Profile",
  SERVICES: "Medical Services",
  ALL_SERVICES: "All Medical Services",
  ALL_FACILITIES: "Hospital Facilities",
  ALL_NEWS_EVENTS: "News & Events",
  HEALTH_WELLNESS: "Health & Wellness",
  HEALTH_ARTICLE: "Health Article",
  ABOUT_US: "About Us",
  MISSION_VISION: "Mission & Vision",
  CONTACT_US: "Contact Us",
  VISITING_TIMES: "Visiting Times",
  REFERRALS: "Patient Referrals",
  ADMIN_DASHBOARD: "Admin Dashboard"
};

/**
 * Higher-order component that automatically sets document title
 * @param {React.Component} Component - The component to wrap
 * @param {string} title - The title for this page
 */
export const withDocumentTitle = (Component, title) => {
  return function WrappedComponent(props) {
    useDocumentTitle(title);
    return <Component {...props} />;
  };
};