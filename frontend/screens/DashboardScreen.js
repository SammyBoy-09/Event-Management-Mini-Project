import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { getAllEvents, rsvpEvent, cancelRSVP, updateEventStatus } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 1, name: 'Technology', icon: 'laptop', color: '#6C63FF' },
  { id: 2, name: 'Sports', icon: 'football', color: '#FF6584' },
  { id: 3, name: 'Cultural', icon: 'musical-notes', color: '#4ECDC4' },
  { id: 4, name: 'Academic', icon: 'book', color: '#FFA500' },
  { id: 5, name: 'Workshop', icon: 'construct', color: '#9C27B0' },
  { id: 6, name: 'Seminar', icon: 'people', color: '#00BCD4' },
];

const DashboardScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadEvents();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents({ upcoming: 'true' });
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  }, []);

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { eventId: event._id });
  };

  const handleRSVP = async (event) => {
    try {
      if (event.hasRSVP) {
        await cancelRSVP(event._id);
        Alert.alert('Success', 'RSVP cancelled successfully!');
      } else {
        await rsvpEvent(event._id);
        Alert.alert('Success', 'RSVP confirmed successfully!');
      }
      loadEvents();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to process RSVP');
    }
  };

  const handleStatusChange = async (event) => {
    const isAdmin = user && (user.role === 'admin' || user.role === 'cr' || user.role === 'CR');
    if (!isAdmin) return;

    const currentStatus = event.status || 'pending';
    
    Alert.alert(
      'Change Event Status',
      `Current status: ${currentStatus}\nSelect new status:`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Pending',
          onPress: () => updateStatus(event._id, 'pending')
        },
        {
          text: 'Approved',
          onPress: () => updateStatus(event._id, 'approved')
        },
        {
          text: 'Rejected',
          onPress: () => updateStatus(event._id, 'rejected'),
          style: 'destructive'
        }
      ]
    );
  };

  const updateStatus = async (eventId, newStatus) => {
    try {
      await updateEventStatus(eventId, newStatus);
      Alert.alert('Success', `Event status changed to ${newStatus}`);
      loadEvents();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update status');
    }
  };

  const getFilteredEvents = () => {
    if (selectedCategory === 'All') {
      return events;
    }
    return events.filter(event => event.category === selectedCategory);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved':
        return { bg: '#10B98120', text: '#10B981', label: 'Approved' };
      case 'pending':
        return { bg: '#F59E0B20', text: '#F59E0B', label: 'Pending' };
      case 'rejected':
        return { bg: '#EF444420', text: '#EF4444', label: 'Rejected' };
      default:
        return { bg: '#6B728020', text: '#6B7280', label: 'Unknown' };
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleLogout = async () => {
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
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name || 'Student'}</Text>
            <Text style={styles.userInfo}>{user?.department} • Year {user?.year}</Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications" size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => {
                // Navigate to appropriate profile screen based on role
                if (user && (user.role === 'admin' || user.role === 'cr' || user.role === 'CR')) {
                  navigation.navigate('AdminProfile');
                } else {
                  navigation.navigate('Profile');
                }
              }}
            >
              <Ionicons name="person" size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: COLORS.PRIMARY + '20' }]}
            onPress={() => navigation.navigate('CreateEvent')}
          >
            <Ionicons name="add-circle" size={32} color={COLORS.PRIMARY} />
            <Text style={styles.actionButtonText}>Create Event</Text>
          </TouchableOpacity>

          {/* Calendar View */}
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#4ECDC420' }]}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Ionicons name="calendar-outline" size={32} color="#4ECDC4" />
            <Text style={styles.actionButtonText}>Calendar</Text>
          </TouchableOpacity>

          {/* Admin Panel - Only for Admins and CRs */}
          {user && (user.role === 'admin' || user.role === 'cr' || user.role === 'CR') && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#FF658420' }]}
              onPress={() => navigation.navigate('AdminPanel')}
            >
              <Ionicons name="shield-checkmark" size={32} color="#FF6584" />
              <Text style={styles.actionButtonText}>Admin Panel</Text>
            </TouchableOpacity>
          )}

          {/* My Events - Only for Students */}
          {user && user.role === 'student' && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: COLORS.SECONDARY + '20' }]}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="calendar" size={32} color={COLORS.SECONDARY} />
              <Text style={styles.actionButtonText}>My Events</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Event Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              selectedCategory === 'All' && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory('All')}
          >
            <Text style={[
              styles.categoryChipText,
              selectedCategory === 'All' && styles.categoryChipTextActive
            ]}>
              All Events
            </Text>
          </TouchableOpacity>
          
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.name && styles.categoryChipActive,
                { borderColor: category.color }
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Ionicons 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.name ? COLORS.WHITE : category.color}
                style={styles.categoryIcon}
              />
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category.name && styles.categoryChipTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* All Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Events' : `${selectedCategory} Events`}
          </Text>
          <Text style={styles.eventCount}>
            {getFilteredEvents().length} {getFilteredEvents().length === 1 ? 'event' : 'events'}
          </Text>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading events...</Text>
          </View>
        ) : getFilteredEvents().length > 0 ? (
          getFilteredEvents().map((event) => (
            <TouchableOpacity
              key={event._id}
              style={styles.eventCard}
              onPress={() => handleEventPress(event)}
            >
              <View style={styles.eventCardHeader}>
                <View style={styles.badgeRow}>
                  <View style={[styles.categoryBadge, { backgroundColor: COLORS.PRIMARY + '20' }]}>
                    <Text style={[styles.categoryBadgeText, { color: COLORS.PRIMARY }]}>
                      {event.category}
                    </Text>
                  </View>
                  
                  {/* Status Badge */}
                  {user && (user.role === 'admin' || user.role === 'cr' || user.role === 'CR') ? (
                    <TouchableOpacity
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusBadgeColor(event.status).bg }
                      ]}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleStatusChange(event);
                      }}
                    >
                      <Ionicons 
                        name={event.status === 'approved' ? 'checkmark-circle' : 
                              event.status === 'rejected' ? 'close-circle' : 
                              'time'} 
                        size={14} 
                        color={getStatusBadgeColor(event.status).text} 
                      />
                      <Text style={[styles.statusBadgeText, { color: getStatusBadgeColor(event.status).text }]}>
                        {getStatusBadgeColor(event.status).label}
                      </Text>
                    </TouchableOpacity>
                  ) : event.status !== 'approved' && (
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusBadgeColor(event.status).bg }
                    ]}>
                      <Text style={[styles.statusBadgeText, { color: getStatusBadgeColor(event.status).text }]}>
                        {getStatusBadgeColor(event.status).label}
                      </Text>
                    </View>
                  )}
                </View>

                {event.hasRSVP && (
                  <View style={styles.rsvpBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.SUCCESS} />
                    <Text style={styles.rsvpBadgeText}>RSVP'd</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDescription} numberOfLines={2}>
                {event.description}
              </Text>
              
              <View style={styles.eventInfo}>
                <View style={styles.eventInfoItem}>
                  <Ionicons name="calendar" size={16} color={COLORS.TEXT_LIGHT} />
                  <Text style={styles.eventInfoText}>
                    {new Date(event.date).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.eventInfoItem}>
                  <Ionicons name="time" size={16} color={COLORS.TEXT_LIGHT} />
                  <Text style={styles.eventInfoText}>{event.time}</Text>
                </View>
                
                <View style={styles.eventInfoItem}>
                  <Ionicons name="location" size={16} color={COLORS.TEXT_LIGHT} />
                  <Text style={styles.eventInfoText} numberOfLines={1}>
                    {event.location}
                  </Text>
                </View>
              </View>
              
              <View style={styles.eventFooter}>
                <View style={styles.attendeeInfo}>
                  <Ionicons name="people" size={16} color={COLORS.TEXT_LIGHT} />
                  <Text style={styles.attendeeText}>
                    {event.currentAttendees}/{event.maxAttendees} attending
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.rsvpButton,
                    event.hasRSVP && styles.rsvpButtonActive
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleRSVP(event);
                  }}
                >
                  <Text style={[
                    styles.rsvpButtonText,
                    event.hasRSVP && styles.rsvpButtonTextActive
                  ]}>
                    {event.hasRSVP ? 'Cancel RSVP' : 'RSVP'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={COLORS.TEXT_LIGHT} />
            <Text style={styles.emptyText}>No events found</Text>
            <Text style={styles.emptySubtext}>
              {selectedCategory === 'All' 
                ? 'Check back later for new events'
                : `No ${selectedCategory.toLowerCase()} events available`
              }
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    paddingTop: 50,
    paddingBottom: SPACING.LG,
    paddingHorizontal: SPACING.LG,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: SPACING.SM,
  },
  headerButton: {
    padding: SPACING.XS,
  },
  greeting: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.WHITE,
    opacity: 0.9,
  },
  userName: {
    fontSize: TYPOGRAPHY.SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginTop: 4,
  },
  userInfo: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.WHITE,
    opacity: 0.8,
    marginTop: 2,
  },
  quickActions: {
    padding: SPACING.LG,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.MD,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.MD,
    borderRadius: RADIUS.MD,
    marginHorizontal: SPACING.XS,
    ...SHADOWS.SMALL,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT_DARK,
    marginTop: SPACING.XS,
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  eventCount: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingRight: SPACING.LG,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: RADIUS.ROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
    marginRight: SPACING.SM,
  },
  categoryChipActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  categoryIcon: {
    marginRight: SPACING.XS,
  },
  categoryChipText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT_DARK,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: COLORS.WHITE,
  },
  eventCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    ...SHADOWS.MEDIUM,
  },
  eventCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    borderRadius: RADIUS.SM,
  },
  categoryBadgeText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    borderRadius: RADIUS.SM,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    fontWeight: '600',
  },
  rsvpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rsvpBadgeText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    color: COLORS.SUCCESS,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
  },
  eventDescription: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT,
    marginBottom: SPACING.SM,
  },
  eventInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.SM,
    marginBottom: SPACING.SM,
  },
  eventInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventInfoText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    color: COLORS.TEXT_LIGHT,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.SM,
    paddingTop: SPACING.SM,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  attendeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendeeText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT_LIGHT,
  },
  rsvpButton: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: RADIUS.SM,
    backgroundColor: COLORS.PRIMARY,
  },
  rsvpButtonActive: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  rsvpButtonText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  rsvpButtonTextActive: {
    color: COLORS.PRIMARY,
  },
  loadingContainer: {
    padding: SPACING.XL,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT,
  },
  emptyContainer: {
    padding: SPACING.XL,
    alignItems: 'center',
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
    textAlign: 'center',
    marginTop: SPACING.XS,
  },
  bottomSpacing: {
    height: SPACING.XL,
  },
});

export default DashboardScreen;
