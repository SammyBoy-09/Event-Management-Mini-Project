import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../utils/theme';

const EventCard = ({ 
  event, 
  onPress, 
  onRSVP, 
  showRSVPButton = true,
  variant = 'default' 
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    // Convert 24h format to 12h format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technology: theme.colors.primary,
      Cultural: theme.colors.secondary,
      Sports: theme.colors.error,
      Academic: '#8B5CF6',
      Workshop: theme.colors.accent,
      Social: '#EC4899',
    };
    return colors[category] || theme.colors.primary;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'rejected':
        return theme.colors.error;
      default:
        return theme.colors.textLight;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, variant === 'compact' && styles.compactContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Event Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.image }} style={styles.eventImage} />
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
          <Ionicons 
            name={getStatusIcon(event.status)} 
            size={12} 
            color={theme.colors.textInverse} 
          />
          <Text style={styles.statusText}>{event.status}</Text>
        </View>

        {/* Category Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
      </View>

      {/* Event Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        
        {variant !== 'compact' && (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        {/* Event Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{formatDate(event.date)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{formatTime(event.time)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
          </View>
        </View>

        {/* Organizer */}
        <View style={styles.organizerContainer}>
          <Ionicons name="person-outline" size={14} color={theme.colors.textLight} />
          <Text style={styles.organizerText}>{event.organizer}</Text>
        </View>

        {/* Attendees and RSVP */}
        {variant !== 'compact' && (
          <View style={styles.footerContainer}>
            <View style={styles.attendeesContainer}>
              <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.attendeesText}>
                {event.currentAttendees}/{event.maxAttendees} attending
              </Text>
            </View>

            {showRSVPButton && event.rsvpRequired && (
              <TouchableOpacity 
                style={styles.rsvpButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onRSVP && onRSVP(event);
                }}
              >
                <Text style={styles.rsvpButtonText}>RSVP</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  compactContainer: {
    marginBottom: theme.spacing.sm,
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.xs,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  categoryBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.xs,
    fontWeight: '600',
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  detailsContainer: {
    marginBottom: theme.spacing.sm,
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
    flex: 1,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  organizerText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
    fontStyle: 'italic',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attendeesText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  rsvpButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  rsvpButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
  },
});

export default EventCard;
