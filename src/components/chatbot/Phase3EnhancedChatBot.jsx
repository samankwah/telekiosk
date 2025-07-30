// Phase 3 Enhanced ChatBot with Multimodal Capabilities
// Integrates all Phase 3 features while maintaining backward compatibility

import { useState, useEffect } from 'react';
import { useEnhancedChatbot } from '../../contexts/EnhancedChatbotContext';
import EnhancedMultimodalChat from './EnhancedMultimodalChat';
import AIStreamingChatInterface from './AIStreamingChatInterface';
import EnhancedChatInterface from './EnhancedChatInterface';
import EnhancedVoiceButton from './EnhancedVoiceButton';
import LanguageSelector from './LanguageSelector';
import { multimodalService } from '../../services/multimodalService';
import { advancedAIRouter } from '../../services/advancedAIRouter';
import { videoProcessingService } from '../../services/videoProcessingService';

function Phase3EnhancedChatBot() {
  const { state, toggleChat } = useEnhancedChatbot();
  const [isMinimized, setIsMinimized] = useState(false);
  const [useMultimodal, setUseMultimodal] = useState(true); // Enable Phase 3 multimodal by default
  const [interfaceMode, setInterfaceMode] = useState('multimodal'); // 'multimodal', 'streaming', 'legacy'
  const [aiStats, setAIStats] = useState(null);
  const [videoAnalysisEnabled, setVideoAnalysisEnabled] = useState(false);

  // Initialize Phase 3 services on mount
  useEffect(() => {
    initializePhase3Services();
  }, []);

  const initializePhase3Services = async () => {
    try {
      console.log('🚀 Initializing Phase 3 Enhanced ChatBot...');
      
      // Get AI router statistics
      const stats = advancedAIRouter.getModelStats();
      setAIStats(stats);
      
      // Initialize video processing if available
      const videoStatus = videoProcessingService.getStatus();
      if (videoStatus.initialized) {
        console.log('📹 Video processing ready');
      }
      
      // Initialize multimodal service
      const multimodalStatus = multimodalService.getStatus();
      if (multimodalStatus.initialized) {
        console.log('🎭 Multimodal service ready');
      }
      
      console.log('✅ Phase 3 services initialized');
    } catch (error) {
      console.error('❌ Phase 3 initialization failed:', error);
    }
  };

  const handleToggle = () => {
    if (state.isOpen && !isMinimized) {
      setIsMinimized(true);
    } else if (state.isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      toggleChat();
      setIsMinimized(false);
    }
  };

  const handleClose = () => {
    toggleChat();
    setIsMinimized(false);
    
    // Stop any active video processing
    if (videoAnalysisEnabled) {
      videoProcessingService.stopRealTimeAnalysis();
      setVideoAnalysisEnabled(false);
    }
  };

  const getStatusIcon = () => {
    if (state.isListening) {
      return (
        <div className="w-6 h-6 relative">
          <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse"></div>
          <svg className="w-6 h-6 relative z-10" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 10V12C19 15.9 15.9 19 12 19S5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17S17 14.8 17 12V10H19Z"/>
          </svg>
        </div>
      );
    } else if (state.isSpeaking) {
      return (
        <div className="w-6 h-6 relative">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse"></div>
          <svg className="w-6 h-6 relative z-10" fill="white" viewBox="0 0 24 24">
            <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
          </svg>
        </div>
      );
    } else if (state.autoResponseEnabled) {
      return (
        <div className="relative">
          <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
            <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      );
    }
    
    // Default AI icon with Phase 3 indicator
    return (
      <div className="relative">
        <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
          <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
        </svg>
        {/* Phase 3 multimodal indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">3</span>
        </div>
      </div>
    );
  };

  const renderChatInterface = () => {
    switch (interfaceMode) {
      case 'multimodal':
        return <EnhancedMultimodalChat />;
      case 'streaming':
        return <AIStreamingChatInterface />;
      case 'legacy':
        return <EnhancedChatInterface />;
      default:
        return <EnhancedMultimodalChat />;
    }
  };

  const getInterfaceModeLabel = () => {
    switch (interfaceMode) {
      case 'multimodal': return '🎭 Multimodal AI';
      case 'streaming': return '⚡ AI Streaming';
      case 'legacy': return '💬 Standard Chat';
      default: return '🎭 Multimodal AI';
    }
  };

  const toggleVideoAnalysis = async () => {
    try {
      if (!videoAnalysisEnabled) {
        // Start video analysis
        const result = await videoProcessingService.startRealTimeAnalysis({
          interval: 10000, // Analyze every 10 seconds
          analysisTypes: ['general_health', 'vital_signs'],
          onAnalysis: (result, analysisType) => {
            console.log('📹 Video analysis result:', result);
            // You could add the analysis to chat here
            if (result.success && result.analysis) {
              // Optional: Add analysis result as a message
              // addMessage(`Video Analysis (${analysisType}): ${result.analysis}`, 'bot', 'analysis');
            }
          }
        });
        
        if (result.success) {
          setVideoAnalysisEnabled(true);
        }
      } else {
        // Stop video analysis
        videoProcessingService.stopRealTimeAnalysis();
        setVideoAnalysisEnabled(false);
      }
    } catch (error) {
      console.error('❌ Video analysis toggle failed:', error);
    }
  };

  return (
    <>
      {/* Enhanced Floating Chat Button */}
      {!state.isOpen && (
        <button
          onClick={handleToggle}
          className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 active:scale-105 group touch-manipulation"
          aria-label="Open TeleKiosk AI Assistant - Phase 3"
        >
          <div className="flex items-center justify-center">
            {getStatusIcon()}
          </div>
          
          {/* Enhanced Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            TeleKiosk AI - Phase 3 ✨
            <div className="text-xs text-gray-300 mt-1">
              {aiStats && `${aiStats.availableModels.length} AI Models • `}
              Multimodal • Voice • Video
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      )}

      {/* Enhanced Chat Interface */}
      {state.isOpen && (
        <div
          className={`fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
            isMinimized
              ? 'w-80 h-16'
              : 'w-full max-w-md h-[32rem] sm:h-[36rem]'
          } max-h-[90vh] flex flex-col overflow-hidden`}
        >
          {/* Enhanced Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {getStatusIcon()}
              </div>
              <div className={`${isMinimized ? 'hidden' : 'block'}`}>
                <h3 className="font-semibold text-sm">TeleKiosk AI Assistant</h3>
                <p className="text-xs text-blue-100">
                  {getInterfaceModeLabel()} • Ghana Healthcare
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* AI Model Indicator */}
              {!isMinimized && aiStats && (
                <div className="relative group">
                  <div className="bg-white/20 text-white text-xs rounded px-2 py-1">
                    {aiStats.availableModels.length} AI
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Available: {aiStats.availableModels.join(', ')}
                  </div>
                </div>
              )}

              {/* Interface Mode Switcher */}
              {!isMinimized && (
                <div className="relative">
                  <select
                    value={interfaceMode}
                    onChange={(e) => setInterfaceMode(e.target.value)}
                    className="bg-white/20 text-white text-xs rounded px-2 py-1 focus:outline-none focus:bg-white/30"
                  >
                    <option value="multimodal" className="text-gray-800">🎭 Multimodal</option>
                    <option value="streaming" className="text-gray-800">⚡ Streaming</option>
                    <option value="legacy" className="text-gray-800">💬 Standard</option>
                  </select>
                </div>
              )}

              {/* Video Analysis Toggle */}
              {!isMinimized && (
                <button
                  onClick={toggleVideoAnalysis}
                  className={`p-1 rounded transition-colors duration-200 ${
                    videoAnalysisEnabled 
                      ? 'bg-green-500/20 text-green-100' 
                      : 'hover:bg-white/20'
                  }`}
                  title={videoAnalysisEnabled ? 'Stop video analysis' : 'Start video analysis'}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z"/>
                  </svg>
                </button>
              )}

              {/* Language Selector */}
              {!isMinimized && (
                <div className="relative">
                  <LanguageSelector />
                </div>
              )}

              {/* Voice Button */}
              <EnhancedVoiceButton />

              {/* Minimize/Maximize Button */}
              <button
                onClick={handleToggle}
                className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  {isMinimized ? (
                    <path d="M4 8h16v2H4zm0 5h16v2H4z" />
                  ) : (
                    <path d="M20 14H4v-2h16v2z" />
                  )}
                </svg>
              </button>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-1 hover:bg-red-500/20 rounded transition-colors duration-200"
                aria-label="Close chat"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Enhanced Chat Content */}
          {!isMinimized && (
            <div className="flex-1 flex flex-col min-h-0">
              {renderChatInterface()}
            </div>
          )}

          {/* Minimized Status */}
          {isMinimized && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-600">Phase 3 AI Chat minimized</p>
                <p className="text-xs text-gray-500">
                  {interfaceMode} • {videoAnalysisEnabled ? 'Video On' : 'Video Off'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Phase 3 Feature Indicators */}
      {!state.isOpen && (
        <div className="fixed bottom-20 left-4 sm:bottom-24 sm:left-8 z-40 space-y-2">
          {/* Multimodal Feature Badge */}
          <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium shadow-md opacity-90">
            📷 Image Analysis
          </div>
          
          {/* Voice Enhancement Badge */}
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium shadow-md opacity-90">
            🎤 Premium Voice
          </div>
          
          {/* Video Analysis Badge */}
          {videoAnalysisEnabled && (
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium shadow-md opacity-90 animate-pulse">
              📹 Video Analysis
            </div>
          )}
          
          {/* AI Models Badge */}
          {aiStats && aiStats.availableModels.length > 0 && (
            <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium shadow-md opacity-90">
              🤖 {aiStats.availableModels.length} AI Models
            </div>
          )}
          
          {/* Security Badge */}
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium shadow-md opacity-90">
            🔒 HIPAA Secure
          </div>
        </div>
      )}
    </>
  );
}

export default Phase3EnhancedChatBot;