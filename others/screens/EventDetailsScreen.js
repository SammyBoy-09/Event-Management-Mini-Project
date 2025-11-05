import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Share,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import theme from '../utils/theme';
import eventService from '../services/eventService';
import { mockEvents } from '../data/mockData';

const EventDetailsScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState(false);

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      const eventData = await eventService.getEventById(eventId);
      setEvent(eventData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load event details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async () => {
    try {
      if (rsvpStatus) {
        await eventService.cancelRsvp(eventId);
        setRsvpStatus(false);
        Alert.alert('RSVP Cancelled', 'Your RSVP has been cancelled');
      } else {
        await eventService.rsvpEvent(eventId);
        setRsvpStatus(true);
        Alert.alert('RSVP Confirmed', 'Thank you for your RSVP!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update RSVP');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${event.title}\n\nDate: ${event.date}\nTime: ${event.time}\nLocation: ${event.location}\n\nJoin us at CampusConnect!`,
        title: event.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleGetDirections = () => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(event.location)}`;
    Linking.openURL(url);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading event details...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Event Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.image }} style={styles.eventImage} />
        
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.textInverse} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color={theme.colors.textInverse} />
          </TouchableOpacity>
        </View>

        {/* Status Badge */}
        <View style={[styles.statusBadge, { 
          backgroundColor: event.status === 'approved' ? theme.colors.success : 
                         event.status === 'pending' ? theme.colors.warning : theme.colors.error 
        }]}>
          <Text style={styles.statusText}>{event.status}</Text>
        </View>
      </View>

      {/* Event Content */}
      <View style={styles.content}>
        {/* Title and Category */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.detailText}>{formatDate(event.date)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.detailText}>{formatTime(event.time)}</Text>
          </View>

          <TouchableOpacity 
            style={styles.detailItem}
            onPress={handleGetDirections}
          >
            <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.detailText, styles.linkText]}>{event.location}</Text>
            <Ionicons name="open-outline" size={16} color={theme.colors.primary} />
          </TouchableOpacity>

          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.detailText}>{event.organizer}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Attendees */}
        <View style={styles.attendeesSection}>
          <Text style={styles.sectionTitle}>Attendance</Text>
          <View style={styles.attendeesInfo}>
            <View style={styles.attendeesCount}>
              <Text style={styles.attendeesNumber}>{event.currentAttendees}</Text>
              <Text style={styles.attendeesLabel}>Going</Text>
            </View>
            <View style={styles.attendeesCount}>
              <Text style={styles.attendeesNumber}>{event.maxAttendees - event.currentAttendees}</Text>
              <Text style={styles.attendeesLabel}>Spots Left</Text>
            </View>
          </View>
          
          {/* Attendees Progress Bar */}
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((event.currentAttendees / event.maxAttendees) * 100)}% capacity
          </Text>
        </View>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {event.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* RSVP Section */}
        {event.rsvpRequired && event.status === 'approved' && (
          <View style={styles.rsvpSection}>
            <CustomButton
              title={rsvpStatus ? "Cancel RSVP" : "RSVP to Event"}
              onPress={handleRSVP}
              variant={rsvpStatus ? "outline" : "primary"}
              icon={rsvpStatus ? "close-circle-outline" : "checkmark-circle-outline"}
              fullWidth
              style={styles.rsvpButton}
            />
            
            {!rsvpStatus && (
              <Text style={styles.rsvpNote}>
                By RSVPing, you confirm your attendance to this event.
              </Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerActions: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 40,
    right: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  content: {
    padding: theme.spacing.lg,
  },
  titleSection: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
  },
  detailsSection: {
    marginBottom: theme.spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  detailText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  linkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  descriptionSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  attendeesSection: {
    marginBottom: theme.spacing.lg,
  },
  attendeesInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.md,
  },
  attendeesCount: {
    alignItems: 'center',
  },
  attendeesNumber: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  attendeesLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  tagsSection: {
    marginBottom: theme.spacing.lg,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  tagText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  rsvpSection: {
    marginTop: theme.spacing.lg,
  },
  rsvpButton: {
    marginBottom: theme.spacing.sm,
  },
  rsvpNote: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default EventDetailsScreen;
