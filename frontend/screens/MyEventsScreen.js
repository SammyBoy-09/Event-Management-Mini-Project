import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { getAllEvents } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedCard from '../components/AnimatedCard';

const MyEventsScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

  useEffect(() => {
    loadMyEvents();
  }, []);

  const loadMyEvents = async () => {
    try {
      setLoading(true);
      
      // Get current user ID from AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : null;
      
      if (!user) {
        Alert.alert('Error', 'User not found. Please login again.');
        return;
      }
      
      const response = await getAllEvents();
      
      console.log('My Events - User ID:', user.id);
      
      // Handle different response structures
      let allEvents = [];
      if (Array.isArray(response.data)) {
        allEvents = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        allEvents = response.data.data;
      } else if (response.data.events && Array.isArray(response.data.events)) {
        allEvents = response.data.events;
      }
      
      // Filter events where current user is in attendees array
      const myEvents = allEvents.filter(event => {
        if (!event.attendees || !Array.isArray(event.attendees)) return false;
        
        // Check if user ID exists in attendees array
        return event.attendees.some(attendee => {
          const attendeeId = attendee.student?._id || attendee.student;
          return attendeeId === user.id;
        });
      });
      
      console.log('My Events - Total events:', allEvents.length);
      console.log('My Events - My RSVP events:', myEvents.length);
      setEvents(myEvents);
    } catch (error) {
      console.error('Error loading my events:', error);
      Alert.alert('Error', 'Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyEvents();
    setRefreshing(false);
  };

  const isEventUpcoming = (eventDate) => {
    return new Date(eventDate) >= new Date();
  };

  const filteredEvents = events.filter(event => {
    if (activeTab === 'upcoming') {
      return isEventUpcoming(event.date);
    } else {
      return !isEventUpcoming(event.date);
    }
  });

  const getCategoryColor = (category) => {
    const colors = {
      Technology: '#6C63FF',
      Sports: '#4CAF50',
      Cultural: '#FF6584',
      Academic: '#2196F3',
      Workshop: '#FF9800',
      Seminar: '#9C27B0',
      Competition: '#F44336',
      Social: '#00BCD4',
      Other: '#607D8B',
    };
    return colors[category] || COLORS.PRIMARY;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const renderEventCard = ({ item, index }) => {
    const categoryColor = getCategoryColor(item.category);
    const isPast = !isEventUpcoming(item.date);

    return (
      <AnimatedCard
        index={index}
        delay={80}
        onPress={() => navigation.navigate('EventDetails', { eventId: item._id })}
        style={[styles.eventCard, isPast && styles.pastEventCard]}
      >
        <View style={styles.eventHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {item.category}
            </Text>
          </View>
          {isPast && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.SUCCESS} />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>

        <Text style={[styles.eventTitle, isPast && styles.pastEventTitle]} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={isPast ? COLORS.TEXT_SECONDARY : COLORS.TEXT} />
            <Text style={[styles.detailText, isPast && styles.pastDetailText]}>
              {formatDate(item.date)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color={isPast ? COLORS.TEXT_SECONDARY : COLORS.TEXT} />
            <Text style={[styles.detailText, isPast && styles.pastDetailText]}>
              {item.time}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={isPast ? COLORS.TEXT_SECONDARY : COLORS.TEXT} />
            <Text style={[styles.detailText, isPast && styles.pastDetailText]} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.attendeeInfo}>
            <Ionicons name="people-outline" size={16} color={COLORS.TEXT_SECONDARY} />
            <Text style={styles.attendeeText}>
              {item.currentAttendees} / {item.maxAttendees} attending
            </Text>
          </View>
          
          {!isPast && (
            <TouchableOpacity
              style={styles.ticketButton}
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('EventDetails', { 
                  eventId: item._id,
                  showQRTicket: true 
                });
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="qr-code" size={18} color={COLORS.WHITE} />
              <Text style={styles.ticketButtonText}>View Ticket</Text>
            </TouchableOpacity>
          )}
        </View>
      </AnimatedCard>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name={activeTab === 'upcoming' ? 'calendar-outline' : 'checkmark-done-circle-outline'} 
        size={80} 
        color={COLORS.TEXT_SECONDARY} 
      />
      <Text style={styles.emptyTitle}>
        {activeTab === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'upcoming' 
          ? "You haven't RSVP'd to any upcoming events yet"
          : "You haven't attended any past events yet"}
      </Text>
      {activeTab === 'upcoming' && (
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.browseButtonText}>Browse Events</Text>
        </TouchableOpacity>
      )}
    </View>
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>My Events</Text>
          <Text style={styles.headerSubtitle}>
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={activeTab === 'upcoming' ? 'calendar' : 'calendar-outline'} 
            size={20} 
            color={activeTab === 'upcoming' ? COLORS.PRIMARY : COLORS.TEXT_LIGHT} 
          />
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
          {activeTab === 'upcoming' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={activeTab === 'past' ? 'checkmark-done-circle' : 'checkmark-done-circle-outline'} 
            size={20} 
            color={activeTab === 'past' ? COLORS.PRIMARY : COLORS.TEXT_LIGHT} 
          />
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past
          </Text>
          {activeTab === 'past' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Event List */}
      <FlatList
        data={filteredEvents}
        renderItem={renderEventCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading && renderEmptyState()}
        showsVerticalScrollIndicator={false}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD*4,
    paddingBottom: SPACING.LG,
    backgroundColor: COLORS.WHITE,
    ...SHADOWS.SMALL,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_LIGHT,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.SM,
    paddingTop: SPACING.SM,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: SPACING.MD,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    gap: SPACING.XS,
  },
  activeTab: {
    // Active tab styling
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_LIGHT,
    letterSpacing: 0.2,
  },
  activeTabText: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: SPACING.MD,
    right: SPACING.MD,
    height: 3,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: RADIUS.SM,
  },
  listContainer: {
    padding: SPACING.LG,
    paddingTop: SPACING.MD,
    flexGrow: 1,
  },
  eventCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.XL,
    padding: SPACING.LG,
    marginBottom: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER + '80',
    ...SHADOWS.SMALL,
  },
  pastEventCard: {
    opacity: 0.65,
    borderColor: COLORS.BORDER + '40',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: 6,
    borderRadius: RADIUS.MD,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  completedBadge: {
    backgroundColor: COLORS.SUCCESS + '15',
    paddingHorizontal: SPACING.SM,
    paddingVertical: 6,
    borderRadius: RADIUS.MD,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedText: {
    fontSize: 11,
    color: COLORS.SUCCESS,
    fontWeight: '700',
  },
  eventTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.MD,
    lineHeight: 26,
  },
  pastEventTitle: {
    color: COLORS.TEXT_SECONDARY,
  },
  eventDetails: {
    marginBottom: SPACING.MD,
    gap: SPACING.XS,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: COLORS.TEXT,
    marginLeft: SPACING.SM,
    flex: 1,
  },
  pastDetailText: {
    color: COLORS.TEXT_SECONDARY,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER + '60',
    marginTop: SPACING.XS,
  },
  attendeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 6,
    borderRadius: RADIUS.MD,
  },
  attendeeText: {
    fontSize: 13,
    color: COLORS.TEXT,
    marginLeft: SPACING.XS,
    fontWeight: '600',
  },
  ticketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MD + 4,
    paddingVertical: SPACING.SM + 2,
    borderRadius: RADIUS.MD,
    gap: 6,
    ...SHADOWS.SMALL,
  },
  ticketButtonText: {
    fontSize: 13,
    color: COLORS.WHITE,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxxl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  browseButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  browseButtonText: {
    color: COLORS.WHITE,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default MyEventsScreen;
