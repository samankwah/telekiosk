import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTitleContext } from '../../contexts/TitleContext';
import { getPageConfigByPath } from '../../config/pageConfig';

/**
 * Auto Title Updater Component
 * Automatically updates page title based on current route
 * Add this component once in your App.jsx and it will handle all pages
 */
const AutoTitleUpdater = () => {
  const location = useLocation();
  const { setPageInfo } = useTitleContext();

  useEffect(() => {
    // Get page configuration based on current path
    const pageConfig = getPageConfigByPath(location.pathname);
    
    // Update page info
    setPageInfo(pageConfig);
  }, [location.pathname, setPageInfo]);

  // This component doesn't render anything
  return null;
};

export default AutoTitleUpdater;