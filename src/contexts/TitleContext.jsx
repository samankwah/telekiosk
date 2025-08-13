import React, { createContext, useContext, useState, useCallback } from 'react';

const TitleContext = createContext();

export const useTitleContext = () => {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error('useTitleContext must be used within a TitleProvider');
  }
  return context;
};

export const TitleProvider = ({ children }) => {
  const [currentTitle, setCurrentTitle] = useState('Home - AI-Powered Healthcare');
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  /**
   * Update the document title and related meta tags
   * @param {string} title - The new title
   * @param {Array} newBreadcrumbs - Optional breadcrumbs array
   */
  const updateTitle = useCallback((title, newBreadcrumbs = []) => {
    const baseSuffix = "TeleKiosk Hospital";
    const fullTitle = title ? `${title} | ${baseSuffix}` : `${baseSuffix} | AI-Powered Healthcare Kiosk`;
    
    // Update document title
    document.title = fullTitle;
    
    // Update current title state
    setCurrentTitle(title || 'Home - AI-Powered Healthcare');
    
    // Update breadcrumbs
    setBreadcrumbs(newBreadcrumbs);
    
    // Update Open Graph meta tag
    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', fullTitle);
    }
    
    // Update Twitter Card meta tag
    const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleMeta) {
      twitterTitleMeta.setAttribute('content', fullTitle);
    }
  }, []);

  /**
   * Update page description
   * @param {string} description - The new description
   */
  const updateDescription = useCallback((description) => {
    if (description) {
      // Update meta description
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute('content', description);
      }
      
      // Update Open Graph description
      const ogDescMeta = document.querySelector('meta[property="og:description"]');
      if (ogDescMeta) {
        ogDescMeta.setAttribute('content', description);
      }
      
      // Update Twitter Card description
      const twitterDescMeta = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescMeta) {
        twitterDescMeta.setAttribute('content', description);
      }
    }
  }, []);

  /**
   * Set page with title, description, and breadcrumbs
   * @param {Object} pageInfo - Page information object
   */
  const setPageInfo = useCallback((pageInfo) => {
    const { title, description, breadcrumbs: pageBreadcrumbs } = pageInfo;
    
    if (title) updateTitle(title, pageBreadcrumbs);
    if (description) updateDescription(description);
  }, [updateTitle, updateDescription]);

  const value = {
    currentTitle,
    breadcrumbs,
    updateTitle,
    updateDescription,
    setPageInfo
  };

  return (
    <TitleContext.Provider value={value}>
      {children}
    </TitleContext.Provider>
  );
};