import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Zap, Globe, Activity, Clock, Users, MessageSquare } from 'lucide-react';

/**
 * TeleKiosk AI Assistant Analytics Dashboard
 * Phase 3: Advanced Features - Real-time Analytics Implementation
 */
export const AnalyticsDashboard = ({ className = "" }) => {
  const [metrics, setMetrics] = useState(null);
  const [cacheMetrics, setCacheMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        
        // Fetch cache metrics
        const cacheResponse = await fetch('http://localhost:3003/api/cache-metrics');
        if (cacheResponse.ok) {
          const cacheData = await cacheResponse.json();
          setCacheMetrics(cacheData.metrics);
        }
        
        // Simulate analytics data (in production, this would come from your analytics service)
        const analyticsData = {
          totalInteractions: 152,
          uniqueUsers: 38,
          averageResponseTime: 2.3,
          emergencyDetections: 3,
          appointmentBookings: 12,
          languageDistribution: {
            en: 78,
            tw: 15,
            ga: 5,
            ew: 2
          },
          topQueries: [
            { query: 'Hospital services', count: 24 },
            { query: 'Book appointment', count: 18 },
            { query: 'Visiting hours', count: 15 },
            { query: 'Contact information', count: 12 },
            { query: 'Emergency services', count: 8 }
          ],
          performanceTrends: {
            responseTime: [2.1, 2.3, 2.0, 2.5, 2.3],
            satisfaction: [4.2, 4.5, 4.3, 4.6, 4.4],
            usage: [45, 52, 48, 65, 58]
          }
        };
        
        setMetrics(analyticsData);
        setError(null);
      } catch (err) {
        console.error('Analytics fetch error:', err);
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-lg h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center text-red-600">
          <Activity className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            TeleKiosk AI Analytics
          </h2>
          <p className="text-gray-600 text-sm">Real-time insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm">Live</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={<MessageSquare className="w-6 h-6" />}
          title="Total Interactions"
          value={metrics?.totalInteractions || 0}
          change="+12%"
          positive={true}
          color="blue"
        />
        <MetricCard
          icon={<Users className="w-6 h-6" />}
          title="Active Users"
          value={metrics?.uniqueUsers || 0}
          change="+5%"
          positive={true}
          color="green"
        />
        <MetricCard
          icon={<Clock className="w-6 h-6" />}
          title="Avg Response Time"
          value={`${metrics?.averageResponseTime || 0}s`}
          change="-8%"
          positive={true}
          color="purple"
        />
        <MetricCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Appointments Booked"
          value={metrics?.appointmentBookings || 0}
          change="+15%"
          positive={true}
          color="orange"
        />
      </div>

      {/* Performance Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Cache Performance */}
        {cacheMetrics && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Cache Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{cacheMetrics.hitRate}%</div>
                <div className="text-sm text-gray-600">Hit Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{cacheMetrics.size}</div>
                <div className="text-sm text-gray-600">Cached Items</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Cache Efficiency</span>
                <span className="capitalize text-blue-600 font-medium">{cacheMetrics.efficiency}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${cacheMetrics.hitRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Language Distribution */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-600" />
            Language Usage
          </h3>
          <div className="space-y-2">
            {metrics?.languageDistribution && Object.entries(metrics.languageDistribution).map(([lang, count]) => {
              const total = Object.values(metrics.languageDistribution).reduce((a, b) => a + b, 0);
              const percentage = ((count / total) * 100).toFixed(1);
              
              return (
                <div key={lang} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getLanguageFlag(lang)}</span>
                    <span className="text-sm font-medium">{getLanguageName(lang)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{count}</span>
                    <span className="text-xs text-green-600 font-medium">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Queries */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Queries</h3>
        <div className="space-y-2">
          {metrics?.topQueries?.map((query, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">{query.query}</span>
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 rounded-full px-2 py-1 text-xs text-white font-medium">
                  {query.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      {cacheMetrics?.recommendations?.length > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">🤖 AI Recommendations</h3>
          <ul className="list-disc list-inside space-y-1">
            {cacheMetrics.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-yellow-700">{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * Individual Metric Card Component
 */
const MetricCard = ({ icon, title, value, change, positive, color }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className={`inline-flex p-2 rounded-lg ${colorClasses[color]} mb-2`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      {change && (
        <div className={`text-xs font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </div>
      )}
    </div>
  );
};

/**
 * Helper functions
 */
function getLanguageFlag(langCode) {
  const flags = {
    'en': '🇺🇸',
    'tw': '🇬🇭',
    'ga': '🇬🇭',
    'ew': '🇬🇭'
  };
  return flags[langCode] || '🌐';
}

function getLanguageName(langCode) {
  const names = {
    'en': 'English',
    'tw': 'Twi',
    'ga': 'Ga',
    'ew': 'Ewe'
  };
  return names[langCode] || langCode.toUpperCase();
}

export default AnalyticsDashboard;