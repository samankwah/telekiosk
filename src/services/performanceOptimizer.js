// Phase 3: Performance Optimization Service
// Advanced performance optimization with intelligent caching, request deduplication,
// and healthcare-specific optimizations for TeleKiosk Hospital

import { intelligentCacheService } from './intelligentCacheService.js';
import { analyticsService } from './analyticsService.js';

class PerformanceOptimizer {
  constructor() {
    // Request deduplication
    this.activeRequests = new Map();
    this.requestQueue = new Map();
    
    // Performance monitoring
    this.performanceMetrics = {
      requestsOptimized: 0,
      duplicateRequestsSaved: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      bandwidthSaved: 0,
      totalRequests: 0
    };

    // Optimization strategies
    this.strategies = {
      caching: true,
      deduplication: true,
      compression: true,
      prefetching: true,
      batchRequests: true,
      adaptiveLoading: true
    };

    // Healthcare-specific performance priorities
    this.healthcarePriorities = {
      emergency: 1,     // Highest priority - no delays
      medical: 2,       // High priority - minimal delays
      appointment: 3,   // Medium priority - some optimization
      general: 4,       // Normal priority - full optimization
      analytics: 5      // Lowest priority - maximum optimization
    };

    // Request patterns for intelligent batching
    this.batchPatterns = {
      medical_queries: {
        maxBatchSize: 3,
        maxWaitTime: 100, // 100ms max wait for emergency contexts
        priority: this.healthcarePriorities.medical
      },
      language_translations: {
        maxBatchSize: 5,
        maxWaitTime: 200,
        priority: this.healthcarePriorities.general
      },
      analytics_events: {
        maxBatchSize: 10,
        maxWaitTime: 1000, // 1 second wait for analytics
        priority: this.healthcarePriorities.analytics
      }
    };

    // Initialize performance monitoring
    this.initializePerformanceMonitoring();
    
    console.log('⚡ Performance Optimizer initialized with healthcare priorities');
  }

  /**
   * Optimized API request wrapper with intelligent caching and deduplication
   */
  async optimizedRequest(url, options = {}) {
    const requestStart = Date.now();
    const requestKey = this.generateRequestKey(url, options);
    const priority = options.priority || this.determinePriority(url, options);
    
    try {
      // Skip optimization for emergency requests
      if (priority === this.healthcarePriorities.emergency) {
        return await this.directRequest(url, options);
      }

      // Check cache first
      if (this.strategies.caching && (options.method || 'GET') === 'GET') {
        const cached = await intelligentCacheService.get(requestKey);
        if (cached) {
          this.updateMetrics('cache_hit', requestStart);
          return cached;
        }
      }

      // Check for duplicate requests
      if (this.strategies.deduplication && this.activeRequests.has(requestKey)) {
        console.log('🔄 Deduplicating request:', requestKey);
        return await this.activeRequests.get(requestKey);
      }

      // Create optimized request
      const requestPromise = this.executeOptimizedRequest(url, options, priority);
      
      // Track active request for deduplication
      this.activeRequests.set(requestKey, requestPromise);
      
      const result = await requestPromise;
      
      // Cache successful GET requests
      if (this.strategies.caching && (options.method || 'GET') === 'GET' && result) {
        const cacheOptions = this.getCacheOptionsForRequest(url, options);
        await intelligentCacheService.set(requestKey, result, cacheOptions);
      }
      
      // Clean up
      this.activeRequests.delete(requestKey);
      
      this.updateMetrics('request_completed', requestStart);
      return result;
      
    } catch (error) {
      this.activeRequests.delete(requestKey);
      this.updateMetrics('request_failed', requestStart);
      throw error;
    }
  }

  /**
   * Execute optimized request with compression and adaptive loading
   */
  async executeOptimizedRequest(url, options, priority) {
    // Apply compression if enabled
    if (this.strategies.compression && options.body) {
      options.headers = { ...options.headers };
      options.headers['Content-Encoding'] = 'gzip';
      // In production, actually compress the body
    }

    // Apply adaptive loading based on priority
    if (this.strategies.adaptiveLoading && priority > this.healthcarePriorities.medical) {
      // Add small delay for non-critical requests to batch them
      await this.adaptiveDelay(priority);
    }

    // Execute request
    return await this.directRequest(url, options);
  }

  /**
   * Direct request without optimization (for emergencies)
   */
  async directRequest(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Batch multiple requests intelligently
   */
  async batchRequests(requests, batchType = 'general') {
    if (!this.strategies.batchRequests || requests.length <= 1) {
      return Promise.all(requests.map(req => this.optimizedRequest(req.url, req.options)));
    }

    const batchConfig = this.batchPatterns[batchType] || {
      maxBatchSize: 5,
      maxWaitTime: 500,
      priority: this.healthcarePriorities.general
    };

    // Skip batching for high priority requests
    if (batchConfig.priority <= this.healthcarePriorities.medical) {
      return Promise.all(requests.map(req => this.optimizedRequest(req.url, req.options)));
    }

    console.log(`📦 Batching ${requests.length} ${batchType} requests`);
    
    // Group requests into batches
    const batches = [];
    for (let i = 0; i < requests.length; i += batchConfig.maxBatchSize) {
      batches.push(requests.slice(i, i + batchConfig.maxBatchSize));
    }

    // Execute batches with controlled timing
    const results = [];
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(req => this.optimizedRequest(req.url, req.options))
      );
      results.push(...batchResults);
      
      // Small delay between batches (except for critical requests)
      if (batchConfig.priority > this.healthcarePriorities.medical) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    this.performanceMetrics.requestsOptimized += requests.length;
    
    return results;
  }

  /**
   * Smart prefetching based on user behavior and healthcare patterns
   */
  async smartPrefetch(context = {}) {
    if (!this.strategies.prefetching) return;

    const prefetchPromises = [];

    try {
      // Healthcare-specific prefetching patterns
      if (context.type === 'appointment') {
        prefetchPromises.push(
          this.prefetchHealthcareData('appointment_templates'),
          this.prefetchHealthcareData('available_doctors'),
          this.prefetchHealthcareData('appointment_slots')
        );
      } else if (context.type === 'emergency') {
        prefetchPromises.push(
          this.prefetchHealthcareData('emergency_protocols'),
          this.prefetchHealthcareData('emergency_contacts'),
          this.prefetchHealthcareData('hospital_directions')
        );
      } else if (context.type === 'medical_query') {
        prefetchPromises.push(
          this.prefetchHealthcareData('common_symptoms'),
          this.prefetchHealthcareData('medical_terminology'),
          this.prefetchHealthcareData('healthcare_services')
        );
      }

      // Language-specific prefetching
      if (context.language && context.language !== 'en') {
        prefetchPromises.push(
          this.prefetchLanguageData(context.language)
        );
      }

      await Promise.all(prefetchPromises);
      console.log(`🚀 Prefetched ${prefetchPromises.length} resources for ${context.type || 'general'}`);
      
    } catch (error) {
      console.warn('⚠️ Prefetch partially failed:', error);
    }
  }

  /**
   * Prefetch healthcare-specific data
   */
  async prefetchHealthcareData(dataType) {
    const cacheKey = `prefetch_${dataType}`;
    
    // Check if already cached
    const cached = await intelligentCacheService.get(cacheKey);
    if (cached) return cached;

    // Simulate fetching healthcare data
    const data = await this.fetchHealthcareData(dataType);
    
    // Cache with appropriate settings
    await intelligentCacheService.set(cacheKey, data, {
      category: 'medical_responses',
      ttl: 30 * 60 * 1000 // 30 minutes
    });

    return data;
  }

  /**
   * Prefetch language-specific data
   */
  async prefetchLanguageData(language) {
    const cacheKey = `prefetch_language_${language}`;
    
    const cached = await intelligentCacheService.get(cacheKey);
    if (cached) return cached;

    // Simulate fetching language data
    const data = await this.fetchLanguageData(language);
    
    await intelligentCacheService.set(cacheKey, data, {
      category: 'language_models',
      ttl: 2 * 60 * 60 * 1000 // 2 hours
    });

    return data;
  }

  /**
   * Optimize images and media for healthcare applications
   */
  async optimizeMedia(mediaUrl, options = {}) {
    const cacheKey = `media_${mediaUrl}_${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = await intelligentCacheService.get(cacheKey);
    if (cached) return cached;

    try {
      // For medical images, maintain quality but optimize size
      const optimizationLevel = options.medical ? 'high_quality' : 'standard';
      
      // Simulate media optimization
      const optimized = await this.processMediaOptimization(mediaUrl, optimizationLevel);
      
      // Cache optimized media
      await intelligentCacheService.set(cacheKey, optimized, {
        category: options.medical ? 'medical_responses' : 'general',
        ttl: 24 * 60 * 60 * 1000 // 24 hours
      });

      return optimized;
      
    } catch (error) {
      console.warn('⚠️ Media optimization failed:', error);
      return mediaUrl; // Return original on failure
    }
  }

  /**
   * Adaptive delay based on request priority
   */
  async adaptiveDelay(priority) {
    const delays = {
      [this.healthcarePriorities.emergency]: 0,      // No delay
      [this.healthcarePriorities.medical]: 10,       // 10ms
      [this.healthcarePriorities.appointment]: 50,   // 50ms
      [this.healthcarePriorities.general]: 100,      // 100ms
      [this.healthcarePriorities.analytics]: 200     // 200ms
    };

    const delay = delays[priority] || 100;
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  /**
   * Generate unique request key for deduplication
   */
  generateRequestKey(url, options) {
    const key = `${options.method || 'GET'}_${url}_${JSON.stringify(options.body || {})}`;
    return key.replace(/\s+/g, '_').substring(0, 100); // Limit key length
  }

  /**
   * Determine request priority from URL and context
   */
  determinePriority(url, options) {
    if (url.includes('emergency') || options.emergency) {
      return this.healthcarePriorities.emergency;
    }
    if (url.includes('medical') || url.includes('symptom') || url.includes('diagnosis')) {
      return this.healthcarePriorities.medical;
    }
    if (url.includes('appointment') || url.includes('booking')) {
      return this.healthcarePriorities.appointment;
    }
    if (url.includes('analytics') || url.includes('tracking')) {
      return this.healthcarePriorities.analytics;
    }
    
    return this.healthcarePriorities.general;
  }

  /**
   * Get cache options based on request type
   */
  getCacheOptionsForRequest(url, options) {
    if (url.includes('emergency')) {
      return { category: 'emergency_protocols', ttl: 60 * 60 * 1000 }; // 1 hour
    }
    if (url.includes('medical') || url.includes('health')) {
      return { category: 'medical_responses', ttl: 30 * 60 * 1000 }; // 30 minutes
    }
    if (url.includes('appointment')) {
      return { category: 'appointment_data', ttl: 15 * 60 * 1000 }; // 15 minutes
    }
    if (url.includes('language') || url.includes('translation')) {
      return { category: 'language_models', ttl: 2 * 60 * 60 * 1000 }; // 2 hours
    }
    
    return { category: 'ai_responses', ttl: 10 * 60 * 1000 }; // 10 minutes default
  }

  /**
   * Simulate healthcare data fetching
   */
  async fetchHealthcareData(dataType) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const mockData = {
      appointment_templates: { templates: ['general', 'specialist', 'emergency'] },
      available_doctors: { doctors: ['Dr. Smith', 'Dr. Johnson', 'Dr. Brown'] },
      appointment_slots: { slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      emergency_protocols: { protocols: ['call_999', 'first_aid', 'hospital_contact'] },
      emergency_contacts: { contacts: ['+233-599-211-311', '999', '193'] },
      hospital_directions: { directions: 'Liberation Road, Airport Residential Area, Accra' },
      common_symptoms: { symptoms: ['headache', 'fever', 'cough', 'chest_pain'] },
      medical_terminology: { terms: ['diagnosis', 'treatment', 'medication', 'therapy'] },
      healthcare_services: { services: ['cardiology', 'pediatrics', 'neurology'] }
    };

    return mockData[dataType] || { data: 'placeholder' };
  }

  /**
   * Simulate language data fetching
   */
  async fetchLanguageData(language) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return {
      language: language,
      phrases: ['hello', 'goodbye', 'help', 'emergency'],
      medical_terms: ['doctor', 'hospital', 'medicine', 'pain']
    };
  }

  /**
   * Simulate media optimization processing
   */
  async processMediaOptimization(mediaUrl, level) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      originalUrl: mediaUrl,
      optimizedUrl: mediaUrl.replace(/\.(jpg|jpeg|png)$/, '_optimized.$1'),
      optimizationLevel: level,
      sizeReduction: '35%'
    };
  }

  /**
   * Update performance metrics
   */
  updateMetrics(operation, startTime) {
    const duration = Date.now() - startTime;
    this.performanceMetrics.totalRequests++;

    switch (operation) {
      case 'cache_hit':
        this.performanceMetrics.cacheHitRate = 
          (this.performanceMetrics.cacheHitRate + 100) / 2; // Running average
        this.performanceMetrics.bandwidthSaved += 1024; // Estimate
        break;
      case 'request_completed':
        this.performanceMetrics.averageResponseTime = 
          (this.performanceMetrics.averageResponseTime + duration) / 2;
        break;
      case 'request_failed':
        // Track failures for monitoring
        break;
    }
  }

  /**
   * Initialize performance monitoring
   */
  initializePerformanceMonitoring() {
    // Monitor performance every 30 seconds
    setInterval(() => {
      this.reportPerformanceMetrics();
    }, 30000);

    // Cleanup old requests every 5 minutes
    setInterval(() => {
      this.cleanupActiveRequests();
    }, 5 * 60 * 1000);
  }

  /**
   * Report performance metrics to analytics
   */
  reportPerformanceMetrics() {
    const cacheStats = intelligentCacheService.getStats();
    
    analyticsService.trackEvent('performance_optimization_metrics', {
      ...this.performanceMetrics,
      cacheHitRate: parseFloat(cacheStats.performance.hitRate),
      memoryUsage: cacheStats.memory.currentUsage,
      activeRequests: this.activeRequests.size,
      timestamp: Date.now()
    });
  }

  /**
   * Cleanup stale active requests
   */
  cleanupActiveRequests() {
    const cutoff = Date.now() - (5 * 60 * 1000); // 5 minutes ago
    let cleaned = 0;

    for (const [key, promise] of this.activeRequests.entries()) {
      // Check if promise is resolved/rejected (simplified check)
      if (promise.timestamp && promise.timestamp < cutoff) {
        this.activeRequests.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} stale active requests`);
    }
  }

  /**
   * Get comprehensive performance statistics
   */
  getPerformanceStats() {
    const cacheStats = intelligentCacheService.getStats();
    
    return {
      requests: this.performanceMetrics,
      cache: cacheStats,
      optimization: {
        strategiesEnabled: Object.entries(this.strategies)
          .filter(([_, enabled]) => enabled)
          .map(([strategy]) => strategy),
        activeRequestsCount: this.activeRequests.size,
        healthcarePrioritiesActive: true,
        batchingEnabled: this.strategies.batchRequests
      },
      health: {
        status: this.performanceMetrics.averageResponseTime > 2000 ? 'SLOW' : 'HEALTHY',
        cacheHealthy: parseFloat(cacheStats.performance.hitRate) > 70,
        memoryUsage: cacheStats.memory.utilizationPercent
      }
    };
  }

  /**
   * Emergency performance mode - disable optimizations for critical situations
   */
  enableEmergencyMode() {
    console.log('🚨 EMERGENCY PERFORMANCE MODE ACTIVATED');
    
    // Disable potentially slow optimizations
    this.strategies.batchRequests = false;
    this.strategies.adaptiveLoading = false;
    this.strategies.compression = false;
    
    // Clear non-emergency caches to free memory
    intelligentCacheService.clearCache('ai_responses');
    intelligentCacheService.clearCache('language_models');
    
    // Track emergency mode activation
    analyticsService.trackEvent('emergency_performance_mode', {
      timestamp: Date.now(),
      reason: 'emergency_detected'
    });
  }

  /**
   * Restore normal performance mode
   */
  disableEmergencyMode() {
    console.log('✅ Returning to normal performance mode');
    
    // Re-enable all optimizations
    this.strategies.batchRequests = true;
    this.strategies.adaptiveLoading = true;
    this.strategies.compression = true;
    
    // Warm up caches again
    intelligentCacheService.warmupHealthcareCache();
  }
}

// Create and export singleton instance
export const performanceOptimizer = new PerformanceOptimizer();
export default performanceOptimizer;