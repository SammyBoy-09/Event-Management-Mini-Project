import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Linking,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { getEventById, rsvpEvent, cancelRSVP, deleteEvent } from '../api/api';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRTicketModal from '../components/QRTicketModal';
import AnimatedTag from '../components/AnimatedTag';

const EventDetailsScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showQRTicket, setShowQRTicket] = useState(false);

  // Debug logging for showQRTicket state changes
  useEffect(() => {
    console.log('EventDetailsScreen - showQRTicket state changed to:', showQRTicket);
  }, [showQRTicket]);

  useEffect(() => {
    loadUser();
    loadEventDetails();
  }, [eventId]);

  // Refresh event details when screen comes into focus (after editing)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadEventDetails();
    });

    return unsubscribe;
  }, [navigation]);

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

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      const response = await getEventById(eventId);
      setEvent(response.data);
    } catch (error) {
      console.error('Error loading event:', error);
      Alert.alert('Error', 'Failed to load event details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async () => {
    try {
      if (event.hasRSVP) {
        await cancelRSVP(eventId);
        Alert.alert('Success', 'RSVP cancelled successfully!');
        loadEventDetails();
      } else {
        await rsvpEvent(eventId);
        Alert.alert(
          '✅ RSVP Confirmed!', 
          'Your event ticket is ready. Would you like to view it now?',
          [
            {
              text: 'View Ticket',
              onPress: () => {
                loadEventDetails();
                setTimeout(() => setShowQRTicket(true), 500);
              },
            },
            {
              text: 'Later',
              onPress: () => loadEventDetails(),
              style: 'cancel',
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to process RSVP');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${event.title}\n\nDate: ${new Date(event.date).toLocaleDateString()}\nTime: ${event.time}\nLocation: ${event.location}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDirections = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
    Linking.openURL(url);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(eventId);
              Alert.alert('Success', 'Event deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  if (!event) {
    return null;
  }

  const isCreator = user && event.createdBy && event.createdBy._id === user.id;
  const isAdmin = user && user.role === 'admin';
  const canEdit = isCreator || isAdmin;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
              <Ionicons name="share-social" size={24} color={COLORS.TEXT_DARK} />
            </TouchableOpacity>
            
            {isAdmin && (
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={() => navigation.navigate('CreateEvent', { 
                  eventId: event._id,
                  eventData: event
                })}
              >
                <Ionicons name="create-outline" size={24} color={COLORS.PRIMARY} />
              </TouchableOpacity>
            )}
            
            {canEdit && (
              <TouchableOpacity style={styles.headerButton} onPress={handleDelete}>
                <Ionicons name="trash" size={24} color={COLORS.ERROR} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Event Info */}
        <View style={styles.content}>
          <View style={[styles.categoryBadge, { backgroundColor: COLORS.PRIMARY + '20' }]}>
            <Text style={[styles.categoryBadgeText, { color: COLORS.PRIMARY }]}>
              {event.category}
            </Text>
          </View>
          
          <Text style={styles.title}>{event.title}</Text>
          
          {/* Event Image */}
          {event.image && (
            <Image
              source={{ uri: event.image }}
              style={styles.eventImage}
              resizeMode="cover"
            />
          )}
          
          {event.hasRSVP && (
            <View style={styles.rsvpBadge}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.SUCCESS} />
              <Text style={styles.rsvpBadgeText}>You're attending this event</Text>
            </View>
          )}
          
          <Text style={styles.description}>{event.description}</Text>
          
          {/* Date & Time */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={24} color={COLORS.PRIMARY} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="time" size={24} color={COLORS.PRIMARY} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>{event.time}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.infoRow} onPress={handleDirections}>
              <View style={styles.iconContainer}>
                <Ionicons name="location" size={24} color={COLORS.PRIMARY} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{event.location}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_LIGHT} />
            </TouchableOpacity>
          </View>
          
          {/* Organizer */}
          <View style={styles.organizerSection}>
            <Text style={styles.organizerLabel}>Organized by</Text>
            <Text style={styles.organizerName}>{event.organizer}</Text>
            {event.createdBy && (
              <Text style={styles.organizerInfo}>
                {event.createdBy.name} • {event.createdBy.email}
              </Text>
            )}
          </View>
          
          {/* Attendees */}
          <View style={styles.attendeesSection}>
            <View style={styles.attendeesHeader}>
              <Ionicons name="people" size={24} color={COLORS.PRIMARY} />
              <Text style={styles.attendeesTitle}>Attendees</Text>
            </View>
            <Text style={styles.attendeesCount}>
              {event.currentAttendees} / {event.maxAttendees} registered
            </Text>
            
            {event.currentAttendees >= event.maxAttendees && (
              <View style={styles.fullBadge}>
                <Text style={styles.fullBadgeText}>Event Full</Text>
              </View>
            )}
          </View>
          
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={styles.tagsLabel}>Tags</Text>
              <View style={styles.tagsContainer}>
                {event.tags.map((tag, index) => (
                  <AnimatedTag key={index} tag={tag} index={index} delay={60} />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Footer Actions */}
      <View style={styles.footer}>
        {/* Admin-Only Actions */}
        {isAdmin && event.currentAttendees > 0 && (
          <TouchableOpacity 
            style={styles.viewAttendeesButton}
            onPress={() => navigation.navigate('Attendance', { 
              eventId: event._id,
              eventTitle: event.title 
            })}
          >
            <Ionicons name="list-outline" size={20} color={COLORS.PRIMARY} />
            <Text style={styles.viewAttendeesText}>
              View Attendees ({event.currentAttendees})
            </Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        )}

        {/* Student RSVP Actions - Only for approved events */}
        {event.status === 'approved' && (
          event.hasRSVP ? (
            <View style={styles.footerButtons}>
              <Button
                title="View QR Ticket"
                onPress={() => {
                  console.log('View QR Ticket button pressed');
                  console.log('Current showQRTicket state:', showQRTicket);
                  setShowQRTicket(true);
                  console.log('setShowQRTicket(true) called');
                }}
                variant="primary"
                style={styles.footerButton}
                icon="qr-code"
              />
              <Button
                title="Cancel RSVP"
                onPress={handleRSVP}
                variant="outline"
                style={styles.footerButton}
              />
            </View>
          ) : (
            !canEdit && (
              <Button
                title="RSVP Now"
                onPress={handleRSVP}
                variant="primary"
                disabled={event.currentAttendees >= event.maxAttendees}
              />
            )
          )
        )}
      </View>

      {/* QR Ticket Modal */}
      <QRTicketModal
        visible={showQRTicket}
        onClose={() => setShowQRTicket(false)}
        event={event}
        userData={user}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // ensure there's enough space for the footer + safe area so buttons aren't overlapped
    paddingBottom: SPACING.XXL + SPACING.LG,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingTop: 50,
    paddingBottom: SPACING.MD,
    backgroundColor: COLORS.WHITE,
  },
  backButton: {
    padding: SPACING.XS,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.SM,
  },
  headerButton: {
    padding: SPACING.XS,
  },
  content: {
    padding: SPACING.LG,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.SM,
    paddingVertical: 6,
    borderRadius: RADIUS.SM,
    marginBottom: SPACING.SM,
  },
  categoryBadgeText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    fontWeight: '600',
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.XXL,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.SM,
  },
  eventImage: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.MD,
    marginBottom: SPACING.MD,
    backgroundColor: COLORS.BORDER_LIGHT,
  },
  rsvpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.MD,
  },
  rsvpBadgeText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.SUCCESS,
    fontWeight: '600',
  },
  description: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT,
    lineHeight: 24,
    marginBottom: SPACING.LG,
  },
  infoSection: {
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.LG,
    ...SHADOWS.MEDIUM,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.SM,
    backgroundColor: COLORS.PRIMARY + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.SM,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    color: COLORS.TEXT_LIGHT,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT_DARK,
    fontWeight: '600',
  },
  organizerSection: {
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.LG,
    ...SHADOWS.SMALL,
  },
  organizerLabel: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.XS,
  },
  organizerName: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
  },
  organizerInfo: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT,
  },
  attendeesSection: {
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.LG,
    ...SHADOWS.SMALL,
  },
  attendeesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
    marginBottom: SPACING.XS,
  },
  attendeesTitle: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
  },
  attendeesCount: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT,
    marginTop: SPACING.XS,
  },
  fullBadge: {
    marginTop: SPACING.SM,
    backgroundColor: COLORS.ERROR + '20',
    paddingHorizontal: SPACING.SM,
    paddingVertical: 6,
    borderRadius: RADIUS.SM,
    alignSelf: 'flex-start',
  },
  fullBadgeText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    color: COLORS.ERROR,
    fontWeight: '600',
  },
  tagsSection: {
    marginBottom: SPACING.LG,
  },
  tagsLabel: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.SM,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.XS,
  },
  tag: {
    backgroundColor: COLORS.PRIMARY + '10',
    paddingHorizontal: SPACING.SM,
    paddingVertical: 6,
    borderRadius: RADIUS.SM,
  },
  tagText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.LG,
    paddingBottom: SPACING.XL,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    ...SHADOWS.LARGE,
    elevation: 10,
  },
  viewAttendeesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.PRIMARY + '10',
    padding: SPACING.MD,
    borderRadius: RADIUS.MD,
    marginBottom: SPACING.MD,
    ...SHADOWS.SMALL,
  },
  viewAttendeesText: {
    flex: 1,
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    marginLeft: SPACING.SM,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: SPACING.SM,
  },
  footerButton: {
    flex: 1,
  },
});

export default EventDetailsScreen;
