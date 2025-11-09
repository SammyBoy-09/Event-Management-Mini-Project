import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * API Configuration
 * Base URL for backend API
 * Automatically detects the correct URL based on the environment
 */

// ⚠️ MANUAL OVERRIDE (if auto-detection fails)
// For production, use your deployed backend URL:
const MANUAL_API_URL = 'https://event-management-mini-project.onrender.com/api';
// const MANUAL_API_URL = null; // Uncomment to use auto-detection

// Get the local IP address dynamically from Expo
const getApiUrl = () => {
  // If manual URL is set, use it
  if (MANUAL_API_URL) {
    console.log('🔧 Using manual API URL:', MANUAL_API_URL);
    return MANUAL_API_URL;
  }
  
  // For production, use your deployed backend URL
  if (__DEV__) {
    // Development mode
    
    // Try to get debugger host from expoConfig (new) or manifest (deprecated)
    const expoConfig = Constants.expoConfig;
    const manifest = Constants.manifest;
    
    // Get the debugger host (works for both physical devices and emulators)
    const debuggerHost = expoConfig?.hostUri || manifest?.debuggerHost || manifest?.hostUri;
    
    console.log('🔍 Debugger Host:', debuggerHost);
    console.log('🔍 Platform:', Platform.OS);
    
    if (debuggerHost) {
      // Extract IP address from debuggerHost (format: "192.168.x.x:19000" or "192.168.x.x:8081")
      const host = debuggerHost.split(':')[0];
      
      // Check if it's a real IP address (not localhost or emulator address)
      if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
        console.log('✅ Using detected IP:', host);
        return `http://${host}:5000/api`;
      }
    }
    
    // Fallback URLs for different platforms
    if (Platform.OS === 'android') {
      console.log('⚠️ Falling back to Android emulator address');
      // Android emulator
      return 'http://10.0.2.2:5000/api';
    } else if (Platform.OS === 'ios') {
      console.log('⚠️ Falling back to iOS simulator address');
      // iOS simulator
      return 'http://localhost:5000/api';
    }
    
    // Default fallback
    console.log('⚠️ Falling back to localhost');
    return 'http://localhost:5000/api';
  } else {
    // Production mode - replace with your actual deployed backend URL
    return 'https://your-backend-url.com/api';
  }
};

const API_BASE_URL = getApiUrl();

// Log the API URL for debugging
console.log('📡 API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add JWT token to headers
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API Methods
 */

// Register new student
export const registerStudent = async (studentData) => {
  try {
    const response = await api.post('/auth/register', studentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login student
export const loginStudent = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Get student profile
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

// Update student profile
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Change password
export const changePassword = async (passwords) => {
  try {
    const response = await api.put('/auth/change-password', passwords);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to change password' };
  }
};

// Logout user (clear local storage)
export const logout = async () => {
  try {
    // Clear user data from AsyncStorage
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout error:', error);
    throw { message: 'Failed to logout' };
  }
};

/**
 * Event API Methods
 */

// Create event
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create event' };
  }
};

// Get all events with filters
export const getAllEvents = async (filters = {}) => {
  try {
    const response = await api.get('/events', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch events' };
  }
};

// Get event by ID
export const getEventById = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch event details' };
  }
};

// Update event
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update event' };
  }
};

// Delete event
export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete event' };
  }
};

// RSVP to event
export const rsvpEvent = async (eventId) => {
  try {
    const response = await api.post(`/events/${eventId}/rsvp`);
    
    // Update user's registeredEvents in AsyncStorage
    const userDataStr = await AsyncStorage.getItem('userData');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      if (!userData.registeredEvents) {
        userData.registeredEvents = [];
      }
      if (!userData.registeredEvents.includes(eventId)) {
        userData.registeredEvents.push(eventId);
      }
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('✅ Updated user registeredEvents after RSVP:', userData.registeredEvents);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to RSVP' };
  }
};

// Cancel RSVP
export const cancelRSVP = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}/rsvp`);
    
    // Update user's registeredEvents in AsyncStorage
    const userDataStr = await AsyncStorage.getItem('userData');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      if (userData.registeredEvents) {
        userData.registeredEvents = userData.registeredEvents.filter(id => id !== eventId);
      }
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('✅ Updated user registeredEvents after cancel:', userData.registeredEvents);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to cancel RSVP' };
  }
};

// Approve event (Admin only)
export const approveEvent = async (eventId) => {
  try {
    const response = await api.put(`/events/${eventId}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to approve event' };
  }
};

// Reject event (Admin only)
export const rejectEvent = async (eventId, reason) => {
  try {
    const response = await api.put(`/events/${eventId}/reject`, { reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reject event' };
  }
};

// Update event status (Admin only)
export const updateEventStatus = async (eventId, status, reason = '') => {
  try {
    const response = await api.put(`/events/${eventId}/status`, { status, reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update event status' };
  }
};

// Mark attendance
export const markAttendance = async (eventId, studentId, attended, checkInMethod = 'manual') => {
  try {
    const response = await api.put(`/events/${eventId}/attendance/${studentId}`, { 
      attended,
      checkInMethod 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark attendance' };
  }
};

// Get event attendees
export const getEventAttendees = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/attendees`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch attendees' };
  }
};

/**
 * Notification API Methods
 */

// Get all notifications
export const getNotifications = async (filters = {}) => {
  try {
    const response = await api.get('/notifications', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch notifications' };
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark as read' };
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.put('/notifications/read-all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark all as read' };
  }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete notification' };
  }
};

// Delete all notifications
export const deleteAllNotifications = async () => {
  try {
    const response = await api.delete('/notifications');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete all notifications' };
  }
};

/**
 * Admin API Methods
 */

// Register new admin
export const registerAdmin = async (adminData) => {
  try {
    const response = await api.post('/auth/admin/register', adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Admin registration failed' };
  }
};

// Login admin
export const loginAdmin = async (credentials) => {
  try {
    const response = await api.post('/auth/admin/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Admin login failed' };
  }
};

// Get admin profile
export const getAdminProfile = async () => {
  try {
    const response = await api.get('/auth/admin/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch admin profile' };
  }
};

/**
 * Storage Helper Functions
 */

// Save authentication data
export const saveAuthData = async (token, userData) => {
  try {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving auth data:', error);
    throw error;
  }
};

// Get authentication data
export const getAuthData = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    return {
      token,
      userData: userData ? JSON.parse(userData) : null,
    };
  } catch (error) {
    console.error('Error getting auth data:', error);
    return { token: null, userData: null };
  }
};

// Clear authentication data
export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};

export default api;
