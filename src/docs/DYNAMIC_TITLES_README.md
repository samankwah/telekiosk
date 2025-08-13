# Dynamic Page Titles System

The TeleKiosk application now includes a comprehensive dynamic page title management system that automatically updates document titles, meta descriptions, and breadcrumbs based on the current page.

## 🚀 Features

- **Automatic title updates** based on route changes
- **SEO meta tag updates** (title, description, Open Graph, Twitter Card)
- **Dynamic breadcrumb navigation**
- **Centralized configuration** for easy maintenance
- **TypeScript-friendly** architecture
- **Performance optimized** with minimal re-renders

## 📁 File Structure

```
src/
├── contexts/
│   └── TitleContext.jsx          # Global title state management
├── hooks/
│   └── useDocumentTitle.js       # Custom hook for title updates
├── config/
│   └── pageConfig.js             # Centralized page configurations
├── components/
│   ├── utils/
│   │   ├── AutoTitleUpdater.jsx  # Automatic title updater
│   │   └── PageTitleUpdater.jsx  # Manual title updater
│   └── ui/
│       └── Breadcrumbs.jsx       # Breadcrumb navigation component
└── docs/
    └── DYNAMIC_TITLES_README.md  # This documentation file
```

## 🔧 How It Works

### 1. Automatic Title Updates

The `AutoTitleUpdater` component is added to `App.jsx` and automatically updates titles based on the current route:

```jsx
// In App.jsx
import AutoTitleUpdater from './components/utils/AutoTitleUpdater';

function App() {
  return (
    <TitleProvider>
      <Router>
        <AutoTitleUpdater />
        {/* Your routes */}
      </Router>
    </TitleProvider>
  );
}
```

### 2. Manual Title Updates

For pages that need custom titles or dynamic content, use the `useTitleContext` hook:

```jsx
import { useTitleContext } from '../contexts/TitleContext';

function MyPage() {
  const { setPageInfo } = useTitleContext();

  useEffect(() => {
    setPageInfo({
      title: 'Custom Page Title',
      description: 'Custom description for this page',
      breadcrumbs: [
        { label: 'Home', path: '/' },
        { label: 'Custom Page' }
      ]
    });
  }, [setPageInfo]);

  return <div>My Page Content</div>;
}
```

### 3. Using PageTitleUpdater Component

For simple cases, use the utility component:

```jsx
import PageTitleUpdater from '../components/utils/PageTitleUpdater';

function MyPage() {
  return (
    <div>
      <PageTitleUpdater
        title="My Page Title"
        description="My page description"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'My Page' }]}
      />
      {/* Page content */}
    </div>
  );
}
```

## ⚙️ Configuration

### Adding New Pages

To add title configuration for new pages, update `src/config/pageConfig.js`:

```javascript
export const PAGE_CONFIG = {
  // Existing pages...
  
  NEW_PAGE: {
    title: 'New Page Title',
    description: 'Description for the new page',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'New Page' }]
  }
};

// Update getPageConfigByPath function
export const getPageConfigByPath = (pathname) => {
  const pathMap = {
    // Existing paths...
    '/new-page': 'NEW_PAGE'
  };
  
  // Rest of the function...
};
```

### Dynamic Pages (with parameters)

For pages with dynamic content (like doctor profiles), use `getDynamicPageConfig`:

```javascript
import { getDynamicPageConfig } from '../config/pageConfig';

function DoctorProfile({ doctorName }) {
  const { setPageInfo } = useTitleContext();

  useEffect(() => {
    const config = getDynamicPageConfig('DOCTOR_PROFILE', {
      title: `Dr. ${doctorName} - Doctor Profile`,
      description: `View profile and information for Dr. ${doctorName}`,
      breadcrumbs: [{ label: doctorName }]
    });
    
    setPageInfo(config);
  }, [doctorName, setPageInfo]);
}
```

## 🧭 Breadcrumbs

Add the Breadcrumbs component to your page layouts:

```jsx
import Breadcrumbs from '../components/ui/Breadcrumbs';

function PageLayout({ children }) {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs className="mb-4" />
        {children}
      </div>
      <Footer />
    </div>
  );
}
```

## 🎯 SEO Benefits

The system automatically updates:

- **Document title** - Shows in browser tab and search results
- **Meta description** - Used by search engines for snippets
- **Open Graph tags** - For social media sharing
- **Twitter Card tags** - For Twitter sharing
- **Structured breadcrumb navigation** - Improves UX and SEO

## 🔍 Current Page Configurations

The following pages are pre-configured:

- **Home** (`/`) - Home - AI-Powered Healthcare
- **Booking** (`/booking`) - Book Appointment
- **Quick Booking** (`/book-now`) - Quick Booking
- **Doctors** (`/doctors`) - Our Medical Specialists
- **Doctor Profile** (`/doctor-profile/:id`) - Doctor Profile
- **Services** (`/services`) - Medical Services
- **All Services** (`/all-services`) - All Medical Services
- **Facilities** (`/all-facilities`) - Hospital Facilities
- **News & Events** (`/all-news-events`) - News & Events
- **Health & Wellness** (`/health-wellness`) - Health & Wellness
- **About Us** (`/about-us`) - About TeleKiosk Hospital
- **Mission & Vision** (`/mission-vision`) - Mission & Vision
- **Contact** (`/contact`) - Contact TeleKiosk Hospital
- **Visiting Times** (`/visiting-times`) - Visiting Times & Guidelines
- **Referrals** (`/referrals`) - Patient Referrals
- **Admin Dashboard** (`/admin`) - Admin Dashboard

## 🚀 Getting Started

The dynamic titles system is already integrated and working! Here's what happens automatically:

1. **Page loads** → `AutoTitleUpdater` detects route change
2. **Route matching** → System finds page configuration in `pageConfig.js`
3. **Title update** → Document title and meta tags are updated
4. **Breadcrumbs** → Navigation breadcrumbs are updated

No additional setup required - the system works out of the box for all configured routes!

## 🔧 Customization

### Custom Hook Usage

```javascript
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function MyComponent() {
  useDocumentTitle('My Custom Title');
  // Component content
}
```

### Context Usage

```javascript
import { useTitleContext } from '../contexts/TitleContext';

function MyComponent() {
  const { currentTitle, breadcrumbs, updateTitle } = useTitleContext();
  
  const handleTitleChange = () => {
    updateTitle('New Title', [{ label: 'New', path: '/new' }]);
  };
}
```

## ✅ Benefits

- **Better SEO** - Dynamic meta tags improve search visibility
- **Improved UX** - Clear page titles and breadcrumb navigation
- **Easy maintenance** - Centralized configuration
- **Performance** - Optimized with minimal re-renders
- **Accessibility** - Proper ARIA labels and semantic navigation
- **Social sharing** - Open Graph and Twitter Card support

The dynamic title system enhances both user experience and SEO while being easy to maintain and extend!