import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Card Skeleton for services, news, health tips, etc.
export function CardSkeleton({ count = 1 }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image skeleton */}
          <Skeleton height={192} />
          
          {/* Content skeleton */}
          <div className="p-6">
            {/* Category badge */}
            <Skeleton width={80} height={24} className="mb-3" />
            
            {/* Title */}
            <Skeleton height={24} className="mb-3" />
            <Skeleton width="80%" height={24} className="mb-3" />
            
            {/* Description */}
            <Skeleton count={3} height={16} className="mb-4" />
            
            {/* Read more button */}
            <Skeleton width={100} height={20} />
          </div>
        </div>
      ))}
    </SkeletonTheme>
  );
}

// Service Detail Skeleton
export function ServiceDetailSkeleton() {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Image Skeleton */}
            <div className="space-y-6">
              <Skeleton height={320} className="rounded-lg" />
            </div>

            {/* Right Side - Content Skeleton */}
            <div className="space-y-6">
              {/* Title */}
              <Skeleton height={48} className="mb-8" />
              
              {/* Description */}
              <div className="space-y-4">
                <Skeleton count={4} height={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

// News List Skeleton
export function NewsListSkeleton({ count = 6 }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Image */}
            <Skeleton height={192} />
            
            {/* Content */}
            <div className="p-6">
              {/* Category badge */}
              <Skeleton width={90} height={20} className="mb-3" />
              
              {/* Title */}
              <Skeleton height={24} className="mb-3" />
              <Skeleton width="75%" height={24} className="mb-3" />
              
              {/* Date */}
              <Skeleton width={120} height={16} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

// Health Tips Skeleton
export function HealthTipsSkeleton({ count = 9 }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image */}
            <Skeleton height={192} />
            
            {/* Content */}
            <div className="p-6">
              {/* Category badge */}
              <Skeleton width={100} height={20} className="mb-3" />
              
              {/* Title */}
              <Skeleton height={20} className="mb-3" />
              <Skeleton width="80%" height={20} className="mb-3" />
              
              {/* Excerpt */}
              <Skeleton count={3} height={14} className="mb-4" />
              
              {/* Read more */}
              <Skeleton width={80} height={16} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

// Header/Navigation Skeleton
export function HeaderSkeleton() {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Skeleton width={150} height={32} />
            
            {/* Navigation */}
            <div className="hidden md:flex space-x-8">
              <Skeleton width={80} height={20} />
              <Skeleton width={100} height={20} />
              <Skeleton width={90} height={20} />
              <Skeleton width={70} height={20} />
            </div>
            
            {/* Language switcher */}
            <Skeleton width={60} height={32} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
      <div className="relative min-h-[400px] sm:min-h-[450px] lg:h-[450px] bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-200"></div>
        
        <div className="relative z-10 h-full min-h-[400px] sm:min-h-[450px] lg:min-h-[450px] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
              <div className="hidden lg:block"></div>
              
              {/* Content */}
              <div className="flex flex-col justify-center lg:pl-16">
                {/* Title */}
                <Skeleton height={48} className="mb-6" />
                <Skeleton width="80%" height={48} className="mb-6" />
                
                {/* Subtitle */}
                <Skeleton count={3} height={20} className="mb-10" />
                
                {/* Search bar */}
                <Skeleton height={48} width="100%" className="max-w-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

// Text Content Skeleton
export function TextSkeleton({ lines = 3, className = "" }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className={className}>
        <Skeleton count={lines} height={16} />
      </div>
    </SkeletonTheme>
  );
}

// Button Skeleton
export function ButtonSkeleton({ width = 120, height = 40, className = "" }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <Skeleton width={width} height={height} className={className} />
    </SkeletonTheme>
  );
}