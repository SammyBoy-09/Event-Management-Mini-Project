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
import { getProfile, updateProfile, changePassword } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../components/InputField';
import Button from '../components/Button';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    year: '',
    semester: '',
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
      const studentData = response.data.student;
      
      // Update profile state
      setProfile(studentData);
      
      // IMPORTANT: Update AsyncStorage with fresh user data including role
      await AsyncStorage.setItem('userData', JSON.stringify(studentData));
      console.log('Profile loaded - Role:', studentData.role, 'IsAdmin:', studentData.isAdmin);
      
      setEditData({
        name: studentData.name || '',
        phone: studentData.phone || '',
        year: studentData.year ? studentData.year.toString() : '',
        semester: studentData.semester ? studentData.semester.toString() : '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
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
      
      // Only include year and semester for students
      if (!profile?.isAdmin) {
        updateData.year = parseInt(editData.year);
        updateData.semester = parseInt(editData.semester);
      }
      
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
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      Alert.alert('Success', 'Password changed successfully');
      setChangePasswordMode(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
            await AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: 'AuthLanding' }],
            });
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Settings')}
            style={styles.headerButton}
          >
            <Ionicons name="settings-outline" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
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
              <Ionicons name="person" size={48} color={COLORS.WHITE} />
            </View>
          </View>
          <Text style={styles.profileName}>{profile?.name}</Text>
          <Text style={styles.profileRole}>{profile?.role?.toUpperCase()}</Text>
          <View style={styles.profileBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{profile?.department}</Text>
            </View>
            {profile?.year && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Year {profile?.year}</Text>
              </View>
            )}
            {profile?.isAdmin && (
              <View style={[styles.badge, { backgroundColor: COLORS.primary + '20' }]}>
                <Text style={[styles.badgeText, { color: COLORS.primary }]}>
                  {profile.role === 'admin' ? 'Administrator' : 'Class Representative'}
                </Text>
              </View>
            )}
          </View>
          
          {/* Admin Panel Quick Access - Prominent placement */}
          {(profile?.role === 'admin' || profile?.role === 'cr') && (
            <TouchableOpacity
              style={styles.adminPanelButton}
              onPress={() => {
                console.log('Navigating to Admin Panel, role:', profile?.role);
                navigation.navigate('AdminPanel');
              }}
            >
              <Ionicons name="shield-checkmark" size={20} color={COLORS.WHITE} />
              <Text style={styles.adminPanelButtonText}>Admin Panel</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.WHITE} />
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
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
              
              {!profile?.isAdmin && (
                <>
                  <InputField
                    label="Year"
                    value={editData.year}
                    onChangeText={(text) => setEditData({ ...editData, year: text })}
                    icon="school"
                    keyboardType="numeric"
                  />
                  
                  <InputField
                    label="Semester"
                    value={editData.semester}
                    onChangeText={(text) => setEditData({ ...editData, semester: text })}
                    icon="calendar"
                    keyboardType="numeric"
                  />
                </>
              )}
              
              <Button title="Save Changes" onPress={handleUpdateProfile} style={styles.button} />
            </>
          ) : (
            <>
              <InfoRow icon="mail" label="Email" value={profile?.email} />
              {profile?.usn && <InfoRow icon="card" label="USN" value={profile?.usn} />}
              <InfoRow icon="call" label="Phone" value={profile?.phone} />
              {profile?.year && <InfoRow icon="school" label="Year" value={`Year ${profile?.year}`} />}
              {profile?.semester && <InfoRow icon="calendar" label="Semester" value={`Semester ${profile?.semester}`} />}
              <InfoRow icon="briefcase" label="Department" value={profile?.department} />
              {profile?.gender && <InfoRow icon="transgender" label="Gender" value={profile?.gender} />}
            </>
          )}
        </View>

        {/* Registered Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registered Events</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile?.registeredEvents?.length || 0}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
          </View>
        </View>

        {/* Change Password */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setChangePasswordMode(!changePasswordMode)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed" size={24} color={COLORS.PRIMARY} />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <Ionicons
              name={changePasswordMode ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.TEXT_LIGHT}
            />
          </TouchableOpacity>
          
          {changePasswordMode && (
            <View style={styles.passwordSection}>
              <InputField
                label="Current Password"
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
                secureTextEntry
                icon="lock-closed"
              />
              
              <InputField
                label="New Password"
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
                secureTextEntry
                icon="lock-closed"
              />
              
              <InputField
                label="Confirm New Password"
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
                secureTextEntry
                icon="lock-closed"
              />
              
              <Button title="Change Password" onPress={handleChangePassword} style={styles.button} />
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity style={styles.actionRow} onPress={handleLogout}>
            <View style={styles.actionLeft}>
              <Ionicons name="log-out" size={24} color={COLORS.ERROR} />
              <Text style={[styles.actionText, { color: COLORS.ERROR }]}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.TEXT_LIGHT} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      <Ionicons name={icon} size={20} color={COLORS.TEXT_LIGHT} />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

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
  loadingText: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingTop: 50,
    paddingBottom: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MD,
  },
  headerButton: {
    padding: SPACING.XS,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: SPACING.XL,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  avatarContainer: {
    marginBottom: SPACING.MD,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.LARGE,
  },
  profileName: {
    fontSize: TYPOGRAPHY.SIZES.XXL,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
  },
  profileRole: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    marginBottom: SPACING.SM,
  },
  profileBadges: {
    flexDirection: 'row',
    gap: SPACING.SM,
  },
  badge: {
    backgroundColor: COLORS.PRIMARY + '20',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: RADIUS.ROUND,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  section: {
    padding: SPACING.LG,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.MD,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT_LIGHT,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT_DARK,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    padding: SPACING.LG,
    borderRadius: RADIUS.MD,
    flex: 1,
    ...SHADOWS.SMALL,
  },
  statValue: {
    fontSize: TYPOGRAPHY.SIZES.XXL,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    marginTop: SPACING.XS,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    borderRadius: RADIUS.SM,
    ...SHADOWS.SMALL,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  settingText: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT_DARK,
    fontWeight: '600',
  },
  passwordSection: {
    marginTop: SPACING.MD,
  },
  button: {
    marginTop: SPACING.MD,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    borderRadius: RADIUS.SM,
    ...SHADOWS.SMALL,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  actionText: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '600',
  },
  adminPanelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: RADIUS.MD,
    marginTop: SPACING.LG,
    gap: SPACING.SM,
    ...SHADOWS.MEDIUM,
  },
  adminPanelButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: SPACING.XL,
  },
});

export default ProfileScreen;
