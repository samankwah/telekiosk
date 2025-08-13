import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTitleContext } from '../../contexts/TitleContext';

const Breadcrumbs = ({ className = '' }) => {
  const { breadcrumbs } = useTitleContext();
  const location = useLocation();

  // Don't show breadcrumbs on home page
  if (location.pathname === '/' || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {/* Home link */}
        <li className="flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-gray-500 hover:text-orange-600 transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              {crumb.path && !isLast ? (
                <Link
                  to={crumb.path}
                  className="text-gray-500 hover:text-orange-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;