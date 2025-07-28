// Real-time data integration service for live updates
import { useState, useEffect } from 'react';

class RealTimeService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.isConnected = false;
    this.heartbeatInterval = null;
    this.connectionUrl = this.getWebSocketUrl();
  }

  // Get WebSocket URL based on environment
  getWebSocketUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    
    // For development, use local WebSocket server
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return `${protocol}//${host}/ws`;
    }
    
    // For production, use actual WebSocket endpoint
    return `${protocol}//${host}/api/ws`;
  }

  // Connect to WebSocket server
  connect() {
    try {
      this.ws = new WebSocket(this.connectionUrl);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.scheduleReconnect();
    }
  }

  // Setup WebSocket event listeners
  setupEventListeners() {
    this.ws.onopen = () => {
      console.log('✅ WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.emit('connected', { timestamp: new Date().toISOString() });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('❌ WebSocket disconnected:', event.code, event.reason);
      this.isConnected = false;
      this.stopHeartbeat();
      this.emit('disconnected', { code: event.code, reason: event.reason });
      
      if (event.code !== 1000) { // Not a normal closure
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      this.emit('error', { error });
    };
  }

  // Handle incoming messages
  handleMessage(data) {
    const { type, payload, timestamp } = data;
    
    switch (type) {
      case 'heartbeat':
        this.send({ type: 'heartbeat_ack', timestamp: new Date().toISOString() });
        break;
      
      case 'appointment_update':
        this.emit('appointmentUpdate', payload);
        break;
      
      case 'queue_update':
        this.emit('queueUpdate', payload);
        break;
      
      case 'notification':
        this.emit('notification', payload);
        break;
      
      case 'system_status':
        this.emit('systemStatus', payload);
        break;
      
      case 'user_activity':
        this.emit('userActivity', payload);
        break;
      
      default:
        console.log('Unknown message type:', type, payload);
        this.emit('message', data);
    }
  }

  // Send message to server
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        clientId: this.getClientId()
      }));
      return true;
    } else {
      console.warn('WebSocket not connected. Message queued:', data);
      // Could implement message queuing here
      return false;
    }
  }

  // Get or create client ID
  getClientId() {
    let clientId = localStorage.getItem('telekiosk_client_id');
    if (!clientId) {
      clientId = 'client_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('telekiosk_client_id', clientId);
    }
    return clientId;
  }

  // Start heartbeat to keep connection alive
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send({ type: 'heartbeat' });
    }, 30000); // Send heartbeat every 30 seconds
  }

  // Stop heartbeat
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Schedule reconnection attempt
  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
      console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    } else {
      console.error('❌ Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
    }
  }

  // Add event listener
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  // Emit event to listeners
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Disconnect WebSocket
  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }

  // Get connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      readyState: this.ws ? this.ws.readyState : WebSocket.CLOSED,
      url: this.connectionUrl
    };
  }

  // Subscribe to appointment updates
  subscribeToAppointments(callback) {
    this.on('appointmentUpdate', callback);
    // Request current appointments
    this.send({ type: 'subscribe', topic: 'appointments' });
  }

  // Subscribe to queue updates
  subscribeToQueue(callback) {
    this.on('queueUpdate', callback);
    this.send({ type: 'subscribe', topic: 'queue' });
  }

  // Subscribe to notifications
  subscribeToNotifications(callback) {
    this.on('notification', callback);
    this.send({ type: 'subscribe', topic: 'notifications' });
  }

  // Update appointment status
  updateAppointmentStatus(appointmentId, status) {
    this.send({
      type: 'appointment_status_update',
      payload: { appointmentId, status }
    });
  }

  // Send user activity
  sendUserActivity(activity) {
    this.send({
      type: 'user_activity',
      payload: activity
    });
  }
}

// Create singleton instance
export const realTimeService = new RealTimeService();

// React hook for real-time data
export function useRealTime() {
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);
    const handleReconnectAttempts = () => setReconnectAttempts(realTimeService.reconnectAttempts);

    realTimeService.on('connected', handleConnected);
    realTimeService.on('disconnected', handleDisconnected);
    realTimeService.on('maxReconnectAttemptsReached', handleReconnectAttempts);

    // Auto-connect if not already connected
    if (!realTimeService.isConnected) {
      realTimeService.connect();
    }

    return () => {
      realTimeService.off('connected', handleConnected);
      realTimeService.off('disconnected', handleDisconnected);
      realTimeService.off('maxReconnectAttemptsReached', handleReconnectAttempts);
    };
  }, []);

  return {
    isConnected,
    reconnectAttempts,
    connect: () => realTimeService.connect(),
    disconnect: () => realTimeService.disconnect(),
    send: (data) => realTimeService.send(data),
    subscribe: (event, callback) => realTimeService.on(event, callback),
    unsubscribe: (event, callback) => realTimeService.off(event, callback)
  };
}

// Hook for appointment updates
export function useAppointmentUpdates() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUpdate = (data) => {
      setAppointments(current => {
        const updated = [...current];
        const index = updated.findIndex(apt => apt.id === data.id);
        
        if (index >= 0) {
          updated[index] = { ...updated[index], ...data };
        } else {
          updated.push(data);
        }
        
        return updated;
      });
      setLoading(false);
    };

    realTimeService.subscribeToAppointments(handleUpdate);

    return () => {
      realTimeService.off('appointmentUpdate', handleUpdate);
    };
  }, []);

  return { appointments, loading };
}

// Hook for queue updates
export function useQueueUpdates() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUpdate = (data) => {
      setQueue(data.queue || []);
      setLoading(false);
    };

    realTimeService.subscribeToQueue(handleUpdate);

    return () => {
      realTimeService.off('queueUpdate', handleUpdate);
    };
  }, []);

  return { queue, loading };
}

// Hook for notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (notification) => {
      setNotifications(current => [notification, ...current].slice(0, 10)); // Keep latest 10
    };

    realTimeService.subscribeToNotifications(handleNotification);

    return () => {
      realTimeService.off('notification', handleNotification);
    };
  }, []);

  const dismissNotification = (id) => {
    setNotifications(current => current.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return { notifications, dismissNotification, clearAll };
}

export default realTimeService;