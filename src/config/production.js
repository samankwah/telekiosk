/**
 * TeleKiosk Production Configuration - Phase 4 Implementation
 * Secure, HIPAA-compliant production settings
 */

// Environment validation
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'NODE_ENV',
  'PORT'
];

const optionalEnvVars = [
  'ENCRYPTION_KEY',
  'JWT_SECRET',
  'ALLOWED_ORIGINS',
  'MONITORING_API_KEY',
  'LOG_LEVEL'
];

// Validate required environment variables
const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Warn about optional variables
  const missingOptional = optionalEnvVars.filter(varName => !process.env[varName]);
  if (missingOptional.length > 0) {
    console.warn(`⚠️ Optional environment variables not set: ${missingOptional.join(', ')}`);
  }
};

// Validate environment on import
if (process.env.NODE_ENV === 'production') {
  validateEnvironment();
}

/**
 * Production configuration object
 */
export const productionConfig = {
  
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
    model: process.env.AI_MODEL || 'gpt-4o',
    maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 2000,
    temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.3,
    timeout: parseInt(process.env.AI_TIMEOUT) || 30000,
    
    // Realtime API settings
    realtime: {
      voice: process.env.AI_VOICE || 'alloy',
      sampleRate: parseInt(process.env.AUDIO_SAMPLE_RATE) || 24000,
      inputFormat: 'pcm16',
      outputFormat: 'pcm16'
    }
  },

  // Security Configuration
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY || 'generate-secure-key-in-production',
    jwtSecret: process.env.JWT_SECRET || 'generate-secure-jwt-secret',
    corsOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      'https://telekiosk.com',
      'https://www.telekiosk.com',
      'https://app.telekiosk.com'
    ],
    
    // Rate limiting
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    emergencyRateLimit: parseInt(process.env.EMERGENCY_RATE_LIMIT) || 10,
    
    // Session security
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 30 * 60 * 1000, // 30 minutes
    maxSessionsPerUser: parseInt(process.env.MAX_SESSIONS_PER_USER) || 3,
    
    // Content security
    maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH) || 2000,
    maxMessagesPerSession: parseInt(process.env.MAX_MESSAGES_PER_SESSION) || 50,
    
    // HIPAA compliance
    enablePHIDetection: process.env.ENABLE_PHI_DETECTION !== 'false',
    enableAuditLogging: process.env.ENABLE_AUDIT_LOGGING !== 'false',
    dataRetentionDays: parseInt(process.env.DATA_RETENTION_DAYS) || 90
  },

  // Server Configuration  
  server: {
    port: parseInt(process.env.PORT) || 3003,
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'production',
    trustProxy: process.env.TRUST_PROXY === 'true',
    
    // SSL/TLS settings
    enableHTTPS: process.env.ENABLE_HTTPS === 'true',
    sslCertPath: process.env.SSL_CERT_PATH,
    sslKeyPath: process.env.SSL_KEY_PATH,
    
    // Performance
    maxRequestSize: process.env.MAX_REQUEST_SIZE || '1mb',
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000
  },

  // Monitoring and Logging
  monitoring: {
    logLevel: process.env.LOG_LEVEL || 'error',
    enableAnalytics: process.env.ENABLE_ANALYTICS !== 'false',
    enableErrorTracking: process.env.ENABLE_ERROR_TRACKING !== 'false',
    enablePerformanceMonitoring: process.env.ENABLE_PERFORMANCE_MONITORING !== 'false',
    
    // Performance thresholds
    performanceThreshold: parseInt(process.env.PERFORMANCE_THRESHOLD) || 5000, // ms
    memoryThreshold: parseInt(process.env.MEMORY_THRESHOLD) || 512, // MB
    cpuThreshold: parseInt(process.env.CPU_THRESHOLD) || 80, // percent
    
    // External services
    sentryDsn: process.env.SENTRY_DSN,
    datadogApiKey: process.env.DATADOG_API_KEY,
    newRelicKey: process.env.NEW_RELIC_LICENSE_KEY
  },

  // Healthcare Features
  features: {
    voiceEnabled: process.env.ENABLE_VOICE !== 'false',
    realtimeVoiceEnabled: process.env.ENABLE_REALTIME_VOICE !== 'false',
    emergencyDetection: process.env.ENABLE_EMERGENCY_DETECTION !== 'false',
    multiLanguage: process.env.ENABLE_MULTI_LANGUAGE !== 'false',
    appointmentBooking: process.env.ENABLE_APPOINTMENT_BOOKING !== 'false',
    analyticsEnabled: process.env.ENABLE_ANALYTICS !== 'false',
    
    // Language settings
    supportedLanguages: (process.env.SUPPORTED_LANGUAGES || 'en,tw,ga,ew').split(','),
    defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
    enableAutoDetection: process.env.ENABLE_LANGUAGE_AUTO_DETECTION !== 'false'
  },

  // Database Configuration (if needed)
  database: {
    enabled: process.env.ENABLE_DATABASE === 'true',
    connectionString: process.env.DATABASE_URL,
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS) || 10,
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 5000,
    
    // Data retention
    enableChatHistory: process.env.ENABLE_CHAT_HISTORY === 'true',
    chatHistoryRetentionDays: parseInt(process.env.CHAT_HISTORY_RETENTION_DAYS) || 30
  },

  // Email Configuration
  email: {
    provider: process.env.EMAIL_PROVIDER || 'resend',
    apiKey: process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY,
    fromEmail: process.env.FROM_EMAIL || 'noreply@telekiosk.com',
    hospitalEmail: process.env.HOSPITAL_EMAIL || 'admin@telekiosk.com',
    
    // Templates
    enableEmailTemplates: process.env.ENABLE_EMAIL_TEMPLATES !== 'false',
    templateVersion: process.env.EMAIL_TEMPLATE_VERSION || 'v1'
  },

  // Cache Configuration
  cache: {
    enabled: process.env.ENABLE_CACHE !== 'false',
    provider: process.env.CACHE_PROVIDER || 'memory', // memory, redis
    ttl: parseInt(process.env.CACHE_TTL) || 300, // 5 minutes
    maxSize: parseInt(process.env.CACHE_MAX_SIZE) || 100,
    
    // Redis settings (if using Redis)
    redisUrl: process.env.REDIS_URL,
    redisPassword: process.env.REDIS_PASSWORD
  },

  // Integration Settings
  integrations: {
    // Hospital management system
    hms: {
      enabled: process.env.ENABLE_HMS_INTEGRATION === 'true',
      apiUrl: process.env.HMS_API_URL,
      apiKey: process.env.HMS_API_KEY
    },
    
    // Payment systems
    payment: {
      enabled: process.env.ENABLE_PAYMENT_INTEGRATION === 'true',
      provider: process.env.PAYMENT_PROVIDER || 'stripe',
      publicKey: process.env.PAYMENT_PUBLIC_KEY,
      secretKey: process.env.PAYMENT_SECRET_KEY
    },
    
    // WhatsApp integration
    whatsapp: {
      enabled: process.env.ENABLE_WHATSAPP === 'true',
      apiKey: process.env.WHATSAPP_API_KEY,
      phoneNumber: process.env.WHATSAPP_PHONE_NUMBER
    }
  }
};

/**
 * Development configuration (fallback)
 */
export const developmentConfig = {
  ...productionConfig,
  
  // Override security settings for development
  security: {
    ...productionConfig.security,
    corsOrigins: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080'
    ],
    rateLimitMax: 1000, // More generous for development
    enablePHIDetection: false, // Disable for easier testing
    enableAuditLogging: false
  },
  
  // Development monitoring
  monitoring: {
    ...productionConfig.monitoring,
    logLevel: 'debug',
    enableAnalytics: false,
    enableErrorTracking: false
  }
};

/**
 * Get configuration based on environment
 */
export const getConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const config = isProduction ? productionConfig : developmentConfig;
  
  // Validate configuration
  validateConfig(config);
  
  return config;
};

/**
 * Validate configuration object
 */
const validateConfig = (config) => {
  // Check OpenAI configuration - only required in production
  if (!config.openai.apiKey && process.env.NODE_ENV === 'production') {
    throw new Error('OpenAI API key is required in production');
  }
  
  if (config.openai.apiKey && config.openai.apiKey.startsWith('sk-') && config.openai.apiKey.length < 20) {
    console.warn('⚠️ OpenAI API key appears to be invalid');
  }
  
  if (!config.openai.apiKey) {
    console.warn('⚠️ OpenAI API key not set - some features will be disabled');
  }
  
  // Check security settings
  if (config.security.encryptionKey === 'generate-secure-key-in-production' && 
      process.env.NODE_ENV === 'production') {
    console.warn('⚠️ Using default encryption key in production - generate a secure key');
  }
  
  // Check CORS origins in production
  if (process.env.NODE_ENV === 'production' && 
      config.security.corsOrigins.some(origin => origin.includes('localhost'))) {
    console.warn('⚠️ Localhost origins detected in production CORS settings');
  }
};

/**
 * Environment-specific defaults
 */
export const environmentDefaults = {
  development: {
    logLevel: 'debug',
    enableAnalytics: false,
    enablePHIDetection: false,
    rateLimitMax: 1000
  },
  
  staging: {
    logLevel: 'info',
    enableAnalytics: true,
    enablePHIDetection: true,
    rateLimitMax: 500
  },
  
  production: {
    logLevel: 'error',
    enableAnalytics: true,
    enablePHIDetection: true,
    rateLimitMax: 100
  }
};

/**
 * Health check configuration
 */
export const healthCheckConfig = {
  enabled: process.env.ENABLE_HEALTH_CHECK !== 'false',
  endpoint: process.env.HEALTH_CHECK_ENDPOINT || '/api/health',
  timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 5000,
  
  checks: {
    openai: process.env.HEALTH_CHECK_OPENAI !== 'false',
    database: process.env.HEALTH_CHECK_DATABASE === 'true',
    cache: process.env.HEALTH_CHECK_CACHE !== 'false',
    memory: process.env.HEALTH_CHECK_MEMORY !== 'false'
  }
};

export default {
  productionConfig,
  developmentConfig,
  getConfig,
  validateEnvironment,
  environmentDefaults,
  healthCheckConfig
};