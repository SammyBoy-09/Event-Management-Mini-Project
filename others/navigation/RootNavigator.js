import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import theme from '../utils/theme';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for authenticated users
const TabNavigator = () => {
  const { state } = useApp();
  const { user } = state;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Events':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Create':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Admin':
              iconName = focused ? 'shield' : 'shield-outline';
              break;
            case 'Scanner':
              iconName = focused ? 'qr-code' : 'qr-code-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.textInverse,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Home' }}
      />
      
      <Tab.Screen 
        name="Create" 
        component={CreateEventScreen}
        options={{ 
          title: 'Create Event',
          tabBarStyle: { display: 'none' }, // Hide tab bar on create event screen
        }}
      />

      {/* Show Scanner for Students and CRs */}
      {(user?.role === 'student' || user?.role === 'cr') && (
        <Tab.Screen 
          name="Scanner" 
          component={QRScannerScreen}
          options={{ title: 'QR Scanner' }}
        />
      )}

      {/* Show Admin Panel only for Admins and CRs */}
      {(user?.role === 'admin' || user?.role === 'cr') && (
        <Tab.Screen 
          name="Admin" 
          component={AdminPanelScreen}
          options={{ title: 'Admin Panel' }}
        />
      )}

      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Auth Stack for unauthenticated users
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.textInverse,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="Login" 
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Register" 
      component={RegisterScreen}
      options={{ title: 'Create Account' }}
    />
  </Stack.Navigator>
);

// Main App Stack
const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.textInverse,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="Main"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="EventDetails"
      component={EventDetailsScreen}
      options={{ title: 'Event Details' }}
    />
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{ title: 'Notifications' }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
  </Stack.Navigator>
);

// Root Navigator
const RootNavigator = () => {
  const { state } = useApp();
  const { loading } = state;

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
};

export default RootNavigator;
