# TeleKiosk - The Bank Hospital Website

A modern React + JavaScript + Vite application for The Bank Hospital's interactive kiosk and web presence with comprehensive service management and email notification system.

## 🚀 Project Overview

This is a comprehensive hospital website/kiosk application built with React, featuring a clean architecture, modern development practices, and integrated email services. The application serves as both a web interface and a kiosk system for hospital visitors, with full appointment booking and service directory capabilities.

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0 + JavaScript
- **Build Tool**: Vite 7.0.4
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 7.7.0
- **Backend**: Express.js 4.18.2 (Email Service)
- **Email Service**: Resend API
- **Linting**: ESLint 9.30.1
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Header, Footer
│   ├── sections/        # Hero, About, Services, etc.
│   ├── ui/              # Generic UI components
│   └── index.js         # Component exports
├── pages/               # Page components
│   ├── HomePage.jsx     # Main landing page
│   ├── ServicesPage.jsx # Individual service details
│   ├── AllServicesPage.jsx # Complete services directory
│   ├── BookingPage.jsx  # Appointment booking
│   └── ...              # Other pages
├── services/            # API and service integrations
│   ├── resendEmailService.js # Resend email integration
│   └── meetingService.js     # Meeting/appointment services
├── contexts/            # React contexts
│   └── LanguageContext.js    # Multi-language support
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── constants/           # Application constants
├── assets/              # Images, icons
├── App.jsx              # Root component with routing
├── main.jsx             # Entry point
└── server.js            # Express email server
```

## 🎯 Development Progress Tracker

### ✅ Core Infrastructure (100%)
- [x] Project setup with Vite + React
- [x] Tailwind CSS configuration
- [x] ESLint configuration
- [x] Component architecture structure
- [x] Build and development scripts

### ✅ Layout Components (100%)
- [x] Header component with navigation and dropdown menus
- [x] Footer component with contact info
- [x] InfoBar component with hospital contact details
- [x] Responsive layout structure

### ✅ Page Components (100%)
- [x] HomePage with complete sections
- [x] ServicesPage with dynamic service content
- [x] AllServicesPage with comprehensive service directory
- [x] BookingPage with appointment system
- [x] AboutUsPage and other informational pages
- [x] DoctorsPage with staff profiles

### ✅ Services & Navigation (100%)
- [x] Services dropdown menu with 8 service categories
- [x] Dynamic routing for individual services (/services/:serviceId)
- [x] Complete services directory (/all-services)
- [x] Service data structure with detailed information
- [x] Navigation integration across all pages

### ✅ Email System (100%)
- [x] Resend API integration for professional emails
- [x] Express.js backend server for email handling
- [x] Dual email system (patient + admin notifications)
- [x] Professional HTML email templates
- [x] CORS-compliant email service architecture

### ✅ UI Components (100%)
- [x] Image Carousel component
- [x] Reusable UI elements
- [x] Multi-language context support
- [x] Component index for easy imports

### ✅ Data Management (100%)
- [x] Hospital data constants
- [x] Service categories and detailed information
- [x] Doctor profiles and specialties
- [x] Centralized data structure

### 🔄 Enhancement Features (30%)
- [x] Multi-language context structure
- [x] Professional email notifications
- [x] Dynamic service routing
- [ ] Advanced animations and transitions
- [ ] PWA capabilities
- [ ] Real-time data integration
- [ ] Admin dashboard for service management

### 📋 Future Enhancements (0%)
- [ ] Patient portal integration
- [ ] Advanced search functionality
- [ ] Analytics and tracking
- [ ] Accessibility improvements (WCAG compliance)
- [ ] Performance optimization
- [ ] SEO optimization

### 🧪 Quality Assurance (0%)
- [ ] Unit tests setup
- [ ] Integration tests
- [ ] E2E testing
- [ ] Email service testing
- [ ] Security audit
- [ ] Browser compatibility testing

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd telekiosk

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev        # Start React development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
npm run server     # Start email service backend
npm run dev:full   # Start both React and email servers
```

## 📧 Email Service Setup

The application includes a professional email notification system using Resend API:

### Quick Start
```bash
# Install dependencies
npm install

# Start both servers (React + Email service)
npm run dev:full

# Or start separately:
# Terminal 1: Start email server
npm run server

# Terminal 2: Start React app  
npm run dev
```

### Email Features
- **Dual Notifications**: Both patient and admin receive booking confirmations
- **Professional Templates**: HTML email templates with hospital branding
- **CORS Compliant**: Backend server handles API calls to avoid browser restrictions
- **Admin Email**: `albertnartey824@gmail.com` receives all booking notifications

## 📊 Project Completion: ~85%

### Completed ✅
- Core application structure and routing
- Complete service management system
- Professional email notification system
- Responsive design foundation
- Component architecture
- Development workflow
- All major page components
- Navigation and service discovery

### In Progress 🔄
- Advanced UI/UX enhancements
- Performance optimization
- Additional service integrations

### Planned 📋
- Testing suite implementation
- Production deployment setup
- Analytics and monitoring
- Admin dashboard
- Advanced search features

## 🔧 Development Guidelines

1. **Component Structure**: Follow the established folder structure
2. **Styling**: Use Tailwind CSS for consistent styling
3. **Code Quality**: Run `npm run lint` before commits
4. **Naming**: Use PascalCase for components, camelCase for functions
5. **Exports**: Export components through `components/index.js`

## 🤝 Contributing

1. Follow the existing code style
2. Ensure all components are properly documented
3. Test your changes thoroughly
4. Update this progress tracker when completing features

## 🌟 Key Features

### Service Management
- **8 Service Categories**: Specialists, Cardiology, Outpatient, Catheterization, Allied Health, Theatre, Radiology, Laboratory, Gastroscopy, Inpatient
- **Dynamic Service Pages**: Individual service detail pages with comprehensive information
- **Service Directory**: Complete services overview page with checkbox-style listing
- **Smart Navigation**: Dropdown menus and intelligent routing

### Email Notifications  
- **Resend Integration**: Professional email service with HTML templates
- **Dual Recipients**: Patient confirmation + admin notification system
- **Template Engine**: Custom HTML templates with hospital branding
- **Backend Architecture**: Express.js server for CORS-compliant email handling

### User Experience
- **Multi-Language Support**: Context-based language switching
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Consistent UI**: Standardized hero sections and layout patterns
- **Professional Design**: Clean, modern interface suitable for hospital environment

## 📈 Next Phase Priorities

1. **Testing Implementation**: Unit tests, integration tests, and E2E testing
2. **Performance Optimization**: Code splitting, lazy loading, and caching
3. **Analytics Integration**: User behavior tracking and service usage metrics  
4. **Admin Dashboard**: Service management and booking administration
5. **Production Deployment**: CI/CD pipeline and hosting setup
6. **Advanced Features**: Search functionality, real-time updates, PWA capabilities
