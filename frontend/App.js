// Polyfill for TextEncoder (required for QR code generation on React Native)
import { TextEncoder, TextDecoder } from 'text-encoding';
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// Screens
import SplashScreen from './screens/SplashScreen';
import LandingPage from './screens/LandingPage';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AuthLandingScreen from './screens/AuthLandingScreen';
import StudentLoginScreen from './screens/StudentLoginScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminRegisterScreen from './screens/AdminRegisterScreen';
import StudentRegisterScreen from './screens/StudentRegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminProfileScreen from './screens/AdminProfileScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import SettingsScreen from './screens/SettingsScreen';
import CalendarScreen from './screens/CalendarScreen';
import MyEventsScreen from './screens/MyEventsScreen';
import LoadingSpinner from './components/LoadingSpinner';

// API
import { getAuthData } from './api/api';

// Push Notifications
import {
  registerForPushNotificationsAsync,
  sendPushTokenToBackend,
  addNotificationReceivedListener,
  addNotificationResponseListener,
} from './utils/pushNotifications';

const Stack = createStackNavigator();

/**
 * Main App Component
 * Handles navigation and authentication flow
 */
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigationRef = useRef();

  useEffect(() => {
    checkAuthStatus();
    setupPushNotifications();

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  /**
   * Check if user is already authenticated
   */
  const checkAuthStatus = async () => {
    try {
      const { token, userData } = await getAuthData();
      if (token && userData) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Setup push notifications
   */
  const setupPushNotifications = async () => {
    try {
      // Register for push notifications
      const token = await registerForPushNotificationsAsync();
      
      if (token) {
        // Check if user is authenticated before sending token
        const { token: authToken } = await getAuthData();
        if (authToken) {
          await sendPushTokenToBackend(token);
        }
      } else {
        // Token registration failed - log but don't block app
        console.log('ℹ️ Push notifications unavailable. App will continue without push notifications.');
        console.log('💡 To enable: Use a device with Google Play Services or a Google Play emulator image.');
      }

      // Listen for notifications when app is in foreground
      notificationListener.current = addNotificationReceivedListener((notification) => {
        console.log('Notification received:', notification);
      });

      // Listen for notification taps
      responseListener.current = addNotificationResponseListener((response) => {
        const data = response.notification.request.content.data;
        console.log('Notification tapped:', data);

        // Navigate to event details if eventId is present
        if (data.eventId && navigationRef.current) {
          navigationRef.current.navigate('EventDetails', { eventId: data.eventId });
        }
      });
    } catch (error) {
      console.error('Error setting up push notifications:', error);
      console.log('ℹ️ App will continue without push notifications.');
    }
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Show loading spinner during auth check
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <PaperProvider>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName={isAuthenticated ? 'Dashboard' : 'AuthLanding'}
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#F8F9FE' },
          }}
        >
          {/* Public Routes - Legacy */}
          <Stack.Screen 
            name="Landing" 
            component={LandingPage}
            options={{ animationEnabled: true }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ 
              animationEnabled: true,
              cardStyleInterpolator: ({ current, layouts }) => {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0],
                        }),
                      },
                    ],
                  },
                };
              },
            }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ 
              animationEnabled: true,
              cardStyleInterpolator: ({ current, layouts }) => {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0],
                        }),
                      },
                    ],
                  },
                };
              },
            }}
          />

          {/* New Authentication Flow */}
          <Stack.Screen 
            name="AuthLanding" 
            component={AuthLandingScreen}
            options={{ 
              animationEnabled: true,
            }}
          />
          <Stack.Screen 
            name="StudentLogin" 
            component={StudentLoginScreen}
            options={{ 
              animationEnabled: true,
              cardStyleInterpolator: ({ current, layouts }) => {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0],
                        }),
                      },
                    ],
                  },
                };
              },
            }}
          />
          <Stack.Screen 
            name="AdminLogin" 
            component={AdminLoginScreen}
            options={{ 
              animationEnabled: true,
              cardStyleInterpolator: ({ current, layouts }) => {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0],
                        }),
                      },
                    ],
                  },
                };
              },
            }}
          />
          <Stack.Screen 
            name="AdminRegister" 
            component={AdminRegisterScreen}
            options={{ 
              animationEnabled: true,
              cardStyleInterpolator: ({ current, layouts }) => {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0],
                        }),
                      },
                    ],
                  },
                };
              },
            }}
          />
          <Stack.Screen 
            name="StudentRegister" 
            component={StudentRegisterScreen}
            options={{ 
              animationEnabled: true,
              cardStyleInterpolator: ({ current, layouts }) => {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0],
                        }),
                      },
                    ],
                  },
                };
              },
            }}
          />
          
          {/* Protected Routes */}
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ 
              animationEnabled: true,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="EventDetails" 
            component={EventDetailsScreen}
            options={{ 
              animationEnabled: true,
            }}
          />
          <Stack.Screen 
            name="CreateEvent" 
            component={CreateEventScreen}
            options={{ 
              animationEnabled: true,
            }}
          />
          <Stack.Screen 
            name="Notifications" 
            component={NotificationsScreen}
            options={{ 
              animationEnabled: true,
            }}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ 
              animationEnabled: true,
            }}
          />
          <Stack.Screen 
            name="AdminProfile" 
            component={AdminProfileScreen}
            options={{ 
              animationEnabled: true,
            }}
          />
          <Stack.Screen 
            name="AdminPanel" 
            component={AdminPanelScreen}
            options={{ 
              animationEnabled: true,
            }}
          />
          <Stack.Screen 
            name="QRScanner" 
            component={QRScannerScreen}
            options={{ 
              title: 'Scan QR Code',
              animationEnabled: true,
            }}
          />
          <Stack.Screen 
            name="Attendance" 
            component={AttendanceScreen}
            options={{ 
              title: 'Attendance Management',
              animationEnabled: true,
            }}
          />
          <Stack.Screen 
            name="Calendar" 
            component={CalendarScreen}
            options={{ 
              title: 'Event Calendar',
              animationEnabled: true,
            }}
          />
          <Stack.Screen 
            name="MyEvents" 
            component={MyEventsScreen}
            options={{ 
              headerShown: false,
              animationEnabled: true,
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ 
              animationEnabled: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
