/**
 * TeleKiosk Mobile Application
 * React Native implementation with offline AI capabilities for Ghana's healthcare system
 * @author AI Integration Lead - TeleKiosk Team
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  Alert,
  Linking,
  AppState,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Provider as PaperProvider } from 'react-native-paper';

// Context providers
import { LanguageProvider } from './src/contexts/LanguageContext';
import { HealthDataProvider } from './src/contexts/HealthDataContext';
import { OfflineAIProvider } from './src/contexts/OfflineAIContext';
import { LocationProvider } from './src/contexts/LocationContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import AIHealthAssistantScreen from './src/screens/AIHealthAssistantScreen';
import SymptomCheckerScreen from './src/screens/SymptomCheckerScreen';
import AppointmentBookingScreen from './src/screens/AppointmentBookingScreen';
import MedicalRecordsScreen from './src/screens/MedicalRecordsScreen';
import EmergencyServicesScreen from './src/screens/EmergencyServicesScreen';
import HospitalFinderScreen from './src/screens/HospitalFinderScreen';
import HealthMonitoringScreen from './src/screens/HealthMonitoringScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';

// Services
import { offlineAIService } from './src/services/offlineAI';
import { healthDataService } from './src/services/healthDataService';
import { notificationService } from './src/services/notificationService';
import { syncService } from './src/services/syncService';
import { analyticsService } from './src/services/analyticsService';

// Utils
import { theme } from './src/utils/theme';
import { storageKeys } from './src/utils/constants';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'AIAssistant':
              iconName = 'smart-toy';
              break;
            case 'Symptoms':
              iconName = 'healing';
              break;
            case 'Appointments':
              iconName = 'event';
              break;
            case 'Records':
              iconName = 'folder-shared';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          elevation: 8,
          shadowOpacity: 0.1,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="AIAssistant" 
        component={AIHealthAssistantScreen}
        options={{ tabBarLabel: 'AI Assistant' }}
      />
      <Tab.Screen 
        name="Symptoms" 
        component={SymptomCheckerScreen}
        options={{ tabBarLabel: 'Symptoms' }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentBookingScreen}
        options={{ tabBarLabel: 'Book' }}
      />
      <Tab.Screen 
        name="Records" 
        component={MedicalRecordsScreen}
        options={{ tabBarLabel: 'Records' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    initializeApp();
    setupNotifications();
    setupNetworkListener();
    setupAppStateListener();

    return cleanup;
  }, []);

  /**
   * Initialize the application
   */
  const initializeApp = async () => {
    try {
      // Check if this is the first launch
      const hasLaunchedBefore = await AsyncStorage.getItem(storageKeys.HAS_LAUNCHED);
      if (!hasLaunchedBefore) {
        setIsFirstLaunch(true);
        await AsyncStorage.setItem(storageKeys.HAS_LAUNCHED, 'true');
      }

      // Check authentication status
      const userToken = await AsyncStorage.getItem(storageKeys.USER_TOKEN);
      setIsLoggedIn(!!userToken);

      // Initialize offline AI service
      await offlineAIService.initialize();

      // Initialize health data service
      await healthDataService.initialize();

      // Initialize analytics
      await analyticsService.initialize();

      // Load user preferences
      await loadUserPreferences();

      setIsLoading(false);
    } catch (error) {
      console.error('App initialization failed:', error);
      Alert.alert('Initialization Error', 'Failed to initialize the app. Please restart.');
      setIsLoading(false);
    }
  };

  /**
   * Setup push notifications
   */
  const setupNotifications = async () => {
    try {
      // Request notification permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        // Get FCM token
        const fcmToken = await messaging().getToken();
        console.log('FCM Token:', fcmToken);
        await AsyncStorage.setItem(storageKeys.FCM_TOKEN, fcmToken);

        // Setup notification handlers
        notificationService.setupNotificationHandlers();

        // Configure local notifications
        PushNotification.configure({
          onRegister: (token) => {
            console.log('Push notification token:', token);
          },
          onNotification: (notification) => {
            console.log('Local notification:', notification);
            notificationService.handleLocalNotification(notification);
          },
          permissions: {
            alert: true,
            badge: true,
            sound: true,
          },
          popInitialNotification: true,
          requestPermissions: Platform.OS === 'ios',
        });
      }
    } catch (error) {
      console.error('Notification setup failed:', error);
    }
  };

  /**
   * Setup network connectivity listener
   */
  const setupNetworkListener = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOnline = isOnline;
      const nowOnline = state.isConnected && state.isInternetReachable;
      
      setIsOnline(nowOnline);

      if (!wasOnline && nowOnline) {
        // Came back online - sync data
        handleBackOnline();
      } else if (wasOnline && !nowOnline) {
        // Went offline
        handleGoOffline();
      }
    });

    return unsubscribe;
  };

  /**
   * Setup app state change listener
   */
  const setupAppStateListener = () => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        handleAppForeground();
      } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        // App has gone to the background
        handleAppBackground();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  };

  /**
   * Handle app coming to foreground
   */
  const handleAppForeground = async () => {
    try {
      // Refresh authentication
      const userToken = await AsyncStorage.getItem(storageKeys.USER_TOKEN);
      setIsLoggedIn(!!userToken);

      // Sync data if online
      if (isOnline) {
        await syncService.syncAll();
      }

      // Update analytics
      analyticsService.trackEvent('app_foreground');
    } catch (error) {
      console.error('App foreground handling failed:', error);
    }
  };

  /**
   * Handle app going to background
   */
  const handleAppBackground = async () => {
    try {
      // Save any pending data
      await healthDataService.savePendingData();
      
      // Update analytics
      analyticsService.trackEvent('app_background');
    } catch (error) {
      console.error('App background handling failed:', error);
    }
  };

  /**
   * Handle coming back online
   */
  const handleBackOnline = async () => {
    try {
      Alert.alert('Connection Restored', 'You are back online. Syncing your data...');
      
      // Start sync process
      await syncService.syncAll();
      
      // Update offline AI models if needed
      await offlineAIService.checkForUpdates();
      
      analyticsService.trackEvent('network_online');
    } catch (error) {
      console.error('Back online handling failed:', error);
    }
  };

  /**
   * Handle going offline
   */
  const handleGoOffline = () => {
    Alert.alert(
      'Offline Mode',
      'You are now offline. Some features may be limited, but basic AI assistance is still available.',
      [{ text: 'OK', style: 'default' }]
    );
    
    analyticsService.trackEvent('network_offline');
  };

  /**
   * Load user preferences
   */
  const loadUserPreferences = async () => {
    try {
      const preferences = await AsyncStorage.getItem(storageKeys.USER_PREFERENCES);
      if (preferences) {
        const parsedPreferences = JSON.parse(preferences);
        // Apply user preferences
        console.log('User preferences loaded:', parsedPreferences);
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  };

  /**
   * Cleanup function
   */
  const cleanup = () => {
    // Cleanup any listeners or services
    console.log('App cleanup');
  };

  // Loading screen
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <Icon name="local-hospital" size={60} color={theme.colors.primary} />
          <Text style={styles.loadingText}>TeleKiosk</Text>
          <Text style={styles.loadingSubtext}>Initializing Ghana Healthcare AI...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <LanguageProvider>
          <HealthDataProvider>
            <OfflineAIProvider>
              <LocationProvider>
                <StatusBar
                  barStyle="dark-content"
                  backgroundColor={theme.colors.surface}
                />
                
                <NavigationContainer>
                  <Stack.Navigator
                    screenOptions={{
                      headerShown: false,
                      cardStyle: { backgroundColor: theme.colors.background },
                    }}
                  >
                    {isFirstLaunch ? (
                      <Stack.Screen 
                        name="Onboarding" 
                        component={OnboardingScreen}
                        options={{ gestureEnabled: false }}
                      />
                    ) : !isLoggedIn ? (
                      <Stack.Screen 
                        name="Login" 
                        component={LoginScreen}
                        options={{ gestureEnabled: false }}
                      />
                    ) : (
                      <>
                        <Stack.Screen 
                          name="Main" 
                          component={MainTabNavigator}
                        />
                        <Stack.Screen 
                          name="Emergency" 
                          component={EmergencyServicesScreen}
                          options={{
                            presentation: 'modal',
                            headerShown: true,
                            headerTitle: 'Emergency Services',
                            headerStyle: {
                              backgroundColor: theme.colors.error,
                            },
                            headerTintColor: theme.colors.onError,
                          }}
                        />
                        <Stack.Screen 
                          name="HospitalFinder" 
                          component={HospitalFinderScreen}
                          options={{
                            headerShown: true,
                            headerTitle: 'Find Hospitals',
                            headerStyle: {
                              backgroundColor: theme.colors.primary,
                            },
                            headerTintColor: theme.colors.onPrimary,
                          }}
                        />
                        <Stack.Screen 
                          name="HealthMonitoring" 
                          component={HealthMonitoringScreen}
                          options={{
                            headerShown: true,
                            headerTitle: 'Health Monitoring',
                            headerStyle: {
                              backgroundColor: theme.colors.primary,
                            },
                            headerTintColor: theme.colors.onPrimary,
                          }}
                        />
                        <Stack.Screen 
                          name="Settings" 
                          component={SettingsScreen}
                          options={{
                            headerShown: true,
                            headerTitle: 'Settings',
                            headerStyle: {
                              backgroundColor: theme.colors.surface,
                            },
                            headerTintColor: theme.colors.onSurface,
                          }}
                        />
                      </>
                    )}
                  </Stack.Navigator>
                </NavigationContainer>

                {/* Offline Indicator */}
                {!isOnline && (
                  <View style={styles.offlineIndicator}>
                    <Icon name="cloud-off" size={16} color={theme.colors.onError} />
                    <Text style={styles.offlineText}>Offline Mode</Text>
                  </View>
                )}
              </LocationProvider>
            </OfflineAIProvider>
          </HealthDataProvider>
        </LanguageProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 20,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
  },
  loadingSubtext: {
    fontSize: 16,
    color: theme.colors.onBackground,
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
  offlineIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.error,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    zIndex: 1000,
  },
  offlineText: {
    color: theme.colors.onError,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});