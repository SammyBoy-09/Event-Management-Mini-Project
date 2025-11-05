import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import CustomButton from '../components/CustomButton';
import theme from '../utils/theme';

const NotificationsScreen = ({ navigation }) => {
  const { state, actions } = useApp();
  const { notifications } = state;

  const handleMarkAsRead = (notificationId) => {
    actions.markNotificationRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    unreadNotifications.forEach(notification => {
      actions.markNotificationRead(notification.id);
    });
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => actions.clearNotifications(),
        },
      ]
    );
  };

  const handleNotificationPress = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    if (notification.eventId) {
      navigation.navigate('EventDetails', { eventId: notification.eventId });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder':
        return 'alarm-outline';
      case 'success':
        return 'checkmark-circle-outline';
      case 'error':
        return 'close-circle-outline';
      case 'info':
      default:
        return 'information-circle-outline';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'reminder':
        return theme.colors.warning;
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'info':
      default:
        return theme.colors.primary;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) }]}>
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={20}
            color={theme.colors.textInverse}
          />
        </View>
        
        <View style={styles.textContent}>
          <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
            {item.title}
          </Text>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.notificationTime}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        
        {!item.read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        {notifications.length > 0 && (
          <View style={styles.headerActions}>
            {unreadCount > 0 && (
              <CustomButton
                title="Mark All Read"
                onPress={handleMarkAllAsRead}
                variant="outline"
                size="small"
                style={styles.actionButton}
              />
            )}
            
            <CustomButton
              title="Clear All"
              onPress={handleClearAll}
              variant="text"
              size="small"
              style={styles.actionButton}
            />
          </View>
        )}
      </View>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={64} color={theme.colors.textLight} />
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyText}>
            You're all caught up! New notifications will appear here.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  unreadBadge: {
    backgroundColor: theme.colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: theme.spacing.sm,
  },
  listContainer: {
    padding: theme.spacing.lg,
  },
  notificationCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  unreadCard: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  textContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  notificationMessage: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textLight,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default NotificationsScreen;
