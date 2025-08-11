import React, { useState } from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { AssistantUIChat } from './AssistantUIChat';
import { AssistantRuntimeProvider } from './runtime/AssistantRuntimeProvider';
import { AnimatedRobotIcon, FloatingRobotIcon } from '../ui/RobotIcon';

/**
 * Main Chat Assistant component with Assistant-UI integration
 * Following Phase 1 implementation plan for basic chat interface
 */
export const ChatAssistantUI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <button
          onClick={toggleChat}
          className="group transition-all duration-700 hover:scale-110 sm:hover:scale-125 focus:outline-none animate-enhanced-bounce btn-hover-glow"
          aria-label="Open TeleKiosk Assistant"
          style={{ 
            background: 'transparent', 
            border: 'none', 
            padding: 0, 
            margin: 0,
            boxShadow: 'none',
            outline: 'none'
          }}
        >
          <div className="relative">
            <FloatingRobotIcon size={85} isActive={true} className="relative z-10" />
          </div>
        </button>
        <div className="absolute -top-16 right-0 bg-gray-800 text-white text-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Chat with TeleKiosk AI</span>
          </div>
          <div className="absolute -bottom-1 right-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-800"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop for click-anywhere-to-close */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={closeChat}
        aria-hidden="true"
      />
      
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto z-50">
        <div 
          className={`glass-morphism rounded-2xl shadow-2xl transition-all duration-500 border-2 border-white/20 backdrop-blur-2xl hover:shadow-blue-500/20 ${
            isMinimized 
              ? 'w-80 sm:w-96 h-14' 
              : 'w-[95vw] sm:w-[420px] md:w-[450px] lg:w-[480px] h-[70vh] sm:h-[650px] max-w-[500px] max-h-[700px]'
          }`}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.95) 100%)'
          }}
        >
          {/* Enhanced Chat Content - Responsive Full Height */}
          {!isMinimized && (
            <div className="h-[70vh] sm:h-[650px] max-h-[700px] rounded-2xl overflow-hidden backdrop-blur-sm animate-slide-in-right">
              <AssistantUIChat 
                onMinimize={minimizeChat} 
                onClose={closeChat}
                isMinimized={isMinimized}
              />
            </div>
          )}
          
          {/* Enhanced Minimized Header */}
          {isMinimized && (
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white rounded-2xl shadow-lg border border-blue-400/30">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <AnimatedRobotIcon size={20} isActive={true} />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white animate-pulse"></div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-sm">TeleKiosk AI</h3>
                    <span className="text-xs opacity-80">Ready to help</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={minimizeChat}
                    className="p-2 hover:bg-blue-800/50 rounded-lg transition-all duration-200 hover:scale-110"
                    aria-label="Maximize chat"
                  >
                    <Maximize2 size={16} />
                  </button>
                  <button
                    onClick={closeChat}
                    className="p-2 hover:bg-red-600/50 rounded-lg transition-all duration-200 hover:scale-110"
                    aria-label="Close chat"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};