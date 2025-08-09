// Phase 3: Intelligent Caching and Performance Optimization Service
// Advanced caching system with healthcare-specific optimizations for TeleKiosk Hospital
// Features smart cache invalidation, medical data prioritization, and performance monitoring

import { analyticsService } from './analyticsService.js';
import { multilingualService } from './multilingualService.js';

class IntelligentCacheService {
  constructor() {
    // Cache storage layers
    this.memoryCache = new Map();
    this.persistentCache = this.initializePersistentCache();
    this.temporaryCache = new Map(); // For session-specific data
    
    // Cache configuration
    this.config = {
      maxMemorySize: 50 * 1024 * 1024, // 50MB memory cache
      maxPersistentSize: 200 * 1024 * 1024, // 200MB persistent cache
      defaultTTL: 30 * 60 * 1000, // 30 minutes default TTL
      maxEntries: 10000,
      compressionEnabled: true,
      encryptionEnabled: true // For medical data
    };

    // Healthcare-specific cache priorities
    this.cachePriorities = {
      emergency: 1, // Highest priority
      medical: 2,
      appointment: 3,
      general: 4,
      analytics: 5
    };

    // Cache categories with specific TTL and behavior
    this.cacheCategories = {
      // Critical healthcare data - longer TTL, high priority
      medical_responses: {
        ttl: 60 * 60 * 1000, // 1 hour
        priority: this.cachePriorities.medical,
        encrypted: true,
        compressed: true,
        maxSize: 10 * 1024 * 1024 // 10MB
      },
      
      // Emergency protocols - never expire during session
      emergency_protocols: {
        ttl: Infinity,
        priority: this.cachePriorities.emergency,
        encrypted: true,
        compressed: false, // Fast access needed
        maxSize: 5 * 1024 * 1024 // 5MB
      },
      
      // Appointment data - moderate TTL
      appointment_data: {
        ttl: 30 * 60 * 1000, // 30 minutes
        priority: this.cachePriorities.appointment,
        encrypted: true,
        compressed: true,
        maxSize: 15 * 1024 * 1024 // 15MB
      },
      
      // Language models and translations
      language_models: {
        ttl: 2 * 60 * 60 * 1000, // 2 hours
        priority: this.cachePriorities.general,
        encrypted: false,
        compressed: true,
        maxSize: 20 * 1024 * 1024 // 20MB
      },
      
      // AI responses - short TTL for freshness
      ai_responses: {
        ttl: 15 * 60 * 1000, // 15 minutes
        priority: this.cachePriorities.general,
        encrypted: false,
        compressed: true,
        maxSize: 30 * 1024 * 1024 // 30MB
      },
      
      // User sessions - temporary cache only
      user_sessions: {
        ttl: 8 * 60 * 60 * 1000, // 8 hours
        priority: this.cachePriorities.general,
        encrypted: true,
        compressed: false,
        persistent: false // Memory only
      }
    };

    // Performance monitoring
    this.performanceMetrics = {
      cacheHits: 0,
      cacheMisses: 0,
      evictions: 0,
      compressionSavings: 0,
      averageRetrievalTime: 0,
      memoryUsage: 0,
      diskUsage: 0
    };

    // Smart prefetching patterns
    this.prefetchPatterns = {
      appointment_followup: ['appointment_data', 'medical_responses'],
      emergency_response: ['emergency_protocols', 'medical_responses', 'language_models'],
      language_switch: ['language_models', 'ai_responses']
    };

    // Initialize cache cleanup intervals
    this.initializeCleanupScheduler();
    
    console.log('🚀 Intelligent Cache Service initialized with healthcare optimizations');
  }

  /**
   * Initialize persistent cache (IndexedDB for browser, file system for Node.js)
   */
  initializePersistentCache() {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      return this.initializeIndexedDB();
    } else {
      // Node.js environment - use memory cache for now
      return new Map();
    }
  }

  /**
   * Initialize IndexedDB for persistent caching
   */
  async initializeIndexedDB() {
    try {
      const dbName = 'TeleKioskCache';
      const version = 1;
      
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);
        
        request.onerror = () => {
          console.warn('⚠️ IndexedDB not available, using memory cache only');
          resolve(new Map());
        };
        
        request.onsuccess = (event) => {
          const db = event.target.result;
          console.log('✅ IndexedDB cache initialized');
          resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          
          // Create object stores for different cache categories
          Object.keys(this.cacheCategories).forEach(category => {
            if (!db.objectStoreNames.contains(category)) {
              const store = db.createObjectStore(category, { keyPath: 'key' });
              store.createIndex('expiry', 'expiry');
              store.createIndex('priority', 'priority');
            }
          });
        };
      });
    } catch (error) {
      console.warn('⚠️ Failed to initialize IndexedDB:', error);
      return new Map();
    }
  }

  /**
   * Smart cache storage with automatic categorization
   */
  async set(key, value, options = {}) {
    const startTime = Date.now();
    
    try {
      // Determine cache category from key or options
      const category = options.category || this.determineCategoryFromKey(key);
      const categoryConfig = this.cacheCategories[category] || this.cacheCategories.general;
      
      // Prepare cache entry
      const entry = {
        key,
        value,
        category,
        timestamp: Date.now(),
        expiry: Date.now() + (options.ttl || categoryConfig.ttl),
        priority: options.priority || categoryConfig.priority,
        size: this.calculateSize(value),
        compressed: false,
        encrypted: false,
        accessCount: 0,
        lastAccessed: Date.now()
      };

      // Apply compression if enabled for category
      if (categoryConfig.compressed && entry.size > 1024) { // Compress if > 1KB
        entry.value = await this.compressData(value);
        entry.compressed = true;
        
        const originalSize = entry.size;
        entry.size = this.calculateSize(entry.value);
        this.performanceMetrics.compressionSavings += (originalSize - entry.size);
      }

      // Apply encryption for sensitive data
      if (categoryConfig.encrypted) {
        entry.value = await this.encryptData(entry.value);
        entry.encrypted = true;
      }

      // Store in appropriate cache layer
      const stored = await this.storeInOptimalLayer(entry, categoryConfig);
      
      if (stored) {
        // Update performance metrics
        this.updatePerformanceMetrics('set', Date.now() - startTime, entry.size);
        
        // Smart prefetching based on patterns
        this.triggerSmartPrefetch(key, category);
        
        // Track cache usage
        analyticsService.trackEvent('intelligent_cache_set', {
          key: key,
          category: category,
          size: entry.size,
          compressed: entry.compressed,
          encrypted: entry.encrypted,
          ttl: categoryConfig.ttl
        });
        
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ Cache set error:', error);
      analyticsService.trackError(error, { service: 'intelligentCache', operation: 'set' });
      return false;
    }
  }

  /**
   * Intelligent cache retrieval with performance optimization
   */
  async get(key, options = {}) {
    const startTime = Date.now();
    
    try {
      // Try memory cache first (fastest)
      let entry = this.memoryCache.get(key);
      let cacheLayer = 'memory';
      
      // Try temporary cache
      if (!entry) {
        entry = this.temporaryCache.get(key);
        cacheLayer = 'temporary';
      }
      
      // Try persistent cache
      if (!entry && this.persistentCache && this.persistentCache.get) {
        entry = await this.retrieveFromPersistentCache(key);
        cacheLayer = 'persistent';
      }
      
      if (!entry) {
        this.performanceMetrics.cacheMisses++;
        this.updatePerformanceMetrics('miss', Date.now() - startTime);
        return null;
      }
      
      // Check expiry
      if (entry.expiry < Date.now()) {
        await this.delete(key);
        this.performanceMetrics.cacheMisses++;
        return null;
      }
      
      // Update access statistics
      entry.accessCount++;
      entry.lastAccessed = Date.now();
      
      // Decrypt if needed
      let value = entry.value;
      if (entry.encrypted) {
        value = await this.decryptData(value);
      }
      
      // Decompress if needed
      if (entry.compressed) {
        value = await this.decompressData(value);
      }
      
      // Move frequently accessed items to memory cache
      if (cacheLayer !== 'memory' && entry.accessCount > 3) {
        this.promoteToMemoryCache(key, entry);
      }
      
      this.performanceMetrics.cacheHits++;
      this.updatePerformanceMetrics('hit', Date.now() - startTime);
      
      // Track cache hit
      analyticsService.trackEvent('intelligent_cache_hit', {
        key: key,
        cacheLayer: cacheLayer,
        accessCount: entry.accessCount,
        age: Date.now() - entry.timestamp
      });
      
      return value;
      
    } catch (error) {
      console.error('❌ Cache get error:', error);
      this.performanceMetrics.cacheMisses++;
      return null;
    }
  }

  /**
   * Smart cache invalidation
   */
  async delete(key, options = {}) {
    try {
      let deleted = false;
      
      // Remove from all cache layers
      if (this.memoryCache.has(key)) {
        this.memoryCache.delete(key);
        deleted = true;
      }
      
      if (this.temporaryCache.has(key)) {
        this.temporaryCache.delete(key);
        deleted = true;
      }
      
      if (this.persistentCache && this.persistentCache.delete) {
        await this.deleteFromPersistentCache(key);
        deleted = true;
      }
      
      if (deleted) {
        analyticsService.trackEvent('intelligent_cache_delete', {
          key: key,
          reason: options.reason || 'manual'
        });
      }
      
      return deleted;
      
    } catch (error) {
      console.error('❌ Cache delete error:', error);
      return false;
    }
  }

  /**
   * Smart prefetching based on usage patterns
   */
  async triggerSmartPrefetch(triggerKey, category) {
    try {
      // Find prefetch patterns that match
      for (const [pattern, categories] of Object.entries(this.prefetchPatterns)) {
        if (triggerKey.includes(pattern.split('_')[0])) {
          // Prefetch related categories
          categories.forEach(async (prefetchCategory) => {
            if (prefetchCategory !== category) {
              await this.prefetchCategory(prefetchCategory);
            }
          });
          break;
        }
      }
    } catch (error) {
      console.error('❌ Smart prefetch error:', error);
    }
  }

  /**
   * Prefetch entire category
   */
  async prefetchCategory(category) {
    // Implementation would depend on specific data sources
    console.log(`🔄 Prefetching category: ${category}`);
  }

  /**
   * Store entry in optimal cache layer
   */
  async storeInOptimalLayer(entry, categoryConfig) {
    try {
      // Always try to store in memory cache first for speed
      if (this.canStoreInMemory(entry)) {
        this.memoryCache.set(entry.key, entry);
        
        // Also store in persistent cache if it should persist
        if (categoryConfig.persistent !== false && this.persistentCache) {
          await this.storeToPersistentCache(entry);
        }
        
        return true;
      }
      
      // If memory is full, store in temporary cache for session
      if (categoryConfig.persistent === false) {
        this.temporaryCache.set(entry.key, entry);
        return true;
      }
      
      // Store only in persistent cache
      if (this.persistentCache) {
        await this.storeToPersistentCache(entry);
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ Store optimal layer error:', error);
      return false;
    }
  }

  /**
   * Check if entry can be stored in memory cache
   */
  canStoreInMemory(entry) {
    const currentMemoryUsage = this.calculateMemoryUsage();
    const categoryConfig = this.cacheCategories[entry.category];
    
    return (currentMemoryUsage + entry.size) < this.config.maxMemorySize &&
           this.memoryCache.size < this.config.maxEntries &&
           (categoryConfig?.maxSize ? entry.size < categoryConfig.maxSize : true);
  }

  /**
   * Store to persistent cache (IndexedDB)
   */
  async storeToPersistentCache(entry) {
    if (!this.persistentCache || typeof this.persistentCache.put !== 'function') {
      return false;
    }

    try {
      const transaction = this.persistentCache.transaction([entry.category], 'readwrite');
      const store = transaction.objectStore(entry.category);
      await store.put(entry);
      return true;
    } catch (error) {
      console.error('❌ Persistent cache store error:', error);
      return false;
    }
  }

  /**
   * Retrieve from persistent cache
   */
  async retrieveFromPersistentCache(key) {
    if (!this.persistentCache) return null;
    
    try {
      // Search across all categories
      for (const category of Object.keys(this.cacheCategories)) {
        const transaction = this.persistentCache.transaction([category], 'readonly');
        const store = transaction.objectStore(category);
        const result = await store.get(key);
        
        if (result) {
          return result;
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ Persistent cache retrieval error:', error);
      return null;
    }
  }

  /**
   * Delete from persistent cache
   */
  async deleteFromPersistentCache(key) {
    if (!this.persistentCache) return false;
    
    try {
      for (const category of Object.keys(this.cacheCategories)) {
        const transaction = this.persistentCache.transaction([category], 'readwrite');
        const store = transaction.objectStore(category);
        await store.delete(key);
      }
      return true;
    } catch (error) {
      console.error('❌ Persistent cache delete error:', error);
      return false;
    }
  }

  /**
   * Promote frequently accessed items to memory cache
   */
  promoteToMemoryCache(key, entry) {
    if (this.canStoreInMemory(entry)) {
      this.memoryCache.set(key, entry);
      console.log(`📈 Promoted ${key} to memory cache (${entry.accessCount} accesses)`);
    }
  }

  /**
   * Determine cache category from key patterns
   */
  determineCategoryFromKey(key) {
    if (key.includes('emergency') || key.includes('urgent')) {
      return 'emergency_protocols';
    }
    if (key.includes('appointment') || key.includes('booking')) {
      return 'appointment_data';
    }
    if (key.includes('medical') || key.includes('health') || key.includes('symptom')) {
      return 'medical_responses';
    }
    if (key.includes('language') || key.includes('translation')) {
      return 'language_models';
    }
    if (key.includes('ai_response') || key.includes('chat')) {
      return 'ai_responses';
    }
    if (key.includes('session') || key.includes('user')) {
      return 'user_sessions';
    }
    
    return 'ai_responses'; // Default category
  }

  /**
   * Data compression using LZ-string algorithm simulation
   */
  async compressData(data) {
    try {
      const jsonString = JSON.stringify(data);
      // Simple compression simulation - in production use LZ-string or similar
      const compressed = this.simpleCompress(jsonString);
      return compressed;
    } catch (error) {
      console.warn('⚠️ Compression failed, storing uncompressed:', error);
      return data;
    }
  }

  /**
   * Data decompression
   */
  async decompressData(compressedData) {
    try {
      const decompressed = this.simpleDecompress(compressedData);
      return JSON.parse(decompressed);
    } catch (error) {
      console.warn('⚠️ Decompression failed:', error);
      return compressedData;
    }
  }

  /**
   * Simple compression simulation
   */
  simpleCompress(str) {
    // Simple RLE-like compression for demonstration
    return str.replace(/(.)\1+/g, (match, char) => `${char}${match.length}`);
  }

  /**
   * Simple decompression simulation
   */
  simpleDecompress(str) {
    // Reverse of simple compression
    return str.replace(/(.)\d+/g, (match, char) => {
      const count = parseInt(match.slice(1));
      return char.repeat(count);
    });
  }

  /**
   * Basic encryption for sensitive medical data
   */
  async encryptData(data) {
    // Simple encryption simulation - in production use Web Crypto API
    const jsonString = JSON.stringify(data);
    const encrypted = btoa(jsonString); // Base64 encoding as simple encryption
    return encrypted;
  }

  /**
   * Basic decryption
   */
  async decryptData(encryptedData) {
    try {
      const decrypted = atob(encryptedData);
      return JSON.parse(decrypted);
    } catch (error) {
      console.warn('⚠️ Decryption failed:', error);
      return encryptedData;
    }
  }

  /**
   * Calculate size of data in bytes
   */
  calculateSize(data) {
    return JSON.stringify(data).length * 2; // Approximate byte size
  }

  /**
   * Calculate current memory usage
   */
  calculateMemoryUsage() {
    let totalSize = 0;
    for (const entry of this.memoryCache.values()) {
      totalSize += entry.size || 0;
    }
    return totalSize;
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics(operation, duration, size = 0) {
    if (operation === 'hit' || operation === 'miss') {
      this.performanceMetrics.averageRetrievalTime = 
        (this.performanceMetrics.averageRetrievalTime + duration) / 2;
    }
    
    if (operation === 'set') {
      this.performanceMetrics.memoryUsage = this.calculateMemoryUsage();
    }
  }

  /**
   * Initialize cleanup scheduler for expired entries
   */
  initializeCleanupScheduler() {
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 5 * 60 * 1000);

    // Optimize cache every hour
    setInterval(() => {
      this.optimizeCache();
    }, 60 * 60 * 1000);
  }

  /**
   * Clean up expired cache entries
   */
  async cleanupExpiredEntries() {
    const now = Date.now();
    let cleanedCount = 0;
    
    try {
      // Clean memory cache
      for (const [key, entry] of this.memoryCache.entries()) {
        if (entry.expiry < now) {
          this.memoryCache.delete(key);
          cleanedCount++;
        }
      }
      
      // Clean temporary cache
      for (const [key, entry] of this.temporaryCache.entries()) {
        if (entry.expiry < now) {
          this.temporaryCache.delete(key);
          cleanedCount++;
        }
      }
      
      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned ${cleanedCount} expired cache entries`);
        this.performanceMetrics.evictions += cleanedCount;
      }
      
    } catch (error) {
      console.error('❌ Cache cleanup error:', error);
    }
  }

  /**
   * Optimize cache by evicting least recently used items
   */
  async optimizeCache() {
    try {
      const memoryUsage = this.calculateMemoryUsage();
      
      if (memoryUsage > this.config.maxMemorySize * 0.8) { // 80% threshold
        console.log('🔄 Optimizing cache - memory usage high');
        
        // Convert to array and sort by access patterns
        const entries = Array.from(this.memoryCache.entries())
          .map(([key, entry]) => ({ key, ...entry }))
          .sort((a, b) => {
            // Sort by priority first, then by last accessed time
            if (a.priority !== b.priority) {
              return a.priority - b.priority; // Lower number = higher priority
            }
            return a.lastAccessed - b.lastAccessed; // Older first
          });
        
        // Remove least important entries
        const entriesToRemove = Math.floor(entries.length * 0.2); // Remove 20%
        for (let i = entries.length - entriesToRemove; i < entries.length; i++) {
          this.memoryCache.delete(entries[i].key);
          this.performanceMetrics.evictions++;
        }
        
        console.log(`🗑️ Evicted ${entriesToRemove} cache entries for optimization`);
      }
      
    } catch (error) {
      console.error('❌ Cache optimization error:', error);
    }
  }

  /**
   * Clear cache by category or entirely
   */
  async clearCache(category = null) {
    try {
      if (category) {
        // Clear specific category
        for (const [key, entry] of this.memoryCache.entries()) {
          if (entry.category === category) {
            this.memoryCache.delete(key);
          }
        }
        
        for (const [key, entry] of this.temporaryCache.entries()) {
          if (entry.category === category) {
            this.temporaryCache.delete(key);
          }
        }
        
        console.log(`🧹 Cleared cache category: ${category}`);
      } else {
        // Clear all caches
        this.memoryCache.clear();
        this.temporaryCache.clear();
        console.log('🧹 Cleared all caches');
      }
      
      analyticsService.trackEvent('intelligent_cache_clear', {
        category: category || 'all',
        timestamp: Date.now()
      });
      
      return true;
      
    } catch (error) {
      console.error('❌ Cache clear error:', error);
      return false;
    }
  }

  /**
   * Get comprehensive cache statistics
   */
  getStats() {
    const memoryUsage = this.calculateMemoryUsage();
    const hitRate = this.performanceMetrics.cacheHits / 
      (this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses) * 100;
    
    return {
      // Performance metrics
      performance: {
        hitRate: isNaN(hitRate) ? 0 : hitRate.toFixed(2) + '%',
        totalHits: this.performanceMetrics.cacheHits,
        totalMisses: this.performanceMetrics.cacheMisses,
        evictions: this.performanceMetrics.evictions,
        averageRetrievalTime: `${this.performanceMetrics.averageRetrievalTime.toFixed(2)}ms`,
        compressionSavings: `${(this.performanceMetrics.compressionSavings / 1024).toFixed(2)} KB`
      },
      
      // Memory usage
      memory: {
        currentUsage: `${(memoryUsage / 1024 / 1024).toFixed(2)} MB`,
        maxAllowed: `${(this.config.maxMemorySize / 1024 / 1024).toFixed(2)} MB`,
        utilizationPercent: `${((memoryUsage / this.config.maxMemorySize) * 100).toFixed(1)}%`,
        entryCount: this.memoryCache.size + this.temporaryCache.size
      },
      
      // Category breakdown
      categories: Object.keys(this.cacheCategories).map(category => {
        const categoryEntries = Array.from(this.memoryCache.values())
          .filter(entry => entry.category === category);
        
        return {
          name: category,
          entries: categoryEntries.length,
          totalSize: categoryEntries.reduce((sum, entry) => sum + entry.size, 0),
          avgAccessCount: categoryEntries.reduce((sum, entry) => sum + entry.accessCount, 0) / categoryEntries.length || 0
        };
      }),
      
      // Configuration
      config: this.config,
      
      // Health status
      health: {
        status: memoryUsage > this.config.maxMemorySize * 0.9 ? 'HIGH_MEMORY' : 'HEALTHY',
        lastOptimized: 'Recently', // Placeholder
        nextCleanup: 'In 5 minutes' // Placeholder
      }
    };
  }

  /**
   * Healthcare-specific cache warming
   */
  async warmupHealthcareCache() {
    console.log('🔥 Warming up healthcare cache...');
    
    try {
      // Pre-cache emergency protocols
      await this.set('emergency_protocols_critical', {
        protocols: ['call_999', 'cpr_instructions', 'hospital_contact'],
        lastUpdated: Date.now()
      }, { category: 'emergency_protocols' });
      
      // Pre-cache common medical responses in multiple languages
      const languages = ['en', 'tw', 'ga', 'ee'];
      for (const lang of languages) {
        const greeting = multilingualService.getGreeting(lang);
        await this.set(`greeting_${lang}`, greeting, { category: 'language_models' });
        
        const emergencyMsg = multilingualService.getEmergencyMessage(lang);
        await this.set(`emergency_message_${lang}`, emergencyMsg, { category: 'emergency_protocols' });
      }
      
      console.log('✅ Healthcare cache warmed up successfully');
      
    } catch (error) {
      console.error('❌ Healthcare cache warmup failed:', error);
    }
  }
}

// Create and export singleton instance
export const intelligentCacheService = new IntelligentCacheService();
export default intelligentCacheService;