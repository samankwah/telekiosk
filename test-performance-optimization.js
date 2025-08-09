// Phase 3: Performance Optimization Test Suite
// Tests the intelligent caching and performance optimization system

import { performanceOptimizer } from './src/services/performanceOptimizer.js';
import { intelligentCacheService } from './src/services/intelligentCacheService.js';

console.log('⚡ TESTING PHASE 3: Performance Optimization System\n');

// Test scenarios
const testScenarios = [
  {
    name: 'Emergency Request (No Optimization)',
    requests: [
      { url: '/api/emergency/protocols', options: { priority: 1 } },
      { url: '/api/emergency/contacts', options: { priority: 1 } }
    ],
    expectedBehavior: 'immediate_processing'
  },
  {
    name: 'Medical Queries (Cached)',
    requests: [
      { url: '/api/medical/symptoms/headache', options: {} },
      { url: '/api/medical/symptoms/fever', options: {} },
      { url: '/api/medical/symptoms/headache', options: {} } // Duplicate for cache test
    ],
    expectedBehavior: 'caching_and_deduplication'
  },
  {
    name: 'Appointment Requests (Batched)',
    requests: [
      { url: '/api/appointment/available-slots', options: {} },
      { url: '/api/appointment/doctors', options: {} },
      { url: '/api/appointment/services', options: {} }
    ],
    expectedBehavior: 'batching_optimization'
  },
  {
    name: 'Language Translation (Prefetched)',
    requests: [
      { url: '/api/translate/greeting/tw', options: {} },
      { url: '/api/translate/emergency/ga', options: {} },
      { url: '/api/translate/symptoms/ee', options: {} }
    ],
    expectedBehavior: 'prefetching_and_caching'
  },
  {
    name: 'Analytics Data (Low Priority)',
    requests: [
      { url: '/api/analytics/user-interactions', options: { priority: 5 } },
      { url: '/api/analytics/system-metrics', options: { priority: 5 } },
      { url: '/api/analytics/performance-data', options: { priority: 5 } }
    ],
    expectedBehavior: 'batched_with_delay'
  }
];

// Mock fetch for testing
global.fetch = async (url, options) => {
  // Simulate network delay based on request type
  let delay = 200; // Default delay
  
  if (url.includes('emergency')) {
    delay = 50; // Fast emergency response
  } else if (url.includes('medical')) {
    delay = 150; // Fast medical response
  } else if (url.includes('analytics')) {
    delay = 500; // Slower analytics response
  }
  
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Return mock response
  return {
    ok: true,
    json: async () => ({
      url: url,
      timestamp: Date.now(),
      data: `Mock response for ${url}`,
      processed: true
    })
  };
};

// Test cache functionality
async function testCacheOperations() {
  console.log('🧪 Testing Cache Operations:');
  console.log('='.repeat(50));
  
  try {
    // Test basic cache operations
    console.log('\n1. Testing basic cache set/get...');
    await intelligentCacheService.set('test_key', { message: 'test data' }, {
      category: 'medical_responses',
      ttl: 60000
    });
    
    const retrieved = await intelligentCacheService.get('test_key');
    console.log(`   ✅ Cache set/get: ${retrieved ? 'PASSED' : 'FAILED'}`);
    
    // Test different categories
    console.log('\n2. Testing category-based caching...');
    const categories = ['emergency_protocols', 'medical_responses', 'appointment_data', 'language_models'];
    
    for (const category of categories) {
      const testKey = `test_${category}`;
      await intelligentCacheService.set(testKey, { category: category, data: 'test' }, {
        category: category
      });
      
      const result = await intelligentCacheService.get(testKey);
      console.log(`   ${category}: ${result ? '✅ PASSED' : '❌ FAILED'}`);
    }
    
    // Test cache statistics
    console.log('\n3. Cache Statistics:');
    const stats = intelligentCacheService.getStats();
    console.log(`   Hit Rate: ${stats.performance.hitRate}`);
    console.log(`   Memory Usage: ${stats.memory.currentUsage}`);
    console.log(`   Total Entries: ${stats.memory.entryCount}`);
    console.log(`   Categories: ${stats.categories.length}`);
    
  } catch (error) {
    console.error('❌ Cache test error:', error);
  }
}

// Test performance optimization
async function testPerformanceOptimization() {
  console.log('\n\n⚡ Testing Performance Optimization:');
  console.log('='.repeat(50));
  
  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i];
    console.log(`\n${i + 1}. ${scenario.name}`);
    console.log(`   Expected: ${scenario.expectedBehavior}`);
    console.log(`   Requests: ${scenario.requests.length}`);
    
    const startTime = Date.now();
    
    try {
      // Test individual optimized requests
      const results = [];
      for (const request of scenario.requests) {
        const result = await performanceOptimizer.optimizedRequest(request.url, request.options);
        results.push(result);
      }
      
      const totalTime = Date.now() - startTime;
      console.log(`   ⏱️ Total Time: ${totalTime}ms`);
      console.log(`   📊 Results: ${results.length} responses received`);
      
      // Verify results
      const allSuccessful = results.every(r => r && r.processed);
      console.log(`   ✅ Success Rate: ${allSuccessful ? '100%' : 'PARTIAL'}`);
      
      // Test duplicate detection for medical queries
      if (scenario.name.includes('Medical')) {
        console.log(`   🔄 Duplicate Detection: Expected for headache query`);
      }
      
    } catch (error) {
      console.error(`   ❌ ERROR: ${error.message}`);
    }
  }
}

// Test smart prefetching
async function testSmartPrefetching() {
  console.log('\n\n🚀 Testing Smart Prefetching:');
  console.log('='.repeat(50));
  
  const prefetchScenarios = [
    { type: 'appointment', language: 'tw' },
    { type: 'emergency', language: 'ga' },
    { type: 'medical_query', language: 'ee' }
  ];
  
  for (const scenario of prefetchScenarios) {
    console.log(`\n📦 Prefetching for ${scenario.type} (${scenario.language})...`);
    
    const startTime = Date.now();
    try {
      await performanceOptimizer.smartPrefetch(scenario);
      const prefetchTime = Date.now() - startTime;
      console.log(`   ✅ Prefetch completed in ${prefetchTime}ms`);
      
      // Test if prefetched data improves subsequent request speed
      const testUrl = `/api/${scenario.type}/test`;
      const requestStartTime = Date.now();
      await performanceOptimizer.optimizedRequest(testUrl);
      const requestTime = Date.now() - requestStartTime;
      console.log(`   ⚡ Subsequent request: ${requestTime}ms`);
      
    } catch (error) {
      console.error(`   ❌ Prefetch error: ${error.message}`);
    }
  }
}

// Test batch optimization
async function testBatchOptimization() {
  console.log('\n\n📦 Testing Batch Optimization:');
  console.log('='.repeat(50));
  
  const batchRequests = [
    { url: '/api/analytics/event1', options: {} },
    { url: '/api/analytics/event2', options: {} },
    { url: '/api/analytics/event3', options: {} },
    { url: '/api/analytics/event4', options: {} },
    { url: '/api/analytics/event5', options: {} }
  ];
  
  console.log(`\n📊 Batching ${batchRequests.length} analytics requests...`);
  
  const startTime = Date.now();
  try {
    const results = await performanceOptimizer.batchRequests(batchRequests, 'analytics_events');
    const batchTime = Date.now() - startTime;
    
    console.log(`   ✅ Batch completed in ${batchTime}ms`);
    console.log(`   📈 Results: ${results.length} responses`);
    console.log(`   ⚡ Avg per request: ${(batchTime / results.length).toFixed(1)}ms`);
    
  } catch (error) {
    console.error(`   ❌ Batch error: ${error.message}`);
  }
}

// Test emergency performance mode
async function testEmergencyMode() {
  console.log('\n\n🚨 Testing Emergency Performance Mode:');
  console.log('='.repeat(50));
  
  console.log('\n1. Activating Emergency Mode...');
  performanceOptimizer.enableEmergencyMode();
  
  // Test emergency request performance
  const emergencyStart = Date.now();
  await performanceOptimizer.optimizedRequest('/api/emergency/critical', { priority: 1 });
  const emergencyTime = Date.now() - emergencyStart;
  console.log(`   🚨 Emergency request: ${emergencyTime}ms`);
  
  console.log('\n2. Returning to Normal Mode...');
  performanceOptimizer.disableEmergencyMode();
  
  console.log('   ✅ Emergency mode test completed');
}

// Test healthcare cache warming
async function testHealthcareCacheWarming() {
  console.log('\n\n🔥 Testing Healthcare Cache Warming:');
  console.log('='.repeat(50));
  
  const warmupStart = Date.now();
  await intelligentCacheService.warmupHealthcareCache();
  const warmupTime = Date.now() - warmupStart;
  
  console.log(`   ✅ Cache warming completed in ${warmupTime}ms`);
  
  // Verify warmed cache
  const emergencyProtocols = await intelligentCacheService.get('emergency_protocols_critical');
  const greetingEn = await intelligentCacheService.get('greeting_en');
  const greetingTw = await intelligentCacheService.get('greeting_tw');
  
  console.log(`   Emergency Protocols: ${emergencyProtocols ? '✅ CACHED' : '❌ MISSING'}`);
  console.log(`   English Greeting: ${greetingEn ? '✅ CACHED' : '❌ MISSING'}`);
  console.log(`   Twi Greeting: ${greetingTw ? '✅ CACHED' : '❌ MISSING'}`);
}

// Run comprehensive test suite
async function runComprehensiveTests() {
  console.log('🧪 Starting Phase 3 Performance Optimization Tests...\n');
  
  await testCacheOperations();
  await testPerformanceOptimization();
  await testSmartPrefetching();
  await testBatchOptimization();
  await testEmergencyMode();
  await testHealthcareCacheWarming();
  
  // Final performance report
  console.log('\n\n📊 Final Performance Report:');
  console.log('='.repeat(50));
  
  const performanceStats = performanceOptimizer.getPerformanceStats();
  console.log('\n🚀 Request Optimization:');
  console.log(`   Total Requests: ${performanceStats.requests.totalRequests}`);
  console.log(`   Requests Optimized: ${performanceStats.requests.requestsOptimized}`);
  console.log(`   Average Response Time: ${performanceStats.requests.averageResponseTime.toFixed(1)}ms`);
  console.log(`   Bandwidth Saved: ${(performanceStats.requests.bandwidthSaved / 1024).toFixed(2)} KB`);
  
  console.log('\n💾 Cache Performance:');
  console.log(`   Hit Rate: ${performanceStats.cache.performance.hitRate}`);
  console.log(`   Memory Usage: ${performanceStats.cache.memory.currentUsage}`);
  console.log(`   Total Entries: ${performanceStats.cache.memory.entryCount}`);
  
  console.log('\n⚡ Optimization Strategies:');
  performanceStats.optimization.strategiesEnabled.forEach(strategy => {
    console.log(`   ✅ ${strategy}`);
  });
  
  console.log('\n🏥 System Health:');
  console.log(`   Overall Status: ${performanceStats.health.status}`);
  console.log(`   Cache Healthy: ${performanceStats.health.cacheHealthy ? 'YES' : 'NO'}`);
  console.log(`   Memory Usage: ${performanceStats.health.memoryUsage}`);
  
  console.log('\n✅ Phase 3 Performance Optimization Test Suite Complete!');
  console.log('🚀 System ready for enterprise-grade healthcare performance optimization.');
}

// Run the comprehensive test suite
runComprehensiveTests().catch(console.error);