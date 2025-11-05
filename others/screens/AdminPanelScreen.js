import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import CustomButton from '../components/CustomButton';
import theme from '../utils/theme';
import eventService from '../services/eventService';
import { mockEvents } from '../data/mockData';

const AdminPanelScreen = ({ navigation }) => {
  const { state, actions } = useApp();
  const { user, events } = state;
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'cr') {
      loadPendingEvents();
    }
  }, []);

  const loadPendingEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents({ status: 'pending' });
      setPendingEvents(response.events);
    } catch (error) {
      Alert.alert('Error', 'Failed to load pending events');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPendingEvents();
    setRefreshing(false);
  };

  const handleApprove = async (eventId) => {
    try {
      await eventService.approveEvent(eventId);
      actions.updateEvent({ id: eventId, status: 'approved' });
      setPendingEvents(prev => prev.filter(event => event.id !== eventId));
      
      Alert.alert('Success', 'Event approved successfully!');
      
      // Add notification
      actions.addNotification({
        title: 'Event Approved',
        message: 'An event has been approved',
        type: 'success',
        eventId,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to approve event');
    }
  };

  const handleReject = async (eventId) => {
    Alert.alert(
      'Reject Event',
      'Are you sure you want to reject this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await eventService.rejectEvent(eventId, 'Event does not meet guidelines');
              actions.updateEvent({ id: eventId, status: 'rejected' });
              setPendingEvents(prev => prev.filter(event => event.id !== eventId));
              
              Alert.alert('Event Rejected', 'Event has been rejected');
              
              // Add notification
              actions.addNotification({
                title: 'Event Rejected',
                message: 'An event has been rejected',
                type: 'error',
                eventId,
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to reject event');
            }
          },
        },
      ]
    );
  };

  const renderEventItem = ({ item }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.eventDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.eventDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{item.organizer}</Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <CustomButton
          title="View Details"
          onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
          variant="outline"
          size="small"
          style={styles.actionButton}
        />
        
        <CustomButton
          title="Approve"
          onPress={() => handleApprove(item.id)}
          variant="primary"
          size="small"
          style={styles.actionButton}
        />
        
        <CustomButton
          title="Reject"
          onPress={() => handleReject(item.id)}
          variant="danger"
          size="small"
          style={styles.actionButton}
        />
      </View>
    </View>
  );

  if (user?.role !== 'admin' && user?.role !== 'cr') {
    return (
      <View style={styles.accessDeniedContainer}>
        <Ionicons name="shield-outline" size={64} color={theme.colors.textLight} />
        <Text style={styles.accessDeniedTitle}>Access Denied</Text>
        <Text style={styles.accessDeniedText}>
          You don't have permission to access the admin panel.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Panel</Text>
        <Text style={styles.subtitle}>
          {pendingEvents.length} event{pendingEvents.length !== 1 ? 's' : ''} pending approval
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading pending events...</Text>
        </View>
      ) : (
        <FlatList
          data={pendingEvents}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle-outline" size={64} color={theme.colors.success} />
              <Text style={styles.emptyTitle}>All Caught Up!</Text>
              <Text style={styles.emptyText}>
                No events pending approval at the moment.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
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
  title: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  listContainer: {
    padding: theme.spacing.lg,
  },
  eventCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  eventTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  statusBadge: {
    backgroundColor: theme.colors.warning,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  eventDescription: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  eventDetails: {
    marginBottom: theme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
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
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  accessDeniedTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  accessDeniedText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default AdminPanelScreen;
