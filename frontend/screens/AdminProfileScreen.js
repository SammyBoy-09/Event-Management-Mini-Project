import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { getProfile, updateProfile, changePassword, logout } from '../api/api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AdminProfileScreen Component
 * Dedicated profile screen for admin and CR accounts
 */
const AdminProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      const adminData = response.data.student;
      
      setProfile(adminData);
      
      // Update AsyncStorage with fresh user data
      await AsyncStorage.setItem('userData', JSON.stringify(adminData));
      console.log('Admin Profile loaded - Role:', adminData.role);
      
      setEditData({
        name: adminData.name || '',
        phone: adminData.phone || '',
      });
    } catch (error) {
      console.error('Error loading admin profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleUpdateProfile = async () => {
    try {
      const updateData = {
        name: editData.name,
        phone: editData.phone,
      };
      
      await updateProfile(updateData);
      
      Alert.alert('Success', 'Profile updated successfully');
      setEditMode(false);
      loadProfile();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      Alert.alert('Success', 'Password changed successfully');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to change password');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'AuthLanding' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color={COLORS.PRIMARY} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'N/A'}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Profile</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setEditMode(!editMode)}>
            <Ionicons
              name={editMode ? 'close' : 'create'}
              size={24}
              color={editMode ? COLORS.ERROR : COLORS.PRIMARY}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="shield-checkmark" size={48} color={COLORS.WHITE} />
            </View>
          </View>
          <Text style={styles.profileName}>{profile?.name}</Text>
          <Text style={styles.profileRole}>
            {profile?.role === 'admin' ? 'ADMINISTRATOR' : 'CLASS REPRESENTATIVE'}
          </Text>
          <View style={styles.profileBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{profile?.department}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: COLORS.primary + '20' }]}>
              <Text style={[styles.badgeText, { color: COLORS.primary }]}>
                {profile?.role === 'admin' ? 'Admin Access' : 'CR Access'}
              </Text>
            </View>
          </View>
          
          {/* Admin Panel Quick Access */}
          <TouchableOpacity
            style={styles.adminPanelButton}
            onPress={() => navigation.navigate('AdminPanel')}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
            <Text style={styles.adminPanelButtonText}>Open Admin Panel</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {editMode ? 'Edit Information' : 'Personal Information'}
          </Text>
          
          {editMode ? (
            <>
              <InputField
                label="Name"
                value={editData.name}
                onChangeText={(text) => setEditData({ ...editData, name: text })}
                icon="person"
              />
              
              <InputField
                label="Phone"
                value={editData.phone}
                onChangeText={(text) => setEditData({ ...editData, phone: text })}
                icon="call"
                keyboardType="phone-pad"
              />
              
              <Button title="Save Changes" onPress={handleUpdateProfile} style={styles.button} />
            </>
          ) : (
            <>
              <InfoRow icon="mail" label="Email" value={profile?.email} />
              <InfoRow icon="call" label="Phone" value={profile?.phone} />
              <InfoRow icon="briefcase" label="Department" value={profile?.department} />
              <InfoRow icon="key" label="Role" value={profile?.role?.toUpperCase()} />
              {profile?.permissions && profile.permissions.length > 0 && (
                <InfoRow 
                  icon="shield-checkmark" 
                  label="Permissions" 
                  value={profile.permissions.join(', ')} 
                />
              )}
            </>
          )}
        </View>

        {/* Change Password */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowPasswordModal(!showPasswordModal)}
          >
            <Text style={styles.sectionTitle}>Change Password</Text>
            <Ionicons
              name={showPasswordModal ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.TEXT_SECONDARY}
            />
          </TouchableOpacity>
          
          {showPasswordModal && (
            <View style={styles.passwordForm}>
              <InputField
                label="Current Password"
                value={passwordData.currentPassword}
                onChangeText={(text) =>
                  setPasswordData({ ...passwordData, currentPassword: text })
                }
                icon="lock-closed"
                secureTextEntry
              />
              
              <InputField
                label="New Password"
                value={passwordData.newPassword}
                onChangeText={(text) =>
                  setPasswordData({ ...passwordData, newPassword: text })
                }
                icon="lock-open"
                secureTextEntry
              />
              
              <InputField
                label="Confirm New Password"
                value={passwordData.confirmPassword}
                onChangeText={(text) =>
                  setPasswordData({ ...passwordData, confirmPassword: text })
                }
                icon="checkmark-circle"
                secureTextEntry
              />
              
              <Button
                title="Update Password"
                onPress={handleChangePassword}
                style={styles.button}
              />
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.ERROR} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.SURFACE,
    ...SHADOWS.small,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.SURFACE,
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT,
    marginBottom: SPACING.xs,
  },
  profileRole: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  profileBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.TERTIARY + '20',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TERTIARY,
  },
  adminPanelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  adminPanelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: COLORS.SURFACE,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.TEXT,
    fontWeight: '500',
  },
  passwordForm: {
    marginTop: SPACING.md,
  },
  button: {
    marginTop: SPACING.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SURFACE,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.ERROR + '30',
    gap: SPACING.sm,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.ERROR,
  },
});

export default AdminProfileScreen;
