import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

const { width, height } = Dimensions.get('window');

/**
 * SplashScreen Component
 * Displays a beautiful animated splash screen on app launch
 * Shows app logo, name, and tagline with smooth animations
 */
const SplashScreen = ({ onFinish }) => {
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animation sequence
    startAnimationSequence();

    // Auto-hide splash after 2.5 seconds
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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
