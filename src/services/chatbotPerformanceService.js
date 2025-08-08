// Chatbot Performance Optimization Service
// Handles caching, request optimization, and performance monitoring

import { analyticsService } from './analyticsService';

class ChatbotPerformanceService {
  constructor() {
    this.cache = new Map();
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.performanceMetrics = {
      cacheHits: 0,
      cacheMisses: 0,
      requestsOptimized: 0,
      averageResponseTime: 0,
      totalRequests: 0
    };
    
    // Cache configuration
    this.cacheConfig = {
      maxSize: 100,
      ttl: 5 * 60 * 1000, // 5 minutes
      commonQueries: [
        'hospital hours',
        'visiting times',
        'contact information',
        'services offered',
        'location',
        'emergency number'
      ]
    };

    // Response templates for common queries
    this.responseTemplates = this.initializeResponseTemplates();
    
    // Initialize performance monitoring
    this.initializePerformanceMonitoring();
  }

  /**
   * Initialize response templates for common queries
   */
  initializeResponseTemplates() {
    return {
      'hospital_hours': {
        en: 'Our hospital is open Monday - Sunday, 8:00 AM - 8:00 PM for general services. Emergency services are available 24/7.',
        tw: 'Yɛn ayaresabea no bue Dwoada - Kwasida, anɔpa 8:00 - anwummɛrɛ 8:00 ma dwumadi a ɛyɛ amansan. Prɛko dwumadi wɔ hɔ berɛ biara.',
        ga: 'Yɛn ayarɛjɔɔ no bue Dwoada - Kɔsiɖa, ogbongbong 8:00 - fiɛfiɛ 8:00 ma dwumadi a ɛyɛ amansan. Prɛko yitsoo wɔ afii berɛ biara.',
        ee: 'Míaƒe kɔdzi la ʋu Dzoɖa - Kɔsiɖa, ŋdi 8:00 - fiẽ 8:00 na dɔwɔwɔ veveawo. Gatagbagba ƒe dɔwɔwɔ li ɣesiaɣi.'
      },
      'contact_info': {
        en: 'You can reach TeleKiosk Hospital at +233-599-211-311 or email us at info@telekiosk.com. For emergencies, call 999 or 193.',
        tw: 'Wobɛtumi afrɛ TeleKiosk Ayaresabea wɔ +233-599-211-311 anaa wo email yɛn wɔ info@telekiosk.com. Prɛko ho a, frɛ 999 anaa 193.',
        ga: 'Wobɛtumi afrɛ TeleKiosk Ayarɛjɔɔ wɔ +233-599-211-311 sane email yɛn wɔ info@telekiosk.com. Prɛko ho a, frɛ 999 sane 193.',
        ee: 'Àte ŋu ayɔ TeleKiosk Kɔdzi le +233-599-211-311 alo email mí le info@telekiosk.com. Na gatagbagbaawo la, yɔ 999 alo 193.'
      },
      'services': {
        en: 'We offer Cardiology ❤️, Pediatrics 👶, Dermatology ✨, Neurology 🧠, Orthopedics 🦴, and Emergency Medicine 🚨.',
        tw: 'Yɛwɔ Akoma ho adwuma ❤️, Mmɔfra ho adwuma 👶, Nhoma ho adwuma ✨, Amemene ho adwuma 🧠, Nnompe ho adwuma 🦴, ne Prɛko ho adwuma 🚨.',
        ga: 'Yɛwɔ Akoma ŋu yitsoo ❤️, Mmɔfra ŋu yitsoo 👶, Honam ŋu yitsoo ✨, Amemene ŋu yitsoo 🧠, Nnompe ŋu yitsoo 🦴, kɛ Prɛko ŋu yitsoo 🚨.',
        ee: 'Míewɔa dzi ƒe dɔ ❤️, ɖeviwo ƒe dɔ 👶, ŋutilã ƒe dɔ ✨, ta me ƒe dɔ 🧠, ƒuwo ƒe dɔ 🦴, kple gatagbagba ƒe dɔ 🚨.'
      },
      'location': {
        en: 'TeleKiosk Hospital is located at Liberation Road, Airport Residential Area, Accra, Ghana. You can find us near Kotoka International Airport.',
        tw: 'TeleKiosk Ayaresabea no wɔ Liberation Road, Airport Residential Area, Accra, Ghana. Wobɛtumi ahunu yɛn wɔ Kotoka International Airport nkyɛn.',
        ga: 'TeleKiosk Ayarɛjɔɔ no wɔ Liberation Road, Airport Residential Area, Accra, Ghana. Wobɛtumi ahunu yɛn wɔ Kotoka International Airport nkyɛn.',
        ee: 'TeleKiosk Kɔdzi la le Liberation Road, Airport Residential Area, Accra, Ghana. Àte ŋu akpɔ mí le Kotoka International Airport gbɔ.'
      }
    };
  }

  /**
   * Initialize performance monitoring
   */
  initializePerformanceMonitoring() {
    // Monitor cache performance
    setInterval(() => {
      this.analyzePerformanceMetrics();
    }, 60000); // Every minute

    // Clean expired cache entries
    setInterval(() => {
      this.cleanExpiredCache();
    }, 300000); // Every 5 minutes
  }

  /**
   * Optimize chat request with caching and preprocessing
   */
  async optimizeChatRequest(messages, options = {}) {
    const startTime = Date.now();
    
    try {
      // Extract user message
      const userMessage = messages[messages.length - 1];
      if (!userMessage || userMessage.role !== 'user') {
        return null; // No optimization possible
      }

      // Generate cache key
      const cacheKey = this.generateCacheKey(userMessage.content, options.language);
      
      // Check cache first
      const cachedResponse = this.getCachedResponse(cacheKey);
      if (cachedResponse) {
        this.performanceMetrics.cacheHits++;
        
        analyticsService.trackPerformance({
          type: 'cache_hit',
          value: Date.now() - startTime,
          context: 'chatbot_request'
        });

        return {
          optimized: true,
          cached: true,
          response: cachedResponse,
          responseTime: Date.now() - startTime
        };
      }

      this.performanceMetrics.cacheMisses++;

      // Check if it's a common query that can be templated
      const templateResponse = this.getTemplateResponse(userMessage.content, options.language);
      if (templateResponse) {
        // Cache the template response
        this.setCachedResponse(cacheKey, templateResponse);
        
        analyticsService.trackPerformance({
          type: 'template_response',
          value: Date.now() - startTime,
          context: 'chatbot_request'
        });

        return {
          optimized: true,
          templated: true,
          response: templateResponse,
          responseTime: Date.now() - startTime
        };
      }

      // Optimize message history (keep only relevant context)
      const optimizedMessages = this.optimizeMessageHistory(messages);
      
      // Add to request queue for batch processing if appropriate
      const shouldBatch = this.shouldBatchRequest(userMessage.content);
      if (shouldBatch && !options.urgent) {
        return this.addToRequestQueue(optimizedMessages, options);
      }

      this.performanceMetrics.requestsOptimized++;
      
      return {
        optimized: true,
        messages: optimizedMessages,
        options: this.optimizeRequestOptions(options),
        responseTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('❌ Request optimization failed:', error);
      analyticsService.trackError(error, { service: 'performanceOptimization' });
      return null;
    }
  }

  /**
   * Generate cache key for request
   */
  generateCacheKey(content, language = 'en') {
    const normalized = content.toLowerCase().trim().replace(/[^\w\s]/g, '');
    return `${language}:${normalized}`.substring(0, 100);
  }

  /**
   * Get cached response
   */
  getCachedResponse(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (!cached) return null;

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(cacheKey);
      return null;
    }

    return cached.response;
  }

  /**
   * Set cached response
   */
  setCachedResponse(cacheKey, response) {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.cacheConfig.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(cacheKey, {
      response,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.cacheConfig.ttl,
      hits: 0
    });
  }

  /**
   * Get template response for common queries
   */
  getTemplateResponse(content, language = 'en') {
    const normalized = content.toLowerCase();
    
    // Check for hospital hours
    if (normalized.includes('hour') || normalized.includes('time') || normalized.includes('open')) {
      return this.responseTemplates.hospital_hours[language] || this.responseTemplates.hospital_hours.en;
    }

    // Check for contact information
    if (normalized.includes('contact') || normalized.includes('phone') || normalized.includes('call')) {
      return this.responseTemplates.contact_info[language] || this.responseTemplates.contact_info.en;
    }

    // Check for services
    if (normalized.includes('service') || normalized.includes('department') || normalized.includes('specialist')) {
      return this.responseTemplates.services[language] || this.responseTemplates.services.en;
    }

    // Check for location
    if (normalized.includes('location') || normalized.includes('address') || normalized.includes('where')) {
      return this.responseTemplates.location[language] || this.responseTemplates.location.en;
    }

    return null;
  }

  /**
   * Optimize message history for better performance
   */
  optimizeMessageHistory(messages) {
    // Keep system prompt + last 5 messages for context
    const systemMessages = messages.filter(msg => msg.role === 'system');
    const userMessages = messages.filter(msg => msg.role !== 'system').slice(-5);
    
    return [...systemMessages, ...userMessages];
  }

  /**
   * Optimize request options
   */
  optimizeRequestOptions(options) {
    const optimized = { ...options };
    
    // Reduce max tokens for simple queries
    if (options.language && options.language !== 'en') {
      optimized.max_tokens = Math.min(options.max_tokens || 2000, 1500);
    }

    // Adjust temperature for consistent responses
    optimized.temperature = Math.min(options.temperature || 0.3, 0.3);

    return optimized;
  }

  /**
   * Determine if request should be batched
   */
  shouldBatchRequest(content) {
    // Don't batch emergency or urgent requests
    const urgentKeywords = ['emergency', 'urgent', 'help', 'pain', 'sick'];
    return !urgentKeywords.some(keyword => content.toLowerCase().includes(keyword));
  }

  /**
   * Add request to processing queue
   */
  async addToRequestQueue(messages, options) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        messages,
        options,
        resolve,
        reject,
        timestamp: Date.now()
      });

      // Process queue if not already processing
      if (!this.isProcessingQueue) {
        this.processRequestQueue();
      }
    });
  }

  /**
   * Process request queue in batch
   */
  async processRequestQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;

    try {
      // Process up to 3 requests simultaneously
      const batch = this.requestQueue.splice(0, 3);
      
      const promises = batch.map(async (request) => {
        try {
          // Simulate API call optimization here
          const result = {
            optimized: true,
            batched: true,
            messages: request.messages,
            options: request.options,
            responseTime: Math.random() * 1000 + 500 // Simulated
          };
          
          request.resolve(result);
        } catch (error) {
          request.reject(error);
        }
      });

      await Promise.all(promises);

      // Continue processing if more requests in queue
      if (this.requestQueue.length > 0) {
        setTimeout(() => {
          this.isProcessingQueue = false;
          this.processRequestQueue();
        }, 100);
      } else {
        this.isProcessingQueue = false;
      }

    } catch (error) {
      console.error('❌ Batch processing failed:', error);
      this.isProcessingQueue = false;
    }
  }

  /**
   * Clean expired cache entries
   */
  cleanExpiredCache() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
      analyticsService.trackPerformance({
        type: 'cache_cleanup',
        value: cleaned,
        context: 'maintenance'
      });
    }
  }

  /**
   * Analyze performance metrics
   */
  analyzePerformanceMetrics() {
    const metrics = this.getPerformanceMetrics();
    
    // Log performance summary
    console.log('⚡ Performance Summary:', {
      cacheHitRate: metrics.cacheHitRate,
      averageResponseTime: metrics.averageResponseTime,
      optimizationRate: metrics.optimizationRate
    });

    // Send to analytics
    analyticsService.trackPerformance({
      type: 'performance_summary',
      value: metrics.cacheHitRate,
      context: 'chatbot_optimization',
      metadata: metrics
    });

    // Auto-adjust cache size if needed
    if (metrics.cacheHitRate < 0.3 && this.cacheConfig.maxSize < 200) {
      this.cacheConfig.maxSize += 10;
      console.log(`📈 Increased cache size to ${this.cacheConfig.maxSize}`);
    }
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    const totalCacheRequests = this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses;
    
    return {
      cacheHitRate: totalCacheRequests > 0 ? (this.performanceMetrics.cacheHits / totalCacheRequests) : 0,
      cacheMissRate: totalCacheRequests > 0 ? (this.performanceMetrics.cacheMisses / totalCacheRequests) : 0,
      optimizationRate: this.performanceMetrics.totalRequests > 0 ? 
        (this.performanceMetrics.requestsOptimized / this.performanceMetrics.totalRequests) : 0,
      averageResponseTime: this.performanceMetrics.averageResponseTime,
      cacheSize: this.cache.size,
      queueLength: this.requestQueue.length,
      totalRequests: this.performanceMetrics.totalRequests,
      ...this.performanceMetrics
    };
  }

  /**
   * Pre-warm cache with common responses
   */
  preWarmCache() {
    const commonQueries = [
      { content: 'what are your hospital hours', language: 'en' },
      { content: 'how can I contact you', language: 'en' },
      { content: 'what services do you offer', language: 'en' },
      { content: 'where is the hospital located', language: 'en' },
      { content: 'ayaresabea no bue berɛ bɛn', language: 'tw' },
      { content: 'sɛn na metumi afrɛ mo', language: 'tw' }
    ];

    commonQueries.forEach(query => {
      const cacheKey = this.generateCacheKey(query.content, query.language);
      const response = this.getTemplateResponse(query.content, query.language);
      
      if (response) {
        this.setCachedResponse(cacheKey, response);
      }
    });

    console.log(`🔥 Pre-warmed cache with ${commonQueries.length} common responses`);
  }

  /**
   * Clear cache
   */
  clearCache() {
    const previousSize = this.cache.size;
    this.cache.clear();
    
    console.log(`🗑️ Cleared cache (${previousSize} entries)`);
    analyticsService.trackPerformance({
      type: 'cache_clear',
      value: previousSize,
      context: 'manual'
    });
  }

  /**
   * Get service status
   */
  getStatus() {
    const metrics = this.getPerformanceMetrics();
    
    return {
      initialized: true,
      cacheEnabled: true,
      batchProcessing: this.isProcessingQueue,
      metrics,
      cacheConfig: this.cacheConfig,
      capabilities: {
        responseCache: true,
        templateResponses: true,
        requestBatching: true,
        messageOptimization: true,
        performanceMonitoring: true
      }
    };
  }
}

// Create and export singleton instance
export const chatbotPerformanceService = new ChatbotPerformanceService();
export default chatbotPerformanceService;