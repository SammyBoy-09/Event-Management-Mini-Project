import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import CustomButton from '../components/CustomButton';
import theme from '../utils/theme';

const ProfileScreen = ({ navigation }) => {
  const { state, actions } = useApp();
  const { user } = state;
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => actions.logout(),
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing feature will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Password change feature will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  const menuItems = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: handleEditProfile,
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings-outline',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      id: 'change-password',
      title: 'Change Password',
      icon: 'lock-closed-outline',
      onPress: handleChangePassword,
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => {
        Alert.alert(
          'Help & Support',
          'For help and support, please contact:\n\nEmail: support@campusconnect.edu\nPhone: +1 (555) 123-4567',
          [{ text: 'OK' }]
        );
      },
    },
    {
      id: 'about',
      title: 'About CampusConnect',
      icon: 'information-circle-outline',
      onPress: () => {
        Alert.alert(
          'About CampusConnect',
          'CampusConnect v1.0.0\n\nSmart Event Management System for Colleges\n\n© 2024 CampusConnect Team',
          [{ text: 'OK' }]
        );
      },
    },
  ];

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return theme.colors.error;
      case 'cr':
        return theme.colors.warning;
      case 'student':
      default:
        return theme.colors.primary;
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'cr':
        return 'Class Representative';
      case 'student':
      default:
        return 'Student';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.headerContainer}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user?.avatar || 'https://via.placeholder.com/100x100/2563EB/FFFFFF?text=U' }} 
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton} onPress={handleEditProfile}>
              <Ionicons name="camera" size={16} color={theme.colors.textInverse} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            
            <View style={styles.badgeContainer}>
              <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(user?.role) }]}>
                <Text style={styles.roleBadgeText}>{getRoleDisplayName(user?.role)}</Text>
              </View>
            </View>
            
            <View style={styles.userMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="school-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.metaText}>{user?.department}</Text>
              </View>
              
              {user?.year && (
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.metaText}>{user?.year}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Events Attended</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Events Created</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <CustomButton
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          icon="log-out-outline"
          style={styles.logoutButton}
        />
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>CampusConnect v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: theme.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: theme.colors.textInverse,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.textInverse,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.textInverse,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textInverse,
    opacity: 0.9,
    marginBottom: theme.spacing.sm,
  },
  badgeContainer: {
    marginBottom: theme.spacing.sm,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  roleBadgeText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
  },
  userMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    marginBottom: 4,
  },
  metaText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textInverse,
    marginLeft: theme.spacing.xs,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    marginTop: -theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  menuContainer: {
    marginTop: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
    fontWeight: '500',
  },
  logoutContainer: {
    margin: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  logoutButton: {
    borderColor: theme.colors.error,
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
  },
  versionText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textLight,
  },
});

export default ProfileScreen;
