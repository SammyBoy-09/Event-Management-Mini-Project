import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import CustomButton from '../components/CustomButton';
import theme from '../utils/theme';
import { mockEvents, eventCategories } from '../data/mockData';
import eventService from '../services/eventService';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { state, actions } = useApp();
  const { user, events, notifications } = state;
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      
      // Load events from service (mock data for now)
      const response = await eventService.getAllEvents({ status: 'approved' });
      actions.setEvents(response.events);
      
      // Filter upcoming events (next 7 days)
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const upcoming = response.events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= nextWeek;
      }).slice(0, 5); // Show max 5 upcoming events
      
      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { eventId: event.id });
  };

  const handleRSVP = async (event) => {
    try {
      await eventService.rsvpEvent(event.id);
      Alert.alert('Success', 'RSVP confirmed successfully!');
      // Refresh events to update attendee count
      loadEvents();
    } catch (error) {
      Alert.alert('Error', 'Failed to RSVP. Please try again.');
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const getFilteredEvents = () => {
    if (selectedCategory === 'all') {
      return events.slice(0, 10); // Show max 10 events
    }
    return events.filter(event => event.category === selectedCategory).slice(0, 10);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

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
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userRole}>{user?.role} • {user?.department}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
            {unreadNotificationsCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Create')}
          >
            <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Create Event</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Scanner')}
          >
            <Ionicons name="qr-code" size={24} color={theme.colors.secondary} />
            <Text style={styles.actionButtonText}>QR Scanner</Text>
          </TouchableOpacity>

          {(user?.role === 'admin' || user?.role === 'cr') && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Admin')}
            >
              <Ionicons name="shield" size={24} color={theme.colors.accent} />
              <Text style={styles.actionButtonText}>Admin Panel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.upcomingEventsContainer}
          >
            {upcomingEvents.map((event) => (
              <View key={event.id} style={styles.upcomingEventCard}>
                <EventCard
                  event={event}
                  onPress={() => handleEventPress(event)}
                  onRSVP={handleRSVP}
                  variant="compact"
                />
              </View>
            ))}
          </ScrollView>
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
              selectedCategory === 'all' && styles.categoryChipActive
            ]}
            onPress={() => handleCategoryPress('all')}
          >
            <Text style={[
              styles.categoryChipText,
              selectedCategory === 'all' && styles.categoryChipTextActive
            ]}>
              All Events
            </Text>
          </TouchableOpacity>
          
          {eventCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.name && styles.categoryChipActive,
                { borderColor: category.color }
              ]}
              onPress={() => handleCategoryPress(category.name)}
            >
              <Ionicons 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.name ? theme.colors.textInverse : category.color}
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
            {selectedCategory === 'all' ? 'All Events' : `${selectedCategory} Events`}
          </Text>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading events...</Text>
          </View>
        ) : getFilteredEvents().length > 0 ? (
          getFilteredEvents().map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => handleEventPress(event)}
              onRSVP={handleRSVP}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>No events found</Text>
            <Text style={styles.emptySubtext}>
              {selectedCategory === 'all' 
                ? 'Check back later for new events'
                : `No ${selectedCategory.toLowerCase()} events available`
              }
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 40,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textInverse,
    opacity: 0.9,
  },
  userName: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.textInverse,
    marginTop: 4,
  },
  userRole: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textInverse,
    opacity: 0.8,
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: theme.spacing.xs,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: theme.colors.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickActions: {
    padding: theme.spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
  },
  actionButton: {
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    minWidth: 80,
    ...theme.shadows.sm,
  },
  actionButtonText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  seeAllText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  upcomingEventsContainer: {
    paddingRight: theme.spacing.lg,
  },
  upcomingEventCard: {
    width: width * 0.8,
    marginRight: theme.spacing.md,
  },
  categoriesContainer: {
    paddingRight: theme.spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryIcon: {
    marginRight: theme.spacing.xs,
  },
  categoryChipText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: theme.colors.textInverse,
  },
  loadingContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});

export default DashboardScreen;
