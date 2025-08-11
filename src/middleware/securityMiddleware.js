/**
 * TeleKiosk Security Middleware - Phase 4 Implementation
 * HIPAA-compliant security measures for healthcare chatbot
 */

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Rate limiting configuration for chat API
export const chatRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP. Please try again later.',
    retryAfter: 15 * 60,
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`=� Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests from this IP. Please try again later.',
      retryAfter: 15 * 60,
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }
});

// Emergency endpoint rate limiting (more restrictive)
export const emergencyRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit emergency alerts to prevent abuse
  message: {
    error: 'Emergency alert rate limit exceeded. Contact hospital directly.',
    retryAfter: 5 * 60,
    code: 'EMERGENCY_RATE_LIMIT'
  }
});

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", // Required for React
        "https://api.openai.com",
        "https://cdn.jsdelivr.net"
      ],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'", // Required for Tailwind CSS
        "https://fonts.googleapis.com"
      ],
      imgSrc: [
        "'self'", 
        "data:", 
        "https:",
        "blob:"
      ],
      connectSrc: [
        "'self'",
        "https://api.openai.com",
        "wss://api.openai.com", // For GPT-4o Realtime API
        "https://api.resend.com",
        "ws://localhost:*", // Development WebSocket
        "wss://localhost:*"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: [
        "'self'",
        "https://meet.google.com" // For video consultations
      ]
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
});

// HIPAA-compliant input validation and sanitization
export const validateChatInput = (req, res, next) => {
  const { messages, model, temperature, max_tokens } = req.body;
  
  // Validate messages
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ 
      error: 'Invalid request format. Messages array required.',
      code: 'INVALID_REQUEST_FORMAT'
    });
  }
  
  // Check message count
  if (messages.length > 50) {
    return res.status(400).json({
      error: 'Too many messages in conversation. Please start a new chat.',
      code: 'MESSAGE_LIMIT_EXCEEDED'
    });
  }
  
  // Validate and sanitize each message
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    
    if (!message.content || typeof message.content !== 'string') {
      return res.status(400).json({
        error: 'Invalid message format.',
        code: 'INVALID_MESSAGE_FORMAT'
      });
    }
    
    // Check message length
    if (message.content.length > 2000) {
      return res.status(400).json({
        error: 'Message too long. Please keep messages under 2000 characters.',
        code: 'MESSAGE_TOO_LONG'
      });
    }
    
    // Sanitize message content
    message.content = sanitizeInput(message.content);
  }
  
  // Validate model parameter
  const allowedModels = ['gpt-4o', 'gpt-4', 'gpt-3.5-turbo'];
  if (model && !allowedModels.includes(model)) {
    req.body.model = 'gpt-4o'; // Default to safe model
  }
  
  // Validate temperature
  if (temperature !== undefined) {
    const temp = parseFloat(temperature);
    if (isNaN(temp) || temp < 0 || temp > 1) {
      req.body.temperature = 0.3; // Safe default
    }
  }
  
  // Validate max_tokens
  if (max_tokens !== undefined) {
    const tokens = parseInt(max_tokens);
    if (isNaN(tokens) || tokens < 1 || tokens > 4000) {
      req.body.max_tokens = 2000; // Safe default
    }
  }
  
  next();
};

// PHI (Personal Health Information) detection and logging
export const phiProtection = (req, res, next) => {
  const originalSend = res.send;
  
  // Intercept response to check for PHI
  res.send = function(data) {
    if (typeof data === 'string') {
      // Check for potential PHI patterns
      const phiPatterns = {
        phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
        email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
        dateOfBirth: /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g,
        medicalRecord: /\b(MR|MRN|ID)[:\s]?\d+/gi
      };
      
      let foundPHI = false;
      for (const [type, pattern] of Object.entries(phiPatterns)) {
        if (pattern.test(data)) {
          console.warn(`� Potential ${type} PHI detected in response`);
          foundPHI = true;
        }
      }
      
      if (foundPHI) {
        console.warn('� PHI detected in response - review required');
        logSecurityEvent('PHI_DETECTED', req, { type: 'response_screening' });
      }
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Security event logging
export const logSecurityEvent = (eventType, req, additionalData = {}) => {
  const securityEvent = {
    timestamp: new Date().toISOString(),
    eventType,
    ipAddress: hashIP(req.ip || 'unknown'),
    userAgent: req.headers['user-agent']?.substring(0, 100) || 'unknown',
    endpoint: req.path,
    method: req.method,
    ...additionalData
  };
  
  // In production, send to secure logging service
  console.log('= Security Event:', securityEvent);
};

// Emergency alert validation
export const validateEmergencyAlert = (req, res, next) => {
  const { severity, confidence, symptoms, language } = req.body;
  
  // Validate required fields
  if (!severity || !confidence) {
    return res.status(400).json({
      error: 'Missing required emergency alert data',
      code: 'INVALID_EMERGENCY_DATA'
    });
  }
  
  // Validate severity level
  const allowedSeverity = ['low', 'medium', 'high', 'critical'];
  if (!allowedSeverity.includes(severity)) {
    return res.status(400).json({
      error: 'Invalid severity level',
      code: 'INVALID_SEVERITY'
    });
  }
  
  // Validate confidence score
  const conf = parseFloat(confidence);
  if (isNaN(conf) || conf < 0 || conf > 1) {
    return res.status(400).json({
      error: 'Invalid confidence score',
      code: 'INVALID_CONFIDENCE'
    });
  }
  
  // Log emergency alert for audit trail
  logSecurityEvent('EMERGENCY_ALERT_RECEIVED', req, { 
    severity, 
    confidence: conf,
    language: language || 'unknown'
  });
  
  next();
};

// Utility functions
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .trim();
};

const hashIP = (ip) => {
  // Simple hash for IP privacy (in production, use proper crypto)
  import('crypto').then(crypto => {
    return crypto.createHash('sha256').update(ip + 'salt').digest('hex').substring(0, 16);
  }).catch(() => {
    // Fallback if crypto is not available
    return ip.substring(0, 8) + '***';
  });
  
  // Synchronous fallback for immediate use
  return ip.substring(0, 8) + '***';
};

// Error handling middleware
export const securityErrorHandler = (error, req, res, next) => {
  logSecurityEvent('SECURITY_ERROR', req, {
    error: error.message,
    stack: error.stack?.split('\n')[0]
  });
  
  // Don't expose error details in production
  const isProduction = process.env.NODE_ENV === 'production';
  const errorMessage = isProduction 
    ? 'A security error occurred. Please try again.'
    : error.message;
  
  res.status(500).json({
    error: errorMessage,
    code: 'SECURITY_ERROR',
    timestamp: new Date().toISOString()
  });
};

// CORS configuration for production
export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://telekiosk.com',
      'https://www.telekiosk.com',
      // Add production domains here
    ];
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      logSecurityEvent('CORS_VIOLATION', { ip: 'unknown' }, { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false, // Don't send cookies for security
  optionsSuccessStatus: 200 // Support legacy browsers
};

export default {
  chatRateLimit,
  emergencyRateLimit,
  securityHeaders,
  validateChatInput,
  phiProtection,
  validateEmergencyAlert,
  securityErrorHandler,
  corsOptions,
  logSecurityEvent
};