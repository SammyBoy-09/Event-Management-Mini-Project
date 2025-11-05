import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

/**
 * Landing Page / Welcome Screen
 * First screen users see when opening the app
 */
const LandingPage = ({ navigation }) => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: 'calendar',
      title: 'Discover Events',
      description: 'Browse and explore exciting campus events',
    },
    {
      icon: 'pricetag-outline',
      title: 'Easy Registration',
      description: 'Register for events with just a few taps',
    },
    {
      icon: 'notifications-outline',
      title: 'Stay Updated',
      description: 'Get notified about upcoming events',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header Section with Gradient Background */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={60} color={COLORS.surface} />
        </View>
        
        <Text style={styles.title}>CampusConnect</Text>
        <Text style={styles.subtitle}>Your Campus Event Hub</Text>
        
        {/* Decorative Elements */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
      </View>

      {/* Features Section */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View
              key={index}
              style={[
                styles.featureCard,
                currentFeature === index && styles.featureCardActive,
              ]}
            >
              <View style={styles.featureIconContainer}>
                <Ionicons
                  name={feature.icon}
                  size={32}
                  color={currentFeature === index ? COLORS.primary : COLORS.textLight}
                />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

        {/* Feature Dots Indicator */}
        <View style={styles.dotsContainer}>
          {features.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentFeature === index && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Call to Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
          />
          
          <Button
            title="Create Account"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            style={styles.registerButton}
          />
        </View>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          Join thousands of students discovering amazing campus events
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.surface,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.surface,
    opacity: 0.9,
    fontSize: 16,
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -100,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: -50,
    left: -30,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  featureCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    ...SHADOWS.small,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  featureCardActive: {
    borderColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  featureTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xs,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  buttonContainer: {
    marginBottom: SPACING.lg,
  },
  loginButton: {
    marginBottom: SPACING.md,
  },
  registerButton: {
    backgroundColor: COLORS.surface,
  },
  footerText: {
    ...TYPOGRAPHY.body2,
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
});

export default LandingPage;
