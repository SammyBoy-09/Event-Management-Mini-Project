import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

// Backend URL for warming up
const BACKEND_URL = 'https://event-management-mini-project.onrender.com/api';

/**
 * SplashScreen Component
 * Displays a beautiful animated splash screen on app launch
 * Shows app logo, name, and tagline with smooth animations
 * Pings backend to wake it up from cold start
 */
const SplashScreen = ({ onFinish }) => {
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  
  // Backend warmup state
  const [backendStatus, setBackendStatus] = useState('Connecting to server...');
  const [isBackendReady, setIsBackendReady] = useState(false);

  useEffect(() => {
    // Start animation sequence
    startAnimationSequence();
    
    // Warm up backend
    warmUpBackend();
  }, []);

  /**
   * Warm up backend server (wake from cold start)
   */
  const warmUpBackend = async () => {
    const startTime = Date.now();
    const minDisplayTime = 1500; // Minimum 1.5 seconds to show animations
    
    try {
      console.log('🔥 Warming up backend server...');
      setBackendStatus('Waking up server...');
      
      // Try health endpoint first, fallback to root endpoint
      let response;
      try {
        response = await axios.get(`${BACKEND_URL}/health`, {
          timeout: 15000, // 15 second timeout
        });
      } catch (healthError) {
        // Health endpoint might not exist yet (old deployment), try root
        console.log('Health endpoint not available, trying root endpoint...');
        response = await axios.get(BACKEND_URL.replace('/api', ''), {
          timeout: 15000,
        });
      }
      
      const elapsedTime = Date.now() - startTime;
      console.log(`✅ Backend ready in ${elapsedTime}ms`);
      setBackendStatus('Server ready!');
      setIsBackendReady(true);
      
      // Wait for minimum display time before finishing
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
      setTimeout(() => {
        if (onFinish) {
          onFinish();
        }
      }, remainingTime);
      
    } catch (error) {
      const elapsedTime = Date.now() - startTime;
      console.log(`⚠️ Backend warmup took ${elapsedTime}ms (may still be starting)`);
      console.error('Backend warmup error:', error.message);
      
      setBackendStatus('Server is starting up...');
      
      // Still proceed after minimum time even if ping fails
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
      setTimeout(() => {
        setIsBackendReady(true);
        if (onFinish) {
          onFinish();
        }
      }, remainingTime + 1000); // Extra 1 second grace period
    }
  };

  /**
   * Animate splash screen elements in sequence
   */
  const startAnimationSequence = () => {
    // Logo animation (scale + fade in)
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // App name animation (fade in after logo)
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 500,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // Tagline animation (fade in last)
    Animated.timing(taglineOpacity, {
      toValue: 1,
      duration: 500,
      delay: 800,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryDark, COLORS.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Logo Container */}
      <View style={styles.logoContainer}>
        <Animated.View
          style={[
            styles.logoCircle,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Ionicons name="calendar" size={80} color={COLORS.WHITE} />
        </Animated.View>

        {/* App Name */}
        <Animated.Text
          style={[
            styles.appName,
            {
              opacity: textOpacity,
            },
          ]}
        >
          CampusConnect
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: taglineOpacity,
            },
          ]}
        >
          Your Campus Events Hub
        </Animated.Text>
      </View>

      {/* Loading Indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: taglineOpacity,
          },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.WHITE} />
        <Text style={styles.loadingText}>{backendStatus}</Text>
        {isBackendReady && (
          <View style={styles.readyBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.readyText}>Ready!</Text>
          </View>
        )}
      </Animated.View>

      {/* Footer */}
      <Animated.View
        style={[
          styles.footer,
          {
            opacity: taglineOpacity,
          },
        ]}
      >
        <Text style={styles.footerText}>Powered by Innovation</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.XXL,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },
  tagline: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: SPACING.XXL * 3,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: SPACING.MD,
    letterSpacing: 0.5,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: 20,
    marginTop: SPACING.SM,
  },
  readyText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: '#4CAF50',
    marginLeft: SPACING.XS,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: SPACING.XXL * 2,
  },
  footerText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
});

export default SplashScreen;
