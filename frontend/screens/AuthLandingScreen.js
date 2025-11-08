import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const AuthLandingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.PRIMARY, COLORS.SECONDARY, '#8B5CF6']}
        style={styles.gradient}
      >
        {/* Logo/Brand Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="calendar" size={64} color={COLORS.WHITE} />
          </View>
          <Text style={styles.appName}>CampusConnect</Text>
          <Text style={styles.tagline}>Your Campus Events, One App</Text>
        </View>

        {/* Auth Options */}
        <View style={styles.authOptionsContainer}>
          <Text style={styles.welcomeText}>Welcome! Choose your role</Text>

          {/* Student Login Button */}
          <TouchableOpacity
            style={styles.authCard}
            onPress={() => navigation.navigate('StudentLogin')}
            activeOpacity={0.9}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="person" size={32} color={COLORS.PRIMARY} />
            </View>
            <View style={styles.authCardContent}>
              <Text style={styles.authCardTitle}>Student</Text>
              <Text style={styles.authCardSubtitle}>
                Discover and join campus events
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>

          {/* Admin Login Button */}
          <TouchableOpacity
            style={styles.authCard}
            onPress={() => navigation.navigate('AdminLogin')}
            activeOpacity={0.9}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="shield-checkmark" size={32} color="#EF4444" />
            </View>
            <View style={styles.authCardContent}>
              <Text style={styles.authCardTitle}>Admin / CR</Text>
              <Text style={styles.authCardSubtitle}>
                Manage events and approve requests
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              New student?{' '}
              <Text
                style={styles.infoLink}
                onPress={() => navigation.navigate('StudentRegister')}
              >
                Create an account
              </Text>
            </Text>
            <Text style={styles.infoSubtext}>
              Admin accounts are created by system administrators
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 CampusConnect. All rights reserved.
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: SPACING.xs,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.WHITE,
    opacity: 0.9,
  },
  authOptionsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: SPACING.xxxl,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.WHITE,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  authCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authCardContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  authCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  authCardSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  infoSection: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.WHITE,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  infoLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  infoSubtext: {
    fontSize: 12,
    color: COLORS.WHITE,
    opacity: 0.7,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.WHITE,
    opacity: 0.6,
  },
});

export default AuthLandingScreen;
