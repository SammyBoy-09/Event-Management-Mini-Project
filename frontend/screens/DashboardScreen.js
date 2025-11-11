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
  TextInput,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { getAllEvents, rsvpEvent, cancelRSVP, updateEventStatus } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedCard from '../components/AnimatedCard';

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
  
  // Search & Filter States
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('All'); // 'All', 'Today', 'This Week', 'This Month'
  const [availabilityFilter, setAvailabilityFilter] = useState(false); // Show only available spots
  
  // Rejection Modal States
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    loadUserData();
    loadEvents();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return parsedUser;
      }
      return null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  };

  const loadEvents = async (currentUser = null) => {
    try {
      setLoading(true);
      const response = await getAllEvents({ upcoming: 'true' });
      
      // Backend already adds hasRSVP flag to each event
      console.log('� Events loaded:', response.data?.map(e => ({
        title: e.title,
        hasRSVP: e.hasRSVP
      })));
      
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
      
      // Reload events to get updated hasRSVP flags from backend
      await loadEvents();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to process RSVP');
      // Reload on error to ensure consistency
      await loadEvents();
    }
  };

  const handleStatusChange = async (event) => {
    const isAdmin = user && (user.role === 'admin' || user.role === 'cr' || user.role === 'CR');
    if (!isAdmin) return;

    const currentStatus = event.status || 'pending';
    
    // Build dynamic options based on current status
    const options = [
      {
        text: 'Cancel',
        style: 'cancel'
      }
    ];

    // Add available state transitions
    if (currentStatus !== 'pending') {
      options.push({
        text: 'Pending',
        onPress: () => updateStatus(event._id, 'pending', null)
      });
    }

    if (currentStatus !== 'approved') {
      options.push({
        text: 'Approved',
        onPress: () => updateStatus(event._id, 'approved', null)
      });
    }

    if (currentStatus !== 'rejected') {
      options.push({
        text: 'Rejected',
        onPress: () => handleRejectEvent(event),
        style: 'destructive'
      });
    }
    
    Alert.alert(
      'Change Event Status',
      `Current status: ${currentStatus}\nSelect new status:`,
      options
    );
  };

  const handleRejectEvent = (event) => {
    setSelectedEventId(event._id);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedEventId) return;
    
    try {
      await updateEventStatus(selectedEventId, 'rejected', rejectionReason || null);
      Alert.alert('Success', 'Event has been rejected');
      loadEvents();
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedEventId(null);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to reject event');
    }
  };

  const updateStatus = async (eventId, newStatus, rejectionReason = null) => {
    try {
      await updateEventStatus(eventId, newStatus, rejectionReason);
      Alert.alert('Success', `Event status changed to ${newStatus}`);
      loadEvents();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update status');
    }
  };

  const getFilteredEvents = () => {
    let filtered = [...events];

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Search filter (search in title, description, organizer, location)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(event => 
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.organizer?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query)
      );
    }

    // Date filter
    if (dateFilter !== 'All') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        
        switch (dateFilter) {
          case 'Today':
            return eventDate.toDateString() === today.toDateString();
          
          case 'This Week':
            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() + 7);
            return eventDate >= today && eventDate <= weekEnd;
          
          case 'This Month':
            const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            return eventDate >= today && eventDate <= monthEnd;
          
          default:
            return true;
        }
      });
    }

    // Availability filter (show only events with available spots)
    if (availabilityFilter) {
      filtered = filtered.filter(event => 
        event.currentAttendees < event.maxAttendees
      );
    }

    return filtered;
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
            navigation.reset({
              index: 0,
              routes: [{ name: 'AuthLanding' }],
            });
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
              onPress={() => setShowSearchModal(true)}
            >
              <Ionicons name="search" size={24} color={COLORS.WHITE} />
            </TouchableOpacity>

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
            style={[
              styles.actionButton, 
              { 
                backgroundColor: COLORS.PRIMARY + '10',
                borderColor: COLORS.PRIMARY + '60',
              }
            ]}
            onPress={() => navigation.navigate('CreateEvent')}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle" size={36} color={COLORS.PRIMARY} />
            <Text style={styles.actionButtonText}>Create{'\n'}Event</Text>
          </TouchableOpacity>

          {/* Calendar View */}
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { 
                backgroundColor: '#4ECDC410',
                borderColor: '#4ECDC460',
              }
            ]}
            onPress={() => navigation.navigate('Calendar')}
            activeOpacity={0.9}
          >
            <Ionicons name="calendar-outline" size={36} color="#4ECDC4" />
            <Text style={styles.actionButtonText}>Calendar</Text>
          </TouchableOpacity>

          {/* Admin Panel - Only for Admins and CRs */}
          {user && (user.role === 'admin' || user.role === 'cr' || user.role === 'CR') && (
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                { 
                  backgroundColor: '#FF658410',
                  borderColor: '#FF658460',
                }
              ]}
              onPress={() => navigation.navigate('AdminPanel')}
              activeOpacity={0.7}
            >
              <Ionicons name="shield-checkmark" size={36} color="#FF6584" />
              <Text style={styles.actionButtonText}>Admin{'\n'}Panel</Text>
            </TouchableOpacity>
          )}

          {/* My Events - Only for Students */}
          {user && user.role === 'student' && (
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                { 
                  backgroundColor: COLORS.SECONDARY + '10',
                  borderColor: COLORS.SECONDARY + '60',
                }
              ]}
              onPress={() => navigation.navigate('MyEvents')}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar" size={36} color={COLORS.SECONDARY} />
              <Text style={styles.actionButtonText}>My Events</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Active Filters Indicator */}
      {(searchQuery || dateFilter !== 'All' || availabilityFilter) && (
        <View style={styles.activeFiltersIndicator}>
          <Ionicons name="funnel" size={16} color={COLORS.primary} />
          <Text style={styles.activeFiltersIndicatorText}>
            {searchQuery || dateFilter !== 'All' || availabilityFilter
              ? `${getFilteredEvents().length} ${getFilteredEvents().length === 1 ? 'result' : 'results'} found`
              : ''
            }
          </Text>
          <TouchableOpacity 
            style={styles.activeFiltersIndicatorButton}
            onPress={() => setShowSearchModal(true)}
          >
            <Text style={styles.activeFiltersIndicatorButtonText}>View Filters</Text>
          </TouchableOpacity>
        </View>
      )}

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
          getFilteredEvents().map((event, index) => {
            console.log('Event RSVP Status:', event.title, 'hasRSVP:', event.hasRSVP);
            return (
            <AnimatedCard
              key={event._id}
              index={index}
              delay={80}
              onPress={() => handleEventPress(event)}
              style={styles.eventCard}
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
                    // Admin/CR: Clickable badge to change status
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
                    // Student: View-only badge for their own pending/rejected events
                    <TouchableOpacity
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusBadgeColor(event.status).bg }
                      ]}
                      onPress={(e) => {
                        if (event.status === 'rejected' && event.rejectionReason) {
                          e.stopPropagation();
                          Alert.alert(
                            'Event Rejected',
                            `Reason: ${event.rejectionReason}`,
                            [{ text: 'OK' }]
                          );
                        }
                      }}
                    >
                      <Ionicons 
                        name={event.status === 'rejected' ? 'close-circle' : 'time'} 
                        size={14} 
                        color={getStatusBadgeColor(event.status).text} 
                      />
                      <Text style={[styles.statusBadgeText, { color: getStatusBadgeColor(event.status).text }]}>
                        {getStatusBadgeColor(event.status).label}
                      </Text>
                      {event.status === 'rejected' && event.rejectionReason && (
                        <Ionicons name="information-circle" size={14} color={getStatusBadgeColor(event.status).text} style={{ marginLeft: 4 }} />
                      )}
                    </TouchableOpacity>
                  )}
                </View>

                {event.hasRSVP && (
                  <View style={styles.rsvpBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.SUCCESS} />
                    <Text style={styles.rsvpBadgeText}>RSVP'd</Text>
                  </View>
                )}
              </View>
              
              {/* Event Image */}
              {event.image && (
                <Image
                  source={{ uri: event.image }}
                  style={styles.eventImage}
                  resizeMode="cover"
                />
              )}
              
              <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
              <Text style={styles.eventDescription} numberOfLines={3}>
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
                    event.hasRSVP && {
                      backgroundColor: '#10B981',
                      borderWidth: 0,
                    }
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleRSVP(event);
                  }}
                >
                  {event.hasRSVP && (
                    <Ionicons 
                      name="checkmark-circle" 
                      size={16} 
                      color="#FFFFFF" 
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text style={[
                    styles.rsvpButtonText,
                    event.hasRSVP && { color: '#FFFFFF' }
                  ]}>
                    {event.hasRSVP ? 'Registered' : 'RSVP'}
                  </Text>
                </TouchableOpacity>
              </View>
            </AnimatedCard>
            );
          })
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

      {/* Search & Filter Modal */}
      <Modal
        visible={showSearchModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={styles.searchModalOverlay}>
          <View style={styles.searchModalContent}>
            {/* Modal Header */}
            <View style={styles.searchModalHeader}>
              <Text style={styles.searchModalTitle}>Search & Filter Events</Text>
              <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.searchModalBody}
              showsVerticalScrollIndicator={false}
            >
              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search events..."
                  placeholderTextColor={COLORS.textLight}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={true}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Date Filters */}
              <Text style={styles.filterLabel}>Filter by Date</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateFiltersContainer}
              >
                {['All', 'Today', 'This Week', 'This Month'].map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.dateFilterChip,
                      dateFilter === filter && styles.dateFilterChipActive
                    ]}
                    onPress={() => {
                      setDateFilter(filter);
                    }}
                  >
                    <Ionicons 
                      name="time-outline" 
                      size={16} 
                      color={dateFilter === filter ? COLORS.WHITE : COLORS.primary} 
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[
                      styles.dateFilterText,
                      dateFilter === filter && styles.dateFilterTextActive
                    ]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Availability Filter */}
              <View style={styles.availabilityFilter}>
                <View style={styles.availabilityFilterLeft}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.availabilityFilterText}>Show only available spots</Text>
                </View>
                <Switch
                  value={availabilityFilter}
                  onValueChange={setAvailabilityFilter}
                  trackColor={{ false: COLORS.border, true: COLORS.primary + '40' }}
                  thumbColor={availabilityFilter ? COLORS.primary : COLORS.textLight}
                />
              </View>

              {/* Active Filters Display */}
              {(searchQuery || dateFilter !== 'All' || availabilityFilter) && (
                <View style={styles.activeFiltersContainer}>
                  <Text style={styles.activeFiltersLabel}>Active Filters:</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.activeFiltersScroll}
                  >
                    {searchQuery && (
                      <View style={styles.activeFilterChip}>
                        <Text style={styles.activeFilterText}>Search: "{searchQuery}"</Text>
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                          <Ionicons name="close" size={16} color={COLORS.WHITE} />
                        </TouchableOpacity>
                      </View>
                    )}
                    {dateFilter !== 'All' && (
                      <View style={styles.activeFilterChip}>
                        <Text style={styles.activeFilterText}>
                          {dateFilter}
                        </Text>
                        <TouchableOpacity onPress={() => setDateFilter('All')}>
                          <Ionicons name="close" size={16} color={COLORS.WHITE} />
                        </TouchableOpacity>
                      </View>
                    )}
                    {availabilityFilter && (
                      <View style={styles.activeFilterChip}>
                        <Text style={styles.activeFilterText}>Available Only</Text>
                        <TouchableOpacity onPress={() => setAvailabilityFilter(false)}>
                          <Ionicons name="close" size={16} color={COLORS.WHITE} />
                        </TouchableOpacity>
                      </View>
                    )}
                    <TouchableOpacity 
                      style={styles.clearAllFiltersButton}
                      onPress={() => {
                        setSearchQuery('');
                        setDateFilter('All');
                        setAvailabilityFilter(false);
                      }}
                    >
                      <Text style={styles.clearAllFiltersText}>Clear All</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              )}

              {/* Results Count */}
              <Text style={styles.resultsCount}>
                {searchQuery || dateFilter !== 'All' || availabilityFilter
                  ? `Found ${getFilteredEvents().length} ${getFilteredEvents().length === 1 ? 'event' : 'events'}`
                  : `Showing ${getFilteredEvents().length} ${getFilteredEvents().length === 1 ? 'event' : 'events'}`
                }
              </Text>
            </ScrollView>

            {/* Modal Footer with Apply Button */}
            <View style={styles.searchModalFooter}>
              <TouchableOpacity 
                style={styles.applyFiltersButton}
                onPress={() => setShowSearchModal(false)}
              >
                <Text style={styles.applyFiltersButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal
        visible={showRejectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.rejectModalOverlay}>
          <View style={styles.rejectModalContent}>
            <Text style={styles.rejectModalTitle}>Reject Event</Text>
            <Text style={styles.rejectModalSubtitle}>
              Please provide a reason for rejection (optional):
            </Text>
            
            <TextInput
              style={styles.rejectModalInput}
              placeholder="Enter rejection reason..."
              placeholderTextColor={COLORS.TEXT_LIGHT}
              value={rejectionReason}
              onChangeText={setRejectionReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.rejectModalButtons}>
              <TouchableOpacity
                style={[styles.rejectModalButton, styles.rejectCancelButton]}
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedEventId(null);
                }}
              >
                <Text style={styles.rejectCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.rejectModalButton, styles.rejectConfirmButton]}
                onPress={confirmReject}
              >
                <Text style={styles.rejectModalButtonText}>Reject Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    gap: SPACING.SM,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.LG,
    paddingHorizontal: SPACING.SM,
    borderRadius: RADIUS.LG,
    marginHorizontal: 2,
    borderWidth: 1.5,
    borderBottomWidth: 3,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT_DARK,
    marginTop: SPACING.SM,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.2,
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
    paddingVertical: SPACING.XS,
    borderRadius: RADIUS.SM,
    gap: SPACING.XS,
  },
  statusBadgeText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    fontWeight: '600',
  },
  rsvpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
  },
  rsvpBadgeText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    color: COLORS.SUCCESS,
    fontWeight: '600',
  },
  eventImage: {
    width: '100%',
    height: 180,
    borderRadius: RADIUS.SM,
    marginBottom: SPACING.SM,
    backgroundColor: COLORS.BORDER_LIGHT,
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
    gap: SPACING.XS,
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
    gap: SPACING.XS,
  },
  attendeeText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT_LIGHT,
  },
  rsvpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: RADIUS.SM,
    backgroundColor: COLORS.PRIMARY,
  },
  rsvpButtonActive: {
    backgroundColor: '#10B981', // Green color for RSVP'd state
    borderWidth: 0,
  },
  rsvpButtonText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  rsvpButtonTextActive: {
    color: COLORS.WHITE,
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
  // Active Filters Indicator
  activeFiltersIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.MD,
    borderRadius: RADIUS.MD,
    gap: SPACING.SM,
  },
  activeFiltersIndicatorText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.primary,
    fontWeight: '600',
  },
  activeFiltersIndicatorButton: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.SM,
  },
  activeFiltersIndicatorButtonText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  // Search Modal Styles
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  searchModalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: RADIUS.XL,
    borderTopRightRadius: RADIUS.XL,
    maxHeight: '85%',
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  searchModalTitle: {
    fontSize: TYPOGRAPHY.SIZES.XL,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  searchModalBody: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
  },
  searchModalFooter: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  applyFiltersButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    borderRadius: RADIUS.MD,
    alignItems: 'center',
  },
  applyFiltersButtonText: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  // Search & Filter Styles
  searchSection: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    marginTop: SPACING.MD,
    borderRadius: RADIUS.LG,
    marginHorizontal: SPACING.MD,
    ...SHADOWS.SMALL,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: RADIUS.MD,
    paddingHorizontal: SPACING.SM,
    marginBottom: SPACING.MD,
  },
  searchIcon: {
    marginRight: SPACING.SM,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.SM,
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT,
  },
  clearButton: {
    padding: SPACING.XS,
  },
  filterLabel: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: SPACING.SM,
    marginTop: SPACING.XS,
  },
  dateFiltersContainer: {
    paddingVertical: SPACING.XS,
    gap: SPACING.SM,
  },
  dateFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.WHITE,
    marginRight: SPACING.SM,
  },
  dateFilterChipActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  dateFilterText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  dateFilterTextActive: {
    color: COLORS.WHITE,
  },
  availabilityFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.MD,
    marginTop: SPACING.SM,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  availabilityFilterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  availabilityFilterText: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT,
    fontWeight: '500',
  },
  activeFiltersContainer: {
    marginTop: SPACING.MD,
    paddingTop: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  activeFiltersLabel: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: SPACING.SM,
  },
  activeFiltersScroll: {
    gap: SPACING.SM,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: RADIUS.SM,
    gap: SPACING.XS,
  },
  activeFilterText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    color: COLORS.WHITE,
    fontWeight: '500',
  },
  clearAllFiltersButton: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: RADIUS.SM,
    borderWidth: 1,
    borderColor: COLORS.ERROR,
    backgroundColor: COLORS.WHITE,
  },
  clearAllFiltersText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    color: COLORS.ERROR,
    fontWeight: '600',
  },
  resultsCount: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    marginTop: SPACING.MD,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: RADIUS.XL,
    borderTopRightRadius: RADIUS.XL,
    paddingBottom: SPACING.XL,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SPACING.MD,
    borderRadius: RADIUS.MD,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: COLORS.PRIMARY,
  },
  modalButtonSecondary: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  modalButtonTextPrimary: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  modalButtonTextSecondary: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  
  // Rejection Modal Styles
  rejectModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XL,
  },
  rejectModalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.LG,
    padding: SPACING.XL,
    ...SHADOWS.MEDIUM,
  },
  rejectModalTitle: {
    fontSize: TYPOGRAPHY.SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.SM,
  },
  rejectModalSubtitle: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.LG,
    lineHeight: 20,
  },
  rejectModalInput: {
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
  rejectModalButtons: {
    flexDirection: 'row',
    gap: SPACING.MD,
  },
  rejectModalButton: {
    flex: 1,
    paddingVertical: SPACING.MD,
    borderRadius: RADIUS.MD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectCancelButton: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  rejectCancelButtonText: {
    color: COLORS.TEXT_DARK,
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '500',
  },
  rejectConfirmButton: {
    backgroundColor: COLORS.ERROR,
  },
  rejectModalButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '600',
  },
});

export default DashboardScreen;
