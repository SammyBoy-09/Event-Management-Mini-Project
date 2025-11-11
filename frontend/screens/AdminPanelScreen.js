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
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import api, { getAuthData, updateEventStatus } from '../api/api';
import Button from '../components/Button';

/**
 * Admin Panel Screen
 * Allows admins to approve/reject pending events
 */
const AdminPanelScreen = ({ navigation }) => {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

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
        loadAllEvents();
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
   * Load all events from API
   */
  const loadAllEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      console.log('AdminPanel - All events response:', response.data);
      const events = response.data.data || response.data.events || [];
      setAllEvents(events);
      applyFilter('all', events);
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply filter to events
   */
  const applyFilter = (filter, events = allEvents) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.status === filter));
    }
  };

  /**
   * Get count for each status
   */
  const getStatusCounts = () => {
    return {
      all: allEvents.length,
      pending: allEvents.filter(e => e.status === 'pending').length,
      approved: allEvents.filter(e => e.status === 'approved').length,
      rejected: allEvents.filter(e => e.status === 'rejected').length,
    };
  };

  /**
   * Refresh event list
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllEvents();
    setRefreshing(false);
  };

  /**
   * Update event status
   */
  const handleStatusChange = async (eventId, newStatus, currentStatus) => {
    // If changing to rejected, show modal
    if (newStatus === 'rejected') {
      setSelectedEventId(eventId);
      setRejectionReason('');
      setShowRejectModal(true);
      return;
    }

    // For other status changes, update directly
    try {
      await updateEventStatus(eventId, newStatus);
      
      // Update the event in the list
      setAllEvents(prev => 
        prev.map(event => 
          event._id === eventId 
            ? { ...event, status: newStatus }
            : event
        )
      );
      
      // Reapply filter
      applyFilter(activeFilter);
      
      const statusLabel = newStatus === 'approved' ? 'approved' : 'moved to pending';
      Alert.alert('Success', `Event ${statusLabel} successfully!`);
    } catch (error) {
      console.error('Error updating event status:', error);
      Alert.alert('Error', error.message || 'Failed to update event status');
    }
  };

  /**
   * Confirm rejection with reason
   */
  const confirmReject = async () => {
    try {
      await updateEventStatus(selectedEventId, 'rejected', rejectionReason || null);
      
      // Update the event in the list
      setAllEvents(prev => 
        prev.map(event => 
          event._id === selectedEventId 
            ? { ...event, status: 'rejected', rejectionReason: rejectionReason || null }
            : event
        )
      );
      
      // Reapply filter
      applyFilter(activeFilter);
      
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedEventId(null);
      
      Alert.alert('Success', 'Event has been rejected');
    } catch (error) {
      console.error('Error rejecting event:', error);
      Alert.alert('Error', error.message || 'Failed to reject event');
    }
  };

  /**
   * Get action buttons based on current status
   */
  const getActionButtons = (event) => {
    const { status, _id } = event;
    
    if (status === 'pending') {
      return (
        <>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleStatusChange(_id, 'approved', status)}
          >
            <Ionicons name="checkmark-circle" size={18} color="#FFF" />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleStatusChange(_id, 'rejected', status)}
          >
            <Ionicons name="close-circle" size={18} color="#FFF" />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </>
      );
    } else if (status === 'approved') {
      return (
        <>
          <TouchableOpacity
            style={[styles.actionButton, styles.pendingButton]}
            onPress={() => handleStatusChange(_id, 'pending', status)}
          >
            <Ionicons name="time" size={18} color="#FFF" />
            <Text style={styles.actionButtonText}>Revert</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleStatusChange(_id, 'rejected', status)}
          >
            <Ionicons name="close-circle" size={18} color="#FFF" />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </>
      );
    } else if (status === 'rejected') {
      return (
        <>
          <TouchableOpacity
            style={[styles.actionButton, styles.pendingButton]}
            onPress={() => handleStatusChange(_id, 'pending', status)}
          >
            <Ionicons name="time" size={18} color="#FFF" />
            <Text style={styles.actionButtonText}>Revert</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleStatusChange(_id, 'approved', status)}
          >
            <Ionicons name="checkmark-circle" size={18} color="#FFF" />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
        </>
      );
    }
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
   * Get status badge style
   */
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'pending':
        return { bg: '#FFF4E5', text: '#F6AD55', icon: 'time' };
      case 'approved':
        return { bg: '#E6F7ED', text: '#48BB78', icon: 'checkmark-circle' };
      case 'rejected':
        return { bg: '#FEE', text: '#F56565', icon: 'close-circle' };
      default:
        return { bg: '#F0F0F0', text: '#666', icon: 'help-circle' };
    }
  };

  /**
   * Render individual event card
   */
  const renderEventItem = ({ item }) => {
    const statusStyle = getStatusBadgeStyle(item.status);
    
    return (
      <View style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Ionicons name={statusStyle.icon} size={14} color={statusStyle.text} />
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.eventDescription} numberOfLines={2}>
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
            style={[styles.actionButton, styles.viewDetailsButton]}
            onPress={() => navigation.navigate('EventDetails', { eventId: item._id })}
          >
            <Text style={styles.viewDetailsButtonText}>View Details</Text>
          </TouchableOpacity>
          
          {getActionButtons(item)}
        </View>
      </View>
    );
  };

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

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.filterTab, 
              activeFilter === 'all' && { backgroundColor: '#6C63FF' }
            ]}
            onPress={() => applyFilter('all')}
          >
            <Ionicons 
              name="apps" 
              size={16} 
              color={activeFilter === 'all' ? '#FFF' : '#6C63FF'} 
            />
            <Text style={[
              styles.filterTabText, 
              activeFilter === 'all' && styles.filterTabTextActive
            ]}>
              All ({getStatusCounts().all})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterTab, 
              activeFilter === 'pending' && { backgroundColor: '#F6AD55' }
            ]}
            onPress={() => applyFilter('pending')}
          >
            <Ionicons 
              name="time" 
              size={16} 
              color={activeFilter === 'pending' ? '#FFF' : '#F6AD55'} 
            />
            <Text style={[
              styles.filterTabText, 
              activeFilter === 'pending' && styles.filterTabTextActive
            ]}>
              Pending ({getStatusCounts().pending})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterTab, 
              activeFilter === 'approved' && { backgroundColor: '#48BB78' }
            ]}
            onPress={() => applyFilter('approved')}
          >
            <Ionicons 
              name="checkmark-circle" 
              size={16} 
              color={activeFilter === 'approved' ? '#FFF' : '#48BB78'} 
            />
            <Text style={[
              styles.filterTabText, 
              activeFilter === 'approved' && styles.filterTabTextActive
            ]}>
              Approved ({getStatusCounts().approved})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterTab, 
              activeFilter === 'rejected' && { backgroundColor: '#F56565' }
            ]}
            onPress={() => applyFilter('rejected')}
          >
            <Ionicons 
              name="close-circle" 
              size={16} 
              color={activeFilter === 'rejected' ? '#FFF' : '#F56565'} 
            />
            <Text style={[
              styles.filterTabText, 
              activeFilter === 'rejected' && styles.filterTabTextActive
            ]}>
              Rejected ({getStatusCounts().rejected})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass-outline" size={48} color="#6C63FF" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
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
              <Ionicons name="folder-open-outline" size={64} color="#CBD5E0" />
              <Text style={styles.emptyTitle}>No Events Found</Text>
              <Text style={styles.emptyText}>
                {activeFilter === 'all' 
                  ? 'No events have been created yet.'
                  : `No ${activeFilter} events at the moment.`}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Rejection Reason Modal */}
      <Modal
        visible={showRejectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reject Event</Text>
            <Text style={styles.modalSubtitle}>
              Please provide a reason for rejection (optional):
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Enter rejection reason..."
              placeholderTextColor={COLORS.TEXT_LIGHT}
              value={rejectionReason}
              onChangeText={setRejectionReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedEventId(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.rejectModalButton]}
                onPress={confirmReject}
              >
                <Text style={styles.modalButtonText}>Reject Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  filterContainer: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  filterScrollContent: {
    paddingHorizontal: SPACING.LG,
    gap: SPACING.SM,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: RADIUS.LG,
    backgroundColor: '#F0F0F0',
    marginRight: SPACING.SM,
    gap: 6,
  },
  filterTabText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    fontWeight: '600',
    color: '#666',
  },
  filterTabTextActive: {
    color: COLORS.WHITE,
  },
  listContainer: {
    padding: SPACING.LG,
    paddingBottom: SPACING.XL,
  },
  eventCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    ...SHADOWS.MEDIUM,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.SM,
  },
  eventTitle: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    flex: 1,
    marginRight: SPACING.SM,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    borderRadius: RADIUS.SM,
    gap: 4,
  },
  statusText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  eventDescription: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT,
    lineHeight: 20,
    marginBottom: SPACING.SM,
  },
  eventDetails: {
    marginBottom: SPACING.MD,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  detailText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT,
    marginLeft: SPACING.SM,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.SM,
    marginTop: SPACING.SM,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.SM,
    borderRadius: RADIUS.MD,
    gap: 4,
  },
  viewDetailsButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  viewDetailsButtonText: {
    color: COLORS.PRIMARY,
    fontSize: TYPOGRAPHY.SIZES.SM,
    fontWeight: '600',
  },
  actionButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.SIZES.SM,
    fontWeight: '600',
  },
  pendingButton: {
    backgroundColor: '#F6AD55',
  },
  // QR Scanner Section Styles
  scannerSection: {
    padding: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  scannerButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: RADIUS.LG,
    padding: SPACING.LG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.MEDIUM,
  },
  scannerTextContainer: {
    flex: 1,
    marginLeft: SPACING.MD,
  },
  scannerButtonText: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: SPACING.XS,
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
    padding: SPACING.XXL,
  },
  accessDeniedTitle: {
    fontSize: TYPOGRAPHY.SIZES.XXL,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginTop: SPACING.LG,
    marginBottom: SPACING.SM,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XL,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.LG,
    padding: SPACING.XL,
    ...SHADOWS.MEDIUM,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.SM,
  },
  modalSubtitle: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.LG,
    lineHeight: 20,
  },
  modalInput: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: RADIUS.MD,
    padding: SPACING.MD,
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT_DARK,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginBottom: SPACING.LG,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.MD,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SPACING.MD,
    borderRadius: RADIUS.MD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  cancelButtonText: {
    color: COLORS.TEXT_DARK,
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '500',
  },
  rejectModalButton: {
    backgroundColor: COLORS.ERROR,
  },
  modalButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '600',
  },
});

export default AdminPanelScreen;
