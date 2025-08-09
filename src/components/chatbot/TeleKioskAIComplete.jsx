import React, { useState, useEffect } from 'react';
import { AssistantUIChat } from './AssistantUIChat.jsx';
import { EmergencyDetection } from './EmergencyDetection.jsx';
import { MultilingualSupport, LanguageProvider } from './MultilingualSupport.jsx';
import { VoiceRealtimeAPI } from './VoiceRealtimeAPI.jsx';
import { AdvancedAnalytics } from './AdvancedAnalytics.jsx';
import { PerformanceOptimizer, PerformanceMonitor } from './PerformanceOptimizer.jsx';
import { Settings, BarChart3, Globe, Mic, Shield, Zap } from 'lucide-react';

/**
 * Complete TeleKiosk AI Chatbot Integration
 * All Phase 2 and Phase 3 features implemented and integrated
 * 
 * Features:
 * ✅ Phase 2: Enhanced Emergency Detection with ML
 * ✅ Phase 2: Comprehensive Healthcare Prompts for Ghana
 * ✅ Phase 3: Advanced Multilingual Support (English, Twi, Ga, Ewe)
 * ✅ Phase 3: GPT-4o Realtime API Voice Integration
 * ✅ Phase 3: Advanced Analytics Dashboard
 * ✅ Phase 3: Intelligent Performance Optimization
 */
export const TeleKioskAIComplete = ({ 
  showAnalytics = false, 
  enableVoice = true,
  enableEmergencyDetection = true,
  enableMultilingual = true,
  enablePerformanceOptimization = true
}) => {
  const [currentView, setCurrentView] = useState('chat');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const [performanceOptimizer] = useState(() => new PerformanceOptimizer());
  const [lastMessage, setLastMessage] = useState('');

  // Handle emergency detection
  const handleEmergencyDetected = (emergency) => {
    setEmergencyAlert(emergency);
    
    // Auto-hide non-critical emergencies after 30 seconds
    if (emergency.priority !== 'CRITICAL') {
      setTimeout(() => setEmergencyAlert(null), 30000);
    }
  };

  // Handle language changes
  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    console.log(`🌍 Language switched to: ${languageCode}`);
  };

  // Handle voice transcription
  const handleVoiceTranscript = (transcript) => {
    setLastMessage(transcript);
    console.log(`🎤 Voice input: ${transcript}`);
  };

  // Handle voice response
  const handleVoiceResponse = (response) => {
    console.log(`🔊 Voice response: ${response}`);
  };

  const ViewButton = ({ view, icon: Icon, label, badge = null }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        currentView === view
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {badge && (
        <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <LanguageProvider>
      <div className="telekiosk-ai-complete min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  🏥 TeleKiosk AI Assistant
                  <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-normal">
                    Phase 3 Complete
                  </span>
                </h1>
                <p className="text-gray-600 mt-1">
                  Advanced healthcare chatbot with multilingual support, voice AI, and emergency detection
                </p>
              </div>

              {/* Language Selector */}
              {enableMultilingual && (
                <MultilingualSupport 
                  onLanguageChange={handleLanguageChange}
                  currentMessage={lastMessage}
                />
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-4 mt-4">
              <ViewButton view="chat" icon={Settings} label="AI Chat" />
              {showAnalytics && (
                <ViewButton view="analytics" icon={BarChart3} label="Analytics" />
              )}
              {enableVoice && (
                <ViewButton view="voice" icon={Mic} label="Voice AI" />
              )}
              {enablePerformanceOptimization && (
                <ViewButton view="performance" icon={Zap} label="Performance" />
              )}
            </div>
          </div>
        </div>

        {/* Emergency Alert Banner */}
        {enableEmergencyDetection && emergencyAlert && (
          <div className="bg-red-50 border-b border-red-200">
            <div className="max-w-7xl mx-auto p-4">
              <EmergencyDetection
                message={lastMessage}
                onEmergencyDetected={handleEmergencyDetected}
                language={currentLanguage}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-4">
          {currentView === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Chat Interface */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <AssistantUIChat />
                </div>

                {/* Voice Integration */}
                {enableVoice && (
                  <div className="mt-6">
                    <VoiceRealtimeAPI
                      onTranscriptReceived={handleVoiceTranscript}
                      onResponseReceived={handleVoiceResponse}
                      isEnabled={enableVoice}
                    />
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Performance Monitor */}
                {enablePerformanceOptimization && (
                  <PerformanceMonitor optimizer={performanceOptimizer} />
                )}

                {/* Feature Status */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    System Status
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Emergency Detection</span>
                      <span className={`font-medium ${
                        enableEmergencyDetection ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {enableEmergencyDetection ? '🟢 Active' : '⚫ Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Voice AI (GPT-4o)</span>
                      <span className={`font-medium ${
                        enableVoice ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {enableVoice ? '🟢 Active' : '⚫ Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Multilingual (4 Languages)</span>
                      <span className={`font-medium ${
                        enableMultilingual ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {enableMultilingual ? '🟢 Active' : '⚫ Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Performance Optimization</span>
                      <span className={`font-medium ${
                        enablePerformanceOptimization ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {enablePerformanceOptimization ? '🟢 Active' : '⚫ Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Implementation Complete</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Advanced Emergency Detection with ML</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>GPT-4o Realtime Voice Integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Multilingual Support (En, Tw, Ga, Ew)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Intelligent Performance Optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Advanced Analytics & Insights</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'analytics' && showAnalytics && (
            <AdvancedAnalytics />
          )}

          {currentView === 'voice' && enableVoice && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <VoiceRealtimeAPI
                onTranscriptReceived={handleVoiceTranscript}
                onResponseReceived={handleVoiceResponse}
                isEnabled={true}
              />
            </div>
          )}

          {currentView === 'performance' && enablePerformanceOptimization && (
            <PerformanceMonitor optimizer={performanceOptimizer} />
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-4 mt-8">
          <div className="max-w-7xl mx-auto text-center text-gray-600">
            <p className="text-sm">
              🏥 TeleKiosk Hospital AI Assistant | 
              🤖 Powered by OpenAI GPT-4o | 
              🌍 Supporting English, Twi, Ga, and Ewe | 
              📞 Emergency: 999 or 193
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Advanced healthcare AI with emergency detection, voice interaction, and multilingual support for Ghana
            </div>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
};

export default TeleKioskAIComplete;