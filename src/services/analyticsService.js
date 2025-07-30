// Analytics Service - Track and analyze user interactions and system performance
// Provides insights for healthcare service optimization

import { getEnvVar } from '../utils/envUtils.js';

class AnalyticsService {
  constructor() {
    this.events = [];
    this.sessionData = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      language: typeof navigator !== 'undefined' ? navigator.language : 'en-GH'
    };
    
    this.metrics = {
      interactions: 0,
      voiceUsage: 0,
      multimodalUsage: 0,
      emergencyDetections: 0,
      bookingAttempts: 0,
      languageSwitches: 0,
      aiModelUsage: {},
      responseTimings: [],
      errorCount: 0
    };
    
    this.realTimeStats = {
      activeUsers: 1,
      currentLoad: 0,
      systemHealth: 'good'
    };

    this.initializeAnalytics();
  }

  async initializeAnalytics() {
    try {
      console.log('📊 Initializing Analytics Service...');
      
      // Initialize session
      this.trackEvent('session_start', {
        sessionId: this.sessionData.sessionId,
        timestamp: this.sessionData.startTime,
        userAgent: this.sessionData.userAgent,
        language: this.sessionData.language
      });
      
      // Set up periodic data transmission
      this.setupPeriodicReporting();
      
      // Set up beforeunload handler
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
          this.trackEvent('session_end', {
            duration: Date.now() - this.sessionData.startTime,
            interactions: this.metrics.interactions
          });
          this.flushEvents();
        });
      }
      
      console.log('✅ Analytics Service initialized');
    } catch (error) {
      console.error('❌ Analytics initialization failed:', error);
    }
  }

  /**
   * Track user interaction event
   */
  trackEvent(eventName, eventData = {}) {
    try {
      const event = {
        id: this.generateEventId(),
        name: eventName,
        timestamp: Date.now(),
        sessionId: this.sessionData.sessionId,
        data: eventData,
        metadata: {
          url: typeof window !== 'undefined' ? window.location.href : 'unknown',
          referrer: typeof document !== 'undefined' ? document.referrer : 'unknown'
        }
      };

      this.events.push(event);
      this.updateMetrics(eventName, eventData);
      
      console.log('📈 Event tracked:', eventName, eventData);
      
      // Real-time event processing for critical events
      if (this.isCriticalEvent(eventName)) {
        this.processCriticalEvent(event);
      }
      
      return event.id;
    } catch (error) {
      console.error('❌ Event tracking failed:', error);
      return null;
    }
  }

  /**
   * Track chatbot interaction
   */
  trackChatbotInteraction(interactionType, data = {}) {
    return this.trackEvent('chatbot_interaction', {
      type: interactionType,
      language: data.language || 'en-GH',
      messageLength: data.messageLength || 0,
      responseTime: data.responseTime || 0,
      aiModel: data.aiModel || 'unknown',
      hasMultimodal: data.hasMultimodal || false,
      hasVoice: data.hasVoice || false,
      ...data
    });
  }

  /**
   * Track voice usage
   */
  trackVoiceUsage(voiceAction, data = {}) {
    return this.trackEvent('voice_usage', {
      action: voiceAction, // 'start_listening', 'stop_listening', 'speak', 'language_switch'
      language: data.language || 'en-GH',
      duration: data.duration || 0,
      success: data.success !== false,
      errorType: data.errorType || null,
      ...data
    });
  }

  /**
   * Track multimodal usage
   */
  trackMultimodalUsage(mediaType, data = {}) {
    return this.trackEvent('multimodal_usage', {
      mediaType, // 'image', 'video', 'audio'
      processingTime: data.processingTime || 0,
      fileSize: data.fileSize || 0,
      analysisType: data.analysisType || 'general',
      aiModel: data.aiModel || 'unknown',
      success: data.success !== false,
      ...data
    });
  }

  /**
   * Track AI model usage
   */
  trackAIModelUsage(modelName, data = {}) {
    return this.trackEvent('ai_model_usage', {
      model: modelName,
      requestType: data.requestType || 'text',
      responseTime: data.responseTime || 0,
      tokenUsage: data.tokenUsage || 0,
      cost: data.cost || 0,
      success: data.success !== false,
      ...data
    });
  }

  /**
   * Track emergency detection
   */
  trackEmergencyDetection(data = {}) {
    return this.trackEvent('emergency_detection', {
      severity: data.severity || 'unknown',
      detectionMethod: data.detectionMethod || 'text',
      responseTime: data.responseTime || 0,
      actionTaken: data.actionTaken || 'alert_shown',
      timestamp: Date.now(),
      ...data
    });
  }

  /**
   * Track booking attempt
   */
  trackBookingAttempt(data = {}) {
    return this.trackEvent('booking_attempt', {
      stage: data.stage || 'initiated',
      serviceType: data.serviceType || 'general',
      success: data.success !== false,
      completionTime: data.completionTime || 0,
      ...data
    });
  }

  /**
   * Track system performance
   */
  trackPerformance(performanceData = {}) {
    return this.trackEvent('performance_metric', {
      type: performanceData.type || 'general',
      value: performanceData.value || 0,
      unit: performanceData.unit || 'ms',
      context: performanceData.context || 'system',
      timestamp: Date.now(),
      ...performanceData
    });
  }

  /**
   * Track error occurrence
   */
  trackError(error, context = {}) {
    return this.trackEvent('error_occurred', {
      errorType: error.name || 'Unknown',
      errorMessage: error.message || 'No message',
      stackTrace: error.stack || 'No stack trace',
      context: context.component || 'unknown',
      severity: context.severity || 'medium',
      recoverable: context.recoverable !== false,
      timestamp: Date.now(),
      ...context
    });
  }

  /**
   * Update internal metrics
   */
  updateMetrics(eventName, eventData) {
    try {
      this.metrics.interactions++;
      
      switch (eventName) {
        case 'voice_usage':
          this.metrics.voiceUsage++;
          break;
          
        case 'multimodal_usage':
          this.metrics.multimodalUsage++;
          break;
          
        case 'emergency_detection':
          this.metrics.emergencyDetections++;
          break;
          
        case 'booking_attempt':
          this.metrics.bookingAttempts++;
          break;
          
        case 'chatbot_interaction':
          if (eventData.language && eventData.language !== 'en-GH') {
            this.metrics.languageSwitches++;
          }
          break;
          
        case 'ai_model_usage':
          const model = eventData.model || 'unknown';
          this.metrics.aiModelUsage[model] = (this.metrics.aiModelUsage[model] || 0) + 1;
          
          if (eventData.responseTime) {
            this.metrics.responseTimings.push(eventData.responseTime);
          }
          break;
          
        case 'error_occurred':
          this.metrics.errorCount++;
          break;
      }
    } catch (error) {
      console.error('❌ Metrics update failed:', error);
    }
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary() {
    const sessionDuration = Date.now() - this.sessionData.startTime;
    const avgResponseTime = this.metrics.responseTimings.length > 0 
      ? this.metrics.responseTimings.reduce((a, b) => a + b, 0) / this.metrics.responseTimings.length 
      : 0;

    return {
      session: {
        sessionId: this.sessionData.sessionId,
        duration: sessionDuration,
        startTime: this.sessionData.startTime
      },
      usage: {
        totalInteractions: this.metrics.interactions,
        voiceInteractions: this.metrics.voiceUsage,
        multimodalInteractions: this.metrics.multimodalUsage,
        emergencyDetections: this.metrics.emergencyDetections,
        bookingAttempts: this.metrics.bookingAttempts,
        languageSwitches: this.metrics.languageSwitches
      },
      performance: {
        averageResponseTime: Math.round(avgResponseTime),
        totalErrors: this.metrics.errorCount,
        errorRate: this.metrics.interactions > 0 ? (this.metrics.errorCount / this.metrics.interactions * 100).toFixed(2) : 0
      },
      aiUsage: {
        modelUsage: this.metrics.aiModelUsage,
        totalAIRequests: Object.values(this.metrics.aiModelUsage).reduce((sum, count) => sum + count, 0)
      },
      realTime: this.realTimeStats
    };
  }

  /**
   * Get detailed analytics report
   */
  getDetailedReport(timeRange = '24h') {
    const now = Date.now();
    const timeRangeMs = this.parseTimeRange(timeRange);
    const startTime = now - timeRangeMs;
    
    const filteredEvents = this.events.filter(event => event.timestamp >= startTime);
    
    return {
      timeRange: {
        start: startTime,
        end: now,
        duration: timeRangeMs
      },
      summary: this.getAnalyticsSummary(),
      events: {
        total: filteredEvents.length,
        byType: this.groupEventsByType(filteredEvents),
        timeline: this.createEventTimeline(filteredEvents)
      },
      insights: this.generateInsights(filteredEvents),
      recommendations: this.generateRecommendations(filteredEvents)
    };
  }

  /**
   * Generate actionable insights
   */
  generateInsights(events) {
    const insights = [];
    
    // Usage patterns
    const voiceEvents = events.filter(e => e.name === 'voice_usage');
    const multimodalEvents = events.filter(e => e.name === 'multimodal_usage');
    const chatEvents = events.filter(e => e.name === 'chatbot_interaction');
    
    if (voiceEvents.length > chatEvents.length * 0.5) {
      insights.push({
        type: 'usage_pattern',
        message: 'High voice interaction usage detected - users prefer voice interface',
        confidence: 'high',
        impact: 'positive'
      });
    }
    
    if (multimodalEvents.length > 0) {
      insights.push({
        type: 'feature_adoption',
        message: 'Multimodal features are being actively used',
        confidence: 'high',
        impact: 'positive'
      });
    }
    
    // Performance insights
    const avgResponseTime = this.metrics.responseTimings.length > 0 
      ? this.metrics.responseTimings.reduce((a, b) => a + b, 0) / this.metrics.responseTimings.length 
      : 0;
    
    if (avgResponseTime > 3000) {
      insights.push({
        type: 'performance',
        message: 'Response times are slower than optimal (>3s average)',
        confidence: 'high',
        impact: 'negative'
      });
    }
    
    // Error insights
    if (this.metrics.errorCount > this.metrics.interactions * 0.1) {
      insights.push({
        type: 'reliability',
        message: 'Error rate is higher than expected (>10%)',
        confidence: 'high',
        impact: 'negative'
      });
    }
    
    return insights;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(events) {
    const recommendations = [];
    const summary = this.getAnalyticsSummary();
    
    // Voice usage recommendations
    if (summary.usage.voiceInteractions > summary.usage.totalInteractions * 0.7) {
      recommendations.push({
        category: 'interface',
        priority: 'medium',
        action: 'Enhance voice recognition accuracy and add more voice commands',
        reason: 'High voice usage indicates strong user preference'
      });
    }
    
    // Performance recommendations
    if (summary.performance.averageResponseTime > 2000) {
      recommendations.push({
        category: 'performance',
        priority: 'high',
        action: 'Optimize AI model routing and response caching',
        reason: 'Response times exceed user expectations'
      });
    }
    
    // Multimodal recommendations
    if (summary.usage.multimodalInteractions > 0 && summary.usage.multimodalInteractions < summary.usage.totalInteractions * 0.2) {
      recommendations.push({
        category: 'features',
        priority: 'low',
        action: 'Improve multimodal feature discoverability and user education',
        reason: 'Low adoption of advanced features'
      });
    }
    
    return recommendations;
  }

  /**
   * Utility functions
   */
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateEventId() {
    return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  isCriticalEvent(eventName) {
    const criticalEvents = ['emergency_detection', 'error_occurred', 'session_start', 'session_end'];
    return criticalEvents.includes(eventName);
  }

  processCriticalEvent(event) {
    // Handle critical events immediately
    console.log('🚨 Critical event processed:', event.name);
    
    if (event.name === 'emergency_detection') {
      // Alert monitoring systems
      this.alertMonitoringSystem(event);
    }
  }

  alertMonitoringSystem(event) {
    // In a real implementation, this would send alerts to monitoring systems
    console.log('🚨 Emergency alert sent to monitoring system:', event);
  }

  parseTimeRange(timeRange) {
    const ranges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    return ranges[timeRange] || ranges['24h'];
  }

  groupEventsByType(events) {
    const grouped = {};
    events.forEach(event => {
      grouped[event.name] = (grouped[event.name] || 0) + 1;
    });
    return grouped;
  }

  createEventTimeline(events) {
    const timeline = events.map(event => ({
      timestamp: event.timestamp,
      type: event.name,
      data: event.data
    })).sort((a, b) => a.timestamp - b.timestamp);
    
    return timeline;
  }

  setupPeriodicReporting() {
    // Send analytics data every 5 minutes
    setInterval(() => {
      this.transmitAnalyticsData();
    }, 5 * 60 * 1000);
  }

  transmitAnalyticsData() {
    try {
      const summary = this.getAnalyticsSummary();
      console.log('📊 Analytics data transmitted:', summary);
      
      // In a real implementation, this would send data to analytics server
      // fetch('/api/analytics', { method: 'POST', body: JSON.stringify(summary) });
      
    } catch (error) {
      console.error('❌ Analytics transmission failed:', error);
    }
  }

  flushEvents() {
    try {
      if (this.events.length > 0) {
        console.log('📊 Flushing', this.events.length, 'events');
        // In a real implementation, send remaining events
        this.events = [];
      }
    } catch (error) {
      console.error('❌ Event flush failed:', error);
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      initialized: true,
      sessionId: this.sessionData.sessionId,
      eventsTracked: this.events.length,
      sessionDuration: Date.now() - this.sessionData.startTime,
      metricsCollected: Object.keys(this.metrics).length,
      capabilities: {
        eventTracking: true,
        performanceMonitoring: true,
        realTimeAnalytics: true,
        insightGeneration: true,
        recommendations: true
      }
    };
  }
}

// Create and export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;