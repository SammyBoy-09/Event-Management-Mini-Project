import React, { useState } from 'react';
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
import CustomButton from '../components/CustomButton';
import theme from '../utils/theme';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      eventReminders: true,
      eventUpdates: true,
      newEvents: false,
      adminMessages: true,
    },
    privacy: {
      profileVisible: true,
      showAttendedEvents: true,
      allowEventInvitations: true,
    },
    app: {
      darkMode: false,
      autoSync: true,
      offlineMode: false,
    },
  });

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
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
            setSettings({
              notifications: {
                pushNotifications: true,
                eventReminders: true,
                eventUpdates: true,
                newEvents: false,
                adminMessages: true,
              },
              privacy: {
                profileVisible: true,
                showAttendedEvents: true,
                allowEventInvitations: true,
              },
              app: {
                darkMode: false,
                autoSync: true,
                offlineMode: false,
              },
            });
            Alert.alert('Settings Reset', 'All settings have been reset to default.');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data and may require re-downloading content.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Cache Cleared', 'App cache has been cleared successfully.');
          },
        },
      ]
    );
  };

  const SettingItem = ({ title, subtitle, value, onValueChange, type = 'switch' }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary,
          }}
          thumbColor={value ? theme.colors.textInverse : theme.colors.textLight}
        />
      )}
      
      {type === 'arrow' && (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
      )}
    </View>
  );

  const SectionHeader = ({ title, icon }) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color={theme.colors.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Notifications Section */}
      <View style={styles.section}>
        <SectionHeader title="Notifications" icon="notifications-outline" />
        
        <View style={styles.settingsGroup}>
          <SettingItem
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            value={settings.notifications.pushNotifications}
            onValueChange={(value) => updateSetting('notifications', 'pushNotifications', value)}
          />
          
          <SettingItem
            title="Event Reminders"
            subtitle="Get reminded about upcoming events"
            value={settings.notifications.eventReminders}
            onValueChange={(value) => updateSetting('notifications', 'eventReminders', value)}
          />
          
          <SettingItem
            title="Event Updates"
            subtitle="Notifications when events are updated"
            value={settings.notifications.eventUpdates}
            onValueChange={(value) => updateSetting('notifications', 'eventUpdates', value)}
          />
          
          <SettingItem
            title="New Events"
            subtitle="Notifications for newly created events"
            value={settings.notifications.newEvents}
            onValueChange={(value) => updateSetting('notifications', 'newEvents', value)}
          />
          
          <SettingItem
            title="Admin Messages"
            subtitle="Important messages from administrators"
            value={settings.notifications.adminMessages}
            onValueChange={(value) => updateSetting('notifications', 'adminMessages', value)}
          />
        </View>
      </View>

      {/* Privacy Section */}
      <View style={styles.section}>
        <SectionHeader title="Privacy" icon="shield-outline" />
        
        <View style={styles.settingsGroup}>
          <SettingItem
            title="Profile Visibility"
            subtitle="Allow others to see your profile"
            value={settings.privacy.profileVisible}
            onValueChange={(value) => updateSetting('privacy', 'profileVisible', value)}
          />
          
          <SettingItem
            title="Show Attended Events"
            subtitle="Display events you've attended on your profile"
            value={settings.privacy.showAttendedEvents}
            onValueChange={(value) => updateSetting('privacy', 'showAttendedEvents', value)}
          />
          
          <SettingItem
            title="Event Invitations"
            subtitle="Allow others to invite you to events"
            value={settings.privacy.allowEventInvitations}
            onValueChange={(value) => updateSetting('privacy', 'allowEventInvitations', value)}
          />
        </View>
      </View>

      {/* App Settings Section */}
      <View style={styles.section}>
        <SectionHeader title="App Settings" icon="settings-outline" />
        
        <View style={styles.settingsGroup}>
          <SettingItem
            title="Dark Mode"
            subtitle="Use dark theme (Coming Soon)"
            value={settings.app.darkMode}
            onValueChange={(value) => updateSetting('app', 'darkMode', value)}
          />
          
          <SettingItem
            title="Auto Sync"
            subtitle="Automatically sync data when connected"
            value={settings.app.autoSync}
            onValueChange={(value) => updateSetting('app', 'autoSync', value)}
          />
          
          <SettingItem
            title="Offline Mode"
            subtitle="Save data for offline access"
            value={settings.app.offlineMode}
            onValueChange={(value) => updateSetting('app', 'offlineMode', value)}
          />
        </View>
      </View>

      {/* Account Actions Section */}
      <View style={styles.section}>
        <SectionHeader title="Account" icon="person-outline" />
        
        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.actionItem} onPress={() => {}}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Export Data</Text>
              <Text style={styles.settingSubtitle}>Download your data</Text>
            </View>
            <Ionicons name="download-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleClearCache}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Clear Cache</Text>
              <Text style={styles.settingSubtitle}>Free up storage space</Text>
            </View>
            <Ionicons name="trash-outline" size={20} color={theme.colors.warning} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={() => {}}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.error }]}>Delete Account</Text>
              <Text style={styles.settingSubtitle}>Permanently delete your account</Text>
            </View>
            <Ionicons name="warning-outline" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Reset Button */}
      <View style={styles.resetContainer}>
        <CustomButton
          title="Reset All Settings"
          onPress={handleResetSettings}
          variant="outline"
          icon="refresh-outline"
          style={styles.resetButton}
        />
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>CampusConnect v1.0.0</Text>
        <Text style={styles.appInfoText}>Built with ❤️ for college communities</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  settingsGroup: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  resetContainer: {
    margin: theme.spacing.lg,
  },
  resetButton: {
    borderColor: theme.colors.warning,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  appInfoText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textLight,
    marginBottom: 4,
    textAlign: 'center',
  },
});

export default SettingsScreen;
