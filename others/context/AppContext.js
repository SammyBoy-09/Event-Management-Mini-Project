import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockEvents, mockNotifications } from '../data/mockData';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  events: [],
  notifications: [],
  loading: false,
  error: null,
};

// Action types
export const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_EVENTS: 'SET_EVENTS',
  ADD_EVENT: 'ADD_EVENT',
  UPDATE_EVENT: 'UPDATE_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    
    case ACTION_TYPES.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        events: [],
        notifications: [],
        loading: false,
        error: null,
      };
    
    case ACTION_TYPES.SET_EVENTS:
      return { ...state, events: action.payload };
    
    case ACTION_TYPES.ADD_EVENT:
      return { ...state, events: [...state.events, action.payload] };
    
    case ACTION_TYPES.UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    
    case ACTION_TYPES.DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
      };
    
    case ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    
    case ACTION_TYPES.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };
    
    case ACTION_TYPES.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] };
    
    default:
      return state;
  }
};

// Create Context
const AppContext = createContext();

// Context Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted data on app start
  useEffect(() => {
    loadPersistedData();
  }, []);

  // Persist user data when authenticated
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      AsyncStorage.setItem('user', JSON.stringify(state.user));
    } else {
      AsyncStorage.removeItem('user');
    }
  }, [state.isAuthenticated, state.user]);

  const loadPersistedData = async () => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      
      // Load user data
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        dispatch({ type: ACTION_TYPES.LOGIN_SUCCESS, payload: user });
      }

      // Load mock data for demo
      dispatch({ type: ACTION_TYPES.SET_EVENTS, payload: mockEvents });
      
      // Add some mock notifications
      mockNotifications.forEach(notification => {
        dispatch({ type: ACTION_TYPES.ADD_NOTIFICATION, payload: notification });
      });
      
    } catch (error) {
      console.error('Error loading persisted data:', error);
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  };

  // Action creators
  const actions = {
    setLoading: (loading) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
    },

    login: async (userData) => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        dispatch({ type: ACTION_TYPES.LOGIN_SUCCESS, payload: userData });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      }
    },

    logout: async () => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        await AsyncStorage.removeItem('user');
        dispatch({ type: ACTION_TYPES.LOGOUT });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },

    setEvents: (events) => {
      dispatch({ type: ACTION_TYPES.SET_EVENTS, payload: events });
    },

    addEvent: (event) => {
      const newEvent = {
        ...event,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: ACTION_TYPES.ADD_EVENT, payload: newEvent });
      return newEvent;
    },

    updateEvent: (event) => {
      dispatch({ type: ACTION_TYPES.UPDATE_EVENT, payload: event });
    },

    deleteEvent: (eventId) => {
      dispatch({ type: ACTION_TYPES.DELETE_EVENT, payload: eventId });
    },

    addNotification: (notification) => {
      const newNotification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        read: false,
      };
      dispatch({ type: ACTION_TYPES.ADD_NOTIFICATION, payload: newNotification });
    },

    markNotificationRead: (notificationId) => {
      dispatch({ type: ACTION_TYPES.MARK_NOTIFICATION_READ, payload: notificationId });
    },

    clearNotifications: () => {
      dispatch({ type: ACTION_TYPES.CLEAR_NOTIFICATIONS });
    },
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
