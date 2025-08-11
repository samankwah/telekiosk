/**
 * TeleKiosk Error Handling Service - Phase 4 Implementation
 * Comprehensive error handling with healthcare-specific error management
 */

import { analyticsService } from './analyticsService.js';

/**
 * Custom error class for TeleKiosk chatbot errors
 */
export class ChatbotError extends Error {
  constructor(message, type, severity = 'medium', metadata = {}) {
    super(message);
    this.name = 'ChatbotError';
    this.type = type;
    this.severity = severity;
    this.timestamp = new Date().toISOString();
    this.metadata = metadata;
    this.userFriendlyMessage = this.generateUserFriendlyMessage();
  }

  generateUserFriendlyMessage() {
    const messages = {
      RATE_LIMIT: 'I\'m receiving too many requests right now. Please wait a moment and try again.',
      API_UNAVAILABLE: 'I\'m having trouble connecting to my AI services. Please try again in a few moments.',
      NETWORK_ERROR: 'There seems to be a network issue. Please check your connection and try again.',
      VALIDATION_ERROR: 'I didn\'t understand your request format. Please try rephrasing your message.',
      EMERGENCY_DETECTED: 'I\'ve detected this might be an emergency. Please call 999 immediately or visit our Emergency Department.',
      AUTHORIZATION_ERROR: 'Authentication issue detected. Please refresh the page and try again.',
      TIMEOUT_ERROR: 'The request took too long to process. Please try again with a shorter message.',
      CONTENT_FILTER: 'I can\'t process that type of content. Please rephrase your healthcare question.',
      SERVICE_UNAVAILABLE: 'Our AI assistant is temporarily unavailable. Please speak with hospital staff for immediate assistance.',
      DEFAULT: 'I apologize, but I\'m having technical difficulties. Please speak with a hospital staff member for assistance.'
    };

    return messages[this.type] || messages.DEFAULT;
  }
}

/**
 * Error handling utilities
 */
export const errorHandler = {
  
  /**
   * Handle API errors with proper logging and user-friendly responses
   */
  handleAPIError: (error, context = 'unknown', userId = null) => {
    const errorInfo = {
      context,
      userId,
      timestamp: new Date().toISOString(),
      originalError: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n') // Limit stack trace
    };

    // Determine error type and severity
    let chatbotError;
    
    if (error.message?.includes('rate limit') || error.code === 'RATE_LIMIT_EXCEEDED') {
      chatbotError = new ChatbotError(error.message, 'RATE_LIMIT', 'medium', errorInfo);
    } else if (error.message?.includes('network') || error.code === 'NETWORK_ERROR') {
      chatbotError = new ChatbotError(error.message, 'NETWORK_ERROR', 'medium', errorInfo);
    } else if (error.message?.includes('timeout') || error.code === 'TIMEOUT') {
      chatbotError = new ChatbotError(error.message, 'TIMEOUT_ERROR', 'medium', errorInfo);
    } else if (error.message?.includes('API key') || error.message?.includes('unauthorized')) {
      chatbotError = new ChatbotError(error.message, 'AUTHORIZATION_ERROR', 'high', errorInfo);
    } else if (error.message?.includes('validation') || error.code === 'VALIDATION_ERROR') {
      chatbotError = new ChatbotError(error.message, 'VALIDATION_ERROR', 'low', errorInfo);
    } else if (error.message?.includes('content') || error.code === 'CONTENT_FILTER') {
      chatbotError = new ChatbotError(error.message, 'CONTENT_FILTER', 'medium', errorInfo);
    } else if (error.message?.includes('emergency')) {
      chatbotError = new ChatbotError(error.message, 'EMERGENCY_DETECTED', 'critical', errorInfo);
    } else {
      chatbotError = new ChatbotError(error.message, 'API_UNAVAILABLE', 'high', errorInfo);
    }

    // Log the error
    errorHandler.logError(chatbotError);

    return chatbotError;
  },

  /**
   * Handle OpenAI specific errors
   */
  handleOpenAIError: (error, requestData = {}) => {
    const context = {
      model: requestData.model,
      messageCount: requestData.messages?.length,
      requestId: requestData.requestId
    };

    // OpenAI specific error handling
    if (error.code === 'rate_limit_exceeded') {
      return new ChatbotError(
        'Rate limit exceeded', 
        'RATE_LIMIT', 
        'medium',
        { ...context, retryAfter: error.retry_after }
      );
    }

    if (error.code === 'insufficient_quota') {
      return new ChatbotError(
        'Service quota exceeded',
        'SERVICE_UNAVAILABLE',
        'high',
        context
      );
    }

    if (error.code === 'model_overloaded') {
      return new ChatbotError(
        'AI model is overloaded',
        'API_UNAVAILABLE',
        'medium',
        context
      );
    }

    if (error.code === 'content_filter') {
      return new ChatbotError(
        'Content policy violation',
        'CONTENT_FILTER',
        'medium',
        context
      );
    }

    // Generic OpenAI error
    return new ChatbotError(
      error.message || 'OpenAI API error',
      'API_UNAVAILABLE',
      'high',
      context
    );
  },

  /**
   * Handle voice-related errors
   */
  handleVoiceError: (error, voiceContext = {}) => {
    const context = {
      audioSupported: voiceContext.audioSupported,
      connectionType: voiceContext.connectionType,
      duration: voiceContext.duration
    };

    if (error.name === 'NotAllowedError') {
      return new ChatbotError(
        'Microphone access denied',
        'AUTHORIZATION_ERROR',
        'medium',
        context
      );
    }

    if (error.name === 'NetworkError') {
      return new ChatbotError(
        'Voice connection failed',
        'NETWORK_ERROR',
        'medium',
        context
      );
    }

    return new ChatbotError(
      error.message || 'Voice feature error',
      'API_UNAVAILABLE',
      'medium',
      context
    );
  },

  /**
   * Handle emergency detection errors
   */
  handleEmergencyError: (error, emergencyContext = {}) => {
    const context = {
      severity: emergencyContext.severity,
      confidence: emergencyContext.confidence,
      language: emergencyContext.language
    };

    // Emergency errors are always high priority
    return new ChatbotError(
      error.message || 'Emergency detection error',
      'EMERGENCY_DETECTED',
      'critical',
      context
    );
  },

  /**
   * Log errors to analytics and monitoring systems
   */
  logError: (chatbotError) => {
    // Log to console with structured format
    console.error('🚨 TeleKiosk Error:', {
      type: chatbotError.type,
      severity: chatbotError.severity,
      message: chatbotError.message,
      timestamp: chatbotError.timestamp,
      metadata: chatbotError.metadata
    });

    // Log to analytics service
    analyticsService.track('error_occurred', {
      errorType: chatbotError.type,
      severity: chatbotError.severity,
      context: chatbotError.metadata?.context,
      userId: chatbotError.metadata?.userId,
      timestamp: Date.now()
    });

    // In production, also send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(chatbotError);
    }
  },

  /**
   * Send error to external monitoring service
   */
  sendToMonitoring: (chatbotError) => {
    // This would integrate with services like Sentry, DataDog, etc.
    const monitoringData = {
      level: this.getSeverityLevel(chatbotError.severity),
      message: chatbotError.message,
      extra: {
        type: chatbotError.type,
        metadata: chatbotError.metadata,
        timestamp: chatbotError.timestamp
      },
      tags: {
        service: 'telekiosk-chatbot',
        severity: chatbotError.severity,
        errorType: chatbotError.type
      }
    };

    // Simulate sending to monitoring service
    console.log('📊 Monitoring Service:', monitoringData);
  },

  /**
   * Log interaction for audit trail
   */
  logInteraction: (userId, message, response, success, metadata = {}) => {
    const logEntry = {
      userId: this.hashUserId(userId),
      messageLength: message?.length || 0,
      responseGenerated: !!response,
      responseLength: response?.length || 0,
      success: success,
      timestamp: new Date().toISOString(),
      sessionId: metadata.sessionId,
      model: metadata.model,
      responseTime: metadata.responseTime,
      tokenUsage: metadata.tokenUsage
    };

    // Send to analytics (without sensitive content)
    analyticsService.track('chatbot_interaction', logEntry);

    // Log to audit trail
    if (!success) {
      console.warn('⚠️ Failed interaction:', logEntry);
    }
  },

  /**
   * Create user-friendly error response
   */
  createErrorResponse: (chatbotError) => {
    const response = {
      error: chatbotError.userFriendlyMessage,
      success: false,
      code: chatbotError.type,
      severity: chatbotError.severity,
      metadata: {
        timestamp: chatbotError.timestamp,
        canRetry: this.canRetry(chatbotError.type),
        helpInfo: this.getHelpInfo(chatbotError.type)
      }
    };

    // Add retry information for rate limits
    if (chatbotError.type === 'RATE_LIMIT') {
      response.retryAfter = chatbotError.metadata?.retryAfter || 900; // 15 minutes default
    }

    return response;
  },

  /**
   * Determine if error is retryable
   */
  canRetry: (errorType) => {
    const retryableErrors = [
      'RATE_LIMIT',
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'API_UNAVAILABLE'
    ];
    return retryableErrors.includes(errorType);
  },

  /**
   * Get help information for error types
   */
  getHelpInfo: (errorType) => {
    const helpInfo = {
      EMERGENCY_DETECTED: {
        action: 'Call emergency services immediately',
        phone: '999 or 193',
        hospitalPhone: '+233-599-211-311'
      },
      RATE_LIMIT: {
        action: 'Wait 15 minutes before trying again',
        alternative: 'Call hospital directly for urgent matters'
      },
      API_UNAVAILABLE: {
        action: 'Try again in a few minutes',
        alternative: 'Speak with hospital staff for immediate assistance'
      },
      NETWORK_ERROR: {
        action: 'Check your internet connection',
        alternative: 'Try refreshing the page'
      },
      DEFAULT: {
        action: 'Contact hospital staff for assistance',
        phone: '+233-599-211-311'
      }
    };

    return helpInfo[errorType] || helpInfo.DEFAULT;
  },

  /**
   * Get severity level for monitoring
   */
  getSeverityLevel: (severity) => {
    const levels = {
      low: 'info',
      medium: 'warning',
      high: 'error',
      critical: 'fatal'
    };
    return levels[severity] || 'error';
  },

  /**
   * Hash user ID for privacy
   */
  hashUserId: (userId) => {
    if (!userId) return 'anonymous';
    
    // Simple fallback hash for privacy
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return 'user_' + Math.abs(hash).toString(16).substring(0, 8);
  },

  /**
   * Recovery suggestions based on error type
   */
  getRecoverySuggestions: (errorType) => {
    const suggestions = {
      RATE_LIMIT: [
        'Wait 15 minutes before making another request',
        'For urgent matters, call the hospital directly',
        'Consider using simpler, shorter messages'
      ],
      API_UNAVAILABLE: [
        'Try again in a few minutes',
        'Check your internet connection',
        'Speak with hospital staff if urgent'
      ],
      NETWORK_ERROR: [
        'Check your internet connection',
        'Try refreshing the page',
        'Switch to mobile data if on WiFi'
      ],
      CONTENT_FILTER: [
        'Rephrase your message in simpler terms',
        'Focus on medical symptoms or hospital services',
        'Avoid using potentially sensitive language'
      ],
      EMERGENCY_DETECTED: [
        'Call 999 or 193 immediately',
        'Visit the Emergency Department',
        'Do not delay seeking medical attention'
      ]
    };

    return suggestions[errorType] || [
      'Try rephrasing your message',
      'Contact hospital staff for assistance',
      'Call +233-599-211-311 for immediate help'
    ];
  }
};

/**
 * Global error handler for unhandled errors
 */
export const setupGlobalErrorHandler = () => {
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('🚨 Uncaught Exception:', error);
    
    // Direct logging without creating chatbot error to avoid recursion
    console.error('Error details:', {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      timestamp: new Date().toISOString()
    });
    
    // Graceful shutdown in production
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
    const chatbotError = errorHandler.handleAPIError(
      new Error(reason), 
      'unhandledRejection'
    );
    errorHandler.logError(chatbotError);
  });
};

export default {
  ChatbotError,
  errorHandler,
  setupGlobalErrorHandler
};