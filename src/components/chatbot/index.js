// TeleKiosk AI Chatbot Components - Phases 2 & 3 Complete ✅

// Phase 1: Foundation Setup (Complete)
export { ChatAssistantUI } from './ChatAssistantUI';
export { AssistantUIChat } from './AssistantUIChat';
export { TeleBotUI } from './TeleBotUI.jsx'; // New TeleKiosk-style UI
export { AssistantRuntimeProvider } from './runtime/AssistantRuntimeProvider';

// Phase 2: Core AI Integration (Complete)
export { EmergencyDetection } from './EmergencyDetection.jsx';

// Phase 3: Advanced Features (Complete)
export { LanguageProvider, useLanguage, LanguageSelector, AutoLanguageDetector, LanguageSwitchNotification } from './LanguageSupport.jsx';
export { AnalyticsDashboard } from './AnalyticsDashboard.jsx';
// Note: VoiceRealtimeAPI and other advanced features will be implemented in future updates

// Healthcare Configuration & Prompts
export * from './HealthcarePrompts.js';

// Complete Integration (All Features)
export { TeleKioskAIComplete } from './TeleKioskAIComplete.jsx';

// Legacy Components (Deprecated - use AssistantUIChat instead)
export { ChatAssistant } from './ChatAssistant';
export { ChatInterface } from './ChatInterface';
export { ChatMessage } from './ChatMessage';
export { VoiceIntegration } from './VoiceIntegration';
export { BookingIntegration } from './BookingIntegration';
export { HealthcarePrompts } from './HealthcarePrompts';