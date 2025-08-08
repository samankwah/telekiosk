// Chatbot Analytics Dashboard Component
// Provides comprehensive insights into chatbot usage and performance

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, 
  LineChart, 
  PieChart,
  TrendingUp, 
  TrendingDown,
  Users,
  MessageCircle,
  Mic,
  AlertTriangle,
  Calendar,
  Clock,
  Activity,
  Globe,
  Target,
  RefreshCw
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

export const ChatbotAnalyticsDashboard = ({ className = '' }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch analytics data
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchAnalyticsData();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, timeRange]);

  /**
   * Fetch analytics data from the service
   */
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get detailed report from analytics service
      const report = analyticsService.getDetailedReport(timeRange);
      const summary = analyticsService.getAnalyticsSummary();
      
      // Combine with additional metrics
      const enhancedData = {
        ...report,
        summary,
        realTimeStats: analyticsService.realTimeStats,
        timestamp: Date.now()
      };

      setAnalyticsData(enhancedData);
    } catch (err) {
      console.error('❌ Failed to fetch analytics data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculate metrics from analytics data
   */
  const metrics = useMemo(() => {
    if (!analyticsData) return null;

    const { summary, events } = analyticsData;
    
    return {
      // Core metrics
      totalInteractions: summary.usage.totalInteractions,
      voiceUsage: summary.usage.voiceInteractions,
      emergencyDetections: summary.usage.emergencyDetections,
      bookingAttempts: summary.usage.bookingAttempts,
      
      // Performance metrics
      avgResponseTime: summary.performance.averageResponseTime,
      errorRate: parseFloat(summary.performance.errorRate),
      totalErrors: summary.performance.totalErrors,
      
      // AI usage
      aiRequests: summary.aiUsage.totalAIRequests,
      modelUsage: summary.aiUsage.modelUsage,
      
      // Engagement metrics
      sessionDuration: summary.session.duration,
      messagesPerSession: summary.usage.totalInteractions > 0 
        ? (summary.usage.totalInteractions / Math.max(1, summary.session.duration / (60 * 1000))).toFixed(1)
        : 0,
      
      // Voice adoption
      voiceAdoption: summary.usage.totalInteractions > 0 
        ? ((summary.usage.voiceInteractions / summary.usage.totalInteractions) * 100).toFixed(1)
        : 0,
        
      // Emergency response metrics
      emergencyResponseTime: events.byType?.emergency_detection 
        ? Math.round(Math.random() * 3000 + 500) // Simulated for now
        : 0
    };
  }, [analyticsData]);

  /**
   * Generate chart data for visualizations
   */
  const chartData = useMemo(() => {
    if (!analyticsData || !analyticsData.events) return null;

    const { events } = analyticsData;
    
    // Timeline data for activity chart
    const timelineData = events.timeline?.slice(-24)?.map((event, index) => ({
      time: new Date(event.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      interactions: Math.floor(Math.random() * 10) + 1, // Simulated for demo
      voice: Math.floor(Math.random() * 5),
      emergencies: event.type === 'emergency_detection' ? 1 : 0
    })) || [];

    // Event type distribution
    const eventTypeData = Object.entries(events.byType || {}).map(([type, count]) => ({
      name: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: count,
      color: getEventTypeColor(type)
    }));

    // Language distribution (simulated)
    const languageData = [
      { name: 'English', value: 65, color: '#3B82F6' },
      { name: 'Twi', value: 20, color: '#10B981' },
      { name: 'Ga', value: 10, color: '#F59E0B' },
      { name: 'Ewe', value: 5, color: '#EF4444' }
    ];

    return {
      timeline: timelineData,
      eventTypes: eventTypeData,
      languages: languageData
    };
  }, [analyticsData]);

  /**
   * Get color for event type
   */
  const getEventTypeColor = (eventType) => {
    const colors = {
      'chatbot_message_received': '#3B82F6',
      'emergency_detection': '#EF4444',
      'voice_usage': '#10B981',
      'ai_model_usage': '#8B5CF6',
      'booking_attempt': '#F59E0B',
      'error_occurred': '#F87171'
    };
    return colors[eventType] || '#6B7280';
  };

  /**
   * Format duration in human readable format
   */
  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin text-blue-500 mr-2" size={24} />
          <span className="text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center text-red-600">
          <AlertTriangle size={48} className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Analytics Error</h3>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchAnalyticsData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData || !metrics) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Activity size={48} className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-sm">Start using the chatbot to see analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              TeleKiosk AI Assistant Analytics
            </h2>
            <p className="text-gray-600">
              Real-time insights into chatbot performance and usage
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center px-3 py-2 rounded-lg ${
                autoRefresh 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <RefreshCw size={16} className={`mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </button>

            {/* Manual Refresh */}
            <button
              onClick={fetchAnalyticsData}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Interactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageCircle className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {metrics.totalInteractions.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600">Total Interactions</p>
            </div>
          </div>
        </div>

        {/* Voice Usage */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Mic className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {metrics.voiceAdoption}%
              </h3>
              <p className="text-sm text-gray-600">Voice Adoption</p>
            </div>
          </div>
        </div>

        {/* Emergency Detections */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {metrics.emergencyDetections}
              </h3>
              <p className="text-sm text-gray-600">Emergency Detections</p>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {metrics.avgResponseTime}ms
              </h3>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activity Timeline
          </h3>
          <div className="h-64">
            {chartData?.timeline?.length > 0 ? (
              <div className="space-y-2">
                {chartData.timeline.slice(-8).map((point, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{point.time}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span>{point.interactions} msgs</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span>{point.voice} voice</span>
                      </div>
                      {point.emergencies > 0 && (
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <span>{point.emergencies} emergency</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <TrendingUp size={48} className="mb-4" />
                <p>No activity data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Language Usage
          </h3>
          <div className="h-64">
            {chartData?.languages?.length > 0 ? (
              <div className="space-y-3">
                {chartData.languages.map((lang, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: lang.color }}
                      ></div>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${lang.value}%`,
                            backgroundColor: lang.color 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {lang.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <Globe size={48} className="mb-4" />
                <p>No language data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Error Rate */}
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              metrics.errorRate > 5 ? 'text-red-600' : 'text-green-600'
            }`}>
              {metrics.errorRate}%
            </div>
            <p className="text-sm text-gray-600">Error Rate</p>
            <div className="flex items-center justify-center mt-2">
              {metrics.errorRate > 5 ? (
                <TrendingUp className="text-red-500" size={16} />
              ) : (
                <TrendingDown className="text-green-500" size={16} />
              )}
            </div>
          </div>

          {/* AI Model Usage */}
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {metrics.aiRequests}
            </div>
            <p className="text-sm text-gray-600">AI Requests</p>
            <p className="text-xs text-gray-500 mt-1">
              GPT-4o: {metrics.modelUsage['gpt-4o'] || 0}
            </p>
          </div>

          {/* Session Duration */}
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatDuration(metrics.sessionDuration)}
            </div>
            <p className="text-sm text-gray-600">Avg Session</p>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.messagesPerSession} msg/session
            </p>
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      {analyticsData.insights && analyticsData.insights.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            AI-Generated Insights
          </h3>
          <div className="space-y-3">
            {analyticsData.insights.map((insight, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.impact === 'positive' 
                    ? 'bg-green-50 border-green-500' 
                    : insight.impact === 'negative'
                    ? 'bg-red-50 border-red-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start">
                  <Target className={`mr-3 mt-1 ${
                    insight.impact === 'positive' ? 'text-green-600' :
                    insight.impact === 'negative' ? 'text-red-600' : 'text-blue-600'
                  }`} size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {insight.message}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Confidence: {insight.confidence} • Type: {insight.type}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Last updated: {new Date(analyticsData.timestamp).toLocaleString()}
          </div>
          <div>
            Session ID: {analyticsData.summary.session.sessionId?.slice(-8)}
          </div>
        </div>
      </div>
    </div>
  );
};