// Intelligent Caching Service for TeleKiosk AI Assistant
// Phase 3: Performance Optimization Implementation

import { analyticsService } from './analyticsService.js';

/**
 * Advanced in-memory cache with TTL, LRU eviction, and analytics tracking
 */
class IntelligentCache {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 1000;
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000; // 5 minutes
    this.cache = new Map();
    this.accessTimes = new Map();
    this.hitCount = 0;
    this.missCount = 0;
    
    // Start cleanup interval
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 1000); // Cleanup every minute
  }

  /**
   * Generate cache key from messages and options
   */
  generateKey(messages, options = {}) {
    // Create a simplified key based on last few messages and key options
    const relevantMessages = messages.slice(-3); // Last 3 messages for context
    const keyData = {
      messages: relevantMessages.map(msg => ({
        role: msg.role,
        content: msg.content?.substring(0, 100) // First 100 chars
      })),
      language: options.language || 'en',
      model: options.model || 'gpt-4o'
    };
    
    return `chat_${this.hashCode(JSON.stringify(keyData))}`;
  }

  /**
   * Simple hash function for cache keys
   */
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get item from cache
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      this.missCount++;
      this.trackCacheEvent('miss', key);
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.accessTimes.delete(key);
      this.missCount++;
      this.trackCacheEvent('expired', key);
      return null;
    }

    // Update access time for LRU
    this.accessTimes.set(key, Date.now());
    this.hitCount++;
    this.trackCacheEvent('hit', key);
    
    return item.data;
  }

  /**
   * Set item in cache
   */
  set(key, data, customTTL = null) {
    const ttl = customTTL || this.defaultTTL;
    const expiresAt = Date.now() + ttl;
    
    // If cache is full, evict least recently used item
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      expiresAt,
      createdAt: Date.now()
    });
    
    this.accessTimes.set(key, Date.now());
    this.trackCacheEvent('set', key, { ttl, dataSize: JSON.stringify(data).length });
  }

  /**
   * Check if key exists and is not expired
   */
  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.accessTimes.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Evict least recently used item
   */
  evictLRU() {
    let lruKey = null;
    let lruTime = Date.now();

    for (const [key, accessTime] of this.accessTimes.entries()) {
      if (accessTime < lruTime) {
        lruTime = accessTime;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      this.accessTimes.delete(lruKey);
      this.trackCacheEvent('evict_lru', lruKey);
    }
  }

  /**
   * Clean up expired items
   */
  cleanup() {
    const now = Date.now();
    let expiredCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        this.accessTimes.delete(key);
        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      this.trackCacheEvent('cleanup', null, { expiredCount });
    }
  }

  /**
   * Track cache events for analytics
   */
  trackCacheEvent(event, key, metadata = {}) {
    analyticsService.track('cache_event', {
      event,
      key: key ? key.substring(0, 20) : null,
      cacheSize: this.cache.size,
      hitRate: this.getHitRate(),
      timestamp: Date.now(),
      ...metadata
    });
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: this.getHitRate(),
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  /**
   * Calculate hit rate
   */
  getHitRate() {
    const total = this.hitCount + this.missCount;
    return total > 0 ? (this.hitCount / total * 100).toFixed(2) : '0.00';
  }

  /**
   * Estimate memory usage
   */
  estimateMemoryUsage() {
    let totalSize = 0;
    for (const [key, item] of this.cache.entries()) {
      totalSize += JSON.stringify({ key, item }).length;
    }
    return totalSize;
  }

  /**
   * Clear cache
   */
  clear() {
    this.cache.clear();
    this.accessTimes.clear();
    this.hitCount = 0;
    this.missCount = 0;
    this.trackCacheEvent('clear');
  }

  /**
   * Destroy cache and cleanup
   */
  destroy() {
    this.clear();
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

/**
 * Response caching strategies
 */
export const CacheStrategies = {
  // Hospital information - cache for longer
  HOSPITAL_INFO: {
    ttl: 30 * 60 * 1000, // 30 minutes
    priority: 'high',
    patterns: ['hospital', 'service', 'contact', 'location', 'visiting hours']
  },

  // Common health questions - medium cache
  HEALTH_QUESTIONS: {
    ttl: 15 * 60 * 1000, // 15 minutes
    priority: 'medium',
    patterns: ['what is', 'how to', 'symptoms', 'treatment']
  },

  // Emergency responses - short cache (safety first)
  EMERGENCY: {
    ttl: 2 * 60 * 1000, // 2 minutes
    priority: 'low',
    patterns: ['emergency', 'urgent', 'pain', 'bleeding']
  },

  // Personal/appointment info - no cache
  PERSONAL: {
    ttl: 0,
    priority: 'none',
    patterns: ['book appointment', 'my appointment', 'personal', 'patient']
  }
};

/**
 * Determine caching strategy based on message content
 */
export function getCachingStrategy(messages) {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
  
  for (const [strategy, config] of Object.entries(CacheStrategies)) {
    if (config.patterns.some(pattern => lastMessage.includes(pattern))) {
      return { strategy, ...config };
    }
  }
  
  // Default strategy
  return {
    strategy: 'DEFAULT',
    ttl: 5 * 60 * 1000, // 5 minutes
    priority: 'medium'
  };
}

/**
 * Template responses for instant replies
 */
export const TemplateResponses = {
  'hello': {
    en: 'Hello! Welcome to TeleKiosk Hospital. How can I help you today?',
    tw: 'Akwaaba! Ɛdeɛn na mɛtumi aboa wo ɛnnɛ wɔ TeleKiosk Ayaresabea?',
    ga: 'Bawo! Nɛ bɛɛ na matumi boa wo ɛnnɛ le TeleKiosk Hospital?',
    ew: 'Miawo! Nu ka miate ŋu akpe ɖe mí ɛgbe le TeleKiosk Hospital?'
  },
  
  'thank you': {
    en: 'You\'re welcome! Is there anything else I can help you with?',
    tw: 'Ɛyɛ! Biribi foforɔ wɔ hɔ a mɛtumi aboa wo?',
    ga: 'Ɛyɛ! Nko bɛɛ wɔ hɔ a matumi boa wo?',
    ew: 'Menyo nu! Nusre bubu aɖe li ama maɖo ɖe ŋu?'
  },

  'contact': {
    en: '📞 **TeleKiosk Hospital Contact:**\n• Main: +233-302-739-373\n• Emergency: +233-599-211-311\n• Email: info@telekiosk.com',
    tw: '📞 **TeleKiosk Ayaresabea Contact:**\n• Main: +233-302-739-373\n• Emergency: +233-599-211-311\n• Email: info@telekiosk.com',
    ga: '📞 **TeleKiosk Hospital Contact:**\n• Main: +233-302-739-373\n• Emergency: +233-599-211-311\n• Email: info@telekiosk.com',
    ew: '📞 **TeleKiosk Hospital Contact:**\n• Main: +233-302-739-373\n• Emergency: +233-599-211-311\n• Email: info@telekiosk.com'
  }
};

/**
 * Get template response if available
 */
export function getTemplateResponse(message, language = 'en') {
  const normalizedMessage = message.toLowerCase().trim();
  
  for (const [key, templates] of Object.entries(TemplateResponses)) {
    if (normalizedMessage.includes(key) || normalizedMessage === key) {
      return templates[language] || templates['en'];
    }
  }
  
  return null;
}

// Create global cache instance
export const chatCache = new IntelligentCache({
  maxSize: 1000,
  defaultTTL: 5 * 60 * 1000 // 5 minutes
});

// Cache performance monitoring
export function getCacheMetrics() {
  const stats = chatCache.getStats();
  
  return {
    ...stats,
    efficiency: stats.hitRate > 70 ? 'excellent' : stats.hitRate > 50 ? 'good' : 'needs_improvement',
    recommendations: generateCacheRecommendations(stats)
  };
}

/**
 * Generate cache optimization recommendations
 */
function generateCacheRecommendations(stats) {
  const recommendations = [];
  
  if (parseFloat(stats.hitRate) < 30) {
    recommendations.push('Consider increasing TTL for hospital information queries');
  }
  
  if (stats.size > stats.maxSize * 0.9) {
    recommendations.push('Cache is near capacity - consider increasing maxSize');
  }
  
  if (stats.memoryUsage > 1024 * 1024) { // 1MB
    recommendations.push('High memory usage detected - review caching strategy');
  }
  
  return recommendations;
}

export default {
  IntelligentCache,
  chatCache,
  CacheStrategies,
  getCachingStrategy,
  TemplateResponses,
  getTemplateResponse,
  getCacheMetrics
};