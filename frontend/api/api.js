import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * API Configuration
 * Base URL for backend API
 * Update this URL based on your backend deployment
 */

// For Android Emulator, use 10.0.2.2
// For iOS Simulator, use localhost
// For Physical Device, use your computer's IP address (e.g., 192.168.1.x)
const API_BASE_URL = 'http://192.168.29.217:5000/api'; // Physical device

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
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to RSVP' };
  }
};

// Cancel RSVP
export const cancelRSVP = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}/rsvp`);
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

// Mark attendance
export const markAttendance = async (eventId, studentId, attended) => {
  try {
    const response = await api.put(`/events/${eventId}/attendance/${studentId}`, { attended });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark attendance' };
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
