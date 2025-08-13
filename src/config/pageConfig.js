/**
 * Centralized page configuration for dynamic titles, descriptions, and SEO
 * This makes it easy to manage all page metadata from one place
 */

export const PAGE_CONFIG = {
  HOME: {
    title: 'Home - AI-Powered Healthcare',
    description: 'Welcome to TeleKiosk Hospital - Your modern healthcare destination with AI-powered services, expert medical care, and state-of-the-art facilities in Ghana.',
    breadcrumbs: []
  },
  
  BOOKING: {
    title: 'Book Appointment',
    description: 'Schedule your medical appointment with our expert doctors. Browse available specialists and book your preferred time slot.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Book Appointment' }]
  },
  
  BOOK_NOW: {
    title: 'Quick Booking',
    description: 'Fast and easy appointment booking. Get instant confirmation for your medical consultation.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Quick Booking' }]
  },
  
  DOCTORS: {
    title: 'Our Medical Specialists',
    description: 'Meet our team of experienced doctors and medical specialists. View profiles, specialties, and availability.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Our Doctors' }]
  },
  
  DOCTOR_PROFILE: {
    title: 'Doctor Profile',
    description: 'View detailed information about our medical specialist including qualifications, experience, and availability.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Our Doctors', path: '/doctors' }, { label: 'Doctor Profile' }]
  },
  
  SERVICES: {
    title: 'Medical Services',
    description: 'Comprehensive medical services including consultations, diagnostics, treatments, and specialized care.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Medical Services' }]
  },
  
  ALL_SERVICES: {
    title: 'All Medical Services',
    description: 'Complete list of all medical services offered at TeleKiosk Hospital. Find the care you need.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'All Services' }]
  },
  
  ALL_FACILITIES: {
    title: 'Hospital Facilities',
    description: 'Explore our modern hospital facilities, equipment, and amenities designed for your comfort and care.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Facilities' }]
  },
  
  ALL_NEWS_EVENTS: {
    title: 'News & Events',
    description: 'Stay updated with the latest news, health tips, and upcoming events at TeleKiosk Hospital.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'News & Events' }]
  },
  
  HEALTH_WELLNESS: {
    title: 'Health & Wellness',
    description: 'Discover health tips, wellness advice, and educational articles to maintain your wellbeing.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Health & Wellness' }]
  },
  
  HEALTH_ARTICLE: {
    title: 'Health Article',
    description: 'Read our detailed health articles and medical insights to stay informed about your health.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Health & Wellness', path: '/health-wellness' }, { label: 'Article' }]
  },
  
  ABOUT_US: {
    title: 'About TeleKiosk Hospital',
    description: 'Learn about TeleKiosk Hospital\'s mission, values, history, and commitment to providing exceptional healthcare in Ghana.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'About Us' }]
  },
  
  MISSION_VISION: {
    title: 'Mission & Vision',
    description: 'Discover our mission to provide quality healthcare and our vision for the future of medical services in Ghana.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'About Us', path: '/about-us' }, { label: 'Mission & Vision' }]
  },
  
  CONTACT_US: {
    title: 'Contact TeleKiosk Hospital',
    description: 'Get in touch with TeleKiosk Hospital. Find our location, phone numbers, email addresses, and business hours.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Contact Us' }]
  },
  
  VISITING_TIMES: {
    title: 'Visiting Times & Guidelines',
    description: 'Information about patient visiting hours, guidelines, and policies at TeleKiosk Hospital.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Visiting Times' }]
  },
  
  REFERRALS: {
    title: 'Patient Referrals',
    description: 'Information about our patient referral system and how to refer patients to TeleKiosk Hospital specialists.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Referrals' }]
  },
  
  ADMIN_DASHBOARD: {
    title: 'Admin Dashboard',
    description: 'Administrative dashboard for managing TeleKiosk Hospital operations, appointments, and system settings.',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Admin Dashboard' }]
  }
};

/**
 * Dynamic title generator for pages with parameters
 * @param {string} baseKey - The base page config key
 * @param {object} params - Parameters to inject into title/description
 * @returns {object} - Page configuration with injected parameters
 */
export const getDynamicPageConfig = (baseKey, params = {}) => {
  const baseConfig = PAGE_CONFIG[baseKey];
  if (!baseConfig) return PAGE_CONFIG.HOME;
  
  const config = { ...baseConfig };
  
  // Inject parameters into title and description
  if (params.title) {
    config.title = params.title;
  }
  if (params.description) {
    config.description = params.description;
  }
  if (params.breadcrumbs) {
    config.breadcrumbs = [...config.breadcrumbs, ...params.breadcrumbs];
  }
  
  return config;
};

/**
 * Helper function to get page config by route path
 * @param {string} pathname - The current route pathname
 * @returns {object} - Matching page configuration
 */
export const getPageConfigByPath = (pathname) => {
  const pathMap = {
    '/': 'HOME',
    '/booking': 'BOOKING',
    '/book-now': 'BOOK_NOW',
    '/doctors': 'DOCTORS',
    '/services': 'SERVICES',
    '/all-services': 'ALL_SERVICES',
    '/all-facilities': 'ALL_FACILITIES',
    '/all-news-events': 'ALL_NEWS_EVENTS',
    '/health-wellness': 'HEALTH_WELLNESS',
    '/health-tips': 'HEALTH_WELLNESS',
    '/about-us': 'ABOUT_US',
    '/about': 'ABOUT_US',
    '/mission-vision': 'MISSION_VISION',
    '/contact': 'CONTACT_US',
    '/visiting-times': 'VISITING_TIMES',
    '/referrals': 'REFERRALS',
    '/admin': 'ADMIN_DASHBOARD'
  };
  
  // Check for exact match first
  const exactMatch = pathMap[pathname];
  if (exactMatch) {
    return PAGE_CONFIG[exactMatch];
  }
  
  // Check for pattern matches
  if (pathname.startsWith('/doctor-profile/')) {
    return PAGE_CONFIG.DOCTOR_PROFILE;
  }
  if (pathname.startsWith('/health-article/')) {
    return PAGE_CONFIG.HEALTH_ARTICLE;
  }
  if (pathname.startsWith('/services/')) {
    return PAGE_CONFIG.SERVICES;
  }
  
  // Default to home
  return PAGE_CONFIG.HOME;
};