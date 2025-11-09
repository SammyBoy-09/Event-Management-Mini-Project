import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { getAllEvents } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * CalendarScreen Component
 * Displays events in a monthly calendar view with date selection
 */
const CalendarScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    loadEvents();
    // Set today as default selected date
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  // Filter events when selectedDate or events change
  useEffect(() => {
    if (selectedDate && events.length > 0) {
      const eventsOnDate = events.filter((event) => {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        return eventDate === selectedDate;
      });
      setEventsForSelectedDate(eventsOnDate);
    }
  }, [selectedDate, events]);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents();
      console.log('CalendarScreen - Events loaded:', response.data?.length || 0);
      setEvents(response.data);
      processEventsForCalendar(response.data);
    } catch (error) {
      console.error('CalendarScreen - Error loading events:', error);
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

  // Process events to create marked dates object for calendar
  const processEventsForCalendar = (eventsList) => {
    const marked = {};
    const today = new Date().toISOString().split('T')[0];

    eventsList.forEach((event) => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      
      if (!marked[eventDate]) {
        marked[eventDate] = {
          marked: true,
          dots: [],
        };
      }

      // Add dot with category color
      const categoryColor = getCategoryColor(event.category);
      marked[eventDate].dots.push({
        color: categoryColor,
        selectedDotColor: categoryColor,
      });
    });

    // Mark today with special styling
    if (marked[today]) {
      marked[today].selected = true;
      marked[today].selectedColor = COLORS.primary;
    } else {
      marked[today] = {
        selected: true,
        selectedColor: COLORS.primary,
      };
    }

    setMarkedDates(marked);
  };

  // Get color based on event category
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
    return colors[category] || COLORS.primary;
  };

  // Handle date selection
  const onDayPress = (day) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);

    // Update marked dates to show selection
    const newMarked = { ...markedDates };
    Object.keys(newMarked).forEach((key) => {
      if (newMarked[key].selected) {
        newMarked[key].selected = false;
      }
    });
    
    if (newMarked[dateString]) {
      newMarked[dateString].selected = true;
      newMarked[dateString].selectedColor = COLORS.primary;
    } else {
      newMarked[dateString] = {
        selected: true,
        selectedColor: COLORS.primary,
      };
    }
    
    setMarkedDates(newMarked);

    // Filter events for selected date
    const eventsOnDate = events.filter((event) => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === dateString;
    });
    setEventsForSelectedDate(eventsOnDate);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Navigate to event details
  const handleEventPress = (eventId) => {
    navigation.navigate('EventDetails', { eventId });
  };

  // Render event card
  const renderEventCard = (event) => {
    const categoryColor = getCategoryColor(event.category);
    const isPast = new Date(event.date) < new Date();

    return (
      <TouchableOpacity
        key={event._id}
        style={[styles.eventCard, isPast && styles.pastEventCard]}
        onPress={() => handleEventPress(event._id)}
        activeOpacity={0.7}
      >
        {/* Event Header */}
        <View style={styles.eventHeader}>
          <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
          <Text style={styles.eventTitle} numberOfLines={1}>
            {event.title}
          </Text>
          {event.hasRSVP && (
            <View style={styles.rsvpBadge}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
            </View>
          )}
        </View>

        {/* Event Details */}
        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>{event.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>
              {event.currentAttendees}/{event.maxAttendees}
            </Text>
          </View>
        </View>

        {/* Category Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {event.category}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
        <TouchableOpacity
          style={styles.todayButton}
          onPress={() => {
            const today = new Date().toISOString().split('T')[0];
            onDayPress({ dateString: today });
          }}
        >
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={onDayPress}
            markingType={'multi-dot'}
            markedDates={markedDates}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: COLORS.textSecondary,
              selectedDayBackgroundColor: COLORS.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: COLORS.primary,
              dayTextColor: COLORS.text,
              textDisabledColor: COLORS.border,
              dotColor: COLORS.primary,
              selectedDotColor: '#ffffff',
              arrowColor: COLORS.primary,
              monthTextColor: COLORS.text,
              indicatorColor: COLORS.primary,
              textDayFontFamily: TYPOGRAPHY.regular,
              textMonthFontFamily: TYPOGRAPHY.semiBold,
              textDayHeaderFontFamily: TYPOGRAPHY.medium,
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
          />
        </View>

        {/* Selected Date Section */}
        {selectedDate && (
          <View style={styles.selectedDateSection}>
            <View style={styles.selectedDateHeader}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
              <Text style={styles.selectedDateText}>
                {formatDate(selectedDate)}
              </Text>
            </View>

            {/* Events List */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading events...</Text>
              </View>
            ) : eventsForSelectedDate.length > 0 ? (
              <View style={styles.eventsList}>
                <Text style={styles.eventsCount}>
                  {eventsForSelectedDate.length} {eventsForSelectedDate.length === 1 ? 'Event' : 'Events'}
                </Text>
                {eventsForSelectedDate.map(renderEventCard)}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color={COLORS.border} />
                <Text style={styles.emptyStateText}>No events on this day</Text>
                <Text style={styles.emptyStateSubtext}>
                  Check other dates or create a new event
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  todayButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
  },
  todayButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: COLORS.surface,
    margin: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  selectedDateSection: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  eventsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  eventsList: {
    gap: SPACING.sm,
  },
  eventCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.small,
    marginBottom: SPACING.sm,
  },
  pastEventCard: {
    opacity: 0.6,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  eventTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  rsvpBadge: {
    marginLeft: SPACING.xs,
  },
  eventDetails: {
    marginBottom: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default CalendarScreen;
