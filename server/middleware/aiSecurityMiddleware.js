// AI Security Middleware for TeleKiosk Backend
// Provides comprehensive security, rate limiting, and monitoring for AI endpoints

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const winston = require('winston');

// Security logger
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/security.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});

class AISecurityMiddleware {
  constructor() {
    this.suspiciousPatterns = [
      // Injection attempts
      /SELECT.*FROM|DROP.*TABLE|INSERT.*INTO|UPDATE.*SET|DELETE.*FROM/i,
      /<script|javascript:|on\w+\s*=/i,
      /\{\{.*\}\}|<%.*%>/i,
      
      // Prompt injection patterns
      /ignore.*previous.*instructions/i,
      /system.*prompt|override.*settings/i,
      /pretend.*you.*are|act.*as.*if/i,
      /jailbreak|DAN|developer.*mode/i,
      
      // Malicious file patterns
      /\.exe|\.bat|\.cmd|\.scr|\.pif/i,
      /base64.*encoded|eval\(|function\(/i
    ];
    
    this.rateLimitConfigs = {
      general: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // requests per window
        message: 'Too many requests, please try again later',
        standardHeaders: true,
        legacyHeaders: false
      },
      ai: {
        windowMs: 5 * 60 * 1000, // 5 minutes
        max: 20, // AI requests per window
        message: 'AI request limit exceeded, please wait before trying again',
        standardHeaders: true,
        legacyHeaders: false
      },
      upload: {
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 10, // file uploads per window
        message: 'File upload limit exceeded',
        standardHeaders: true,
        legacyHeaders: false
      }
    };
  }

  /**
   * Initialize security middleware
   */
  initializeSecurity() {
    return [
      // Basic security headers
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            connectSrc: ["'self'", 'https://api.openai.com', 'https://api.anthropic.com', 'https://generativelanguage.googleapis.com']
          }
        },
        crossOriginEmbedderPolicy: false
      }),
      
      // Request ID for tracking
      this.addRequestId,
      
      // Security logging
      this.logSecurityEvents
    ];
  }

  /**
   * Add unique request ID
   */
  addRequestId(req, res, next) {
    req.requestId = crypto.randomUUID();
    res.setHeader('X-Request-ID', req.requestId);
    next();
  }

  /**
   * Log security events
   */
  logSecurityEvents(req, res, next) {
    const startTime = Date.now();
    
    // Log request
    securityLogger.info('Request received', {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    // Log response on finish
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      securityLogger.info('Request completed', {
        requestId: req.requestId,
        statusCode: res.statusCode,
        duration: duration,
        timestamp: new Date().toISOString()
      });
    });

    next();
  }

  /**
   * Rate limiting for different endpoint types
   */
  createRateLimit(type = 'general') {
    const config = this.rateLimitConfigs[type] || this.rateLimitConfigs.general;
    
    return rateLimit({
      ...config,
      keyGenerator: (req) => {
        // Use user ID if authenticated, otherwise IP
        return req.user?.id || req.ip;
      },
      handler: (req, res) => {
        securityLogger.warn('Rate limit exceeded', {
          requestId: req.requestId,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          endpoint: req.path,
          type: type
        });
        
        res.status(429).json({
          error: 'Rate limit exceeded',
          message: config.message,
          retryAfter: Math.ceil(config.windowMs / 1000)
        });
      }
    });
  }

  /**
   * JWT Authentication middleware
   */
  authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      securityLogger.warn('Missing authentication token', {
        requestId: req.requestId,
        ip: req.ip,
        endpoint: req.path
      });
      
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Access token is missing'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        securityLogger.warn('Invalid authentication token', {
          requestId: req.requestId,
          ip: req.ip,
          endpoint: req.path,
          error: err.message
        });
        
        return res.status(403).json({
          error: 'Authentication failed',
          message: 'Invalid or expired token'
        });
      }

      req.user = user;
      next();
    });
  }

  /**
   * Optional JWT authentication (allows anonymous access)
   */
  optionalJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (!err) {
          req.user = user;
        }
      });
    }

    next();
  }

  /**
   * Input validation and sanitization for AI requests
   */
  validateAIInput() {
    return [
      body('message')
        .trim()
        .isLength({ min: 1, max: 10000 })
        .withMessage('Message must be between 1 and 10000 characters')
        .custom(this.checkSuspiciousContent.bind(this)),
      
      body('language')
        .optional()
        .isIn(['en-GH', 'tw-GH', 'ee-GH', 'ga-GH', 'ha-GH'])
        .withMessage('Invalid language code'),
      
      body('model')
        .optional()
        .isIn(['gpt-4o', 'claude-sonnet', 'gemini-pro', 'auto'])
        .withMessage('Invalid AI model'),
      
      body('temperature')
        .optional()
        .isFloat({ min: 0, max: 2 })
        .withMessage('Temperature must be between 0 and 2'),
      
      body('maxTokens')
        .optional()
        .isInt({ min: 1, max: 4000 })
        .withMessage('Max tokens must be between 1 and 4000'),
      
      this.handleValidationErrors
    ];
  }

  /**
   * File upload validation
   */
  validateFileUpload() {
    return [
      body('fileType')
        .isIn(['image', 'audio', 'video', 'document'])
        .withMessage('Invalid file type'),
      
      body('fileName')
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Invalid file name')
        .custom((value) => {
          // Check for dangerous file extensions
          const dangerousExtensions = /\.(exe|bat|cmd|scr|pif|vbs|js|jar|app|deb|pkg|dmg)$/i;
          if (dangerousExtensions.test(value)) {
            throw new Error('File type not allowed');
          }
          return true;
        }),
      
      this.handleValidationErrors
    ];
  }

  /**
   * Check for suspicious content patterns
   */
  checkSuspiciousContent(value) {
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(value)) {
        securityLogger.warn('Suspicious content detected', {
          pattern: pattern.toString(),
          content: value.substring(0, 100) + '...',
          timestamp: new Date().toISOString()
        });
        throw new Error('Content contains potentially harmful patterns');
      }
    }
    return true;
  }

  /**
   * Handle validation errors
   */
  handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      securityLogger.warn('Input validation failed', {
        requestId: req.requestId,
        errors: errors.array(),
        ip: req.ip,
        endpoint: req.path
      });
      
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    next();
  }

  /**
   * Medical data encryption middleware
   */
  encryptMedicalData(req, res, next) {
    if (req.body && req.body.medicalData) {
      try {
        const key = process.env.MEDICAL_ENCRYPTION_KEY;
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipher('aes-256-gcm', key, iv);
        
        let encrypted = cipher.update(JSON.stringify(req.body.medicalData), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        req.body.encryptedMedicalData = {
          encrypted: encrypted,
          iv: iv.toString('hex'),
          authTag: authTag.toString('hex')
        };
        
        // Remove plain text medical data
        delete req.body.medicalData;
        
        securityLogger.info('Medical data encrypted', {
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        securityLogger.error('Medical data encryption failed', {
          requestId: req.requestId,
          error: error.message
        });
        
        return res.status(500).json({
          error: 'Data encryption failed'
        });
      }
    }
    
    next();
  }

  /**
   * HIPAA compliance checks
   */
  hipaaCompliance(req, res, next) {
    // Add HIPAA-required headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // Log medical data access
    if (req.path.includes('medical') || req.path.includes('patient')) {
      securityLogger.info('Medical data access', {
        requestId: req.requestId,
        userId: req.user?.id,
        endpoint: req.path,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });
    }
    
    next();
  }

  /**
   * AI model usage tracking and limiting
   */
  trackAIUsage(req, res, next) {
    const userId = req.user?.id || 'anonymous';
    const model = req.body.model || 'auto';
    const currentHour = new Date().getHours();
    const usageKey = `ai_usage:${userId}:${currentHour}`;
    
    // In production, use Redis for this
    if (!global.aiUsageTracking) {
      global.aiUsageTracking = new Map();
    }
    
    const currentUsage = global.aiUsageTracking.get(usageKey) || 0;
    const hourlyLimit = req.user ? 100 : 20; // Higher limit for authenticated users
    
    if (currentUsage >= hourlyLimit) {
      securityLogger.warn('AI usage limit exceeded', {
        requestId: req.requestId,
        userId: userId,
        currentUsage: currentUsage,
        limit: hourlyLimit
      });
      
      return res.status(429).json({
        error: 'AI usage limit exceeded',
        message: 'You have reached your hourly AI request limit',
        resetTime: new Date(Date.now() + (60 - new Date().getMinutes()) * 60 * 1000)
      });
    }
    
    // Increment usage
    global.aiUsageTracking.set(usageKey, currentUsage + 1);
    
    // Track the request details
    req.aiUsageTracking = {
      userId: userId,
      model: model,
      startTime: Date.now(),
      usageKey: usageKey
    };
    
    next();
  }

  /**
   * Content filtering for inappropriate requests
   */
  contentFilter(req, res, next) {
    const inappropriatePatterns = [
      /explicit|adult|nsfw|sexual|pornographic/i,
      /violence|harm|kill|suicide|self.*harm/i,
      /illegal|drugs|weapons|bomb|terrorist/i,
      /hate.*speech|racist|discriminatory/i
    ];
    
    const content = req.body.message || '';
    
    for (const pattern of inappropriatePatterns) {
      if (pattern.test(content)) {
        securityLogger.warn('Inappropriate content detected', {
          requestId: req.requestId,
          userId: req.user?.id,
          pattern: pattern.toString(),
          content: content.substring(0, 100) + '...'
        });
        
        return res.status(400).json({
          error: 'Content violation',
          message: 'Your request contains inappropriate content that violates our terms of service'
        });
      }
    }
    
    next();
  }

  /**
   * Audit trail middleware
   */
  auditTrail(req, res, next) {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log the response (without sensitive data)
      const responseData = typeof data === 'string' ? JSON.parse(data) : data;
      
      securityLogger.info('AI Request Audit', {
        requestId: req.requestId,
        userId: req.user?.id || 'anonymous',
        endpoint: req.path,
        method: req.method,
        responseStatus: res.statusCode,
        processingTime: Date.now() - (req.aiUsageTracking?.startTime || Date.now()),
        aiModel: req.body.model,
        inputLength: req.body.message?.length || 0,
        responseLength: typeof data === 'string' ? data.length : JSON.stringify(data).length,
        hasImages: !!(req.body.images && req.body.images.length > 0),
        timestamp: new Date().toISOString()
      });
      
      originalSend.call(this, data);
    };
    
    next();
  }

  /**
   * Emergency bypass for critical health situations
   */
  emergencyBypass(req, res, next) {
    const emergencyKeywords = [
      'emergency', 'urgent', 'critical', 'heart attack', 'stroke',
      'unconscious', 'not breathing', 'severe pain', 'overdose'
    ];
    
    const content = (req.body.message || '').toLowerCase();
    const isEmergency = emergencyKeywords.some(keyword => content.includes(keyword));
    
    if (isEmergency) {
      req.isEmergency = true;
      
      securityLogger.info('Emergency request detected', {
        requestId: req.requestId,
        userId: req.user?.id,
        content: content.substring(0, 200) + '...',
        timestamp: new Date().toISOString()
      });
      
      // Bypass some rate limits for emergency requests
      req.emergencyBypass = true;
    }
    
    next();
  }

  /**
   * Health check endpoint security
   */
  healthCheckSecurity(req, res, next) {
    // Only allow health checks from authorized sources
    const allowedIPs = process.env.HEALTH_CHECK_IPS?.split(',') || ['127.0.0.1'];
    
    if (!allowedIPs.includes(req.ip)) {
      return res.status(403).json({
        error: 'Unauthorized health check request'
      });
    }
    
    next();
  }

  /**
   * API key validation for external integrations
   */
  validateAPIKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({
        error: 'API key required'
      });
    }
    
    // Validate API key format and existence
    const validAPIKeys = process.env.VALID_API_KEYS?.split(',') || [];
    
    if (!validAPIKeys.includes(apiKey)) {
      securityLogger.warn('Invalid API key used', {
        requestId: req.requestId,
        ip: req.ip,
        apiKey: apiKey.substring(0, 8) + '***',
        timestamp: new Date().toISOString()
      });
      
      return res.status(403).json({
        error: 'Invalid API key'
      });
    }
    
    // Add API key info to request
    req.apiKey = apiKey;
    
    next();
  }

  /**
   * Security monitoring and alerting
   */
  securityMonitoring(req, res, next) {
    // Monitor for suspicious patterns
    const suspiciousIndicators = [
      req.headers['user-agent']?.includes('bot'),
      req.headers['user-agent']?.includes('crawler'),
      req.path.includes('..'),
      req.path.includes('%2e'),
      Object.keys(req.query).length > 20,
      req.body && JSON.stringify(req.body).length > 50000
    ];
    
    const suspiciousCount = suspiciousIndicators.filter(Boolean).length;
    
    if (suspiciousCount >= 2) {
      securityLogger.warn('Suspicious request detected', {
        requestId: req.requestId,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
        suspiciousIndicators: suspiciousCount,
        timestamp: new Date().toISOString()
      });
      
      // Add to suspicious IP tracking
      if (!global.suspiciousIPs) {
        global.suspiciousIPs = new Map();
      }
      
      const currentCount = global.suspiciousIPs.get(req.ip) || 0;
      global.suspiciousIPs.set(req.ip, currentCount + 1);
      
      // Block if too many suspicious requests
      if (currentCount > 10) {
        return res.status(429).json({
          error: 'Suspicious activity detected',
          message: 'Your IP has been temporarily blocked due to suspicious activity'
        });
      }
    }
    
    next();
  }
}

// Create and export singleton instance
const aiSecurityMiddleware = new AISecurityMiddleware();

module.exports = {
  aiSecurityMiddleware,
  initializeSecurity: aiSecurityMiddleware.initializeSecurity.bind(aiSecurityMiddleware),
  createRateLimit: aiSecurityMiddleware.createRateLimit.bind(aiSecurityMiddleware),
  authenticateJWT: aiSecurityMiddleware.authenticateJWT.bind(aiSecurityMiddleware),
  optionalJWT: aiSecurityMiddleware.optionalJWT.bind(aiSecurityMiddleware),
  validateAIInput: aiSecurityMiddleware.validateAIInput.bind(aiSecurityMiddleware),
  validateFileUpload: aiSecurityMiddleware.validateFileUpload.bind(aiSecurityMiddleware),
  encryptMedicalData: aiSecurityMiddleware.encryptMedicalData.bind(aiSecurityMiddleware),
  hipaaCompliance: aiSecurityMiddleware.hipaaCompliance.bind(aiSecurityMiddleware),
  trackAIUsage: aiSecurityMiddleware.trackAIUsage.bind(aiSecurityMiddleware),
  contentFilter: aiSecurityMiddleware.contentFilter.bind(aiSecurityMiddleware),
  auditTrail: aiSecurityMiddleware.auditTrail.bind(aiSecurityMiddleware),
  emergencyBypass: aiSecurityMiddleware.emergencyBypass.bind(aiSecurityMiddleware),
  healthCheckSecurity: aiSecurityMiddleware.healthCheckSecurity.bind(aiSecurityMiddleware),
  validateAPIKey: aiSecurityMiddleware.validateAPIKey.bind(aiSecurityMiddleware),
  securityMonitoring: aiSecurityMiddleware.securityMonitoring.bind(aiSecurityMiddleware)
};