// Animation utilities and presets for enhanced user experience

// Common animation classes that can be applied via Tailwind
export const ANIMATION_PRESETS = {
  // Fade animations
  fadeIn: 'animate-fadeIn opacity-0',
  fadeInUp: 'animate-fadeInUp translate-y-4 opacity-0',
  fadeInDown: 'animate-fadeInDown -translate-y-4 opacity-0',
  fadeInLeft: 'animate-fadeInLeft -translate-x-4 opacity-0',
  fadeInRight: 'animate-fadeInRight translate-x-4 opacity-0',
  
  // Scale animations
  scaleIn: 'animate-scaleIn scale-95 opacity-0',
  scaleOut: 'animate-scaleOut scale-105',
  
  // Bounce animations
  bounceIn: 'animate-bounceIn scale-95 opacity-0',
  
  // Slide animations
  slideInLeft: 'animate-slideInLeft -translate-x-full opacity-0',
  slideInRight: 'animate-slideInRight translate-x-full opacity-0',
  slideInUp: 'animate-slideInUp translate-y-full opacity-0',
  slideInDown: 'animate-slideInDown -translate-y-full opacity-0',
  
  // Rotation animations
  rotateIn: 'animate-rotateIn rotate-180 opacity-0',
  
  // Hover effects
  hoverLift: 'transition-all duration-300 hover:scale-105 hover:shadow-lg',
  hoverGlow: 'transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/25',
  hoverSlide: 'transition-all duration-300 hover:translate-x-1',
  
  // Button animations
  buttonPulse: 'animate-pulse-soft',
  buttonPress: 'transition-transform duration-150 active:scale-95',
  
  // Loading animations
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  
  // Card animations
  cardHover: 'transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1',
  cardFloat: 'transition-all duration-500 hover:shadow-2xl hover:-translate-y-2',
  
  // Text animations
  textGlow: 'transition-all duration-300 hover:text-orange-500 hover:drop-shadow-lg',
  textShimmer: 'animate-shimmer bg-gradient-to-r from-gray-900 via-orange-500 to-gray-900 bg-clip-text text-transparent',
};

// Animation delays for staggered effects
export const ANIMATION_DELAYS = {
  none: 'animate-delay-0',
  xs: 'animate-delay-75',
  sm: 'animate-delay-150',
  md: 'animate-delay-300',
  lg: 'animate-delay-500',
  xl: 'animate-delay-700',
  '2xl': 'animate-delay-1000',
};

// Animation durations
export const ANIMATION_DURATIONS = {
  fast: 'animate-duration-150',
  normal: 'animate-duration-300',
  slow: 'animate-duration-500',
  slower: 'animate-duration-700',
  slowest: 'animate-duration-1000',
};

// Utility function to combine animation classes
export function combineAnimations(...animations) {
  return animations.filter(Boolean).join(' ');
}

// Stagger animation utility for lists
export function getStaggerDelay(index, baseDelay = 100) {
  return `animation-delay: ${index * baseDelay}ms;`;
}

// Page transition animations
export const PAGE_TRANSITIONS = {
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  fadeSlide: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.4, ease: 'easeInOut' }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};