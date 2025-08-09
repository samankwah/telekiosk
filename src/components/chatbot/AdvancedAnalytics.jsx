import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart 
} from 'recharts';
import { 
  TrendingUp, Users, MessageSquare, Clock, AlertTriangle, 
  Globe, Mic, Calendar, Activity, Brain, Zap, Target 
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService.js';

/**
 * Advanced Analytics Dashboard for TeleKiosk AI Chatbot
 * Real-time insights, AI recommendations, and comprehensive performance metrics
 */
export const AdvancedAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalInteractions: 0,
      voiceInteractions: 0,
      emergencyDetections: 0,
      bookingAttempts: 0,
      averageResponseTime: 0,
      userSatisfaction: 0,
      languageSwitches: 0,
      activeUsers: 0
    },
    trends: {
      hourly: [],
      daily: [],
      weekly: []
    },
    languages: {
      en: 0, tw: 0, ga: 0, ew: 0
    },
    emergencyTypes: [],
    responseTimeTrends: [],
    voiceAdoption: [],
    aiRecommendations: [],
    performanceMetrics: {
      accuracy: 0,
      availability: 0,
      speed: 0,
      satisfaction: 0
    }
  });

  const [timeRange, setTimeRange] = useState('24h'); // 24h, 7d, 30d
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load analytics data
  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate comprehensive analytics data (in production, this would come from your analytics service)
      const data = {
        overview: {
          totalInteractions: 1247,
          voiceInteractions: 312,
          emergencyDetections: 23,
          bookingAttempts: 89,
          averageResponseTime: 1850,
          userSatisfaction: 4.7,
          languageSwitches: 45,
          activeUsers: 156
        },
        trends: {
          hourly: generateHourlyData(),
          daily: generateDailyData(),
          weekly: generateWeeklyData()
        },
        languages: {
          en: 65, tw: 20, ga: 10, ew: 5
        },
        emergencyTypes: [
          { type: 'Cardiovascular', count: 8, severity: 'critical' },
          { type: 'Respiratory', count: 6, severity: 'high' },
          { type: 'Neurological', count: 4, severity: 'critical' },
          { type: 'Trauma', count: 3, severity: 'high' },
          { type: 'Other', count: 2, severity: 'medium' }
        ],
        responseTimeTrends: generateResponseTimeTrends(),
        voiceAdoption: generateVoiceAdoptionData(),
        aiRecommendations: generateAIRecommendations(),
        performanceMetrics: {
          accuracy: 94.2,
          availability: 99.8,
          speed: 92.1,
          satisfaction: 94.0
        }
      };

      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate sample data (replace with real analytics in production)
  const generateHourlyData = () => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      interactions: Math.floor(Math.random() * 50) + 10,
      voice: Math.floor(Math.random() * 15) + 2,
      emergencies: Math.floor(Math.random() * 3),
      bookings: Math.floor(Math.random() * 8) + 1
    }));
  };

  const generateDailyData = () => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      interactions: Math.floor(Math.random() * 200) + 100,
      satisfaction: (Math.random() * 1 + 4).toFixed(1)
    }));
  };

  const generateWeeklyData = () => {
    return Array.from({ length: 4 }, (_, i) => ({
      week: `Week ${i + 1}`,
      growth: (Math.random() * 20 + 5).toFixed(1),
      adoption: (Math.random() * 30 + 60).toFixed(1)
    }));
  };

  const generateResponseTimeTrends = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      time: `${i + 1}h`,
      avgTime: Math.floor(Math.random() * 1000) + 1500,
      p95: Math.floor(Math.random() * 1500) + 2000
    }));
  };

  const generateVoiceAdoptionData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      adoption: Math.floor(Math.random() * 30) + 15,
      quality: (Math.random() * 0.5 + 4.5).toFixed(1)
    }));
  };

  const generateAIRecommendations = () => {
    return [
      {
        id: 1,
        type: 'performance',
        priority: 'high',
        title: 'Optimize Peak Hour Response Times',
        description: 'Response times increase by 40% during 9-11 AM. Consider implementing intelligent caching for common queries.',
        impact: 'Reduce response time by ~600ms',
        actionRequired: true
      },
      {
        id: 2,
        type: 'language',
        priority: 'medium',
        title: 'Expand Twi Language Support',
        description: 'Twi usage increased 25% this week. Consider adding more healthcare-specific Twi phrases.',
        impact: 'Improve user satisfaction by 15%',
        actionRequired: false
      },
      {
        id: 3,
        type: 'emergency',
        priority: 'high',
        title: 'Emergency Detection Accuracy',
        description: 'Emergency detection confidence scores suggest room for improvement in cardiovascular symptoms.',
        impact: 'Improve emergency detection by 8%',
        actionRequired: true
      },
      {
        id: 4,
        type: 'voice',
        priority: 'low',
        title: 'Voice Feature Promotion',
        description: 'Only 25% of users try voice features. Consider adding onboarding prompts.',
        impact: 'Increase voice adoption by 20%',
        actionRequired: false
      }
    ];
  };

  // Auto-refresh data
  useEffect(() => {
    loadAnalyticsData();
    
    if (autoRefresh) {
      const interval = setInterval(loadAnalyticsData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [timeRange, autoRefresh]);

  const colors = {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#8B5CF6'
  };

  const MetricCard = ({ icon: Icon, title, value, change, color = 'primary' }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color === 'primary' ? 'blue' : color}-100`}>
          <Icon className={`w-6 h-6 text-${color === 'primary' ? 'blue' : color}-600`} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4" />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );

  const AIRecommendationCard = ({ recommendation }) => (
    <div className={`bg-white rounded-lg p-4 border-l-4 ${
      recommendation.priority === 'high' ? 'border-red-500' :
      recommendation.priority === 'medium' ? 'border-yellow-500' : 'border-blue-500'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Brain className={`w-5 h-5 ${
            recommendation.priority === 'high' ? 'text-red-500' :
            recommendation.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
          }`} />
          <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          recommendation.priority === 'high' ? 'bg-red-100 text-red-700' :
          recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {recommendation.priority}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-2">{recommendation.description}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-green-600 font-medium">{recommendation.impact}</span>
        {recommendation.actionRequired && (
          <button className="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
            Take Action
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="advanced-analytics-dashboard p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              TeleKiosk AI Analytics
            </h1>
            <p className="text-gray-600 mt-1">Real-time insights and AI-powered recommendations</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              {autoRefresh ? '🟢 Live' : '⚫ Paused'}
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={MessageSquare}
          title="Total Interactions"
          value={analyticsData.overview.totalInteractions.toLocaleString()}
          change={12.5}
        />
        <MetricCard
          icon={Mic}
          title="Voice Interactions"
          value={analyticsData.overview.voiceInteractions.toLocaleString()}
          change={25.8}
          color="success"
        />
        <MetricCard
          icon={AlertTriangle}
          title="Emergency Detections"
          value={analyticsData.overview.emergencyDetections}
          change={-8.2}
          color="warning"
        />
        <MetricCard
          icon={Calendar}
          title="Appointment Bookings"
          value={analyticsData.overview.bookingAttempts}
          change={15.3}
          color="info"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(analyticsData.performanceMetrics).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg p-4 text-center">
            <div className={`text-2xl font-bold mb-1 ${
              value >= 95 ? 'text-green-600' : value >= 90 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {value}%
            </div>
            <div className="text-gray-600 text-sm capitalize">{key}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${
                  value >= 95 ? 'bg-green-500' : value >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Interaction Trends */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Interaction Trends (24h)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.trends.hourly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="interactions" stackId="1" stroke={colors.primary} fill={colors.primary} fillOpacity={0.6} />
              <Area type="monotone" dataKey="voice" stackId="1" stroke={colors.success} fill={colors.success} fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Language Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Language Usage
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'English', value: analyticsData.languages.en, color: '#3B82F6' },
                  { name: 'Twi', value: analyticsData.languages.tw, color: '#10B981' },
                  { name: 'Ga', value: analyticsData.languages.ga, color: '#F59E0B' },
                  { name: 'Ewe', value: analyticsData.languages.ew, color: '#8B5CF6' }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {[
                  { color: '#3B82F6' },
                  { color: '#10B981' },
                  { color: '#F59E0B' },
                  { color: '#8B5CF6' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Response Time Analysis */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Response Time Analysis
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.responseTimeTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avgTime" stroke={colors.primary} strokeWidth={2} name="Average Time" />
            <Line type="monotone" dataKey="p95" stroke={colors.warning} strokeWidth={2} name="95th Percentile" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          AI-Powered Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyticsData.aiRecommendations.map((recommendation) => (
            <AIRecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      </div>

      {/* Emergency Detection Analysis */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-red-600" />
          Emergency Detection Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {analyticsData.emergencyTypes.map((type, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              type.severity === 'critical' ? 'border-red-500 bg-red-50' :
              type.severity === 'high' ? 'border-orange-500 bg-orange-50' : 'border-yellow-500 bg-yellow-50'
            }`}>
              <div className="text-2xl font-bold text-gray-900">{type.count}</div>
              <div className="text-sm text-gray-600">{type.type}</div>
              <div className={`text-xs mt-1 font-medium ${
                type.severity === 'critical' ? 'text-red-700' :
                type.severity === 'high' ? 'text-orange-700' : 'text-yellow-700'
              }`}>
                {type.severity.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;