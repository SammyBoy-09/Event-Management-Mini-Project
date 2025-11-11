import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import api from '../api/api';

// Configure how notifications are displayed when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications and get Expo push token
 * @returns {Promise<string|null>} Expo push token or null if registration failed
 */
export async function registerForPushNotificationsAsync() {
  let token = null;

  if (Device.isDevice) {
    // Check if we already have permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If we don't have permission, ask for it
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If permission denied, return null
    if (finalStatus !== 'granted') {
      console.log('Permission for push notifications was denied');
      return null;
    }

    // Get the Expo push token
    try {
      // try with retries in case Google Play services are temporarily unavailable
      const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
      token = await fetchExpoPushTokenWithRetry(projectId);
      if (token) console.log('Expo Push Token:', token);
    } catch (error) {
      console.error('Error getting push token:', error);
      // Helpful hint for common Android emulator issue
      if (error?.message && error.message.includes('SERVICE_NOT_AVAILABLE')) {
        console.warn('Fetch token failed with SERVICE_NOT_AVAILABLE. On Android emulators ensure you are using a Google Play system image or test on a physical device with Google Play Services.');
      }
      return null;
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  // Configure notification channels for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }

  return token;
}

// Helper: delay
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper: try to fetch Expo push token with retries (useful when Play Services briefly unavailable)
async function fetchExpoPushTokenWithRetry(projectId, retries = 2, delay = 1500) {
  try {
    const res = await Notifications.getExpoPushTokenAsync({ projectId });
    return res?.data ?? null;
  } catch (err) {
    const isServiceUnavailable = err?.message && err.message.includes('SERVICE_NOT_AVAILABLE');
    if (retries > 0 && isServiceUnavailable) {
      console.warn(`Push token fetch failed (SERVICE_NOT_AVAILABLE). Retrying in ${delay}ms... (${retries} retries left)`);
      await wait(delay);
      return fetchExpoPushTokenWithRetry(projectId, retries - 1, delay * 1.5);
    }
    // rethrow for the outer handler to catch/log
    throw err;
  }
}

/**
 * Send push token to backend
 * @param {string} token - Expo push token
 * @returns {Promise<boolean>} Success status
 */
export async function sendPushTokenToBackend(token) {
  try {
    const response = await api.post('/auth/register-push-token', {
      expoPushToken: token,
    });

    if (response.data.success) {
      console.log('✅ Push token registered with backend');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error registering push token:', error.message);
    return false;
  }
}

/**
 * Get notification badge count (unread notifications)
 * @returns {Promise<number>} Unread notification count
 */
export async function getNotificationBadgeCount() {
  try {
    const count = await Notifications.getBadgeCountAsync();
    return count;
  } catch (error) {
    console.error('Error getting badge count:', error);
    return 0;
  }
}

/**
 * Set notification badge count
 * @param {number} count - Badge count to set
 */
export async function setNotificationBadgeCount(count) {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error setting badge count:', error);
  }
}

/**
 * Clear all notifications
 */
export async function clearAllNotifications() {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
}

/**
 * Add notification received listener
 * @param {Function} callback - Callback function to handle notification
 * @returns {Subscription} Notification subscription
 */
export function addNotificationReceivedListener(callback) {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Add notification response listener (when user taps notification)
 * @param {Function} callback - Callback function to handle notification tap
 * @returns {Subscription} Notification response subscription
 */
export function addNotificationResponseListener(callback) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Schedule a local notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Additional data
 * @param {number} seconds - Seconds until notification fires
 */
export async function scheduleLocalNotification(title, body, data = {}, seconds = 0) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
        sound: 'default',
      },
      trigger: seconds > 0 ? { seconds: seconds } : null,
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}
