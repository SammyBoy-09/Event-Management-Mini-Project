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
        {/* Logo/Brand Section - Top of Screen */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="calendar" size={48} color={COLORS.WHITE} />
          </View>
          <Text style={styles.appName}>CampusConnect</Text>
          <Text style={styles.tagline}>Your Campus Events, One App</Text>
        </View>

        {/* Auth Options - Centered */}
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
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: SPACING.xs,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.WHITE,
    opacity: 0.9,
  },
  authOptionsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.WHITE,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  authCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.PRIMARY + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authCardContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  authCardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 2,
  },
  authCardSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 17,
  },
  infoSection: {
    marginTop: SPACING.lg,
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
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
    fontSize: 11,
    color: COLORS.WHITE,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: COLORS.WHITE,
    opacity: 0.7,
  },
});

export default AuthLandingScreen;
