import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api, { getAuthData } from '../api/api';

/**
 * Admin Panel Screen
 * Allows admins to approve/reject pending events
 */
const AdminPanelScreen = ({ navigation }) => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  /**
   * Check if user has admin access
   */
  const checkAdminAccess = async () => {
    try {
      const { userData } = await getAuthData();
      console.log('Admin Panel - User Data:', userData);
      console.log('Admin Panel - User Role:', userData?.role);
      setUserData(userData);
      
      if (userData?.role === 'admin' || userData?.role === 'cr') {
        console.log('Admin Panel - Access Granted');
        loadPendingEvents();
      } else {
        console.log('Admin Panel - Access Denied, Role:', userData?.role);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setLoading(false);
    }
  };

  /**
   * Load pending events from API
   */
  const loadPendingEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events?status=pending');
      setPendingEvents(response.data.events || []);
    } catch (error) {
      console.error('Error loading pending events:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load pending events');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh event list
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await loadPendingEvents();
    setRefreshing(false);
  };

  /**
   * Approve an event
   */
  const handleApprove = async (eventId) => {
    try {
      await api.put(`/events/${eventId}/approve`);
      
      // Remove from pending list
      setPendingEvents(prev => prev.filter(event => event._id !== eventId));
      
      Alert.alert('Success', 'Event approved successfully!');
    } catch (error) {
      console.error('Error approving event:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to approve event');
    }
  };

  /**
   * Reject an event
   */
  const handleReject = (eventId) => {
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
              await api.put(`/events/${eventId}/reject`, {
                reason: 'Event does not meet guidelines'
              });
              
              // Remove from pending list
              setPendingEvents(prev => prev.filter(event => event._id !== eventId));
              
              Alert.alert('Event Rejected', 'Event has been rejected');
            } catch (error) {
              console.error('Error rejecting event:', error);
              Alert.alert('Error', error.response?.data?.message || 'Failed to reject event');
            }
          },
        },
      ]
    );
  };

  /**
   * Format date string
   */
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  /**
   * Format time string
   */
  const formatTime = (timeString) => {
    try {
      if (!timeString) return 'N/A';
      return timeString;
    } catch (error) {
      return timeString;
    }
  };

  /**
   * Render individual event card
   */
  const renderEventItem = ({ item }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.eventDescription} numberOfLines={3}>
        {item.description}
      </Text>
      
      <View style={styles.eventDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {formatDate(item.date)} at {formatTime(item.time)}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="pricetag-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.category}</Text>
        </View>

        {item.createdBy?.name && (
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.detailText}>Created by: {item.createdBy.name}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.outlineButton]}
          onPress={() => navigation.navigate('EventDetails', { eventId: item._id })}
        >
          <Text style={styles.outlineButtonText}>View Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={() => handleApprove(item._id)}
        >
          <Ionicons name="checkmark-circle" size={18} color="#FFF" />
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleReject(item._id)}
        >
          <Ionicons name="close-circle" size={18} color="#FFF" />
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Show access denied screen if not admin
  if (!loading && userData?.role !== 'admin' && userData?.role !== 'cr') {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.accessDeniedContainer}>
          <Ionicons name="shield-outline" size={64} color="#CCC" />
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedText}>
            You don't have permission to access the admin panel.
          </Text>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onRefresh}
        >
          <Ionicons name="refresh" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* QR Scanner Section - Admin Only */}
      <View style={styles.scannerSection}>
        <TouchableOpacity 
          style={styles.scannerButton} 
          onPress={() => navigation.navigate('QRScanner')}
        >
          <Ionicons name="qr-code-outline" size={40} color="#FFF" />
          <View style={styles.scannerTextContainer}>
            <Text style={styles.scannerButtonText}>Scan QR Ticket</Text>
            <Text style={styles.scannerButtonSubtext}>Check-in attendees for events</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Stats Header */}
      <View style={styles.statsHeader}>
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={24} color="#FF6B35" />
          <Text style={styles.statNumber}>{pendingEvents.length}</Text>
          <Text style={styles.statLabel}>Pending Approval</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#4ECDC4" />
          <Text style={styles.statNumber}>{userData?.role?.toUpperCase()}</Text>
          <Text style={styles.statLabel}>Your Role</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass-outline" size={48} color="#6C63FF" />
          <Text style={styles.loadingText}>Loading pending events...</Text>
        </View>
      ) : (
        <FlatList
          data={pendingEvents}
          renderItem={renderEventItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#6C63FF']}
              tint="#6C63FF"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle-outline" size={64} color="#4ECDC4" />
              <Text style={styles.emptyTitle}>All Caught Up!</Text>
              <Text style={styles.emptyText}>
                No events pending approval at the moment.
              </Text>
              <Text style={styles.emptySubtext}>
                New event submissions will appear here for review.
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
    backgroundColor: '#F8F9FE',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#6C63FF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statsHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  eventCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  eventDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#4A5568',
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  outlineButtonText: {
    color: '#6C63FF',
    fontSize: 13,
    fontWeight: '600',
  },
  // QR Scanner Section Styles
  scannerSection: {
    padding: 16,
    backgroundColor: '#F7FAFC',
  },
  scannerButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  scannerTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  scannerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  scannerButtonSubtext: {
    fontSize: 13,
    color: '#FFF',
    opacity: 0.9,
  },
  approveButton: {
    backgroundColor: '#4ECDC4',
  },
  rejectButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#718096',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: 8,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 20,
    marginBottom: 8,
  },
  accessDeniedText: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  goBackButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  goBackButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default AdminPanelScreen;
