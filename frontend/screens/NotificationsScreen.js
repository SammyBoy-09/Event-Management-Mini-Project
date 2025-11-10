import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from '../api/api';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      setNotifications(response.data || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);
      }
      
      if (notification.relatedEvent) {
        navigation.navigate('EventDetails', { eventId: notification.relatedEvent._id });
      }
      
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      Alert.alert('Success', 'All notifications marked as read');
      loadNotifications();
    } catch (error) {
      Alert.alert('Error', 'Failed to mark all as read');
    }
  };

  const handleDeleteAll = () => {
    Alert.alert(
      'Delete All',
      'Are you sure you want to delete all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllNotifications();
              Alert.alert('Success', 'All notifications deleted');
              loadNotifications();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete notifications');
            }
          },
        },
      ]
    );
  };

  const handleDelete = (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNotification(notificationId);
              loadNotifications();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete notification');
            }
          },
        },
      ]
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event_reminder':
        return 'alarm';
      case 'event_update':
        return 'refresh';
      case 'event_cancelled':
        return 'close-circle';
      case 'rsvp_confirmation':
        return 'checkmark-circle';
      case 'event_approval':
        return 'checkmark-done';
      case 'event_rejection':
        return 'close';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'event_reminder':
        return COLORS.TERTIARY;
      case 'event_update':
        return COLORS.PRIMARY;
      case 'event_cancelled':
      case 'event_rejection':
        return COLORS.ERROR;
      case 'rsvp_confirmation':
      case 'event_approval':
        return COLORS.SUCCESS;
      default:
        return COLORS.TEXT_LIGHT;
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.isRead && styles.notificationCardUnread,
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) + '20' }]}>
        <Ionicons
          name={getNotificationIcon(item.type)}
          size={24}
          color={getNotificationColor(item.type)}
        />
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item._id)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.ERROR} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      {notifications.length > 0 && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleMarkAllRead}>
            <Ionicons name="checkmark-done" size={20} color={COLORS.PRIMARY} />
            <Text style={styles.actionButtonText}>Mark all read</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleDeleteAll}>
            <Ionicons name="trash" size={20} color={COLORS.ERROR} />
            <Text style={[styles.actionButtonText, { color: COLORS.ERROR }]}>Delete all</Text>
          </TouchableOpacity>
        </View>
      )}

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadBannerText}>
            {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
          </Text>
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={64} color={COLORS.TEXT_LIGHT} />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>You're all caught up!</Text>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingTop: 50,
    paddingBottom: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  unreadBanner: {
    backgroundColor: COLORS.PRIMARY + '20',
    padding: SPACING.SM,
    alignItems: 'center',
  },
  unreadBannerText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  listContainer: {
    padding: SPACING.MD,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    ...SHADOWS.SMALL,
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.SM,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.SM,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
  },
  notificationMessage: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT,
    marginBottom: SPACING.XS,
  },
  notificationTime: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    color: COLORS.TEXT_LIGHT,
  },
  deleteButton: {
    padding: SPACING.XS,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.XXL * 2,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginTop: SPACING.MD,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    marginTop: SPACING.XS,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.XXL * 2,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT_LIGHT,
    marginTop: SPACING.MD,
  },
});

export default NotificationsScreen;
