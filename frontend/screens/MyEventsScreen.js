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
      const response = await getAllEvents();
      
      // Filter only events where user has RSVP'd
      const myEvents = response.data.data.filter(event => event.hasRSVP);
      
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

  const renderEventCard = ({ item }) => {
    const categoryColor = getCategoryColor(item.category);
    const isPast = !isEventUpcoming(item.date);

    return (
      <TouchableOpacity
        style={[styles.eventCard, isPast && styles.pastEventCard]}
        onPress={() => navigation.navigate('EventDetails', { eventId: item._id })}
        activeOpacity={0.7}
      >
        <View style={styles.eventHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {item.category}
            </Text>
          </View>
          {isPast && (
            <View style={styles.completedBadge}>
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
            >
              <Ionicons name="qr-code-outline" size={18} color={COLORS.PRIMARY} />
              <Text style={styles.ticketButtonText}>Ticket</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
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
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Events</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
          {activeTab === 'upcoming' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  placeholder: {
    width: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    // Active tab styling
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.TEXT_SECONDARY,
  },
  activeTabText: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.PRIMARY,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  listContainer: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  eventCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  pastEventCard: {
    opacity: 0.7,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedBadge: {
    backgroundColor: COLORS.TEXT_SECONDARY + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  completedText: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.sm,
  },
  pastEventTitle: {
    color: COLORS.TEXT_SECONDARY,
  },
  eventDetails: {
    marginBottom: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.TEXT,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  pastDetailText: {
    color: COLORS.TEXT_SECONDARY,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  attendeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.xs,
  },
  ticketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY + '10',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  ticketButtonText: {
    fontSize: 13,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    marginLeft: 4,
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
