import React from 'react';
import robotIcon from '../../assets/chat2.png';

/**
 * Custom Robot Icon Component  
 * Uses the robot image from assets folder - shows as natural image
 */
export const RobotIcon = ({ size = 24, className = "" }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <img 
        src={robotIcon}
        alt="TeleKiosk AI Robot Assistant"
        className="object-contain"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`
        }}
      />
    </div>
  );
};

/**
 * Enhanced Animated Robot Icon with advanced visual effects
 */
export const AnimatedRobotIcon = ({ size = 24, className = "", isActive = false }) => {
  return (
    <div className={`relative ${className}`} style={{ background: 'transparent' }}>
      {/* Main Robot Icon with Enhanced Animation */}
      <div className={`transition-all duration-500 transform ${
        isActive 
          ? 'animate-pulse hover:scale-110 hover:rotate-3' 
          : 'hover:scale-105 hover:rotate-2'
      }`}>
        <div className="relative">
          <RobotIcon size={size} className="drop-shadow-lg" />
          
            </div>
      </div>
      
      {/* Simplified Active Indicator */}
      {isActive && (
        <div className="absolute -top-1 -right-1">
          <div className="w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

/**
 * Simplified Floating Robot Icon without background effects
 */
export const FloatingRobotIcon = ({ size = 80, className = "", isActive = true }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="transform transition-all duration-300 hover:scale-110">
        <AnimatedRobotIcon size={size} isActive={isActive} />
      </div>
    </div>
  );
};

export default RobotIcon;