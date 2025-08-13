import { useEffect } from 'react';
import { useTitleContext } from '../../contexts/TitleContext';

/**
 * Utility component to update page title, description, and breadcrumbs
 * Usage: <PageTitleUpdater title="Page Title" description="Page description" breadcrumbs={[...]} />
 */
const PageTitleUpdater = ({ title, description, breadcrumbs = [] }) => {
  const { setPageInfo } = useTitleContext();

  useEffect(() => {
    if (title) {
      setPageInfo({
        title,
        description,
        breadcrumbs
      });
    }
  }, [title, description, breadcrumbs, setPageInfo]);

  // This component doesn't render anything
  return null;
};

export default PageTitleUpdater;