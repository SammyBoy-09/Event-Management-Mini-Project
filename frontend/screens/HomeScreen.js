import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import { getProfile, clearAuthData } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Home Screen
 * Dashboard after successful login
 */
const HomeScreen = ({ route, navigation }) => {
  const [user, setUser] = useState(route.params?.user || null);
  const [loading, setLoading] = useState(!route.params?.user);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!route.params?.user) {
      fetchProfile();
    }
  }, []);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      if (response.success) {
        setUser(response.data.student);
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      Alert.alert('Error', 'Failed to load profile. Please login again.', [
        {
          text: 'OK',
          onPress: () => handleLogout(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await clearAuthData();
            navigation.replace('Landing');
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Student'}</Text>
        </View>
        
        <TouchableOpacity style={styles.profileIcon} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.surface} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="card-outline" size={20} color={COLORS.textLight} />
              <Text style={styles.detailLabel}>USN:</Text>
              <Text style={styles.detailValue}>{user?.usn}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="school-outline" size={20} color={COLORS.textLight} />
              <Text style={styles.detailLabel}>Year:</Text>
              <Text style={styles.detailValue}>
                {user?.year} Year | Semester {user?.semester}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="business-outline" size={20} color={COLORS.textLight} />
              <Text style={styles.detailLabel}>Department:</Text>
              <Text style={styles.detailValue}>{user?.department}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={20} color={COLORS.textLight} />
              <Text style={styles.detailLabel}>Phone:</Text>
              <Text style={styles.detailValue}>{user?.phone}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color={COLORS.textLight} />
              <Text style={styles.detailLabel}>Gender:</Text>
              <Text style={styles.detailValue}>{user?.gender}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.primary + '20' }]}>
                <Ionicons name="calendar" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.actionText}>Browse Events</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.secondary + '20' }]}>
                <Ionicons name="pricetag" size={28} color={COLORS.secondary} />
              </View>
              <Text style={styles.actionText}>My Tickets</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.tertiary + '20' }]}>
                <Ionicons name="notifications" size={28} color={COLORS.tertiary} />
              </View>
              <Text style={styles.actionText}>Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.info + '20' }]}>
                <Ionicons name="settings" size={28} color={COLORS.info} />
              </View>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Events Section (Placeholder) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          
          <View style={styles.emptyState}>
            <Ionicons name="calendar" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyStateText}>No upcoming events</Text>
            <Text style={styles.emptyStateSubtext}>
              Check back later for exciting campus events
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Events Attended</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Certificates</Text>
          </View>
        </View>
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
    paddingTop: 50,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...TYPOGRAPHY.body2,
    color: COLORS.surface,
    opacity: 0.9,
  },
  userName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  profileDetails: {
    gap: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    marginRight: SPACING.xs,
    fontWeight: '600',
  },
  detailValue: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    flex: 1,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionText: {
    ...TYPOGRAPHY.body2,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  emptyStateText: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptyStateSubtext: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    ...SHADOWS.small,
  },
  statNumber: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});

export default HomeScreen;
