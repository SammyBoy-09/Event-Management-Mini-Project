import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../utils/theme';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Gradient Effect */}
      <View style={styles.gradientBackground} />
      
      {/* Logo and App Name */}
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Ionicons 
            name="calendar" 
            size={60} 
            color={theme.colors.textInverse} 
          />
        </View>
        
        <Text style={styles.appName}>CampusConnect</Text>
        <Text style={styles.tagline}>Smart Event Management</Text>
      </Animated.View>

      {/* Loading Indicator */}
      <Animated.View 
        style={[
          styles.loadingContainer,
          { opacity: fadeAnim },
        ]}
      >
        <View style={styles.loadingBar}>
          <Animated.View 
            style={[
              styles.loadingProgress,
              {
                transform: [{
                  translateX: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                  }),
                }],
              },
            ]}
          />
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </Animated.View>

      {/* Version Info */}
      <Animated.View 
        style={[
          styles.versionContainer,
          { opacity: fadeAnim },
        ]}
      >
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <Text style={styles.copyrightText}>© 2024 CampusConnect</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    backgroundColor: theme.colors.primaryDark,
    borderRadius: width,
    top: -width / 2,
    left: -width / 2,
    opacity: 0.1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
    shadowColor: theme.colors.textInverse,
  },
  appName: {
    fontSize: theme.fontSizes.huge,
    fontWeight: 'bold',
    color: theme.colors.textInverse,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  tagline: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.textInverse,
    opacity: 0.9,
    textAlign: 'center',
    fontWeight: '300',
  },
  loadingContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: theme.spacing.xxxl * 2,
    width: '80%',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  loadingProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.textInverse,
    borderRadius: 2,
  },
  loadingText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.md,
    opacity: 0.8,
  },
  versionContainer: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    alignItems: 'center',
  },
  versionText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.sm,
    opacity: 0.7,
    marginBottom: theme.spacing.xs,
  },
  copyrightText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.sm,
    opacity: 0.6,
  },
});

export default SplashScreen;
