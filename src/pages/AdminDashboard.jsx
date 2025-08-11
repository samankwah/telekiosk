import React, { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useRealTime, useAppointmentUpdates, useNotifications } from '../services/realTimeService';
import { LoadingSpinner } from '../components/ui/AnimationComponents.jsx';

function AdminDashboard() {
  const [dashboardRef, isDashboardVisible] = useScrollAnimation(0.1);
  const { isConnected, connect, disconnect } = useRealTime();
  const { appointments, loading: appointmentsLoading } = useAppointmentUpdates();
  const { notifications, dismissNotification, clearAll } = useNotifications();
  
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    activeUsers: 0,
    systemStatus: 'operational'
  });

  const [selectedTab, setSelectedTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Calculate statistics from appointments
    if (appointments.length > 0) {
      const pending = appointments.filter(apt => apt.status === 'pending').length;
      const completed = appointments.filter(apt => apt.status === 'completed').length;
      
      setStats(prev => ({
        ...prev,
        totalAppointments: appointments.length,
        pendingAppointments: pending,
        completedAppointments: completed
      }));
    }
    setIsLoading(false);
  }, [appointments]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'appointments', name: 'Appointments', icon: '📅' },
    { id: 'services', name: 'Services', icon: '🏥' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  const StatCard = ({ title, value, icon, color, change }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {change && (
            <p className={`text-sm ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
              {change.positive ? '↗' : '↘'} {change.value}
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  const AppointmentCard = ({ appointment }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${
          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
          appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {appointment.status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-1">📅 {appointment.date}</p>
      <p className="text-sm text-gray-600 mb-1">🕐 {appointment.time}</p>
      <p className="text-sm text-gray-600">🏥 {appointment.service}</p>
    </div>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Appointments"
                value={stats.totalAppointments}
                icon="📅"
                color="text-blue-600"
                change={{ positive: true, value: "+12%" }}
              />
              <StatCard
                title="Pending"
                value={stats.pendingAppointments}
                icon="⏳"
                color="text-yellow-600"
                change={{ positive: false, value: "-5%" }}
              />
              <StatCard
                title="Completed"
                value={stats.completedAppointments}
                icon="✅"
                color="text-green-600"
                change={{ positive: true, value: "+8%" }}
              />
              <StatCard
                title="Active Users"
                value={stats.activeUsers}
                icon="👥"
                color="text-purple-600"
                change={{ positive: true, value: "+3%" }}
              />
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h2>
              {appointmentsLoading ? (
                <div className="flex justify-center">
                  <LoadingSpinner size="md" color="orange" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appointments.slice(0, 6).map((appointment, index) => (
                    <AppointmentCard key={appointment.id || index} appointment={appointment} />
                  ))}
                </div>
              )}
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-green-600 text-2xl mb-2">🟢</div>
                  <p className="text-sm font-medium text-green-800">API Services</p>
                  <p className="text-xs text-green-600">Operational</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-green-600 text-2xl mb-2">🟢</div>
                  <p className="text-sm font-medium text-green-800">Database</p>
                  <p className="text-xs text-green-600">Operational</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-yellow-600 text-2xl mb-2">🟡</div>
                  <p className="text-sm font-medium text-yellow-800">Real-time Updates</p>
                  <p className="text-xs text-yellow-600">{isConnected ? 'Operational' : 'Reconnecting'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">All Appointments</h2>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  Add New Appointment
                </button>
              </div>
              {appointmentsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" color="orange" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appointments.map((appointment, index) => (
                    <AppointmentCard key={appointment.id || index} appointment={appointment} />
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Management</h2>
            <p className="text-gray-600">Service management features coming soon...</p>
          </div>
        );

      case 'users':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
            <p className="text-gray-600">User management features coming soon...</p>
          </div>
        );

      case 'analytics':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h2>
            <p className="text-gray-600">Analytics features coming soon...</p>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Real-time Connection</h3>
                  <p className="text-sm text-gray-600">Manage WebSocket connection</p>
                </div>
                <button
                  onClick={isConnected ? disconnect : connect}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isConnected
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="xl" color="orange" />
          <p className="mt-4 text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TeleKiosk Admin</h1>
              <p className="text-sm text-gray-600">Hospital Management Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {notifications.length > 0 && (
                <div className="relative">
                  <button className="relative p-2 text-gray-600 hover:text-gray-900">
                    🔔
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  </button>
                </div>
              )}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{isConnected ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedTab === tab.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div 
            ref={dashboardRef}
            className={`flex-1 transition-all duration-700 ${
              isDashboardVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-4'
            }`}
          >
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;