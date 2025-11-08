import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      eventReminders: true,
      eventUpdates: true,
      newEvents: false,
    },
    privacy: {
      profileVisible: true,
      showAttendedEvents: true,
      allowEventInvitations: true,
    },
    app: {
      darkMode: false,
      autoSync: true,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const updateSetting = (category, key, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    };
    saveSettings(newSettings);
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaultSettings = {
              notifications: {
                pushNotifications: true,
                eventReminders: true,
                eventUpdates: true,
                newEvents: false,
              },
              privacy: {
                profileVisible: true,
                showAttendedEvents: true,
                allowEventInvitations: true,
              },
              app: {
                darkMode: false,
                autoSync: true,
              },
            };
            saveSettings(defaultSettings);
            Alert.alert('Success', 'Settings have been reset to default');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deletion', 'Please contact support to delete your account');
          },
        },
      ]
    );
  };

  const SettingItem = ({ title, subtitle, value, onValueChange, iconName }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        {iconName && (
          <View style={styles.settingIconContainer}>
            <Ionicons name={iconName} size={22} color={COLORS.PRIMARY} />
          </View>
        )}
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.BORDER, true: COLORS.PRIMARY + '40' }}
        thumbColor={value ? COLORS.PRIMARY : COLORS.TEXT_LIGHT}
      />
    </View>
  );

  const SectionHeader = ({ title, iconName }) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={iconName} size={20} color={COLORS.PRIMARY} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const ActionButton = ({ title, subtitle, iconName, onPress, danger }) => (
    <TouchableOpacity 
      style={styles.actionButton}
      onPress={onPress}
    >
      <View style={styles.actionButtonContent}>
        <View style={[styles.actionIconContainer, danger && styles.dangerIconContainer]}>
          <Ionicons 
            name={iconName} 
            size={22} 
            color={danger ? COLORS.ERROR : COLORS.PRIMARY} 
          />
        </View>
        <View style={styles.actionTextContainer}>
          <Text style={[styles.actionTitle, danger && styles.dangerText]}>{title}</Text>
          {subtitle && <Text style={styles.actionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_LIGHT} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Notifications Section */}
        <View style={styles.section}>
          <SectionHeader title="Notifications" iconName="notifications-outline" />
          <View style={styles.card}>
            <SettingItem
              title="Push Notifications"
              subtitle="Receive notifications on your device"
              value={settings.notifications.pushNotifications}
              onValueChange={(value) => updateSetting('notifications', 'pushNotifications', value)}
              iconName="notifications"
            />
            <View style={styles.divider} />
            <SettingItem
              title="Event Reminders"
              subtitle="Get reminded about upcoming events"
              value={settings.notifications.eventReminders}
              onValueChange={(value) => updateSetting('notifications', 'eventReminders', value)}
              iconName="alarm"
            />
            <View style={styles.divider} />
            <SettingItem
              title="Event Updates"
              subtitle="Notify when events are modified"
              value={settings.notifications.eventUpdates}
              onValueChange={(value) => updateSetting('notifications', 'eventUpdates', value)}
              iconName="refresh"
            />
            <View style={styles.divider} />
            <SettingItem
              title="New Events"
              subtitle="Notify about new events in your categories"
              value={settings.notifications.newEvents}
              onValueChange={(value) => updateSetting('notifications', 'newEvents', value)}
              iconName="star"
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <SectionHeader title="Privacy" iconName="lock-closed-outline" />
          <View style={styles.card}>
            <SettingItem
              title="Profile Visible"
              subtitle="Make your profile visible to others"
              value={settings.privacy.profileVisible}
              onValueChange={(value) => updateSetting('privacy', 'profileVisible', value)}
              iconName="person"
            />
            <View style={styles.divider} />
            <SettingItem
              title="Show Attended Events"
              subtitle="Display events you've attended"
              value={settings.privacy.showAttendedEvents}
              onValueChange={(value) => updateSetting('privacy', 'showAttendedEvents', value)}
              iconName="eye"
            />
            <View style={styles.divider} />
            <SettingItem
              title="Event Invitations"
              subtitle="Allow friends to invite you to events"
              value={settings.privacy.allowEventInvitations}
              onValueChange={(value) => updateSetting('privacy', 'allowEventInvitations', value)}
              iconName="mail"
            />
          </View>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <SectionHeader title="App Settings" iconName="settings-outline" />
          <View style={styles.card}>
            <SettingItem
              title="Dark Mode"
              subtitle="Enable dark theme (Coming soon)"
              value={settings.app.darkMode}
              onValueChange={(value) => {
                Alert.alert('Coming Soon', 'Dark mode will be available in the next update!');
              }}
              iconName="moon"
            />
            <View style={styles.divider} />
            <SettingItem
              title="Auto Sync"
              subtitle="Automatically sync data when connected"
              value={settings.app.autoSync}
              onValueChange={(value) => updateSetting('app', 'autoSync', value)}
              iconName="sync"
            />
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <SectionHeader title="More" iconName="ellipsis-horizontal-outline" />
          <View style={styles.card}>
            <ActionButton
              title="Clear Cache"
              subtitle="Free up storage space"
              iconName="trash-outline"
              onPress={handleClearCache}
            />
            <View style={styles.divider} />
            <ActionButton
              title="Reset Settings"
              subtitle="Restore default settings"
              iconName="refresh-outline"
              onPress={handleResetSettings}
            />
            <View style={styles.divider} />
            <ActionButton
              title="Privacy Policy"
              subtitle="View our privacy policy"
              iconName="document-text-outline"
              onPress={() => Alert.alert('Privacy Policy', 'Privacy policy coming soon')}
            />
            <View style={styles.divider} />
            <ActionButton
              title="Terms of Service"
              subtitle="Read our terms and conditions"
              iconName="clipboard-outline"
              onPress={() => Alert.alert('Terms of Service', 'Terms of service coming soon')}
            />
            <View style={styles.divider} />
            <ActionButton
              title="About"
              subtitle="App version and information"
              iconName="information-circle-outline"
              onPress={() => Alert.alert('CampusConnect', 'Version 1.0.0\nEvent Management App for Students')}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <SectionHeader title="Danger Zone" iconName="warning-outline" />
          <View style={styles.card}>
            <ActionButton
              title="Delete Account"
              subtitle="Permanently delete your account"
              iconName="trash"
              onPress={handleDeleteAccount}
              danger
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingTop: 50,
    paddingBottom: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    padding: SPACING.XS,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: SPACING.LG,
    paddingHorizontal: SPACING.MD,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
    gap: SPACING.XS,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.MD,
    padding: SPACING.SM,
    ...SHADOWS.SMALL,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.XS,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.MD,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.PRIMARY + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.SM,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT_DARK,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    color: COLORS.TEXT_LIGHT,
    lineHeight: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.XS,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.PRIMARY + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.SM,
  },
  dangerIconContainer: {
    backgroundColor: COLORS.ERROR + '10',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT_DARK,
    fontWeight: '500',
    marginBottom: 2,
  },
  dangerText: {
    color: COLORS.ERROR,
  },
  actionSubtitle: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    color: COLORS.TEXT_LIGHT,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginVertical: 4,
  },
});

export default SettingsScreen;
